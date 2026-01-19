#!/usr/bin/env bash

# Simple Link Checker - Just shows ACTIVE or DEAD links
# Usage: sh check_links_simple.sh

RED="\033[31m"
GREEN="\033[32m"
RESET="\033[0m"

declare -a DEAD_LINKS=()
declare -a ACTIVE_LINKS=()
declare -A CHECKED=()

echo "Checking external links..."
echo ""

# Extract all external URLs from HTML files
while IFS= read -r file; do
    grep -Eo 'https?://[^"<>[:space:]]+' "$file" 2>/dev/null | while read -r url; do
        [[ -z "$url" ]] && continue
        [[ "$url" =~ johnfulton\.org ]] && continue  # Skip self-references
        
        # Skip if already checked
        if [[ -v CHECKED["$url"] ]]; then
            continue
        fi
        CHECKED["$url"]=1
        
        # Check the link
        status=$(curl -o /dev/null -s -w "%{http_code}" --max-time 10 --head "$url" 2>/dev/null || echo "000")
        
        # Categorize
        if [[ "$status" =~ ^(2|3|999|417) ]]; then
            echo -e "${GREEN}✓ ACTIVE${RESET}  - $url"
            ACTIVE_LINKS+=("$url")
        else
            echo -e "${RED}✗ DEAD${RESET}    - $url ($status)"
            DEAD_LINKS+=("$url")
        fi
    done
done < <(find . -type f -name "*.html")

# Summary
echo ""
echo "========================================"
echo "SUMMARY"
echo "========================================"
echo -e "${GREEN}Active links: ${#ACTIVE_LINKS[@]}${RESET}"
echo -e "${RED}Dead links: ${#DEAD_LINKS[@]}${RESET}"

if [[ ${#DEAD_LINKS[@]} -gt 0 ]]; then
    echo ""
    echo -e "${RED}Dead Links:${RESET}"
    for link in "${DEAD_LINKS[@]}"; do
        echo "  ✗ $link"
    done
fi

echo ""
exit 0
