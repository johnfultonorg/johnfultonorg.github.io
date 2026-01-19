#!/usr/bin/env bash

# Simple Link Checker - Just shows ACTIVE or DEAD links
# Usage: sh check_links_simple.sh

RED="\033[31m"
GREEN="\033[32m"
RESET="\033[0m"

TEMP_FILE=$(mktemp)
URLS_FILE=$(mktemp)
trap "rm -f $TEMP_FILE $URLS_FILE ${TEMP_FILE}.data" EXIT

echo "Checking external links..."
echo ""

# Extract all unique external URLs from HTML files (skip src/ directory to avoid duplicates)
grep -rEho 'https?://[^"<>[:space:]]+' . --include="*.html" --exclude-dir=src 2>/dev/null | sort -u > "$URLS_FILE"

while IFS= read -r url; do
    [[ -z "$url" ]] && continue
    [[ "$url" =~ johnfulton\.org ]] && continue  # Skip self-references
    
    # Check the link
    status=$(curl -o /dev/null -s -w "%{http_code}" --max-time 10 --head "$url" 2>/dev/null || echo "000")
    
    # Categorize and write to temp file
    if [[ "$status" =~ ^(2|3|999|417) ]]; then
        echo -e "${GREEN}✓ ACTIVE${RESET}  - $url" | tee -a "$TEMP_FILE"
        echo "ACTIVE|$url" >> "${TEMP_FILE}.data"
    else
        echo -e "${RED}✗ DEAD${RESET}    - $url ($status)" | tee -a "$TEMP_FILE"
        echo "DEAD|$url|$status" >> "${TEMP_FILE}.data"
    fi
done < "$URLS_FILE"

# Count results
ACTIVE_COUNT=$(grep -c "^ACTIVE|" "${TEMP_FILE}.data" 2>/dev/null || echo 0)
DEAD_COUNT=$(grep -c "^DEAD|" "${TEMP_FILE}.data" 2>/dev/null || echo 0)

# Summary
echo ""
echo "========================================"
echo "SUMMARY"
echo "========================================"
echo -e "${GREEN}Active links: $ACTIVE_COUNT${RESET}"
echo -e "${RED}Dead links: $DEAD_COUNT${RESET}"

if [[ $DEAD_COUNT -gt 0 ]]; then
    echo ""
    echo -e "${RED}Dead Links:${RESET}"
    while IFS='|' read -r status url code; do
        [[ "$status" == "DEAD" ]] && echo "  ✗ $url (HTTP $code)"
    done < "${TEMP_FILE}.data"
fi

echo ""
rm -f "${TEMP_FILE}.data"
exit 0
