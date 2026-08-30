// SSDK Application Bootloader - Initializes CoreEngine and mounts layout frameworks

import { CoreEngine } from "./core.js";
import { ErrorEngine } from "../engines/error-engine.js";
import { ThemeEngine } from "./theme/theme-engine.js";
import { RouterEngine } from "../engines/router-engine.js";
import { ToolEngine } from "../engines/tool-engine.js";
import { SearchEngine } from "./search/engine.js";
import { HistoryEngine } from "../engines/history-engine.js";
import { FavoritesEngine } from "../engines/favorites-engine.js";
import { SEOEngine } from "./seo/seo-engine.js";
import { HomepageEngine } from "../engines/homepage-engine.js";
import { AnalyticsEngine } from "./analytics/engine.js";
import { NotificationEngine } from "../engines/notification-engine.js";
import { RecommendationEngine } from "./discovery/recommendation-engine.js";
import { PythonEngine } from "../engines/python-engine.js";
import { AIEngine } from "../engines/ai-engine.js";
import { PluginEngine } from "./plugins/plugin-engine.js";
import { UpdateEngine } from "../engines/update-engine.js";
import { CategoryEngine } from "../engines/category-engine.js";
import { StateEngine } from "../engines/state-engine.js";
import { AdminEngine } from "../engines/admin-engine.js";
import { SecurityEngine } from "../engines/security-engine.js";
import { StorageEngine } from "./storage/engine.js";
import { LoggerEngine } from "./logger/logger-engine.js";
import { HealthMonitor } from "../engines/health-monitor.js";
import { JobEngine } from "../engines/job-engine.js";
import { PluginManager } from "./plugins/plugin-manager.js";
import { MarketplaceEngine } from "../engines/marketplace-engine.js";
import { CommunityEngine } from "../engines/community-engine.js";
import { ReputationEngine } from "../engines/reputation-engine.js";
import { I18nEngine } from "./i18n/i18n-engine.js";
import { A11yEngine } from "../engines/a11y-engine.js";
import { PlatformBridge } from "../engines/platform-bridge.js";
import { SyncEngine } from "../engines/sync-engine.js";
import { WorkspaceEngine } from "../engines/workspace-engine.js";
import { BillingEngine } from "../engines/billing-engine.js";
import { APIService } from "../engines/api-service.js";
import { WorkflowEngine } from "../engines/workflow-engine.js";
import { CapabilityEngine } from "../engines/capability-engine.js";
import { ImageEngine } from "../engines/image-engine.js";
import { PDFEngine } from "../engines/pdf-engine.js";
import { SupabaseEngine } from "../engines/supabase-engine.js";

