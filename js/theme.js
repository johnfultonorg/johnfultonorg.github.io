// Dark Mode Theme Switcher
(function() {
  const THEME_KEY = 'johnfulton-theme';
  const LIGHT_THEME = 'light';
  const DARK_THEME = 'dark';

  // Initialize theme on page load
  function initializeTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Determine which theme to use:
    // 1. Saved preference in localStorage
    // 2. System preference
    // 3. Default to light
    const theme = savedTheme || (prefersDark ? DARK_THEME : LIGHT_THEME);
    
    setTheme(theme);
  }

  // Set the theme
  function setTheme(theme) {
    if (theme === DARK_THEME) {
      document.documentElement.setAttribute('data-theme', DARK_THEME);
      localStorage.setItem(THEME_KEY, DARK_THEME);
      updateToggleButton('☀️'); // Sun icon for switching to light mode
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem(THEME_KEY, LIGHT_THEME);
      updateToggleButton('🌙'); // Moon icon for switching to dark mode
    }
  }

  // Get current theme
  function getCurrentTheme() {
    return document.documentElement.getAttribute('data-theme') || LIGHT_THEME;
  }

  // Toggle theme
  function toggleTheme() {
    const currentTheme = getCurrentTheme();
    const newTheme = currentTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
    setTheme(newTheme);
  }

  // Update toggle button text/icon
  function updateToggleButton(icon) {
    const button = document.getElementById('theme-toggle-btn');
    if (button) {
      button.innerHTML = icon;
      button.setAttribute('aria-label', 
        icon === '🌙' ? 'Switch to dark mode' : 'Switch to light mode'
      );
    }
  }

  // Create and inject the toggle button
  function createToggleButton() {
    const button = document.createElement('button');
    button.id = 'theme-toggle-btn';
    button.className = 'theme-toggle';
    button.setAttribute('aria-label', 'Toggle dark mode');
    button.setAttribute('title', 'Toggle dark mode');
    
    // Set initial icon based on current theme
    const currentTheme = getCurrentTheme();
    button.innerHTML = currentTheme === LIGHT_THEME ? '🌙' : '☀️';
    
    button.addEventListener('click', toggleTheme);
    
    document.body.appendChild(button);
  }

  // Listen for system theme changes
  function watchSystemTheme() {
    window.matchMedia('(prefers-color-scheme: dark)').addListener(function(e) {
      // Only apply system preference if user hasn't set a preference
      if (!localStorage.getItem(THEME_KEY)) {
        setTheme(e.matches ? DARK_THEME : LIGHT_THEME);
      }
    });
  }

  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initializeTheme();
      createToggleButton();
      watchSystemTheme();
    });
  } else {
    // DOM is already ready
    initializeTheme();
    createToggleButton();
    watchSystemTheme();
  }

  // Expose public API if needed
  window.themeManager = {
    toggle: toggleTheme,
    set: setTheme,
    get: getCurrentTheme,
    LIGHT: LIGHT_THEME,
    DARK: DARK_THEME
  };
})();
