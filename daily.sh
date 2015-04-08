#!/bin/bash

CMD_PATH=`dirname $0`

cd $CMD_PATH
git pull
git checkout develop

mkdir -p ../logs

forever stopall

forever start -l $CMD_PATH/../logs/sshuiyan.log -o $CMD_PATH/../logs/sshuiyan.out -e $CMD_PATH/../logs/sshuiyan.error app.js $1