async function startApp() {
  if (window.__SSDK_BOOTED__) return;
  window.__SSDK_BOOTED__ = true;
  
  console.log("[Bootstrap] Booting SSDK Tools Hub platform...");

  try {
    // 1. Initialize Core Engine Orchestrator
    const core = new CoreEngine();
    window.SSDKCore = core;

    // 2. Register all support modules
    await core.registerEngine("error", new ErrorEngine());
    await core.registerEngine("theme", new ThemeEngine());
    await core.registerEngine("router", new RouterEngine());
    await core.registerEngine("tool", new ToolEngine());
    await core.registerEngine("search", new SearchEngine());
    await core.registerEngine("history", new HistoryEngine());
    await core.registerEngine("favorites", new FavoritesEngine());
    await core.registerEngine("seo", new SEOEngine());
    await core.registerEngine("homepage", new HomepageEngine());
    await core.registerEngine("analytics", new AnalyticsEngine());
    await core.registerEngine("notification", new NotificationEngine());
    await core.registerEngine("recommendation", new RecommendationEngine());
    await core.registerEngine("python", new PythonEngine());
    await core.registerEngine("ai", new AIEngine());
    await core.registerEngine("plugin", new PluginEngine());
    await core.registerEngine("update", new UpdateEngine());
    await core.registerEngine("category", new CategoryEngine());
    await core.registerEngine("state", new StateEngine());
    await core.registerEngine("admin", new AdminEngine());
    await core.registerEngine("storage", new StorageEngine());
    await core.registerEngine("logger", new LoggerEngine());
    await core.registerEngine("security", new SecurityEngine());
    await core.registerEngine("health", new HealthMonitor());
    await core.registerEngine("job", new JobEngine());
    await core.registerEngine("workflow", new WorkflowEngine());
    await core.registerEngine("capability", new CapabilityEngine());
    await core.registerEngine("image", new ImageEngine());
    await core.registerEngine("pdf", new PDFEngine());
    await core.registerEngine("supabase", new SupabaseEngine());
    
    // Phase 16 Abstractions
    await core.registerEngine("i18n", new I18nEngine());
    await core.registerEngine("a11y", new A11yEngine());
    await core.registerEngine("bridge", new PlatformBridge());
    await core.registerEngine("pluginManager", new PluginManager());
    await core.registerEngine("marketplace", new MarketplaceEngine());
    await core.registerEngine("community", new CommunityEngine());
    await core.registerEngine("reputation", new ReputationEngine());
    await core.registerEngine("sync", new SyncEngine());
    await core.registerEngine("workspace", new WorkspaceEngine());
    await core.registerEngine("billing", new BillingEngine());

    // 3. Boot the Core Orchestration
    await core.init();

    // 4. Dynamically Render Header & Footer Layouts
    await renderLayoutFramework(core);

    // 5. Register Service Worker for offline support and speed caching
    const prefix = core.prefix;
    if ("serviceWorker" in navigator && window.location.protocol !== "file:") {
      navigator.serviceWorker.register(`${prefix}/sw.js`)
        .then(reg => console.log("[Bootstrap] ServiceWorker registered with scope:", reg.scope))
        .catch(err => console.error("[Bootstrap] ServiceWorker registration failed:", err));
    }
  } catch (err) {
    console.error("[Bootstrap] Critical error during platform bootstrap:", err);
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", startApp, { once: true });
} else {
  startApp();
}

async function renderLayoutFramework(core) {
  const prefix = core.prefix;
  const config = core.getEngine("config");
  const categoriesList = await config.getCategories();
  const siteConfig = await config.loadJSON("site.json") || {};
  
  // Inject Header
  renderHeader(prefix, categoriesList, siteConfig);
  
  // Inject Footer
  renderFooter(prefix, siteConfig);

  // Initialize theme controls and auth listeners in header
  setupHeaderControls(core);
}



function renderHeader(prefix, categoriesList = [], siteConfig = {}) {
  let nav = document.getElementById("nav");
  if (!nav) {
    const headerHTML = `
      <nav id="nav">
        <a href="${prefix}/index.html" class="logo">
          <img src="${prefix}/assets/images/logo.png" alt="SSDK" onerror="this.style.display='none'">
          <div class="logo-text-container">
            <span class="logo-title"><span class="brand-ssdk">SSDK</span> <span class="brand-th">Tools Hub</span></span>
            <span class="logo-tagline">One Platform. Every Tool You Need.</span>
          </div>
        </a>

        <button class="burger" id="burger" aria-label="Toggle navigation">☰</button>

        <div class="nav-links" id="navLinks">
          <a href="${prefix}/index.html">Home</a>
          <a href="${prefix}/index.html#favorites" id="navFavsLink">Favorites <span class="fav-badge" id="favBadge" style="display:none">0</span></a>

          <div class="dropdown">
            <a href="javascript:void(0)" class="dropdown-trigger">Categories ▾</a>
            <div class="dropdown-menu mega-menu" id="dropCats"></div>
          </div>

          <a href="${prefix}/pages/about.html">About</a>
          <a href="${prefix}/pages/contact.html">Contact</a>
          <a href="${prefix}/index.html#tools">All Tools</a>
          <a href="${prefix}/pages/login.html" id="navAuthBtn" class="toggle" style="border-radius:30px;padding:8px 20px;">Login</a>
          
          <button id="globalSearchBtn" class="nav-cmd-btn" title="Quick Search (Ctrl+K)" style="background:rgba(255,255,255,0.06);border:1px solid var(--color-border);border-radius:var(--radius-pill);padding:6px 12px;color:var(--color-muted);font-size:var(--font-size-micro);cursor:pointer;display:inline-flex;align-items:center;gap:6px;">
            <span>🔍 Search</span>
            <kbd style="background:rgba(255,255,255,0.1);padding:2px 6px;border-radius:4px;font-size:10px;">⌘K</kbd>
          </button>

          <select id="langSelect" style="background:transparent;border:1px solid var(--color-border);border-radius:15px;color:var(--color-foreground);outline:none;cursor:pointer;font-weight:600;font-size:0.85rem;padding:4px 8px;margin-right:6px;">
            <option value="en">🌐 English</option>
            <option value="bn">🌐 বাংলা</option>
            <option value="hi">🌐 हिन्दी</option>
          </select>
          
          <button class="toggle" id="themeBtn">🌙 Dark</button>
        </div>
      </nav>
    `;
    document.body.insertAdjacentHTML("afterbegin", headerHTML);
  }

  // Populate Categories Dropdown
  const dropCats = document.getElementById("dropCats");
  if (dropCats && Array.isArray(categoriesList) && categoriesList.length > 0) {
    dropCats.innerHTML = categoriesList.map(cat => `
      <a href="${prefix}/index.html#category-${cat.id || cat.name}" class="mega-item dropdown-item" data-cat="${cat.name}">
        <span class="cat-emoji" style="margin-right:8px;font-size:1.1rem;">${cat.emoji || '🛠️'}</span>
        <span class="cat-label">${cat.name}</span>
      </a>
    `).join("");
  }
}

function renderFooter(prefix, siteConfig = {}) {
  const company = siteConfig.company || {
    name: "SSDK TOOLS HUB",
    slogan: "Smart Tools for Smart Creators",
    copyright: "© 2026 SSDK TOOLS HUB. All rights reserved.",
    version: "2.0.0"
  };

  const resources = (siteConfig.footer && siteConfig.footer.resources) || [
    { name: "API Reference", url: "pages/developers.html" }
  ];

  const policies = (siteConfig.footer && siteConfig.footer.policies) || [
    { name: "Privacy Policy", url: "#" }
  ];

  const footerHTML = `
    <footer class="enterprise-footer">
      <div class="foot-container">
        <div class="foot-grid">
          <div class="foot-brand">
            <a href="${prefix}/index.html" class="logo">
              <span class="logo-title"><span class="brand-ssdk">${company.name.split(' ')[0]}</span> <span class="brand-th">${company.name.split(' ').slice(1).join(' ')}</span></span>
            </a>
            <p class="foot-slogan">${company.slogan}</p>
            <div class="system-status-badge">
              <span class="status-dot"></span> All Systems Operational
            </div>
            <div class="social-links">
              <a href="https://github.com" target="_blank" rel="noopener" aria-label="GitHub">💻 GitHub</a>
              <a href="https://twitter.com" target="_blank" rel="noopener" aria-label="Twitter">🐦 Twitter</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener" aria-label="LinkedIn">🔗 LinkedIn</a>
            </div>
          </div>
          <div class="foot-col">
            <h4>Resources & API</h4>
            ${resources.map(res => `
              <a href="${prefix}/${res.url}">${res.name}</a>
            `).join('')}
          </div>
          <div class="foot-col">
            <h4>Support & Feedback</h4>
            <a href="${prefix}/pages/contact.html?type=feedback">Feedback Form</a>
            <a href="${prefix}/pages/contact.html?type=request">Request a Tool</a>
            <a href="${prefix}/pages/contact.html?type=bug">Report an Issue</a>
          </div>
          <div class="foot-col">
            <h4>Legal & Trust</h4>
            ${policies.map(pol => `
              <a href="${prefix}/${pol.url}">${pol.name}</a>
            `).join('')}
            <a href="${prefix}/pages/privacy.html">Privacy Policy</a>
            <a href="${prefix}/pages/terms.html">Terms of Service</a>
            <a href="${prefix}/pages/disclaimer.html">Disclaimer</a>
          </div>
          <div class="foot-col foot-newsletter">
            <h4>Stay Connected</h4>
            <p>Subscribe for updates on newly launched online tools & developer APIs.</p>
            <form class="newsletter-form" onsubmit="event.preventDefault(); alert('Subscribed to SSDK Tools Hub newsletter!');">
              <input type="email" placeholder="Enter your work email..." required class="newsletter-input">
              <button type="submit" class="btn btn-sm btn-primary">Subscribe</button>
            </form>
          </div>
        </div>
        <div class="foot-bottom">
          <p>${company.copyright}</p>
          <div class="foot-bottom-meta">
            <span class="foot-version">Version ${company.version}</span>
            <span class="foot-privacy">Privacy First • Client-Side Processing</span>
          </div>
        </div>
      </div>
    </footer>
    <button class="back-to-top" id="backToTopBtn" aria-label="Back To Top">↑</button>
  `;
  document.body.insertAdjacentHTML("beforeend", footerHTML);
}

function setupHeaderControls(core) {
  const burger = document.getElementById("burger");
  const navLinks = document.getElementById("navLinks");
  if (burger && navLinks) {
    burger.onclick = () => {
      navLinks.classList.toggle("open");
    };
  }

  // Theme control switcher (Dynamic cycle: dark -> light -> highlight -> dark)
  const themeBtn = document.getElementById("themeBtn");
  const themeEngine = core.getEngine("theme");
  if (themeBtn && themeEngine) {
    const updateBtnLabel = () => {
      const active = themeEngine.getCurrentTheme();
      if (active === "dark") themeBtn.textContent = "🌙 Dark";
      else if (active === "light") themeBtn.textContent = "☀️ Light";
      else if (active === "highlight" || active === "high-contrast") themeBtn.textContent = "✨ Highlight";
      else themeBtn.textContent = "⚙️ System";
    };
    updateBtnLabel();
    themeBtn.onclick = () => {
      const active = themeEngine.getCurrentTheme();
      let next = "dark";
      if (active === "dark") next = "light";
      else if (active === "light") next = "highlight";
      else if (active === "highlight" || active === "high-contrast") next = "dark";
      
      themeEngine.applyTheme(next);
      updateBtnLabel();
    };
  }

  // Mount Universal Search Modal (Command Palette Ctrl+K)
  const GlassComponents = window.GlassComponents || null;
  if (!document.getElementById("globalSearchModal")) {
    import("../components/glass-components.js").then(mod => {
      const modalEl = mod.GlassComponents.createSearchModal();
      document.body.appendChild(modalEl);
      bindCommandPaletteSearch(core);
    }).catch(e => console.warn("Failed to mount search modal", e));
  } else {
    bindCommandPaletteSearch(core);
  }

  // Quick Action Dropdown overlays setup
  setupQuickActionDropdowns(core);

  // Sticky Scroll Behavior (Hide on Scroll Down, Show on Scroll Up)
  let lastScrollTop = 0;
  const nav = document.getElementById("nav");
  const scrollThreshold = 10;
  const backToTopBtn = document.getElementById("backToTopBtn");

  window.addEventListener("scroll", () => {
    const st = window.pageYOffset || document.documentElement.scrollTop;
    
    // Solid backdrop highlight on scroll
    if (nav) {
      if (st > 50) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }

      // Hide/Show Header
      if (Math.abs(lastScrollTop - st) <= scrollThreshold) return;
      if (st > lastScrollTop && st > 100) {
        nav.classList.add("nav-hidden");
      } else {
        nav.classList.remove("nav-hidden");
      }
    }
    lastScrollTop = st;

    // Back to top button show/hide
    if (backToTopBtn) {
      if (st > 300) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.onclick = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  }

  // Click handler inside categories mega menu
  document.querySelectorAll("#dropCats .mega-item").forEach(item => {
    item.onclick = (e) => {
      e.preventDefault();
      const catName = item.getAttribute("data-cat");
      
      // Close mobile drawer if active
      if (navLinks) navLinks.classList.remove("open");
      
      const onLanding = document.getElementById("toolContainer") !== null;
      if (onLanding) {
        const homepage = core.getEngine("homepage");
        if (homepage && typeof homepage.filterByCategory === "function") {
          homepage.filterByCategory(catName);
          const toolsSec = document.getElementById("tools");
          if (toolsSec) toolsSec.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          // Fallback if homepage engine isn't ready
          window.location.href = `${core.prefix}/index.html#category-${catName}`;
          window.location.reload();
        }
      } else {
        sessionStorage.setItem("ssdk-open-category", catName);
        window.location.href = `${core.prefix}/index.html`;
      }
    };
  });

  // Multilingual change listener
  const langSelect = document.getElementById("langSelect");
  if (langSelect) {
    const savedLang = localStorage.getItem("ssdk-lang") || "en";
    langSelect.value = savedLang;
    langSelect.onchange = () => {
      const selected = langSelect.value;
      localStorage.setItem("ssdk-lang", selected);
      if (window.ssdkTranslate) {
        window.ssdkTranslate(selected);
      }
      window.dispatchEvent(new CustomEvent("ssdk-lang-change", { detail: selected }));
    };
  }

  // Favorites count update listener
  const updateFavs = () => {
    const favs = JSON.parse(localStorage.getItem("ssdk-tool-favorites") || "[]");
    const badge = document.getElementById("favBadge");
    if (badge) {
      if (favs.length > 0) {
        badge.textContent = favs.length;
        badge.style.display = "inline-block";
      } else {
        badge.style.display = "none";
      }
    }
  };
  updateFavs();
  window.updateFavoritesBadge = updateFavs;
}

function bindCommandPaletteSearch(core) {
  const modal = document.getElementById("globalSearchModal");
  const input = document.getElementById("cmdSearchInput");
  const clearBtn = document.getElementById("cmdClearInput");
  const resultsSec = document.getElementById("cmdResultsSection");
  const resultsList = document.getElementById("cmdResultsList");
  const typoSec = document.getElementById("cmdTypoSection");
  const typoResults = document.getElementById("cmdTypoResults");
  const recentList = document.getElementById("cmdRecentList");
  const globalSearchBtn = document.getElementById("globalSearchBtn");
  const filterChips = document.querySelectorAll(".search-modal-filters .filter-chip");
  
  let activeFilter = "all";
  let selectedIndex = -1;

  const searchEngine = core.getEngine("search");

  const openModal = () => {
    if (modal) {
      modal.style.display = "flex";
      if (input) {
        input.focus();
        input.select();
      }
      renderRecentSearches();
    }
  };

  const closeModal = () => {
    if (modal) modal.style.display = "none";
  };

  if (globalSearchBtn) {
    globalSearchBtn.onclick = (e) => {
      e.preventDefault();
      openModal();
    };
  }

  // Keyboard shortcut binding: Ctrl + K or / key
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (modal && modal.style.display === "flex") closeModal();
      else openModal();
    }
    if (e.key === "/" && document.activeElement.tagName !== "INPUT" && document.activeElement.tagName !== "TEXTAREA") {
      e.preventDefault();
      openModal();
    }
    if (e.key === "Escape" && modal && modal.style.display === "flex") {
      closeModal();
    }
  });

  if (modal) {
    modal.onclick = (e) => {
      if (e.target === modal) closeModal();
    };
  }

  // Filter chips selection
  filterChips.forEach(chip => {
    chip.onclick = () => {
      filterChips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");
      activeFilter = chip.getAttribute("data-filter");
      triggerSearch(input ? input.value : "");
    };
  });

  const renderRecentSearches = () => {
    if (!recentList || !searchEngine) return;
    const recents = searchEngine.getRecentSearches();
    if (recents.length > 0) {
      recentList.innerHTML = recents.map(r => `<span class="cmd-tag">${r}</span>`).join("");
      recentList.querySelectorAll(".cmd-tag").forEach(tag => {
        tag.onclick = () => {
          if (input) {
            input.value = tag.textContent;
            triggerSearch(tag.textContent);
          }
        };
      });
    } else {
      recentList.innerHTML = `<span style="font-size:0.8rem; color:var(--text-muted);">No recent searches.</span>`;
    }
  };

  const clearRecentBtn = document.getElementById("cmdClearRecentBtn");
  if (clearRecentBtn && searchEngine) {
    clearRecentBtn.onclick = () => {
      searchEngine.clearRecentSearches();
      renderRecentSearches();
    };
  }

  const triggerSearch = async (val) => {
    const q = val.trim();
    if (clearBtn) clearBtn.style.display = q ? "block" : "none";

    const emptySec = document.getElementById("cmdEmptySection");

    if (!q) {
      if (resultsSec) resultsSec.style.display = "none";
      if (typoSec) typoSec.style.display = "none";
      if (emptySec) emptySec.style.display = "none";
      return;
    }

    if (!searchEngine) return;
    const tools = await searchEngine.search(q, { category: activeFilter });
    
    if (tools.length > 0) {
      if (typoSec) typoSec.style.display = "none";
      if (emptySec) emptySec.style.display = "none";
      if (resultsSec) resultsSec.style.display = "block";
      
      resultsList.innerHTML = tools.slice(0, 8).map((t, idx) => `
        <a href="${core.prefix}/${t.url}" class="cmd-result-item ${idx === 0 ? 'selected' : ''}" data-url="${core.prefix}/${t.url}">
          <div class="cmd-result-left">
            <span style="font-size:1.3rem;">${t.icon}</span>
            <div>
              <div class="cmd-result-title">${t.name}</div>
              <div class="cmd-result-desc">${t.description}</div>
            </div>
          </div>
          <span class="cmd-result-cat">${t.category}</span>
        </a>
      `).join("");

      selectedIndex = 0;
      bindResultClicks();
    } else {
      if (resultsSec) resultsSec.style.display = "none";
      
      const analytics = core.getEngine("analytics");
      if (analytics && q.length > 2) {
        analytics.logEvent("search", "no_results", q);
      }

      const typos = await searchEngine.getTypoSuggestions(q);
      if (typos.length > 0 && typoSec) {
        if (emptySec) emptySec.style.display = "none";
        typoSec.style.display = "block";
        typoResults.innerHTML = typos.map(t => `<button class="cmd-tag typo-btn">${t}</button>`).join("");
        typoResults.querySelectorAll(".typo-btn").forEach(btn => {
          btn.onclick = () => {
            if (input) {
              input.value = btn.textContent;
              triggerSearch(btn.textContent);
            }
          };
        });
      } else {
        if (typoSec) typoSec.style.display = "none";
        if (emptySec) {
          emptySec.style.display = "block";
          const browseBtn = emptySec.querySelector("#cmdBrowseCatBtn");
          if (browseBtn) {
            browseBtn.href = `${core.prefix}/index.html#tools`;
            browseBtn.onclick = () => closeModal();
          }
        }
      }
    }
  };

  const bindResultClicks = () => {
    if (!resultsList) return;
    resultsList.querySelectorAll(".cmd-result-item").forEach(item => {
      item.onclick = () => {
        if (input && input.value.trim() && searchEngine) {
          searchEngine.addRecentSearch(input.value.trim());
        }
        closeModal();
      };
    });
  };

  // Popular search tags click bindings
  const popularTags = document.querySelectorAll("#cmdPopularList .cmd-tag");
  popularTags.forEach(tag => {
    tag.onclick = () => {
      if (input) {
        input.value = tag.textContent;
        triggerSearch(tag.textContent);
      }
    };
  });

  let debounceTimer = null;
  if (input) {
    input.addEventListener("input", (e) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => triggerSearch(e.target.value), 120);
    });
    input.addEventListener("keydown", (e) => {
      const items = resultsList ? resultsList.querySelectorAll(".cmd-result-item") : [];
      if (items.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        selectedIndex = (selectedIndex + 1) % items.length;
        items.forEach(i => i.classList.remove("selected"));
        items[selectedIndex].classList.add("selected");
        items[selectedIndex].scrollIntoView({ block: "nearest" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        items.forEach(i => i.classList.remove("selected"));
        items[selectedIndex].classList.add("selected");
        items[selectedIndex].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex >= 0 && items[selectedIndex]) {
          const url = items[selectedIndex].getAttribute("href");
          if (input && input.value.trim() && searchEngine) {
            searchEngine.addRecentSearch(input.value.trim());
          }
          closeModal();
          window.location.href = url;
        }
      }
    });
  }

  if (clearBtn) {
    clearBtn.onclick = () => {
      if (input) input.value = "";
      triggerSearch("");
    };
  }
}

