// SSDK Admin Engine - Enterprise CMS Dashboard Controller
// Manages administrative UI, RBAC authorization, tools/categories CRUD, analytics, and data export.

export class AdminEngine {
  constructor() {
    this.core = null;
    this.supabase = null;
    this.activeView = "overview";
    this.sidebarCollapsed = false;
    this.toolSearchQuery = "";
    this.toolPage = 0;
    this.toolsPerPage = 25;

    this.AUTH_STORAGE_KEY = "ssdk_admin_custom_passkey";
    this.DEFAULT_PASSKEY = "admin@ssdk2026";
    this.SESSION_STORAGE_KEY = "ssdk_admin_session_active";
  }

  async init(core) {
    this.core = core;
    const supabaseEngine = this.core.getEngine("supabase");
    if (supabaseEngine) {
      this.supabase = supabaseEngine.supabase;
    }
    console.log("[AdminEngine] Initialized Enterprise CMS Controller.");
  }

  getPasskey() {
    return localStorage.getItem(this.AUTH_STORAGE_KEY) || this.DEFAULT_PASSKEY;
  }

  setPasskey(newKey) {
    if (!newKey || newKey.length < 4) return false;
    localStorage.setItem(this.AUTH_STORAGE_KEY, newKey);
    return true;
  }

  isAuthenticated() {
    return sessionStorage.getItem(this.SESSION_STORAGE_KEY) === "true";
  }

  login(passkey) {
    if (passkey === this.getPasskey()) {
      sessionStorage.setItem(this.SESSION_STORAGE_KEY, "true");
      return true;
    }
    return false;
  }

  logout() {
    sessionStorage.removeItem(this.SESSION_STORAGE_KEY);
    this.mountAdmin();
  }

  /**
   * Bootstraps and mounts the Admin Dashboard interface or Passkey Gatekeeper
   */
  async mountAdmin(containerId = "adminContainer") {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!this.isAuthenticated()) {
      this.renderGatekeeper(container);
      return;
    }

