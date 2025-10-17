import fs from "fs";
import multer from "multer";
import makeSlugFrom from "../utils/slug.js";

const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileExtension = file.originalname.split(".").pop();
    const uniqueName = `${makeSlugFrom(null, "image")}.${fileExtension}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("seules les images sont autorisees !"), false);
  }
};

const upload = multer({ storage, fileFilter });

export default upload;
