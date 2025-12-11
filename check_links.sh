#!/usr/bin/env bash

RED="\033[31m"
RESET="\033[0m"

declare -a BAD_LINKS=()

# Loop over all HTML files — no pipelines
while IFS= read -r file; do
    echo "Scanning: $file"

    # Extract URLs
    mapfile -t urls < <(
        grep -Eo '(http|https)://[^"]+' "$file" \
        | sed -E 's/(<\/a>|<\/p>|<[^>]+>|["\047])$//' \
        | sed -E 's/(<\/a>|<\/p>|["\047])$//' \
        | sed -E 's/["\047]$//' \
        | sort -u
    )

    # Process URLs
    for url in "${urls[@]}"; do
        [[ -z "$url" ]] && continue

        result=$(curl -o /dev/null -s -w "%{http_code} %{time_total}" "$url")
        status=$(echo "$result" | awk '{print $1}')
        time=$(echo "$result" | awk '{print $2}')

        # Track error statuses
        if [[ "$status" =~ ^4|5 ]]; then
            echo -e "${RED}${status}    ${time} ${url}${RESET}"
            BAD_LINKS+=("$status  $url")
        else
            printf "%-6s %-8s %s\n" "$status" "$time" "$url"
        fi
    done

    echo ""
done < <(find . -type f -name "*.html")

# ----------------------------------------------
# SUMMARY (now works correctly)
# ----------------------------------------------
echo ""
echo "============================"
echo " Summary of Broken/Questionable Links"
echo "============================"

if [[ ${#BAD_LINKS[@]} -eq 0 ]]; then
    echo "No 4xx or 5xx errors found."
else
    for entry in "${BAD_LINKS[@]}"; do
        echo -e "${RED}${entry}${RESET}"
    done
fi

echo "============================"
echo ""