function setupQuickActionDropdowns(core) {
  const notificationsBtn = document.getElementById("notificationsBtn");
  const navFavsLink = document.getElementById("navFavsLink");
  const navAuthBtn = document.getElementById("navAuthBtn");

  // Build Notifications Dropdown Overlay
  if (notificationsBtn && !document.getElementById("notifQuickDrop")) {
    const notifDrop = document.createElement("div");
    notifDrop.id = "notifQuickDrop";
    notifDrop.className = "header-quick-dropdown";
    notifDrop.innerHTML = `
      <div class="quick-drop-header">
        <span>🔔 Notifications</span>
        <span class="badge badge-info">New</span>
      </div>
      <div class="quick-drop-item">
        <span>🎉</span> <div><strong>150+ Tools Live!</strong><br><small style="color:var(--text-muted);">Explore Medical, AI & PDF panels.</small></div>
      </div>
      <div class="quick-drop-item">
        <span>⚡</span> <div><strong>Python WASM Active</strong><br><small style="color:var(--text-muted);">Run Python in browser client-side.</small></div>
      </div>
      <div class="quick-drop-item">
        <span>🚀</span> <div><strong>Supabase Sync Ready</strong><br><small style="color:var(--text-muted);">Favorites & history saved in cloud.</small></div>
      </div>
    `;
    notificationsBtn.parentElement.style.position = "relative";
    notificationsBtn.parentElement.appendChild(notifDrop);

    notificationsBtn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      notifDrop.classList.toggle("show");
    };
  }

  // Close dropdowns on outside click
  document.addEventListener("click", () => {
    document.querySelectorAll(".header-quick-dropdown").forEach(d => d.classList.remove("show"));
  });
}

