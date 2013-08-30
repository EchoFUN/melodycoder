#!/bin/bash

/Applications/mongodb/bin/mongod --dbpath /Applications/mongodb/db/ &
/Applications/redis/src/redis-server &
node-dev "/Users/xukai/Documents/Aptana workspace/melodycoder/app.js" &