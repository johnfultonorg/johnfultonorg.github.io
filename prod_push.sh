#!/bin/bash


# Get the commit message from the user
read -p "Enter commit message: " message

# Add all changes to the staging area
git add -A

# Commit the changes with the provided message
git commit -m "$message"

# Pull changes from the remote repository
git pull gitlab main
git pull github main

# Push the changes to the remote repository
git push gitlab main
git push github main

echo "Add, commit, pull, push, and github deploy for johnfulton.org"