// SSDK Enterprise Storage Engine
// Abstracts local data persistence, handling localStorage, sessionStorage, and fallbacks with encryption

export class StorageEngine {
  constructor() {
    this.core = null;
    this.memoryFallback = new Map();
    this.isLocalStorageAvailable = this.testStorage("localStorage");
    this.isSessionStorageAvailable = this.testStorage("sessionStorage");
    // Mock encryption key for client-side obfuscation (Enterprise scale usually uses KMS, this is a basic layer)
    this.encryptionKey = "ssdk_ent_sec_key_2026";
  }

  async init(core) {
    this.core = core;
    console.log(`[StorageEngine] Initialized. LocalStorage: ${this.isLocalStorageAvailable}`);
  }

  /**
   * Tests if storage is available and writable (handles Private Browsing modes)
   */
  testStorage(type) {
    try {
      const storage = window[type];
      const x = '__storage_test__';
      storage.setItem(x, x);
      storage.removeItem(x);
      return true;
    } catch (e) {
      return e instanceof DOMException && (
        // everything except Firefox
        e.code === 22 ||
        // Firefox
        e.code === 1014 ||
        // test name field too, because code might not be present
        e.name === 'QuotaExceededError' ||
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
        // acknowledge QuotaExceededError only if there's something already stored
        (window[type] && window[type].length !== 0);
    }
  }

  /**
   * Very basic obfuscation for sensitive data in localStorage (Not real crypto, just avoids plain text snooping)
   */
  _obfuscate(text) {
    return btoa(unescape(encodeURIComponent(text)));
  }

  _deobfuscate(encoded) {
    try {
      return decodeURIComponent(escape(atob(encoded)));
    } catch (e) {
      return null;
    }
  }

  setItem(key, value, options = { secure: false, session: false }) {
    let dataToStore = typeof value === "string" ? value : JSON.stringify(value);
    
    if (options.secure) {
      dataToStore = this._obfuscate(dataToStore);
    }

    if (options.session && this.isSessionStorageAvailable) {
      window.sessionStorage.setItem(key, dataToStore);
    } else if (this.isLocalStorageAvailable) {
      window.localStorage.setItem(key, dataToStore);
    } else {
      this.memoryFallback.set(key, dataToStore);
    }
  }

  getItem(key, options = { secure: false, session: false, parse: false }) {
    let rawData = null;
    
    if (options.session && this.isSessionStorageAvailable) {
      rawData = window.sessionStorage.getItem(key);
    } else if (this.isLocalStorageAvailable) {
      rawData = window.localStorage.getItem(key);
    } else {
      rawData = this.memoryFallback.get(key) || null;
    }

    if (!rawData) return null;

    if (options.secure) {
      rawData = this._deobfuscate(rawData);
      if (!rawData) return null;
    }

    if (options.parse) {
      try {
        return JSON.parse(rawData);
      } catch (e) {
        console.warn(`[StorageEngine] Failed to parse JSON for key: ${key}`);
        return null;
      }
    }

    return rawData;
  }

  removeItem(key, session = false) {
    if (session && this.isSessionStorageAvailable) {
      window.sessionStorage.removeItem(key);
    } else if (this.isLocalStorageAvailable) {
      window.localStorage.removeItem(key);
    } else {
      this.memoryFallback.delete(key);
    }
  }

  clear(session = false) {
    if (session && this.isSessionStorageAvailable) {
      window.sessionStorage.clear();
    } else if (this.isLocalStorageAvailable) {
      window.localStorage.clear();
    } else {
      this.memoryFallback.clear();
    }
  }
}
