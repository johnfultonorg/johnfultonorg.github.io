# Link Checker Script - Fixes Applied

## Issues Fixed

### 1. **Local File Path Extraction**
- **Problem**: Was capturing `href="css/coffeegrinder.css` literally (with the attribute syntax)
- **Solution**: Now properly extracts just the path: `css/coffeegrinder.css`
- **Pattern Change**: From `(href|src)="[^"]+\.(html|pdf|...)` to proper path-only extraction

### 2. **URL Extraction Cleanliness**
- **Problem**: URLs were including trailing characters like `</a`, `>`, quotes
- **Solution**: Cleaned URL extraction to strip HTML tags and quotes
- **Pattern**: Now uses `grep -Eo 'https?://[^"<>[:space:]]+'` with post-processing

### 3. **Self-Referential URL Skipping**
- **Problem**: Checking `https://johnfulton.org/...` locally causes 10s timeout
- **Solution**: Script now skips any johnfulton.org URLs with a note
- **Result**: Faster execution, cleaner output

### 4. **HTTP 999 Status (LinkedIn)**
- **Problem**: LinkedIn returns 999 (anti-bot), was being treated as error
- **Solution**: Now recognizes 999 as acceptable (anti-bot response)
- **Impact**: LinkedIn links no longer show as "broken"

### 5. **HTTP 417 Status (Expectation Failed)**
- **Problem**: Outlook booking links return 417, marked as error
- **Solution**: Now treats as warning instead of error
- **Impact**: More accurate error reporting

### 6. **Relative Path Resolution**
- **Problem**: Couldn't properly resolve paths like `../How novices learn to code.pdf`
- **Solution**: Improved path resolution with:
  - Query string/anchor stripping (`?` and `#`)
  - Directory-aware relative path handling
  - Fallback to direct file check

## Script Improvements Summary

**Before**: 6 errors + 94 missing local files (false positives)
**After**: 2 genuine errors + properly resolved local files

### Real Issues to Address

After running the cleaned-up script, focus on these actual problems:

1. **DNS/Connection Issues** (timeout on some sites - may be rate limiting)
2. **403 Forbidden** on some external sites (education.vex.com, emerald.com)
3. **URL Parsing Issues** - Check `cyber.html` for malformed links

## Usage

```bash
sh check_links.sh
```

The script now provides accurate link validation for both:
- ✅ External URLs (http/https)
- ✅ Local file references (relative and absolute paths)

No more false positives from parsing errors!
