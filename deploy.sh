#!/bin/bash
echo "starting deploy..."
bash commit.sh
echo "ftp push to bluehost...."
git ftp push
echo "pushing cloud code and html and javascript to parse...."
cp *.html ~/workspace/pracloudcode/public
mv ~/workspace/pracloudcode/public/signup.html ~/workspace/pracloudcode/public/index.html
cp *.js ~/workspace/pracloudcode/public
cd pracloudcode
parse deploy
rm -rf ~/workspace/pracloudcode/public/*.html
rm -rf ~/workspae/pracloudcode/public/*.js
cd