// Global Translations Dictionary for index.html
window.ssdkTranslations = {
  en: {
    heroTitle: "SSDK TOOLS HUB",
    heroSub: "Designed to inspire. Built to create. Aesthetic tools for the modern creator — 150+ free online tools in one place, accessible without login.",
    exploreTitle: "Explore Tool Categories",
    exploreSub: "Click a category to open its tools, or use the dropdown in the menu",
    searchPlaceholder: "🔍 Search 150+ tools... (e.g. PDF, QR, Medical, JSON)",
    filterAll: "All Tools",
    filterFav: "⭐ Favorites",
    filterRecent: "🕒 Recently Used",
    noResult: "No tools found 😕",
    recentsTitle: "🕒 Recently Visited Tools",
    clearHistory: "Clear History",
    featuredTitle: "⭐ Featured Utilities",
    sortLabel: "Sort:",
    suggestTitle: "Suggestions",
    popularTitle: "Popular Searches",
    recentTitle: "Recent Searches",
    // Categories
    "AI Tools": "AI Tools",
    "Image Tools": "Image Tools",
    "PDF Tools": "PDF Tools",
    "Text Tools": "Text Tools",
    "File Tools": "File Tools",
    "Video Tools": "Video Tools",
    "Audio Tools": "Audio Tools",
    "Developer Tools": "Developer Tools",
    "Web Tools": "Web Tools",
    "SEO Tools": "SEO Tools",
    "Social Media Tools": "Social Media Tools",
    "Security Tools": "Security Tools",
    "Color Tools": "Color Tools",
    "Finance Tools": "Finance Tools",
    "Education Tools": "Education Tools",
    "Business Tools": "Business Tools",
    "Marketing Tools": "Marketing Tools",
    "Medical & Laboratory Tools": "Medical & Laboratory Tools",
    "Health Calculators": "Health Calculators",
    "Unit Converters": "Unit Converters",
    "Database Tools": "Database Tools",
    "Design Tools": "Design Tools",
    "Miscellaneous Tools": "Miscellaneous Tools",
    "tools": "tools",
    // Subcategories
    "Formatters & Parsers": "Formatters & Parsers",
    "Image Processing": "Image Processing",
    "PDF Utilities": "PDF Utilities",
    "Coagulation": "Coagulation",
    "Thyroid": "Thyroid",
    "Iron Panel": "Iron Panel",
    "Blood Panel": "Blood Panel",
    "Vitamins": "Vitamins",
    "Urine & Kidneys": "Urine & Kidneys",
    "Cardiac Biomarkers": "Cardiac Biomarkers",
    "Generators": "Generators"
  },
  bn: {
    heroTitle: "এসএসডিকে টুলস হাব",
    heroSub: "অনুপ্রেরণার জন্য ডিজাইন করা। তৈরি করার জন্য নির্মিত। আধুনিক নির্মাতাদের জন্য নান্দনিক টুলস — ১৫০টিরও বেশি ফ্রি অনলাইন টুলস এক জায়গায়, লগইন ছাড়াই ব্যবহার করুন।",
    exploreTitle: "টুলস ক্যাটাগরি এক্সপ্লোর করুন",
    exploreSub: "টুলস খুলতে একটি ক্যাটাগরি ক্লিক করুন, বা মেনুর ড্রপডাউন ব্যবহার করুন",
    searchPlaceholder: "🔍 ১৫০+ টুলস খুঁজুন... (যেমন PDF, QR, Medical, JSON)",
    filterAll: "সব টুলস",
    filterFav: "⭐ ফেভারিট",
    filterRecent: "🕒 সম্প্রতি ব্যবহৃত",
    noResult: "কোনো টুলস পাওয়া যায়নি 😕",
    recentsTitle: "🕒 সম্প্রতি পরিদর্শিত টুলস",
    clearHistory: "ইতিহাস মুছুন",
    featuredTitle: "⭐ নির্বাচিত ইউটিলিটি",
    sortLabel: "সর্ট:",
    suggestTitle: "পরামর্শ",
    popularTitle: "জনপ্রিয় অনুসন্ধান",
    recentTitle: "সাম্প্রতিক অনুসন্ধান",
    // Categories
    "AI Tools": "এআই টুলস",
    "Image Tools": "ইমেজ টুলস",
    "PDF Tools": "পিডিএফ টুলস",
    "Text Tools": "টেক্সট টুলস",
    "File Tools": "ফাইল টুলস",
    "Video Tools": "ভিডিও টুলস",
    "Audio Tools": "অডিও টুলস",
    "Developer Tools": "ডেভেলপার টুলস",
    "Web Tools": "ওয়েব টুলস",
    "SEO Tools": "এসইও টুলস",
    "Social Media Tools": "সোশ্যাল মিডিয়া টুলস",
    "Security Tools": "সিকিউরিটি টুলস",
    "Color Tools": "কালার টুলস",
    "Finance Tools": "ফাইন্যান্স টুলস",
    "Education Tools": "এডুকেশন টুলস",
    "Business Tools": "বিজনেস টুলস",
    "Marketing Tools": "মার্কেটিং টুলস",
    "Medical & Laboratory Tools": "মেডিকেল ও ল্যাবরেটরি টুলস",
    "Health Calculators": "হেলথ ক্যালকুলেটরস",
    "Unit Converters": "ইউনিট কনভার্টারস",
    "Database Tools": "ডাটাবেস টুলস",
    "Design Tools": "ডিজাইন টুলস",
    "Miscellaneous Tools": "অন্যান্য টুলস",
    "tools": "টুলস",
    // Subcategories
    "Formatters & Parsers": "ফরম্যাটার ও পার্সার",
    "Image Processing": "ইমেজ প্রসেসিং",
    "PDF Utilities": "পিডিএফ ইউটিলিটি",
    "Coagulation": "কোয়াগুলেশন",
    "Thyroid": "থাইরয়েড",
    "Iron Panel": "আয়রন প্যানেল",
    "Blood Panel": "ব্লাড প্যানেল",
    "Vitamins": "ভিটামিন",
    "Urine & Kidneys": "ইউরিন ও কিডনি",
    "Cardiac Biomarkers": "কার্ডিয়াক বায়োমার্কার",
    "Generators": "জেনারেটর"
  },
  hi: {
    heroTitle: "एसएसडीके टूल्स हब",
    heroSub: "प्रेरणा के लिए डिज़ाइन किया गया। बनाने के लिए निर्मित। आधुनिक रचनाकारों के लिए सौंदर्य उपकरण — एक ही स्थान पर 150+ मुफ्त ऑनलाइन उपकरण, बिना लॉगिन के उपलब्ध।",
    exploreTitle: "टूल्स श्रेणियों का अन्वेषण करें",
    exploreSub: "टूल्स खोलने के लिए किसी श्रेणी पर क्लिक करें, या मेनू में ड्रॉपडाउन का उपयोग करें",
    searchPlaceholder: "🔍 150+ टूल्स खोजें... (जैसे PDF, QR, Medical, JSON)",
    filterAll: "सभी टूल्स",
    filterFav: "⭐ पसंदीदा",
    filterRecent: "🕒 हाल ही में प्रयुक्त",
    noResult: "कोई टूल नहीं मिला 😕",
    recentsTitle: "🕒 हाल ही में देखे गए टूल्स",
    clearHistory: "इतिहास साफ़ करें",
    featuredTitle: "⭐ चुनिंदा यूटिलिटीज",
    sortLabel: "क्रमबद्ध करें:",
    suggestTitle: "सुझाव",
    popularTitle: "लोकप्रिय खोजें",
    recentTitle: "हाल की खोजें",
    // Categories
    "AI Tools": "एआई टूल्स",
    "Image Tools": "इमेज टूल्स",
    "PDF Tools": "पीडीएफ टूल्स",
    "Text Tools": "टेक्स्ट टूल्स",
    "File Tools": "फाइल टूल्स",
    "Video Tools": "वीडियो टूल्स",
    "Audio Tools": "ऑडियो टूल्स",
    "Developer Tools": "डेवलपर टूल्स",
    "Web Tools": "वेब टूल्स",
    "SEO Tools": "एसईओ टूल्स",
    "Social Media Tools": "सोशल मीडिया टूल्स",
    "Security Tools": "सुरक्षा टूल्स",
    "Color Tools": "रंग टूल्स",
    "Finance Tools": "वित्त टूल्स",
    "Education Tools": "शिक्षा टूल्स",
    "Business Tools": "व्यावसायिक टूल्स",
    "Marketing Tools": "विपणन टूल्स",
    "Medical & Laboratory Tools": "चिकित्सा और प्रयोगशाला टूल्स",
    "Health Calculators": "स्वास्थ्य कैलकुलेटर",
    "Unit Converters": "इकाई कनवर्टर",
    "Database Tools": "डेटाबेस टूल्स",
    "Design Tools": "डिज़ाइन टूल्स",
    "Miscellaneous Tools": "विविध टूल्स",
    "tools": "टूल्स",
    // Subcategories
    "Formatters & Parsers": "फ़ॉर्मेटर और पार्सर",
    "Image Processing": "छवि प्रसंस्करण",
    "PDF Utilities": "पीडीएफ उपयोगिताएँ",
    "Coagulation": "जमावट",
    "Thyroid": "थायराइड",
    "Iron Panel": "आयरन पैनल",
    "Blood Panel": "रक्त पैनल",
    "Vitamins": "विटामिन",
    "Urine & Kidneys": "मूत्र और गुर्दे",
    "Cardiac Biomarkers": "कार्डियक बायोमार्कर",
    "Generators": "जेनरेटर"
  }
};

