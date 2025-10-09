@echo off
echo ====== Starting MongoDB Replica Set ======

REM --- Instance 1 ---
start "MongoDB RS1" cmd /k "mongod --replSet rs0 --port 27017 --dbpath C:\mongo\data\rs1 --bind_ip localhost"

REM --- Instance 2 ---
start "MongoDB RS2" cmd /k "mongod --replSet rs0 --port 27018 --dbpath C:\mongo\data\rs2 --bind_ip localhost"

REM --- Instance 3 ---
start "MongoDB RS3" cmd /k "mongod --replSet rs0 --port 27019 --dbpath C:\mongo\data\rs3 --bind_ip localhost"

start "MongoDB RS0" cmd /k "mongosh --port 27017"

echo All replica set nodes started.
