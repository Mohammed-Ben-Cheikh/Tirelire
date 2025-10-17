const MODEL_URL = "/models"; // dossier où tu mets les modèles face-api

async function loadModels() {
  await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL); // détection
  await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
  console.log("Models loaded");
}

async function startVideo() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: true });
  const v = document.getElementById("video");
  v.srcObject = stream;
  await v.play();

  // Effet miroir sur la vidéo
  v.style.transform = "scaleX(-1)";

  // Ajouter un canvas superposé à la vidéo
  let overlay = document.getElementById("videoOverlay");
  if (!overlay) {
    overlay = document.createElement("canvas");
    overlay.id = "videoOverlay";
    overlay.width = v.width;
    overlay.height = v.height;
    overlay.style.position = "absolute";
    overlay.style.left = v.offsetLeft + "px";
    overlay.style.top = v.offsetTop + "px";
    overlay.style.pointerEvents = "none";
    // Effet miroir sur le canvas overlay
    overlay.style.transform = "scaleX(-1)";
    document.body.appendChild(overlay);
  }
}

async function getDescriptorFromImageElement(imgEl) {
  const detection = await faceapi
    .detectSingleFace(imgEl)
    .withFaceLandmarks()
    .withFaceDescriptor();
  if (!detection) return null;
  return detection.descriptor;
}

function euclideanDistance(d1, d2) {
  let sum = 0;
  for (let i = 0; i < d1.length; i++) {
    const diff = d1[i] - d2[i];
    sum += diff * diff;
  }
  return Math.sqrt(sum);
}

(async () => {
  await loadModels();
  await startVideo();

  let idDescriptor = null;

  // upload ID
  document.getElementById("idUpload").addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const img = await faceapi.bufferToImage(file);
    document.body.appendChild(img); // pour debug; tu peux le cacher
    const desc = await getDescriptorFromImageElement(img);
    if (!desc) {
      document.getElementById("result").innerText =
        "Aucun visage détecté sur la pièce d'identité";
      return;
    }
    idDescriptor = desc;
    document.getElementById("result").innerText =
      "Visage ID détecté et enregistré localement";
    img.remove(); // nettoyer si voulu
  });

  // prendre selfie
  document.getElementById("snap").addEventListener("click", async () => {
    const video = document.getElementById("video");
    const canvas = document.getElementById("selfieCanvas");
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const img = new Image();
    img.src = canvas.toDataURL("image/jpeg");
    await new Promise((r) => (img.onload = r));
    const selfieDesc = await getDescriptorFromImageElement(img);
    if (!selfieDesc) {
      document.getElementById("result").innerText =
        "Aucun visage détecté dans le selfie";
      return;
    }
    if (!idDescriptor) {
      document.getElementById("result").innerText = "Aucun visage ID chargé";
      return;
    }

    const dist = euclideanDistance(selfieDesc, idDescriptor);
    const threshold = 0.5;
    document.getElementById("result").innerText = `Distance: ${dist.toFixed(
      4
    )} — ${dist < threshold ? "MATCH" : "NO MATCH"}`;

    // Optionnel : envoyer au serveur pour vérification persistante
    // fetch('/api/verify', {method:'POST', body: JSON.stringify({dist}), headers:{'Content-Type':'application/json'}})
  });
})();