window.ssdkTranslateKey = (key) => {
  const lang = localStorage.getItem("ssdk-lang") || "en";
  const dict = window.ssdkTranslations || {};
  const langDict = dict[lang] || {};
  return langDict[key] || key;
};

window.ssdkTranslate = (lang = "en") => {
  const langDict = window.ssdkTranslations[lang] || window.ssdkTranslations["en"];
  
  document.querySelectorAll("[data-translate]").forEach(el => {
    const key = el.getAttribute("data-translate");
    if (langDict && langDict[key]) {
      if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
        el.placeholder = langDict[key];
      } else {
        el.innerHTML = langDict[key];
      }
    }
  });
  
  const searchInput = document.getElementById("search");
  if (searchInput) {
    searchInput.placeholder = langDict.searchPlaceholder;
  }
  
  const navLinks = document.getElementById("navLinks");
  if (navLinks) {
    const homeLink = navLinks.querySelector("a[href*='index.html']:not([href*='#'])");
    if (homeLink) homeLink.textContent = lang === "bn" ? "হোম" : (lang === "hi" ? "होम" : "Home");
    
    const favLink = document.getElementById("navFavsLink");
    if (favLink) {
      const badge = document.getElementById("favBadge");
      const badgeText = badge ? badge.outerHTML : "";
      favLink.innerHTML = (lang === "bn" ? "ফেভারিট " : (lang === "hi" ? "पसंदीदा " : "Favorites ")) + badgeText;
    }
    
    const catLink = navLinks.querySelector(".dropdown-trigger") || navLinks.querySelector(".dropdown > a");
    if (catLink) catLink.textContent = lang === "bn" ? "ক্যাটাগরি ▾" : (lang === "hi" ? "श्रेणियां ▾" : "Categories ▾");
    
    const aboutLink = navLinks.querySelector("a[href*='about.html']");
    if (aboutLink) aboutLink.textContent = lang === "bn" ? "সম্পর্কে" : (lang === "hi" ? "हमारे बारे में" : "About");
    
    const contactLink = navLinks.querySelector("a[href*='contact.html']");
    if (contactLink) contactLink.textContent = lang === "bn" ? "যোগাযোগ" : (lang === "hi" ? "संपर्क" : "Contact");
  }

  // Dynamically rebuild category mega menu with translated text
  const dropCats = document.getElementById("dropCats");
  const categories = [
    { name: "Image Tools", emoji: "🖼" },
    { name: "PDF Tools", emoji: "📄" },
    { name: "Developer Tools", emoji: "🛠" },
    { name: "Medical & Laboratory Tools", emoji: "🩺" },
    { name: "Health Calculators", emoji: "🏥" },
    { name: "Business Tools", emoji: "💼" },
    { name: "Finance Tools", emoji: "💵" },
    { name: "SEO Tools", emoji: "📊" },
    { name: "AI Tools", emoji: "⚡" },
    { name: "Video Tools", emoji: "🎥" },
    { name: "Audio Tools", emoji: "🔊" },
    { name: "Text Tools", emoji: "🔤" },
    { name: "Unit Converters", emoji: "🔄" },
    { name: "Utility Tools", emoji: "⚙️" },
    { name: "Security Tools", emoji: "🔐" },
    { name: "Education Tools", emoji: "🎓" },
    { name: "Scientific Calculators", emoji: "🔬" },
    { name: "File Tools", emoji: "📁" }
  ];
  const prefix = window.ssdkHeaderPrefix || ".";
  if (dropCats) {
    dropCats.innerHTML = "";
    categories.forEach(cat => {
      const a = document.createElement("a");
      a.href = `${prefix}/index.html#tools`;
      a.className = "mega-item";
      a.setAttribute("data-cat", cat.name);
      const translatedName = window.ssdkTranslateKey ? window.ssdkTranslateKey(cat.name) : cat.name;
      a.innerHTML = `<span>${cat.emoji}</span> ${translatedName}`;
      a.onclick = (e) => {
        e.preventDefault();
        
        // Hide mobile burger drawer if open
        const navLinks = document.getElementById("navLinks");
        if (navLinks) navLinks.classList.remove("open");
        
        const onLanding = document.getElementById("toolContainer") !== null;
        if (onLanding) {
          const catBlocks = document.querySelectorAll(".cat-block");
          catBlocks.forEach(b => {
            const dataCat = b.getAttribute("data-cat") || "";
            const head = b.querySelector(".cat-head").textContent.toLowerCase();
            const searchCat = cat.name.toLowerCase().replace(/[^a-z0-9]/g, "");
            const normHead = head.replace(/[^a-z0-9]/g, "");
            const normDataCat = dataCat.toLowerCase().replace(/[^a-z0-9]/g, "");
            if (normHead.includes(searchCat) || normDataCat.includes(searchCat)) {
              if (!b.classList.contains("open")) {
                const catHead = b.querySelector(".cat-head");
                if (catHead) catHead.click();
              }
              b.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          });
        } else {
          sessionStorage.setItem("ssdk-open-category", cat.name);
          window.location.href = `${prefix}/index.html`;
        }
      };
      dropCats.appendChild(a);
    });
    
    // Append View All Categories item at the bottom of Mega Menu
    const allA = document.createElement("a");
    allA.href = `${prefix}/index.html#tools`;
    allA.className = "mega-item";
    allA.style.gridColumn = "1 / -1";
    allA.style.textAlign = "center";
    allA.style.justifyContent = "center";
    allA.style.fontWeight = "700";
    allA.style.borderTop = "1px solid var(--border-color)";
    allA.textContent = lang === "bn" ? "🌐 সব ক্যাটাগরি দেখুন" : (lang === "hi" ? "🌐 सभी श्रेणियां देखें" : "🌐 View All Categories");
    allA.onclick = (e) => {
      e.preventDefault();
      const navLinks = document.getElementById("navLinks");
      if (navLinks) navLinks.classList.remove("open");
      window.location.href = `${prefix}/index.html#tools`;
    };
    dropCats.appendChild(allA);
  }
};

