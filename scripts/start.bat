@ECHO OFF

D:
cd\redis\64bit
start redis-server.exe

cd\mongodb
start mongod.exe --dbpath D:/db

cd\workhome\melodycoder
start node-dev app.js