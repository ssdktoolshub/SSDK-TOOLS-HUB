// SSDK Enterprise Internationalization (i18n) Engine
// Centralizes multi-language support (English, Bengali, Hindi, etc.)

export class I18nEngine {
  constructor() {
    this.core = null;
    this.currentLanguage = "en";
    this.dictionaries = {};
  }

  async init(core) {
    this.core = core;
    // Migrate from window global to internal dictionary if it exists
    if (window.ssdkTranslations) {
      this.dictionaries = window.ssdkTranslations;
    }
    
    const storage = this.core.getEngine("storage");
    if (storage) {
      this.currentLanguage = storage.getItem("ssdk-lang") || "en";
    } else {
      this.currentLanguage = localStorage.getItem("ssdk-lang") || "en";
    }

    // Attach global hooks to preserve compatibility with existing bootstrap.js calls
    window.ssdkTranslateKey = this.translateKey.bind(this);
    window.ssdkTranslate = this.applyTranslations.bind(this);
    
    if (this.core.getEngine("logger")) {
      this.core.getEngine("logger").info("I18nEngine", `Translation Engine Initialized. Language: ${this.currentLanguage}`);
    }
  }

  setLanguage(langCode) {
    this.currentLanguage = langCode;
    const storage = this.core.getEngine("storage");
    if (storage) {
      storage.setItem("ssdk-lang", langCode);
    } else {
      localStorage.setItem("ssdk-lang", langCode);
    }
    this.applyTranslations(langCode);
    window.dispatchEvent(new CustomEvent("ssdk-lang-change", { detail: langCode }));
  }

  translateKey(key) {
    const dict = this.dictionaries[this.currentLanguage] || this.dictionaries["en"] || {};
    return dict[key] || key;
  }

  applyTranslations(lang = null) {
    if (lang) this.currentLanguage = lang;
    const dict = this.dictionaries[this.currentLanguage] || this.dictionaries["en"] || {};
    
    document.querySelectorAll("[data-translate]").forEach(el => {
      const key = el.getAttribute("data-translate");
      if (dict[key]) {
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          el.placeholder = dict[key];
        } else {
          el.innerHTML = dict[key];
        }
      }
    });
  }

  // Support for dynamic lazy loading of language JSONs in the future
  async loadLanguagePack(langCode) {
    // API logic to fetch langCode.json
  }
}
