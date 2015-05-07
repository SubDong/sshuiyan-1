#!/bin/bash

CMD_PATH=`dirname $0`

cd $CMD_PATH
git pull
git checkout develop

pm2 reload app.js
