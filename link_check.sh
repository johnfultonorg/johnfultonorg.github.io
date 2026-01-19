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

