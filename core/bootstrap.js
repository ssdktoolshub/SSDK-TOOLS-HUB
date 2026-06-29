// SSDK Application Bootloader - Initializes CoreEngine and mounts layout frameworks

import { CoreEngine } from "./core.js";
import { ThemeEngine } from "../engines/theme-engine.js";
import { RouterEngine } from "../engines/router-engine.js";
import { ToolEngine } from "../engines/tool-engine.js";
import { SearchEngine } from "../engines/search-engine.js";
import { HistoryEngine } from "../engines/history-engine.js";
import { FavoritesEngine } from "../engines/favorites-engine.js";
import { SEOEngine } from "../engines/seo-engine.js";
import { HomepageEngine } from "../engines/homepage-engine.js";
import { AnalyticsEngine } from "../engines/analytics-engine.js";
import { NotificationEngine } from "../engines/notification-engine.js";
import { RecommendationEngine } from "../engines/recommendation-engine.js";
import { FirebaseEngine } from "../engines/firebase-engine.js";
import { PythonEngine } from "../engines/python-engine.js";
import { AIEngine } from "../engines/ai-engine.js";
import { PluginEngine } from "../engines/plugin-engine.js";
import { UpdateEngine } from "../engines/update-engine.js";

const initApp = async () => {
  console.log("[Bootstrap] Booting SSDK Tools Hub platform...");

  // 1. Initialize Core Engine Orchestrator
  const core = new CoreEngine();
  window.SSDKCore = core;

  // 2. Register all support modules
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
  await core.registerEngine("firebase", new FirebaseEngine());
  await core.registerEngine("python", new PythonEngine());
  await core.registerEngine("ai", new AIEngine());
  await core.registerEngine("plugin", new PluginEngine());
  await core.registerEngine("update", new UpdateEngine());

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
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}

async function renderLayoutFramework(core) {
  const prefix = core.prefix;
  const config = core.getEngine("config");
  const categoriesList = await config.getCategories();
  
  // Inject Header
  renderHeader(prefix, categoriesList);
  
  // Inject Footer
  renderFooter(prefix);

  // Initialize theme controls and auth listeners in header
  setupHeaderControls(core);
}

function renderHeader(prefix, categories) {
  // Prepend navigation bar
  const navHTML = `
    <nav id="nav">
      <a href="${prefix}/index.html" class="logo">
        <img src="${prefix}/assets/images/logo.png" alt="SSDK" onerror="this.style.display='none';this.nextElementSibling.style.display='inline'">
        <span class="logo-text" style="display:none">SSDK TOOLS HUB</span>
        SSDK TOOLS HUB
      </a>
      <button class="burger" id="burger" aria-label="Toggle navigation">☰</button>
      <div class="nav-links" id="navLinks">
        <a href="${prefix}/index.html">Home</a>
        <div class="dropdown">
          <a class="dropdown-trigger">Categories ▾</a>
          <div class="dropdown-menu" id="dropCats"></div>
        </div>
        <a href="${prefix}/pages/about.html">About</a>
        <a href="${prefix}/pages/contact.html">Contact</a>
        <a href="${prefix}/pages/login.html" id="navAuthBtn" class="toggle">Login</a>
        <button class="toggle" id="themeBtn">🌙 Dark</button>
      </div>
    </nav>
  `;
  document.body.insertAdjacentHTML("afterbegin", navHTML);

  // Render categories dropdown items dynamically from database config
  const dropCats = document.getElementById("dropCats");
  if (dropCats && categories) {
    categories.forEach(cat => {
      const a = document.createElement("a");
      a.href = `${prefix}/index.html#tools`;
      a.textContent = `${cat.emoji} ${cat.name}`;
      a.onclick = (e) => {
        e.preventDefault();
        
        // Hide mobile burger drawer if open
        const navLinks = document.getElementById("navLinks");
        if (navLinks) navLinks.classList.remove("open");
        
        const onLanding = document.getElementById("toolContainer") !== null;
        if (onLanding) {
          // Trigger category open smoothly
          const catBlocks = document.querySelectorAll(".cat-block");
          catBlocks.forEach(b => {
            const head = b.querySelector(".cat-head").textContent.toLowerCase();
            if (head.includes(cat.name.toLowerCase())) {
              b.classList.add("open");
              const body = b.querySelector(".cat-body");
              if (body) body.style.maxHeight = "1600px";
              b.scrollIntoView({ behavior: "smooth", block: "center" });
              b.querySelectorAll(".card").forEach(c => c.classList.add("show"));
            }
          });
        } else {
          sessionStorage.setItem("ssdk-open-category", cat.name);
          window.location.href = `${prefix}/index.html`;
        }
      };
      dropCats.appendChild(a);
    });
  }
}

function renderFooter(prefix) {
  const footerHTML = `
    <footer>
      <div class="foot-grid">
        <div>
          <h4>SSDK TOOLS HUB</h4>
          <p>Designed to inspire. Built to create. Professional multi-tool platform with advanced utilities.</p>
        </div>
        <div>
          <h4>Information</h4>
          <a href="${prefix}/pages/about.html">About Developer</a>
          <a href="${prefix}/pages/contact.html">Contact Us</a>
          <a href="${prefix}/pages/faq.html">FAQ Accordion</a>
        </div>
        <div>
          <h4>Legal Terms</h4>
          <a href="${prefix}/pages/privacy.html">Privacy Policy</a>
          <a href="${prefix}/pages/terms.html">Terms & Conditions</a>
          <a href="${prefix}/pages/disclaimer.html">Disclaimer</a>
        </div>
      </div>
      <div class="copy">
        <p>&copy; ${new Date().getFullYear()} SSDK Tools Hub. All rights reserved. Created with 💖 by Swarnava Das.</p>
      </div>
    </footer>
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

  // Bind theme engine toggle trigger
  const themeBtn = document.getElementById("themeBtn");
  const themeEngine = core.getEngine("theme");
  if (themeBtn && themeEngine) {
    themeBtn.textContent = themeEngine.currentTheme === "dark" ? "☀️ Light" : "🌙 Dark";
    themeBtn.onclick = () => themeEngine.toggleTheme();
  }

  // Expand category dropdown elements on touch clicks (mobile <= 900px)
  setTimeout(() => {
    const trigger = document.querySelector(".dropdown-trigger");
    if (trigger) {
      trigger.onclick = (e) => {
        if (window.innerWidth <= 900) {
          e.preventDefault();
          e.stopPropagation();
          trigger.parentElement.classList.toggle("open");
        }
      };
    }
  }, 100);
}
