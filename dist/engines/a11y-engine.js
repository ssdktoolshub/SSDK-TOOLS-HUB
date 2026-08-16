// SSDK Enterprise Accessibility (A11y) Engine
// Supports WCAG 2.2, Reduced Motion, High Contrast, Font Scaling

export class A11yEngine {
  constructor() {
    this.core = null;
    this.preferences = {
      reducedMotion: false,
      highContrast: false,
      fontScale: 1
    };
  }

  async init(core) {
    this.core = core;
    
    // Check OS-level preferences
    if (window.matchMedia) {
      this.preferences.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    // Load user preferences
    const storage = this.core.getEngine("storage");
    if (storage) {
      const saved = storage.getItem("ssdk-a11y-prefs", { parse: true });
      if (saved) {
        this.preferences = { ...this.preferences, ...saved };
      }
    }

    this.applyPreferences();
    
    if (this.core.getEngine("logger")) {
      this.core.getEngine("logger").info("A11yEngine", "Accessibility Engine Initialized");
    }
  }

  applyPreferences() {
    if (this.preferences.reducedMotion) {
      document.documentElement.classList.add("reduced-motion");
    } else {
      document.documentElement.classList.remove("reduced-motion");
    }
    
    // High contrast is handled by ThemeManager (data-theme="high-contrast"), 
    // but this engine tracks the accessibility aspect.
    
    document.documentElement.style.setProperty('--font-scale', this.preferences.fontScale);
  }

  setPreference(key, value) {
    this.preferences[key] = value;
    const storage = this.core.getEngine("storage");
    if (storage) storage.setItem("ssdk-a11y-prefs", this.preferences);
    this.applyPreferences();
  }
}
