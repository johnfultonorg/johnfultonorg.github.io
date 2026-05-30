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
read -p "Do you want to run check_links_simple.sh before proceeding? (yes/no): " check_links

# Normalize input
check_links=$(echo "$check_links" | tr '[:upper:]' '[:lower:]')

if [[ "$check_links" == "yes" || "$check_links" == "y" ]]; then
    sh check_links_simple.sh
else    
    echo "Skipping link check."
fi

# -----------------------------------------------
# Git operations
# -----------------------------------------------

version=$(grep -o 'Version [0-9][0-9.]*' footer.html | head -n 1 | sed 's/^Version //')

if [[ -z "$version" ]]; then
    echo "Error: Could not determine version from footer.html"
    exit 1
fi

has_changes="false"
if [[ -n "$(git status --porcelain)" ]]; then
    has_changes="true"
fi

if [[ "$has_changes" == "true" ]]; then
    read -p "Enter commit message text for version $version: " message

    if [[ -z "$message" ]]; then
        echo "Error: Commit message cannot be empty when there are local changes."
        exit 1
    fi

    full_message="$version $message"
    echo "Final commit message: $full_message"

    echo "Adding changes..."
    git add -A

    # Check again after add in case all detected files were ignored or unchanged.
    if [[ -n "$(git status --porcelain)" ]]; then
        echo "Committing..."
        git commit -m "$full_message"
    else
        echo "No committable changes after add; continuing with pull/push."
    fi
else
    echo "Working tree is clean; skipping commit step."
fi

echo "Pulling from GitLab..."
git pull gitlab main

echo "Pulling from GitHub..."
git pull github main

gitlab_ahead=$(git rev-list --count gitlab/main..HEAD)
github_ahead=$(git rev-list --count github/main..HEAD)

if [[ "$has_changes" == "false" && "$gitlab_ahead" -eq 0 && "$github_ahead" -eq 0 ]]; then
    read -p "Working tree is clean and there is nothing to push. Do you really want to proceed with this? (yes/no): " proceed_anyway
    proceed_anyway=$(echo "$proceed_anyway" | tr '[:upper:]' '[:lower:]')

    if [[ "$proceed_anyway" != "yes" && "$proceed_anyway" != "y" ]]; then
        echo "Push cancelled by user."
        exit 0
    fi
fi

echo "Pushing to GitLab..."
git push gitlab main

echo "Pushing to GitHub..."
git push github main

echo "Completed: link-check (optional) → add → commit → pull → push."
