# johnfultonorg.github.io
Home

Base github page accessible by http://johnfultonorg.github.io
Linked to custom domain johnfulton.org

Test by opening index.html in Visual Studio nad Live Server

Deploy by pushing to https://github.com/johnfultonorg/johnfultonorg.github.io.git
sh prod_push.sh


Change version information here and and footer.html


## Word Cloud Notes (How to Recreate)

The word cloud is a dedicated page powered by a public-read Google Sheet.

### Files involved
- `wordcloud.html` - page layout and cloud container
- `js/wordcloud.js` - fetches sheet data and renders cloud with WordCloud2
- `css/main.css` - word cloud visual styles
- `nav.html` - includes `Word Cloud` menu item between Home and Resume
- `sitemap.xml` - includes `wordcloud.html`

### Data source format
Google Sheet must be readable by anyone with the link.

- Column A: word text
- Column B: weight (number)
- One word per row

### Where to set the sheet
In `wordcloud.html`, set these attributes on the `#word-cloud` element:

- `data-sheet-id="YOUR_SHEET_ID"`
- `data-sheet-gid="0"` (change if using a different tab)

Example sheet URL:
`https://docs.google.com/spreadsheets/d/1igQHwNbo2-l9yxSjP_Px7z_pjhm7RKcmbP4gfR5wYaw/edit`

Sheet ID is the part between `/d/` and `/edit`.

### Rendering library
The page uses WordCloud2 loaded from CDN in `wordcloud.html`:

`https://cdn.jsdelivr.net/npm/wordcloud@1.2.3/src/wordcloud2.min.js`

If the sheet fails to load, `js/wordcloud.js` falls back to sample words so the page still renders.

### Quick recreate checklist
1. Create `wordcloud.html` with `data-active-page="wordcloud"`.
2. Add a `Word Cloud` tab in `nav.html` between Home and Resume.
3. Add cloud styles to `css/main.css`.
4. Add/verify `js/wordcloud.js`.
5. Add `wordcloud.html` to `sitemap.xml`.
6. Confirm sheet sharing is public read.


## Revision History (most current at top)


4.1 - 5/30/26
    - Added Word Cloud page
    - Added Google Sheet powered word cloud rendering
    - Added Word Cloud navigation link and sitemap entry


4.0 - 12/30/25
    - refactor for duplicate page code

3.9 - 12/30/25
    - How Junior Developers Learn to Program

3.8 - 12/10/2025
    - Cleanup

3.7 - 11/15/25
    - Merit Badges
    
3.6 - 11/14/25
    - Fraud and Cybersecurity
    - Copyright notice

3.5 - 11/12/25
    - Courses for 26SP

3.4 - 9/16/25
    - Added link to interview-questions.net

3.3 - 9/9/25
    - revised networking pdf
    - description and keywords for SEO

3.2 - 9/6/25
    - 25FA classes
    - Display version in index.html
    - Added WIX and web design persentation

3.1 - 9/3/25
    - cleanup
    - added networking preswentation and link from "other"

3.0 - 8/6/2025
    - revised manually for johnfulton.org
    - cleanup of all pages
    - added Cousrse taught
    - Added other links
  
2.0 - 8/16/2020
    - Revised using CoffeeCup


  sh check_links.sh
  sh prod_push.sh