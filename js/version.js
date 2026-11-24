// Version information for johnfulton.org
// Update this file to change the version number site-wide

const siteVersion = {
  major: 4,
  minor: 1,
  patch: 2,

  releaseDate: "2026-11-24",
  
  // Get the full version string (e.g., "4.0.17")
  getVersion: function() {
    return `${this.major}.${this.minor}.${this.patch}`;
  },
  
  // Get the full version string with "Version" prefix (e.g., "Version 4.0.17")
  getVersionLabel: function() {
    return `Version ${this.getVersion()}`;
  }
  
};
