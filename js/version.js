// Version information for johnfulton.org
// Update this file to change the version number site-wide

const siteVersion = {
  major: 4,
  minor: 1,
  patch: 1,
  
  // Get the full version string (e.g., "4.0.17")
  getVersion: function() {
    return `${this.major}.${this.minor}.${this.patch}`;
  },
  
  // Get the full version string with "Version" prefix (e.g., "Version 4.0.17")
  getVersionLabel: function() {
    return `Version ${this.getVersion()}`;
  },
  
  // Get release date if needed (optional)
  releaseDate: "2026-11-20"
};
