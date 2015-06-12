#!/bin/bash
echo "Starting deploy...."
echo "Committing to github...."
git add .
git commit -m "$1"
git push -u origin master
#echo "ftp push to bluehost...."
#git ftp push
echo "pushing cloud code to parse...."
cd pracloudcode
parse deploy
cd