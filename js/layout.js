// js/layout.js
async function includeHtml(selector, file) {
  const host = document.querySelector(selector);
  if (!host) return;

  try {
    // Add loading state
    host.classList.add('loading');
    
    const res = await fetch(file);
    if (!res.ok) throw new Error(`${file} -> ${res.status}`);
    const content = await res.text();
    
    // Add ARIA labels to nav and footer
    if (selector === "#nav-placeholder") {
      host.setAttribute('role', 'navigation');
      host.setAttribute('aria-label', 'Main navigation');
    } else if (selector === "#footer-placeholder") {
      host.setAttribute('role', 'contentinfo');
      host.setAttribute('aria-label', 'Site footer');
    }
    
    host.innerHTML = content;
    // Remove loading state
    host.classList.remove('loading');
  } catch (err) {
    console.error("Include failed:", err);
    // Show user-friendly fallback message
    if (selector === "#nav-placeholder") {
      host.innerHTML = '<p style="text-align: center; color: #999; padding: 10px;">Navigation unavailable</p>';
    } else if (selector === "#footer-placeholder") {
      host.innerHTML = '<p style="text-align: center; color: #999; padding: 10px;">Footer unavailable</p>';
    }
  }
}

function setActiveNav(activePage) {
  if (!activePage) return;
  const activeTab = document.getElementById(`nav-${activePage}`);
  if (activeTab) activeTab.classList.add("active-tab");
}

function setCopyrightYear() {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

function setLastUpdated() {
  const lastUpdatedEl = document.getElementById("last-updated");
  if (lastUpdatedEl) {
    const today = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
    lastUpdatedEl.textContent = today;
  }
}

function setSiteVersion() {
  const versionEl = document.getElementById("site-version");
  if (versionEl && typeof siteVersion !== 'undefined') {
    versionEl.textContent = siteVersion.getVersionLabel();
  }
}

function changeLanguage(lang) {
  // Store language preference
  localStorage.setItem('preferredLanguage', lang);
  
  // Currently only English is available
  if (lang !== 'en') {
    alert('This language is coming soon. Currently only English is available.');
    document.getElementById('language-select').value = 'en';
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const activePage = document.body.dataset.activePage; // e.g., "contact", "courses", ...

  try {
    // Load version information
    const script = document.createElement('script');
    script.src = './js/version.js';
    document.head.appendChild(script);

    // Detect if we're on a deep page (src/pages/) or root
    const isDeepPage = window.location.pathname.includes('src/pages');
    const basePath = isDeepPage ? '../../' : './';

    await includeHtml("#nav-placeholder", basePath + "nav.html");
    setActiveNav(activePage);

    await includeHtml("#footer-placeholder", basePath + "footer.html");
    // Set version after footer is loaded (small delay to ensure siteVersion is available)
    setTimeout(setSiteVersion, 100);
    setCopyrightYear();
    setLastUpdated();
  } catch (err) {
    console.error("Layout initialization error:", err);
  }
});
