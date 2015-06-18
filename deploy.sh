#!/bin/bash
if test "$#" -ne 1; then
    echo "Enter a github commit message"
    exit 1
fi
echo "Starting deploy...."
echo "Committing to github...."
git add .
git commit -m "$1"
git push -u origin master
echo "ftp push to bluehost...."
git ftp push
echo "pushing cloud code and html and javascript to parse...."
cp *.html ~/workspace/pracloudcode/public
cp *.js ~/workspace/pracloudcode/public
cd pracloudcode
parse deploy
rm -rf ~/workspace/pracloudcode/public/*.html
rm -rf ~/workspae/pracloudcode/public/*.js
cd