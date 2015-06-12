#!/bin/bash
echo "Starting deploy...."
git add .
git commit -m "$1"
git push -u origin master
git ftp push
cd pracloudcode
parse deploy
cd