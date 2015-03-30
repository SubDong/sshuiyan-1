#!/bin/bash

CMD_PATH=`dirname $0`

cd $CMD_PATH
git pull
git checkout develop

cd ../logs
forever restart -l sshuiyan.log -o sshuiyan.out -e sshuiyan.error ../sshuiyan/app.js $1