const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '../assets/css/ssdk-style.css');

const enterpriseCSS = `

/* ==========================================================================
   SSDK Enterprise SaaS UI/UX Overhaul
   Inspired by Vercel, Linear, Raycast, Stripe & Framer
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. Glass Header & Navigation
   -------------------------------------------------------------------------- */
#nav, .enterprise-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 72px;
  background: var(--bg-overlay, rgba(8, 9, 17, 0.85));
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  z-index: var(--z-header, 900);
  transition: background 0.3s ease, border-color 0.3s ease;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.logo-img {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  box-shadow: 0 0 15px var(--glow-color, rgba(124, 58, 237, 0.35));
}

.logo-title {
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.brand-ssdk {
  background: var(--primary-gradient, linear-gradient(135deg, #7C3AED, #3B82F6));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-th {
  color: var(--text-primary, #F8FAFC);
}

.logo-tagline {
  display: block;
  font-size: 0.7rem;
  color: var(--text-muted, #94A3B8);
  font-weight: 400;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 20px;
}

.nav-item {
  color: var(--text-secondary, #CBD5E1);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-item:hover {
  color: var(--text-primary, #F8FAFC);
}

/* Command Palette Search Trigger Button (Raycast Style) */
.cmd-search-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--card-bg, rgba(255, 255, 255, 0.03));
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  border-radius: var(--radius-pill, 9999px);
  padding: 6px 14px;
  color: var(--text-muted, #94A3B8);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cmd-search-btn:hover {
  background: var(--card-bg-hover, rgba(255, 255, 255, 0.06));
  border-color: var(--border-hover, rgba(168, 85, 247, 0.4));
  color: var(--text-primary, #F8FAFC);
  box-shadow: 0 0 15px rgba(124, 58, 237, 0.15);
}

.cmd-badge {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 0.7rem;
  font-family: var(--font-mono, monospace);
  color: var(--text-secondary, #CBD5E1);
}

/* Mega Menu Styling */
.mega-dropdown {
  position: relative;
}

.mega-menu {
  position: absolute;
  top: calc(100% + 12px);
  left: -20px;
  width: 540px;
  background: var(--bg-secondary, #0F121C);
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  border-radius: var(--radius-lg, 16px);
  padding: 20px;
  box-shadow: var(--shadow-lg, 0 12px 32px -4px rgba(0, 0, 0, 0.6));
  backdrop-filter: blur(20px);
  display: none;
  z-index: var(--z-dropdown, 1000);
}

.dropdown:hover .mega-menu,
.mega-menu.show {
  display: block;
  animation: fadeInDown 0.25s var(--ease-out-cubic, cubic-bezier(0.16, 1, 0.3, 1));
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-8px); }
  to { opacity: 1; transform: translateY(0); }
}

.mega-menu-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.mega-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: var(--radius-md, 12px);
  text-decoration: none;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.mega-item:hover {
  background: var(--card-bg-hover, rgba(255, 255, 255, 0.06));
  border-color: var(--border-hover, rgba(168, 85, 247, 0.4));
  transform: translateX(3px);
}

.mega-icon {
  font-size: 1.4rem;
}

.mega-title {
  display: block;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary, #F8FAFC);
}

.mega-sub {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted, #94A3B8);
}

.mega-view-all {
  grid-column: 1 / -1;
  margin-top: 12px;
  justify-content: center;
  font-weight: 600;
  border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  padding-top: 12px;
  color: var(--accent-color, #C084FC);
}

/* Theme Toggle & Language */
.theme-toggle-btn, .lang-select {
  background: var(--card-bg, rgba(255, 255, 255, 0.03));
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  border-radius: var(--radius-pill, 9999px);
  padding: 6px 14px;
  color: var(--text-primary, #F8FAFC);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-toggle-btn:hover, .lang-select:hover {
  background: var(--card-bg-hover, rgba(255, 255, 255, 0.06));
  border-color: var(--border-hover, rgba(168, 85, 247, 0.4));
}

/* --------------------------------------------------------------------------
   2. Raycast-Style Command Palette Modal
   -------------------------------------------------------------------------- */
.cmd-palette-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 5, 10, 0.75);
  backdrop-filter: blur(12px);
  z-index: var(--z-command-palette, 9999);
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 12vh;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
}

.cmd-palette-overlay.active {
  opacity: 1;
  pointer-events: auto;
}

.cmd-palette-box {
  width: 640px;
  max-width: 92vw;
  background: var(--bg-secondary, #0F121C);
  border: 1px solid var(--border-hover, rgba(168, 85, 247, 0.4));
  border-radius: var(--radius-xl, 24px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8), 0 0 30px rgba(124, 58, 237, 0.25);
  overflow: hidden;
  transform: translateY(-10px) scale(0.98);
  transition: transform 0.25s var(--ease-out-cubic, cubic-bezier(0.16, 1, 0.3, 1));
}

.cmd-palette-overlay.active .cmd-palette-box {
  transform: translateY(0) scale(1);
}

.cmd-input-wrap {
  display: flex;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
}

.cmd-input-wrap input {
  width: 100%;
  background: transparent;
  border: none;
  outline: none;
  font-size: 1.1rem;
  color: var(--text-primary, #F8FAFC);
}

.cmd-results {
  max-height: 380px;
  overflow-y: auto;
  padding: 12px;
}

.cmd-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: var(--radius-md, 12px);
  cursor: pointer;
  color: var(--text-secondary, #CBD5E1);
  transition: background 0.15s ease;
}

.cmd-item.selected, .cmd-item:hover {
  background: var(--card-bg-active, rgba(124, 58, 237, 0.15));
  color: var(--text-primary, #F8FAFC);
}

/* --------------------------------------------------------------------------
   3. Enterprise SaaS Buttons & Badges
   -------------------------------------------------------------------------- */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: var(--radius-pill, 9999px);
  text-decoration: none;
  cursor: pointer;
  border: 1px solid transparent;
  transition: all 0.25s var(--ease-out-cubic, cubic-bezier(0.16, 1, 0.3, 1));
}

.btn-primary {
  background: var(--primary-gradient, linear-gradient(135deg, #7C3AED, #3B82F6));
  color: #FFFFFF;
  box-shadow: 0 4px 15px rgba(124, 58, 237, 0.35);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(124, 58, 237, 0.5);
}

.btn-secondary {
  background: var(--card-bg, rgba(255, 255, 255, 0.03));
  border-color: var(--border-color, rgba(255, 255, 255, 0.08));
  color: var(--text-primary, #F8FAFC);
}

.btn-secondary:hover {
  background: var(--card-bg-hover, rgba(255, 255, 255, 0.06));
  border-color: var(--border-hover, rgba(168, 85, 247, 0.4));
}

.btn-glow {
  position: relative;
  overflow: hidden;
}

.btn-glow::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 60%);
  transform: rotate(30deg);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.btn-glow:hover::before {
  opacity: 1;
}

/* --------------------------------------------------------------------------
   4. Hero & Interactive Cuboid
   -------------------------------------------------------------------------- */
.hero {
  padding: 100px 32px 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: var(--container-max-width, 1280px);
  margin: 0 auto;
  gap: 40px;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(124, 58, 237, 0.12);
  border: 1px solid rgba(168, 85, 247, 0.3);
  padding: 6px 16px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--accent-color, #C084FC);
  margin-bottom: 20px;
}

.text-3d {
  font-size: var(--font-size-5xl, 3.5rem);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.03em;
  margin-bottom: 16px;
}

/* --------------------------------------------------------------------------
   5. Tool Cards & Category Blocks
   -------------------------------------------------------------------------- */
.card {
  background: var(--card-bg, rgba(255, 255, 255, 0.03));
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  border-radius: var(--radius-lg, 16px);
  padding: 20px;
  transition: all 0.3s var(--ease-out-cubic, cubic-bezier(0.16, 1, 0.3, 1));
}

.card:hover {
  background: var(--card-bg-hover, rgba(255, 255, 255, 0.06));
  border-color: var(--border-hover, rgba(168, 85, 247, 0.4));
  transform: translateY(-4px);
  box-shadow: var(--shadow-card-hover, 0 16px 40px -8px rgba(0, 0, 0, 0.7));
}

/* --------------------------------------------------------------------------
   6. Multi-Column Enterprise Footer
   -------------------------------------------------------------------------- */
.enterprise-footer {
  background: var(--bg-secondary, #0F121C);
  border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  padding: 80px 32px 40px;
  margin-top: 100px;
}

.foot-container {
  max-width: var(--container-max-width, 1280px);
  margin: 0 auto;
}

.foot-grid {
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr) 2fr;
  gap: 40px;
  margin-bottom: 60px;
}

.foot-slogan {
  color: var(--text-muted, #94A3B8);
  font-size: 0.9rem;
  margin: 12px 0 20px;
}

.system-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #10B981;
  padding: 4px 12px;
  border-radius: var(--radius-pill, 9999px);
  font-size: 0.75rem;
  font-weight: 600;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #10B981;
  border-radius: 50%;
  box-shadow: 0 0 10px #10B981;
}

.foot-col h4 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary, #F8FAFC);
  margin-bottom: 16px;
}

.foot-col a {
  display: block;
  color: var(--text-muted, #94A3B8);
  text-decoration: none;
  font-size: 0.85rem;
  margin-bottom: 10px;
  transition: color 0.2s ease;
}

.foot-col a:hover {
  color: var(--accent-color, #C084FC);
}

.newsletter-form {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.newsletter-input {
  flex: 1;
  background: var(--card-bg, rgba(255, 255, 255, 0.03));
  border: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  border-radius: var(--radius-pill, 9999px);
  padding: 8px 16px;
  color: var(--text-primary, #F8FAFC);
  font-size: 0.85rem;
  outline: none;
}

.newsletter-input:focus {
  border-color: var(--primary-color, #7C3AED);
}

.foot-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid var(--border-color, rgba(255, 255, 255, 0.08));
  padding-top: 24px;
  color: var(--text-muted, #94A3B8);
  font-size: 0.8rem;
}

.foot-bottom-meta {
  display: flex;
  gap: 20px;
}
`;

try {
  fs.appendFileSync(cssPath, enterpriseCSS, 'utf8');
  console.log("✅ Enterprise SaaS UI styles successfully injected into ssdk-style.css");
} catch (e) {
  console.error("❌ Failed to inject CSS", e);
}
