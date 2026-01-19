#!/bin/bash

# Build script: Process files from src/ and output to root for GitHub Pages
echo "Building site from src/..."

# Copy HTML files from src/pages/ to root
cp src/pages/*.html .
echo "✓ HTML pages copied to root"

# Copy assets to root directories (maintain structure)
cp -r src/assets/css/* css/
cp -r src/assets/js/* js/
[ -d src/assets/fonts ] && cp -r src/assets/fonts/* fonts/ 2>/dev/null || true
[ -d src/assets/socialicons ] && cp -r src/assets/socialicons/* socialicons/ 2>/dev/null || true
echo "✓ Assets synced"

# Copy includes to root
cp src/includes/*.html .
echo "✓ Includes copied to root"

echo "Build complete!"
