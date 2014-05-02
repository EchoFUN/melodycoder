@ECHO OFF

D:
cd\redis
start redis-server.exe

cd\mongodb
start mongod.exe --dbpath D:/db

cd\Pro lab\Aptana workspace\melodycoder
start node-dev app.js