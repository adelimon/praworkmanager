if test "$#" -ne 1; then
    echo "Enter a github commit message"
    exit 1
fi

echo "Committing to github...."
git add --all ./
git commit -m "$1"
git push -u origin master