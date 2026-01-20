function fixNavLinks() {
  // Navigation links are already correct as-is
  // Files are at root level, not in subdirectories
  // No fixing needed
}

// js/layout.js
async function includeHtml(selector, file) {
  const host = document.querySelector(selector);
  if (!host) return;

  try {
    const res = await fetch(file);
    if (!res.ok) throw new Error(`${file} -> ${res.status}`);
    host.innerHTML = await res.text();
    fixNavLinks(); // Fix links after nav is loaded
  } catch (err) {
    console.error("Include failed:", err);
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

document.addEventListener("DOMContentLoaded", async () => {
  const activePage = document.body.dataset.activePage; // e.g., "contact", "courses", ...

  // Detect if we're on a deep page (src/pages/) or root
  const isDeepPage = window.location.pathname.includes('src/pages');
  const basePath = isDeepPage ? '../../' : './';

  await includeHtml("#nav-placeholder", basePath + "nav.html");
  setActiveNav(activePage);

  await includeHtml("#footer-placeholder", basePath + "footer.html");
  setCopyrightYear();
  setLastUpdated();
});