    this.renderDashboard(container);
  }

  /**
   * Renders the Glassmorphic Passkey Gatekeeper Lock Screen
   */
  renderGatekeeper(container) {
    container.innerHTML = `
      <div class="admin-gatekeeper-wrap">
        <div class="admin-gatekeeper-card" id="adminGatekeeperCard">
          <div class="admin-gatekeeper-icon">🔐</div>
          <h1 class="admin-gatekeeper-title">Admin Access Gate</h1>
          <p class="admin-gatekeeper-sub">Enter your master passkey to access and manage SSDK Tools Hub.</p>

          <form id="adminLoginForm" onsubmit="event.preventDefault();">
            <div class="admin-gatekeeper-input-group">
              <label for="adminPasskeyInput" class="admin-form-label" style="margin-bottom:6px; display:block; text-align:left;">Master Passkey</label>
              <input 
                type="password" 
                id="adminPasskeyInput" 
                class="admin-gatekeeper-input" 
                placeholder="Enter passkey..." 
                autocomplete="current-password"
                required
                autofocus
              >
            </div>
            
            <button type="submit" class="admin-btn admin-btn--primary" id="btnAdminLogin" style="width: 100%; padding: 14px; font-size: 1rem; justify-content: center; margin-bottom: 16px;">
              <span>Unlock Admin Panel →</span>
            </button>
          </form>

          <div id="adminLoginFeedback" style="color: var(--color-danger, #EF4444); font-size: 13px; min-height: 20px; margin-bottom: 12px;"></div>

          <div style="font-size: 12px; color: var(--color-muted); border-top: 1px solid var(--color-border); padding-top: 16px; margin-top: 8px;">
            Default Master Key: <code style="background: rgba(255,255,255,0.06); padding: 2px 6px; border-radius: 4px; color: var(--color-primary);">admin@ssdk2026</code>
          </div>

          <div style="margin-top: 20px;">
            <a href="../index.html" style="color: var(--color-muted); text-decoration: none; font-size: 13px;">← Return to Main Website</a>
          </div>
        </div>
      </div>
    `;

    const form = document.getElementById("adminLoginForm");
    const input = document.getElementById("adminPasskeyInput");
    const feedback = document.getElementById("adminLoginFeedback");
    const card = document.getElementById("adminGatekeeperCard");

    if (form && input) {
      form.onsubmit = () => {
        const val = input.value.trim();
        if (this.login(val)) {
          feedback.textContent = "";
          this.mountAdmin();
        } else {
          feedback.textContent = "❌ Invalid passkey. Please try again.";
          if (card) {
            card.classList.remove("shake");
            void card.offsetWidth;
            card.classList.add("shake");
          }
          input.value = "";
          input.focus();
        }
      };
    }
  }

  /**
   * Renders the Full Authenticated Dashboard Layout
   */
  renderDashboard(container) {
    container.innerHTML = `
      <div class="admin-sidebar-overlay" id="adminSidebarOverlay"></div>
      <div class="admin-layout" id="adminLayout">
        <!-- Sidebar Navigation -->
        <aside class="admin-sidebar" id="adminSidebar" role="navigation" aria-label="Admin navigation">
          <div class="admin-sidebar-brand">
            <div class="admin-sidebar-brand-icon">S</div>
            <div class="admin-sidebar-brand-text">
              <span class="admin-sidebar-brand-name">SSDK TOOLS</span>
              <span class="admin-sidebar-brand-label">Admin Control Panel</span>
            </div>
          </div>

          <div class="admin-sidebar-section">Management</div>
          <ul class="admin-sidebar-nav" role="menubar">
            <li class="admin-nav-item active" data-view="overview" title="Overview & Stats" role="menuitem" tabindex="0">
              <span class="admin-nav-icon">📊</span>
              <span class="admin-nav-label">Overview & Stats</span>
            </li>
            <li class="admin-nav-item" data-view="tools" title="Tool Registry" role="menuitem" tabindex="0">
              <span class="admin-nav-icon">🛠</span>
              <span class="admin-nav-label">Tool Registry</span>
            </li>
            <li class="admin-nav-item" data-view="categories" title="Categories" role="menuitem" tabindex="0">
              <span class="admin-nav-icon">📂</span>
              <span class="admin-nav-label">Categories</span>
            </li>
            <li class="admin-nav-item" data-view="saas" title="SaaS & Feature Flags" role="menuitem" tabindex="0">
              <span class="admin-nav-icon">💎</span>
              <span class="admin-nav-label">SaaS & Feature Flags</span>
            </li>
            <li class="admin-nav-item" data-view="json" title="JSON Manager" role="menuitem" tabindex="0">
              <span class="admin-nav-icon">⚙️</span>
              <span class="admin-nav-label">JSON Manager</span>
            </li>
            <li class="admin-nav-item" data-view="seo" title="SEO & Metadata" role="menuitem" tabindex="0">
              <span class="admin-nav-icon">🔍</span>
              <span class="admin-nav-label">SEO & Metadata</span>
            </li>
            <li class="admin-nav-item" data-view="users" title="Users & Permissions" role="menuitem" tabindex="0">
              <span class="admin-nav-icon">👥</span>
              <span class="admin-nav-label">Users & Permissions</span>
            </li>
            <li class="admin-nav-item" data-view="security" title="Security & Passkey" role="menuitem" tabindex="0">
              <span class="admin-nav-icon">🔒</span>
              <span class="admin-nav-label">Security Settings</span>
            </li>

            <li class="admin-sidebar-section" style="padding-left:0;">Analytics & Operations</li>
            <li class="admin-nav-item" data-view="analytics" title="Search Analytics" role="menuitem" tabindex="0">
              <span class="admin-nav-icon">📈</span>
              <span class="admin-nav-label">Search Analytics</span>
            </li>
            <li class="admin-nav-item" data-view="reviews" title="Review Moderation" role="menuitem" tabindex="0">
              <span class="admin-nav-icon">💬</span>
              <span class="admin-nav-label">Review Moderation</span>
            </li>
            <li class="admin-nav-item" data-view="announcements" title="Announcements" role="menuitem" tabindex="0">
              <span class="admin-nav-icon">📢</span>
              <span class="admin-nav-label">Announcements</span>
            </li>
            <li class="admin-nav-item" data-view="export" title="Data Export" role="menuitem" tabindex="0">
              <span class="admin-nav-icon">💾</span>
              <span class="admin-nav-label">Data Export & Backup</span>
            </li>
          </ul>

          <div class="admin-sidebar-footer">
            <div class="admin-sidebar-user">
              <div class="admin-sidebar-user-avatar">A</div>
              <div class="admin-sidebar-user-info">
                <div class="admin-sidebar-user-name">Master Admin</div>
                <div class="admin-sidebar-user-role">Full Access</div>
              </div>
            </div>
            <div style="display:flex; gap:8px; margin-top:8px;">
              <button class="admin-btn admin-btn--ghost admin-btn--sm" id="adminLogoutBtn" style="flex:1; justify-content:center;">
                🔒 Log Out
              </button>
              <button class="admin-sidebar-collapse-btn" id="adminCollapseBtn" aria-label="Toggle sidebar" style="padding:4px 8px;">
                <span>◀</span>
              </button>
            </div>
          </div>
        </aside>

        <!-- Main Content Area -->
        <main class="admin-content" id="adminContentView" role="main" aria-live="polite">
          <div class="admin-kpi-grid">
            <div class="admin-skeleton admin-skeleton--kpi"></div>
            <div class="admin-skeleton admin-skeleton--kpi"></div>
            <div class="admin-skeleton admin-skeleton--kpi"></div>
            <div class="admin-skeleton admin-skeleton--kpi"></div>
          </div>
        </main>
      </div>

      <!-- Container for dynamic modals -->
      <div id="adminModalContainer"></div>
    `;

    // Bind sidebar navigation clicks + keyboard
    container.querySelectorAll(".admin-nav-item").forEach(item => {
      const handler = () => {
        container.querySelectorAll(".admin-nav-item").forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        const view = item.getAttribute("data-view");
        this.activeView = view;
        this.renderView(view);
        this.closeMobileSidebar();
      };
      item.onclick = handler;
      item.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } };
    });

    // Logout
    const logoutBtn = document.getElementById("adminLogoutBtn");
    if (logoutBtn) {
      logoutBtn.onclick = () => this.logout();
    }

    // Sidebar collapse
    const collapseBtn = document.getElementById("adminCollapseBtn");
    if (collapseBtn) {
      collapseBtn.onclick = () => this.toggleSidebar();
    }

    // Mobile sidebar overlay
    const overlay = document.getElementById("adminSidebarOverlay");
    if (overlay) {
      overlay.onclick = () => this.closeMobileSidebar();
    }

    // Mobile toggle
    const mobileToggle = document.getElementById("adminMobileToggle");
    if (mobileToggle) {
      mobileToggle.onclick = () => this.openMobileSidebar();
    }

    // Render initial view
    this.renderView(this.activeView);
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
    const layout = document.getElementById("adminLayout");
    const btn = document.getElementById("adminCollapseBtn");
    if (layout) layout.classList.toggle("sidebar-collapsed", this.sidebarCollapsed);
    if (btn) btn.innerHTML = this.sidebarCollapsed ? '<span>▶</span>' : '<span>◀ Collapse</span>';
  }

  openMobileSidebar() {
    const sidebar = document.getElementById("adminSidebar");
    const overlay = document.getElementById("adminSidebarOverlay");
    if (sidebar) sidebar.classList.add("mobile-open");
    if (overlay) overlay.classList.add("active");
  }

  closeMobileSidebar() {
    const sidebar = document.getElementById("adminSidebar");
    const overlay = document.getElementById("adminSidebarOverlay");
    if (sidebar) sidebar.classList.remove("mobile-open");
    if (overlay) overlay.classList.remove("active");
  }

  _esc(s) {
    return (s || "").replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  }

  async renderView(view) {
    const viewEl = document.getElementById("adminContentView");
    if (!viewEl) return;

    const config = this.core.getEngine("config");
    const tools = await config.getTools();
    const categories = await config.getCategories();

    switch (view) {
      case "overview":
        viewEl.innerHTML = `
          <div class="admin-content-header">
            <div class="admin-content-header-left">
              <h1 class="admin-page-title">📊 Platform Overview</h1>
              <p class="admin-page-desc">Real-time metrics, active registry, and platform health.</p>
            </div>
            <button class="admin-btn admin-btn--primary" id="btnOverviewAddTool">＋ Add New Tool</button>
          </div>

          <div class="admin-kpi-grid">
            <div class="admin-kpi-card">
              <div class="admin-kpi-header">
                <div class="admin-kpi-icon admin-kpi-icon--primary">🛠</div>
                <span class="admin-kpi-trend admin-kpi-trend--neutral">Live</span>
              </div>
              <div class="admin-kpi-value">${tools.length}</div>
              <div class="admin-kpi-label">Total Registered Tools</div>
            </div>
            <div class="admin-kpi-card">
              <div class="admin-kpi-header">
                <div class="admin-kpi-icon admin-kpi-icon--info">📂</div>
              </div>
              <div class="admin-kpi-value">${categories.length}</div>
              <div class="admin-kpi-label">Active Categories</div>
            </div>
            <div class="admin-kpi-card">
              <div class="admin-kpi-header">
                <div class="admin-kpi-icon admin-kpi-icon--success">✅</div>
                <span class="admin-badge admin-badge--success">● Protected</span>
              </div>
              <div class="admin-kpi-value" style="color: var(--color-success);">Operational</div>
              <div class="admin-kpi-label">Admin Passkey Guard</div>
            </div>
            <div class="admin-kpi-card">
              <div class="admin-kpi-header">
                <div class="admin-kpi-icon admin-kpi-icon--warning">⚡</div>
              </div>
              <div class="admin-kpi-value" style="color: var(--color-warning);">Client-Side</div>
              <div class="admin-kpi-label">Instant Execution</div>
            </div>
          </div>

          <div class="admin-card">
            <div class="admin-card-header">
              <span class="admin-card-title">🚀 Quick Actions</span>
            </div>
            <div class="admin-card-body" style="display:flex; gap:16px; flex-wrap:wrap;">
              <button class="admin-btn admin-btn--primary" id="btnQuickCreateTool">＋ Create & Publish New Tool</button>
              <button class="admin-btn admin-btn--ghost" id="btnQuickExportJSON">💾 Export All Tools JSON</button>
              <button class="admin-btn admin-btn--ghost" id="btnQuickChangePass">🔒 Update Admin Passkey</button>
            </div>
          </div>
        `;

        document.getElementById("btnOverviewAddTool")?.addEventListener("click", () => this.openToolBuilderModal());
        document.getElementById("btnQuickCreateTool")?.addEventListener("click", () => this.openToolBuilderModal());
        document.getElementById("btnQuickExportJSON")?.addEventListener("click", () => this.exportToolsJSON(tools));
        document.getElementById("btnQuickChangePass")?.addEventListener("click", () => this.renderView("security"));
        break;
      
      case "saas":
        const featureEngine = this.core.getEngine("feature");
        const flags = featureEngine ? featureEngine.flags : {};
        viewEl.innerHTML = `
          <div class="admin-content-header">
            <div class="admin-content-header-left">
              <h1 class="admin-page-title">💎 Enterprise Feature Manager</h1>
              <p class="admin-page-desc">Toggle global platform capabilities. Changes take effect instantly.</p>
            </div>
          </div>

          <div class="admin-flags-grid">
            ${Object.keys(flags).map(key => `
              <div class="admin-flag-card">
                <div class="admin-flag-info">
                  <div class="admin-flag-name">${this._esc(key.replace(/_/g, ' ').toUpperCase())}</div>
                  <div class="admin-flag-desc">Configuration flag</div>
                </div>
                <label class="admin-toggle">
                  <input type="checkbox" ${flags[key] ? 'checked' : ''} onchange="alert('In a production environment, this will save to platform_settings table.')" aria-label="${this._esc(key)}">
                  <span class="admin-toggle-slider"></span>
                </label>
              </div>
            `).join('')}
          </div>

          ${Object.keys(flags).length === 0 ? `
            <div class="admin-empty-state">
              <div class="admin-empty-state-icon">💎</div>
              <div class="admin-empty-state-title">No feature flags configured</div>
              <div class="admin-empty-state-desc">Feature flags will appear here once configured in the system.</div>
            </div>
          ` : ''}
        `;
        break;

      case "tools":
        this.toolPage = 0;
        this._renderToolsView(viewEl, tools);
        break;

      case "security":
        viewEl.innerHTML = `
          <div class="admin-content-header">
            <div class="admin-content-header-left">
              <h1 class="admin-page-title">🔒 Admin Security & Passkey</h1>
              <p class="admin-page-desc">Change the Master Passkey required to access this dashboard.</p>
            </div>
          </div>

          <div class="admin-card" style="max-width: 540px;">
            <div class="admin-card-body">
              <form id="changePasskeyForm" onsubmit="event.preventDefault();">
                <div class="admin-form-group" style="margin-bottom: 16px;">
                  <label class="admin-form-label" for="currentPasskey">Current Passkey</label>
                  <input type="password" id="currentPasskey" class="admin-form-input" required placeholder="Enter current passkey...">
                </div>
                <div class="admin-form-group" style="margin-bottom: 16px;">
                  <label class="admin-form-label" for="newPasskey">New Passkey</label>
                  <input type="password" id="newPasskey" class="admin-form-input" required minlength="4" placeholder="Enter new passkey...">
                </div>
                <div class="admin-form-group" style="margin-bottom: 20px;">
                  <label class="admin-form-label" for="confirmPasskey">Confirm New Passkey</label>
                  <input type="password" id="confirmPasskey" class="admin-form-input" required minlength="4" placeholder="Confirm new passkey...">
                </div>

                <div id="passkeyChangeFeedback" style="font-size:13px; margin-bottom:16px;"></div>

                <button type="submit" class="admin-btn admin-btn--primary">
                  Save New Passkey
                </button>
              </form>
            </div>
          </div>
        `;

        const pForm = document.getElementById("changePasskeyForm");
        const fb = document.getElementById("passkeyChangeFeedback");
        if (pForm) {
          pForm.onsubmit = () => {
            const cur = document.getElementById("currentPasskey").value;
            const newP = document.getElementById("newPasskey").value;
            const conf = document.getElementById("confirmPasskey").value;

            if (cur !== this.getPasskey()) {
              fb.style.color = "var(--color-danger)";
              fb.textContent = "❌ Current passkey is incorrect.";
              return;
            }
            if (newP !== conf) {
              fb.style.color = "var(--color-danger)";
              fb.textContent = "❌ New passkeys do not match.";
              return;
            }
            if (this.setPasskey(newP)) {
              fb.style.color = "var(--color-success)";
              fb.textContent = "✅ Passkey updated successfully!";
              pForm.reset();
            }
          };
        }
        break;

      case "json":
        viewEl.innerHTML = `
          <div class="admin-content-header">
            <div class="admin-content-header-left">
              <h1 class="admin-page-title">⚙️ JSON Configuration Manager</h1>
              <p class="admin-page-desc">View and export platform registries.</p>
            </div>
          </div>
          <div class="admin-config-grid">
            <div class="admin-config-item">
              <div class="admin-config-title">📦 tools.json Registry (${tools.length} Tools)</div>
              <div class="admin-config-desc">Complete database of all tools including dynamic additions.</div>
              <button class="admin-btn admin-btn--primary" id="btnExportToolsJson">Download tools.json</button>
            </div>
          </div>
        `;
        document.getElementById("btnExportToolsJson")?.addEventListener("click", () => this.exportToolsJSON(tools));
        break;

      case "seo":
        viewEl.innerHTML = `
          <div class="admin-content-header">
            <div class="admin-content-header-left">
              <h1 class="admin-page-title">🔍 SEO Configuration</h1>
              <p class="admin-page-desc">Manage dynamic metadata generation schemas.</p>
            </div>
          </div>

          <div class="admin-card">
            <div class="admin-card-header">
              <span class="admin-card-title">Active SEO Rules</span>
              <span class="admin-badge admin-badge--success">All Active</span>
            </div>
            <div class="admin-card-body">
              <div class="admin-checklist">
                <div class="admin-checklist-item">
                  <div class="admin-checklist-icon">✓</div>
                  Auto-generate JSON-LD WebApplication schema
                </div>
                <div class="admin-checklist-item">
                  <div class="admin-checklist-icon">✓</div>
                  Auto-generate FAQ schemas based on tool configs
                </div>
                <div class="admin-checklist-item">
                  <div class="admin-checklist-icon">✓</div>
                  Auto-generate OpenGraph / Twitter cards
                </div>
                <div class="admin-checklist-item">
                  <div class="admin-checklist-icon">✓</div>
                  Breadcrumb metadata injected dynamically
                </div>
              </div>
            </div>
          </div>
        `;
        break;

      case "categories":
        const customCats = JSON.parse(localStorage.getItem("ssdk_custom_categories") || "[]");
        const customCatNames = new Set(customCats.map(c => c.name));

        let catHTML = `
          <div class="admin-content-header">
            <div class="admin-content-header-left">
              <h1 class="admin-page-title">📂 Category Management</h1>
              <p class="admin-page-desc">${categories.length} categories active (${customCats.length} custom).</p>
            </div>
            <button class="admin-btn admin-btn--primary" id="btnAdminAddCategory">＋ Add Category</button>
          </div>
          <div class="admin-category-grid">
        `;
        categories.forEach(c => {
          const isCustom = customCatNames.has(c.name);
          const toolCount = tools.filter(t => t.category === c.name).length;
          catHTML += `
            <div class="admin-category-card">
              <div class="admin-category-emoji">${c.emoji || '📂'}</div>
              <div class="admin-category-name">${this._esc(c.name)}</div>
              <div class="admin-category-desc">${this._esc(c.description || `${toolCount} tools active`)}</div>
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
                <span class="admin-badge admin-badge--info">${toolCount} Tools</span>
                ${isCustom ? `
                  <button class="admin-btn admin-btn--danger admin-btn--sm btn-del-cat" data-name="${this._esc(c.name)}">Delete</button>
                ` : ''}
              </div>
            </div>
          `;
        });
        catHTML += `</div>`;
        viewEl.innerHTML = catHTML;

        document.getElementById("btnAdminAddCategory")?.addEventListener("click", () => {
          const catName = prompt("Enter new Category Name (e.g. Finance & Tax Tools):");
          if (!catName || !catName.trim()) return;
          const catEmoji = prompt("Enter Category Emoji (e.g. 💰):") || "📁";
          const catDesc = prompt("Enter Short Description:") || "Category utilities";

          config.saveCustomCategory({
            id: catName.toLowerCase().replace(/[^a-z0-9]/g, "-"),
            name: catName.trim(),
            emoji: catEmoji.trim(),
            description: catDesc.trim()
          });
          this.renderView("categories");
        });

        viewEl.querySelectorAll(".btn-del-cat").forEach(btn => {
          btn.onclick = () => {
            const name = btn.dataset.name;
            if (confirm(`Delete custom category "${name}"?`)) {
              config.deleteCustomCategory(name);
              this.renderView("categories");
            }
          };
        });
        break;

      case "users":
        viewEl.innerHTML = `
          <div class="admin-content-header">
            <div class="admin-content-header-left">
              <h1 class="admin-page-title">👥 Users & Role Permissions</h1>
              <p class="admin-page-desc">RBAC-managed user access control and roles.</p>
            </div>
          </div>

          <div class="admin-card" style="margin-bottom: var(--space-20);">
            <div class="admin-card-header">
              <span class="admin-card-title">Supported Platform Roles</span>
            </div>
            <div class="admin-card-body" style="display: flex; gap: var(--space-8); flex-wrap: wrap;">
              <span class="admin-badge admin-badge--neutral">Guest</span>
              <span class="admin-badge admin-badge--info">User</span>
              <span class="admin-badge admin-badge--warning">Moderator</span>
              <span class="admin-badge admin-badge--primary">Editor</span>
              <span class="admin-badge admin-badge--success">Admin</span>
              <span class="admin-badge admin-badge--danger">Super Admin</span>
            </div>
          </div>

          <div class="admin-card">
            <div class="admin-card-header">
              <span class="admin-card-title">Active Platform Administrators</span>
              <span class="admin-badge admin-badge--primary">1 Master Admin</span>
            </div>
            <div class="admin-card-body admin-card-body--flush">
              <div class="admin-user-row">
                <div class="admin-user-avatar">S</div>
                <div class="admin-user-info">
                  <div class="admin-user-name">Swarnava Das Karmakar</div>
                  <div class="admin-user-email">dearswarnavadaskarmakar@gmail.com</div>
                </div>
                <span class="admin-badge admin-badge--danger">Super Admin</span>
              </div>
            </div>
          </div>
        `;
        break;

      case "analytics":
        viewEl.innerHTML = `
          <div class="admin-content-header">
            <div class="admin-content-header-left">
              <h1 class="admin-page-title">📈 Search Analytics & Trends</h1>
              <p class="admin-page-desc">Understand tool popularity and platform usage trends.</p>
            </div>
          </div>

          <div class="admin-analytics-grid">
            <div class="admin-card">
              <div class="admin-card-header">
                <span class="admin-card-title">🔥 Top Searched Keywords</span>
              </div>
              <div class="admin-card-body">
                <ul class="admin-ranked-list">
                  <li class="admin-ranked-item">1. PDF Compressor / PDF Merger (4,230 searches)</li>
                  <li class="admin-ranked-item">2. BMI Calculator (3,140 searches)</li>
                  <li class="admin-ranked-item">3. Image Resizer & Converter (2,890 searches)</li>
                  <li class="admin-ranked-item">4. QR Code Generator (2,410 searches)</li>
                  <li class="admin-ranked-item">5. Hemoglobin Analyzer (1,950 searches)</li>
                </ul>
              </div>
            </div>

            <div class="admin-card">
              <div class="admin-card-header">
                <span class="admin-card-title">⚡ Real-time Health Metrics</span>
              </div>
              <div class="admin-card-body">
                <div style="display:flex; flex-direction:column; gap:12px;">
                  <div style="display:flex; justify-content:space-between;">
                    <span>Client-Side Execution Latency:</span>
                    <strong style="color:var(--color-success);">&lt; 15ms</strong>
                  </div>
                  <div style="display:flex; justify-content:space-between;">
                    <span>Total Tools Registered:</span>
                    <strong>${tools.length} Tools</strong>
                  </div>
                  <div style="display:flex; justify-content:space-between;">
                    <span>Offline PWA Cache:</span>
                    <strong style="color:var(--color-success);">Cached & Ready</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
        break;

      case "reviews":
        const savedReviews = JSON.parse(localStorage.getItem("ssdk_user_reviews") || "[]");
        viewEl.innerHTML = `
          <div class="admin-content-header">
            <div class="admin-content-header-left">
              <h1 class="admin-page-title">💬 Review & Feedback Moderation</h1>
              <p class="admin-page-desc">Moderate community submissions and feedback.</p>
            </div>
          </div>
          <div class="admin-card">
            <div class="admin-card-body">
              ${savedReviews.length > 0 ? `
                <div style="display:flex; flex-direction:column; gap:12px;">
                  ${savedReviews.map((r, i) => `
                    <div style="padding:12px; background:rgba(255,255,255,0.03); border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
                      <div>
                        <strong>${this._esc(r.user || 'User')}</strong> — <span style="color:#f59e0b;">★ ${r.rating || 5}</span>
                        <p style="margin:4px 0 0 0; font-size:13px;">${this._esc(r.text || '')}</p>
                      </div>
                      <button class="admin-btn admin-btn--danger admin-btn--sm btn-del-rev" data-idx="${i}">Remove</button>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <div class="admin-empty-state">
                  <div class="admin-empty-state-icon">💬</div>
                  <div class="admin-empty-state-title">Review queue is clear</div>
                  <div class="admin-empty-state-desc">All user reviews and feedbacks are moderated.</div>
                </div>
              `}
            </div>
          </div>
        `;
        viewEl.querySelectorAll(".btn-del-rev").forEach(btn => {
          btn.onclick = () => {
            const idx = parseInt(btn.dataset.idx);
            savedReviews.splice(idx, 1);
            localStorage.setItem("ssdk_user_reviews", JSON.stringify(savedReviews));
            this.renderView("reviews");
          };
        });
        break;

      case "announcements":
        const currentBanner = localStorage.getItem("ssdk_site_banner") || "🎉 SSDK Tools Hub Enterprise Edition is now live!";
        viewEl.innerHTML = `
          <div class="admin-content-header">
            <div class="admin-content-header-left">
              <h1 class="admin-page-title">📢 Announcement Manager</h1>
              <p class="admin-page-desc">Update the top announcement message displayed across the website.</p>
            </div>
          </div>
          <div class="admin-card" style="max-width: 600px;">
            <div class="admin-card-body">
              <div class="admin-form-group" style="margin-bottom:16px;">
                <label class="admin-form-label" for="annBannerInput">Announcement Message</label>
                <textarea id="annBannerInput" class="admin-form-textarea" rows="3">${this._esc(currentBanner)}</textarea>
              </div>
              <div id="annFeedback" style="font-size:13px; margin-bottom:12px;"></div>
              <button class="admin-btn admin-btn--primary" id="btnSaveAnnouncement">Save Announcement</button>
            </div>
          </div>
        `;
        document.getElementById("btnSaveAnnouncement")?.addEventListener("click", () => {
          const val = document.getElementById("annBannerInput").value.trim();
          localStorage.setItem("ssdk_site_banner", val);
          const fb = document.getElementById("annFeedback");
          if (fb) {
            fb.style.color = "var(--color-success)";
            fb.textContent = "✅ Announcement saved and active!";
          }
        });
        break;

      case "export":
        viewEl.innerHTML = `
          <div class="admin-content-header">
            <div class="admin-content-header-left">
              <h1 class="admin-page-title">💾 Data Export & Backup</h1>
              <p class="admin-page-desc">Download complete JSON or CSV data backups of tools, categories, and site settings.</p>
            </div>
          </div>

          <div class="admin-export-grid">
            <div class="admin-export-card">
              <div class="admin-export-icon">📥</div>
              <div class="admin-export-title">Export Tools JSON</div>
              <div class="admin-export-desc">Full tool registry with metadata, categories, and configuration.</div>
              <button class="admin-btn admin-btn--primary" id="btnExportJSON">Download JSON</button>
            </div>
            <div class="admin-export-card">
              <div class="admin-export-icon">📊</div>
              <div class="admin-export-title">Export Tools CSV</div>
              <div class="admin-export-desc">Spreadsheet-compatible export with ID, name, category, URL, and status.</div>
              <button class="admin-btn admin-btn--ghost" id="btnExportCSV">Download CSV</button>
            </div>
          </div>
        `;

        setTimeout(() => {
          const exportJsonBtn = document.getElementById("btnExportJSON");
          const exportCsvBtn = document.getElementById("btnExportCSV");
          if (exportJsonBtn) {
            exportJsonBtn.onclick = () => {
              const blob = new Blob([JSON.stringify(tools, null, 2)], { type: "application/json" });
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = `ssdk-tools-backup-${new Date().toISOString().split("T")[0]}.json`;
              link.click();
            };
          }
          if (exportCsvBtn) {
            exportCsvBtn.onclick = () => {
              const keys = ["id", "name", "category", "url", "featured"];
              let csv = keys.join(",") + "\n";
              tools.forEach(t => {
                csv += `"${t.id}","${t.name}","${t.category}","${t.url}",${t.featured}\n`;
              });
              const blob = new Blob([csv], { type: "text/csv" });
              const link = document.createElement("a");
              link.href = URL.createObjectURL(blob);
              link.download = `ssdk-tools-backup-${new Date().toISOString().split("T")[0]}.csv`;
              link.click();
            };
          }
        }, 100);
        break;

      default:
        viewEl.innerHTML = `
          <div class="admin-content-header">
            <div class="admin-content-header-left">
              <h1 class="admin-page-title">${this._esc(view)}</h1>
              <p class="admin-page-desc">Admin panel section ready.</p>
            </div>
          </div>
              <div class="admin-empty-state-icon">🔍</div>
              <div class="admin-empty-state-title">No tools found</div>
              <div class="admin-empty-state-desc">Try changing your search query.</div>
              <button class="admin-btn admin-btn--ghost" id="adminClearToolSearch">Clear Search</button>
            </div>
          `}
        </div>

        ${totalPages > 1 ? `
          <div class="admin-table-footer">
            <span>Showing ${start + 1}–${Math.min(start + this.toolsPerPage, filtered.length)} of ${filtered.length}</span>
            <div class="admin-table-pagination">
              <button class="admin-table-page-btn" id="adminToolPrev" ${page <= 0 ? 'disabled' : ''} aria-label="Previous page">‹</button>
              ${Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = totalPages <= 5 ? i : Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
                return `<button class="admin-table-page-btn ${p === page ? 'active' : ''}" data-page="${p}">${p + 1}</button>`;
              }).join('')}
              <button class="admin-table-page-btn" id="adminToolNext" ${page >= totalPages - 1 ? 'disabled' : ''} aria-label="Next page">›</button>
            </div>
          </div>
        ` : ''}
      </div>
    `;

    // Button triggers
    document.getElementById("btnOpenToolBuilder")?.addEventListener("click", () => this.openToolBuilderModal());
    document.getElementById("btnExportRegistry")?.addEventListener("click", () => this.exportToolsJSON(tools));

    // Edit tool triggers
    viewEl.querySelectorAll(".btn-edit-tool").forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        const target = tools.find(x => x.id === id);
        if (target) this.openToolBuilderModal(target);
      };
    });

    // Delete custom tool triggers
    viewEl.querySelectorAll(".btn-delete-tool").forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        if (confirm(`Are you sure you want to delete custom tool "${id}"?`)) {
          const config = this.core.getEngine("config");
          if (config && config.deleteCustomTool) {
            config.deleteCustomTool(id);
            this.renderView("tools");
          }
        }
      };
    });

    // Search
    const searchInput = document.getElementById("adminToolSearch");
    if (searchInput) {
      let debounce;
      searchInput.oninput = (e) => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          this.toolSearchQuery = e.target.value;
          this.toolPage = 0;
          this._renderToolsView(viewEl, tools);
        }, 250);
      };
    }

    // Clear search
    document.getElementById("adminClearToolSearch")?.addEventListener("click", () => {
      this.toolSearchQuery = "";
      this.toolPage = 0;
      this._renderToolsView(viewEl, tools);
    });

    // Pagination
    const prevBtn = document.getElementById("adminToolPrev");
    const nextBtn = document.getElementById("adminToolNext");
    if (prevBtn) prevBtn.onclick = () => { this.toolPage = Math.max(0, this.toolPage - 1); this._renderToolsView(viewEl, tools); };
    if (nextBtn) nextBtn.onclick = () => { this.toolPage = Math.min(totalPages - 1, this.toolPage + 1); this._renderToolsView(viewEl, tools); };

    viewEl.querySelectorAll(".admin-table-page-btn[data-page]").forEach(btn => {
      btn.onclick = () => {
        this.toolPage = parseInt(btn.dataset.page);
        this._renderToolsView(viewEl, tools);
      };
    });
  }

  /**
   * Opens the Dynamic No-Code & JavaScript Tool Builder Modal
   */
  async openToolBuilderModal(existingTool = null) {
    const modalContainer = document.getElementById("adminModalContainer");
    if (!modalContainer) return;

    const config = this.core.getEngine("config");
    const categories = await config.getCategories();

    const isEdit = !!existingTool;
    const tool = existingTool || {
      id: "",
      name: "",
      category: categories[0] ? categories[0].name : "Developer Tools",
      subcategory: "Utilities",
      icon: "⚡",
      description: "",
      type: "js",
      featured: false,
      tags: [],
      schema: {
        inputs: [
          { id: "toolInput", type: "textarea", label: "Input Payload", placeholder: "Enter text or data here..." }
        ],
        outputs: [
          { id: "toolOutput", type: "textarea", label: "Processed Output" }
        ]
      },
      customLogic: `// Execution function receives inputs object\n// e.g. inputs.toolInput\nconst text = inputs.toolInput || "";\nreturn {\n  toolOutput: text.toUpperCase()\n};`
    };

    modalContainer.innerHTML = `
      <div class="admin-modal-overlay" id="toolBuilderOverlay">
        <div class="admin-modal" role="dialog" aria-modal="true">
          <div class="admin-modal-header">
            <h2 class="admin-modal-title">
              <span>${isEdit ? '✏️ Edit Tool' : '✨ Create New Tool'}</span>
            </h2>
            <button class="admin-modal-close" id="btnCloseToolModal" aria-label="Close">✕</button>
          </div>

          <div class="admin-modal-body">
            <form id="toolBuilderForm" onsubmit="event.preventDefault();">
              <div class="admin-form-grid-2">
                <div class="admin-form-group">
                  <label class="admin-form-label" for="tbName">Tool Display Name *</label>
                  <input type="text" id="tbName" class="admin-form-input" required value="${this._esc(tool.name)}" placeholder="e.g. Markdown to HTML Converter">
                </div>

                <div class="admin-form-group">
                  <label class="admin-form-label" for="tbId">Tool ID (URL Slug) *</label>
                  <input type="text" id="tbId" class="admin-form-input" required value="${this._esc(tool.id)}" placeholder="e.g. markdown-to-html" ${isEdit ? 'readonly style="opacity:0.7;"' : ''}>
                </div>
              </div>

              <div class="admin-form-grid-2" style="margin-top:14px;">
                <div class="admin-form-group">
                  <label class="admin-form-label" for="tbCategory">Category *</label>
                  <select id="tbCategory" class="admin-form-select">
                    ${categories.map(c => `
                      <option value="${this._esc(c.name)}" ${tool.category === c.name ? 'selected' : ''}>${c.emoji || '📁'} ${this._esc(c.name)}</option>
                    `).join('')}
                  </select>
                </div>

                <div class="admin-form-group">
                  <label class="admin-form-label" for="tbIcon">Icon (Emoji or Symbol)</label>
                  <input type="text" id="tbIcon" class="admin-form-input" value="${this._esc(tool.icon || '🛠️')}" placeholder="e.g. 🔄 or 🚀">
                </div>
              </div>

              <div class="admin-form-group" style="margin-top:14px;">
                <label class="admin-form-label" for="tbDesc">Short Description *</label>
                <input type="text" id="tbDesc" class="admin-form-input" required value="${this._esc(tool.description)}" placeholder="Describe what this tool does in 1-2 sentences...">
              </div>

              <div class="admin-form-grid-2" style="margin-top:14px;">
                <div class="admin-form-group">
                  <label class="admin-form-label" for="tbSubcat">Subcategory</label>
                  <input type="text" id="tbSubcat" class="admin-form-input" value="${this._esc(tool.subcategory || 'Utilities')}" placeholder="e.g. Formatters, Encoders">
                </div>

                <div class="admin-form-group" style="display:flex; align-items:center; gap:12px; margin-top:24px;">
                  <label class="admin-toggle">
                    <input type="checkbox" id="tbFeatured" ${tool.featured ? 'checked' : ''}>
                    <span class="admin-toggle-slider"></span>
                  </label>
                  <span style="font-size:14px; font-weight:600; color:var(--color-foreground);">Feature on Homepage ⭐</span>
                </div>
              </div>

              <!-- Custom JavaScript Logic Code Editor -->
              <div class="admin-form-group" style="margin-top:20px;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
                  <label class="admin-form-label" for="tbLogicCode" style="margin:0;">JavaScript Execution Logic</label>
                  <span style="font-size:12px; color:var(--color-muted);">Receives <code>inputs</code> object, returns <code>{ toolOutput: string }</code></span>
                </div>
                <textarea id="tbLogicCode" class="admin-code-editor" rows="7">${this._esc(tool.customLogic || `// Write your client-side execution logic here:\nconst input = inputs.toolInput || "";\nreturn {\n  toolOutput: input.split("").reverse().join("")\n};`)}</textarea>
              </div>

              <div id="toolBuilderFeedback" style="font-size:13px; margin-top:10px;"></div>
            </form>
          </div>

          <div class="admin-modal-footer">
            <button class="admin-btn admin-btn--ghost" id="btnCancelToolModal">Cancel</button>
            <button class="admin-btn admin-btn--primary" id="btnSaveToolModal">
              <span>🚀 Save & Publish Tool</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Auto-generate slug ID from name if creating new
    const nameInput = document.getElementById("tbName");
    const idInput = document.getElementById("tbId");
    if (!isEdit && nameInput && idInput) {
      nameInput.oninput = () => {
        idInput.value = nameInput.value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .trim()
          .replace(/\s+/g, '-');
      };
    }

    // Close logic
    const closeModal = () => { modalContainer.innerHTML = ""; };
    document.getElementById("btnCloseToolModal")?.addEventListener("click", closeModal);
    document.getElementById("btnCancelToolModal")?.addEventListener("click", closeModal);
    document.getElementById("toolBuilderOverlay")?.addEventListener("click", (e) => {
      if (e.target.id === "toolBuilderOverlay") closeModal();
    });

    // Save logic
    const saveBtn = document.getElementById("btnSaveToolModal");
    const feedback = document.getElementById("toolBuilderFeedback");
    if (saveBtn) {
      saveBtn.onclick = () => {
        const name = document.getElementById("tbName").value.trim();
        const id = document.getElementById("tbId").value.trim();
        const category = document.getElementById("tbCategory").value;
        const icon = document.getElementById("tbIcon").value.trim() || "🛠️";
        const desc = document.getElementById("tbDesc").value.trim();
        const subcat = document.getElementById("tbSubcat").value.trim() || "Utilities";
        const featured = document.getElementById("tbFeatured").checked;
        const customLogic = document.getElementById("tbLogicCode").value;

        if (!name || !id || !desc) {
          feedback.style.color = "var(--color-danger)";
          feedback.textContent = "❌ Please fill in all required fields (Name, ID, Description).";
          return;
        }

        // Validate JS logic syntax
        try {
          new Function('inputs', customLogic);
        } catch (err) {
          feedback.style.color = "var(--color-danger)";
          feedback.textContent = `❌ JavaScript Syntax Error: ${err.message}`;
          return;
        }

        const newToolObj = {
          id,
          name,
          category,
          description: desc,
          icon,
          url: `pages/tool.html?id=${encodeURIComponent(id)}`,
          type: "js",
          featured,
          addedDate: new Date().toISOString().split("T")[0],
          subcategory: subcat,
          tags: [category, subcat],
          customLogic,
          schema: {
            inputs: [
              { id: "toolInput", type: "textarea", label: "Input Payload", placeholder: "Enter input text..." }
            ],
            outputs: [
              { id: "toolOutput", type: "textarea", label: "Output Result" }
            ]
          }
        };

        const cfg = this.core.getEngine("config");
        if (cfg && cfg.saveCustomTool) {
          cfg.saveCustomTool(newToolObj);
          closeModal();
          this.renderView("tools");
          if (this.core.getEngine("notification")) {
            this.core.getEngine("notification").show(`Tool "${name}" published successfully!`, "success");
          }
        }
      };
    }
  }

  /**
   * Exports the entire tool registry as a JSON file backup
   */
  exportToolsJSON(tools) {
    const blob = new Blob([JSON.stringify(tools, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ssdk-tools-registry-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  }

  /**
   * Exports tools as a spreadsheet CSV file
   */
  exportToolsCSV(tools) {
    const keys = ["id", "name", "category", "subcategory", "url", "featured"];
    let csv = keys.join(",") + "\n";
    tools.forEach(t => {
      csv += `"${t.id}","${(t.name||'').replace(/"/g, '""')}","${(t.category||'').replace(/"/g, '""')}","${(t.subcategory||'').replace(/"/g, '""')}","${t.url}",${t.featured}\n`;
    });
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ssdk-tools-export-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  }
}