// ─── PWA Service Worker & Network Detection Integration ───
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").then(reg => {
      console.log("[PWA] Service Worker registered with scope:", reg.scope);
    }).catch(err => {
      console.warn("[PWA] Service Worker registration failed:", err);
    });
  });
}

// Network Status Toast Listener
window.addEventListener("online", () => {
  if (window.SSDKCore) {
    const notif = window.SSDKCore.getEngine("notification");
    if (notif) notif.show("🌐 Internet connection restored", "success");
  }
});

window.addEventListener("offline", () => {
  if (window.SSDKCore) {
    const notif = window.SSDKCore.getEngine("notification");
    if (notif) notif.show("📡 You are offline. Cached tools remain available.", "warning");
  }
});

// PWA Install Prompt Capture
let deferredPwaPrompt = null;
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  deferredPwaPrompt = e;
  console.log("[PWA] Install prompt captured.");
});

// Mount Floating AI Assistant Widget
window.addEventListener("DOMContentLoaded", () => {
  if (window.SSDKCore && window.GlassComponents && typeof window.GlassComponents.createAIChatWidget === "function") {
    if (!document.getElementById("ssdkAiChatWidget")) {
      const widget = window.GlassComponents.createAIChatWidget(window.SSDKCore);
      document.body.appendChild(widget);
    }
  }
});


