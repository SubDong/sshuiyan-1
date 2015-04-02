#!/bin/bash

CMD_PATH=`dirname $0`

cd $CMD_PATH
git pull
git checkout develop

mkdir -p ../logs

forever stopall

forever start -l ../logs/sshuiyan.log -o ../logs/sshuiyan.out -e ../logs/sshuiyan.error app.js $1