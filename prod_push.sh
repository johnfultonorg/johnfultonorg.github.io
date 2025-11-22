#!/bin/bash
# prod_push.sh: Add, commit, pull, and push changes to GitLab and GitHub remotes.

set -e  # Stop immediately on error

# Check remotes
if ! git remote get-url gitlab >/dev/null 2>&1; then
    echo "Error: Remote 'gitlab' is not configured."
    exit 1
fi

if ! git remote get-url github >/dev/null 2>&1; then
    echo "Error: Remote 'github' is not configured."
    exit 1
fi

# Ask if user wants to check links first
read -p "Do you want to run check_links.sh before proceeding? (yes/no): " check_links

# Normalize input
check_links=$(echo "$check_links" | tr '[:upper:]' '[:lower:]')

if [[ "$check_links" == "yes" || "$check_links" == "y" ]]; then
    echo "Running link checker..."
    if [[ -x "./check_links.sh" ]]; then
        ./check_links.sh
    else
        echo "Error: check_links.sh is not executable or not found."
        exit 1
    fi

    echo ""
    # Ask if user wants to continue after link checking
    read -p "Continue with commit and push? (yes/no): " continue_push
    continue_push=$(echo "$continue_push" | tr '[:upper:]' '[:lower:]')

    if [[ "$continue_push" != "yes" && "$continue_push" != "y" ]]; then
        echo "Operation canceled by user."
        exit 0
    fi
fi

# -----------------------------------------------
# Git operations
# -----------------------------------------------

read -p "Enter commit message: " message

if [[ -z "$message" ]]; then
    echo "Error: Commit message cannot be empty."
    exit 1
fi

echo "Adding changes..."
git add -A

echo "Committing..."
git commit -m "$message"

echo "Pulling from GitLab..."
git pull gitlab main

echo "Pulling from GitHub..."
git pull github main

echo "Pushing to GitLab..."
git push gitlab main

echo "Pushing to GitHub..."
git push github main

echo "Completed: link-check (optional) → add → commit → pull → push."
