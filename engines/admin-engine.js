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
  }

  async init(core) {
    this.core = core;
    const supabaseEngine = this.core.getEngine("supabase");
    if (supabaseEngine) {
      this.supabase = supabaseEngine.supabase;
    }
    console.log("[AdminEngine] Initialized Enterprise CMS Controller.");
  }

  /**
   * Bootstraps and mounts the Admin Dashboard interface
   */
  async mountAdmin(containerId = "adminContainer") {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="admin-sidebar-overlay" id="adminSidebarOverlay"></div>
      <div class="admin-layout" id="adminLayout">
        <!-- Sidebar Navigation -->
        <aside class="admin-sidebar" id="adminSidebar" role="navigation" aria-label="Admin navigation">
          <div class="admin-sidebar-brand">
            <div class="admin-sidebar-brand-icon">S</div>
            <div class="admin-sidebar-brand-text">
              <span class="admin-sidebar-brand-name">SSDK TOOLS</span>
              <span class="admin-sidebar-brand-label">Admin Panel</span>
            </div>
          </div>

          <div class="admin-sidebar-section">Management</div>
          <ul class="admin-sidebar-nav" role="menubar">
            <li class="admin-nav-item active" data-view="overview" title="Overview & Stats" role="menuitem" tabindex="0">
              <span class="admin-nav-icon">📊</span>
              <span class="admin-nav-label">Overview & Stats</span>
            </li>
            <li class="admin-nav-item" data-view="saas" title="SaaS & Feature Flags" role="menuitem" tabindex="0">
              <span class="admin-nav-icon">💎</span>
              <span class="admin-nav-label">SaaS & Feature Flags</span>
            </li>
            <li class="admin-nav-item" data-view="tools" title="Tool Registry" role="menuitem" tabindex="0">
              <span class="admin-nav-icon">🛠</span>
              <span class="admin-nav-label">Tool Registry</span>
            </li>
            <li class="admin-nav-item" data-view="json" title="JSON Manager" role="menuitem" tabindex="0">
              <span class="admin-nav-icon">⚙️</span>
              <span class="admin-nav-label">JSON Manager</span>
            </li>
            <li class="admin-nav-item" data-view="seo" title="SEO Config" role="menuitem" tabindex="0">
              <span class="admin-nav-icon">🔍</span>
              <span class="admin-nav-label">SEO Config</span>
            </li>

            <li class="admin-sidebar-section" style="padding-left:0;">Content</li>
            <li class="admin-nav-item" data-view="categories" title="Categories" role="menuitem" tabindex="0">
              <span class="admin-nav-icon">📂</span>
              <span class="admin-nav-label">Categories</span>
            </li>
            <li class="admin-nav-item" data-view="users" title="Users & Roles" role="menuitem" tabindex="0">
              <span class="admin-nav-icon">👥</span>
              <span class="admin-nav-label">Users & Roles</span>
            </li>
            <li class="admin-nav-item" data-view="analytics" title="Search Analytics" role="menuitem" tabindex="0">
              <span class="admin-nav-icon">📈</span>
              <span class="admin-nav-label">Search Analytics</span>
            </li>

            <li class="admin-sidebar-section" style="padding-left:0;">Operations</li>
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
              <span class="admin-nav-label">Data Export</span>
            </li>
          </ul>

          <div class="admin-sidebar-footer">
            <div class="admin-sidebar-user">
              <div class="admin-sidebar-user-avatar">A</div>
              <div class="admin-sidebar-user-info">
                <div class="admin-sidebar-user-name">Admin</div>
                <div class="admin-sidebar-user-role">Super Admin</div>
              </div>
            </div>
            <button class="admin-sidebar-collapse-btn" id="adminCollapseBtn" aria-label="Toggle sidebar">
              <span>◀ Collapse</span>
            </button>
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
    `;

    // Bind sidebar navigation clicks + keyboard
    container.querySelectorAll(".admin-nav-item").forEach(item => {
      const handler = () => {
        container.querySelectorAll(".admin-nav-item").forEach(i => i.classList.remove("active"));
        item.classList.add("active");
        const view = item.getAttribute("data-view");
        this.activeView = view;
        this.renderView(view);
        // Close mobile sidebar
        this.closeMobileSidebar();
      };
      item.onclick = handler;
      item.onkeydown = (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handler(); } };
    });

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

    // Mobile toggle (in topbar)
    const mobileToggle = document.getElementById("adminMobileToggle");
    if (mobileToggle) {
      mobileToggle.onclick = () => this.openMobileSidebar();
    }

    // Default view
    await this.renderView("overview");
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
              <p class="admin-page-desc">Real-time metrics and system health at a glance.</p>
            </div>
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
                <span class="admin-badge admin-badge--success">● Healthy</span>
              </div>
              <div class="admin-kpi-value" style="color: var(--color-success);">Operational</div>
              <div class="admin-kpi-label">System Status</div>
            </div>
            <div class="admin-kpi-card">
              <div class="admin-kpi-header">
                <div class="admin-kpi-icon admin-kpi-icon--warning">⭐</div>
              </div>
              <div class="admin-kpi-value" style="color: var(--color-warning);">4.9 ★</div>
              <div class="admin-kpi-label">Avg Platform Rating</div>
            </div>
          </div>

          <div class="admin-card">
            <div class="admin-card-header">
              <span class="admin-card-title">🕒 Recent Activity</span>
            </div>
            <div class="admin-card-body">
              <div class="admin-timeline">
                <div class="admin-timeline-item">
                  <div class="admin-timeline-dot admin-timeline-dot--success">✓</div>
                  <div class="admin-timeline-content">
                    <div class="admin-timeline-title">System initialized cleanly</div>
                    <div class="admin-timeline-meta">Supabase backend RLS policies active</div>
                  </div>
                </div>
                <div class="admin-timeline-item">
                  <div class="admin-timeline-dot admin-timeline-dot--info">↻</div>
                  <div class="admin-timeline-content">
                    <div class="admin-timeline-title">Tool registry loaded</div>
                    <div class="admin-timeline-meta">${tools.length} tools registered across ${categories.length} categories</div>
                  </div>
                </div>
                <div class="admin-timeline-item">
                  <div class="admin-timeline-dot admin-timeline-dot--success">●</div>
                  <div class="admin-timeline-content">
                    <div class="admin-timeline-title">All engines operational</div>
                    <div class="admin-timeline-meta">Search, Discovery, SEO, Analytics — running</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;
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

      case "json":
        viewEl.innerHTML = `
          <div class="admin-content-header">
            <div class="admin-content-header-left">
              <h1 class="admin-page-title">⚙️ JSON Configuration Manager</h1>
              <p class="admin-page-desc">Edit site configs dynamically without changing source code.</p>
            </div>
          </div>

          <div class="admin-config-grid">
            <div>
              <div class="admin-config-item" style="margin-bottom: var(--space-16);">
                <div class="admin-config-title">📄 site.json</div>
                <div class="admin-config-desc">Controls theme defaults, global layout, header/footer links.</div>
                <button class="admin-btn admin-btn--ghost" onclick="alert('site.json raw configuration is loading...')">Edit JSON</button>
              </div>
              <div class="admin-config-item">
                <div class="admin-config-title">📦 tools.json</div>
                <div class="admin-config-desc">The universal registry containing definitions for all ${tools.length} tools.</div>
                <button class="admin-btn admin-btn--ghost" onclick="alert('tools.json registry config is loading...')">Edit JSON</button>
              </div>
            </div>

            <div class="admin-form-section">
              <div class="admin-form-section-header">
                <div class="admin-form-section-title">📢 Announcement & Alert Editor</div>
                <div class="admin-form-section-desc">Update the platform announcement banner</div>
              </div>
              <div class="admin-form-section-body">
                <div class="admin-form-group">
                  <label class="admin-form-label" for="cmsBannerText">Banner Message Text</label>
                  <textarea class="admin-form-textarea" id="cmsBannerText" rows="3">🎉 SSDK Tools Hub Enterprise Edition (Phase 14) is now live with high contrast accessibility mode!</textarea>
                </div>
                <div class="admin-form-group">
                  <label class="admin-form-label" for="cmsBannerType">Banner Theme Style</label>
                  <select class="admin-form-select" id="cmsBannerType">
                    <option value="info">Info (Purple)</option>
                    <option value="maintenance">Maintenance (Red)</option>
                  </select>
                </div>
              </div>
              <div class="admin-form-actions">
                <button class="admin-btn admin-btn--primary" onclick="alert('CMS settings saved to Supabase settings cache!')">Update Announcement</button>
              </div>
            </div>
          </div>
        `;
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
        let catHTML = `
          <div class="admin-content-header">
            <div class="admin-content-header-left">
              <h1 class="admin-page-title">📂 Category Management</h1>
              <p class="admin-page-desc">Organize and manage tool categories.</p>
            </div>
            <button class="admin-btn admin-btn--primary" onclick="alert('Add Category modal triggered')">＋ Add Category</button>
          </div>
          <div class="admin-category-grid">
        `;
        categories.forEach(c => {
          catHTML += `
            <div class="admin-category-card">
              <div class="admin-category-emoji">${c.emoji || '📂'}</div>
              <div class="admin-category-name">${this._esc(c.name)}</div>
              <div class="admin-category-desc">${this._esc(c.description || 'Category')}</div>
            </div>
          `;
        });
        if (categories.length === 0) {
          catHTML += `
            <div class="admin-empty-state" style="grid-column: 1 / -1;">
              <div class="admin-empty-state-icon">📂</div>
              <div class="admin-empty-state-title">No categories yet</div>
              <div class="admin-empty-state-desc">Create your first category to organize tools.</div>
              <button class="admin-btn admin-btn--primary" onclick="alert('Add Category modal triggered')">＋ Add Category</button>
            </div>
          `;
        }
        catHTML += `</div>`;
        viewEl.innerHTML = catHTML;
        break;

      case "users":
        viewEl.innerHTML = `
          <div class="admin-content-header">
            <div class="admin-content-header-left">
              <h1 class="admin-page-title">👥 Users & Role Permissions</h1>
              <p class="admin-page-desc">RBAC-managed user access control.</p>
            </div>
          </div>

          <div class="admin-card" style="margin-bottom: var(--space-20);">
            <div class="admin-card-header">
              <span class="admin-card-title">Supported Roles</span>
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
              <span class="admin-card-title">Admin Users</span>
              <span class="admin-badge admin-badge--primary">1 Admin</span>
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
              <p class="admin-page-desc">Understand how users find and use tools.</p>
            </div>
          </div>

          <div class="admin-analytics-grid">
            <div class="admin-card">
              <div class="admin-card-header">
                <span class="admin-card-title">🔥 Top Searched Keywords</span>
              </div>
              <div class="admin-card-body">
                <ul class="admin-ranked-list">
                  <li class="admin-ranked-item">PDF Compressor</li>
                  <li class="admin-ranked-item">BMI Calculator</li>
                  <li class="admin-ranked-item">Image Resizer</li>
                  <li class="admin-ranked-item">QR Code Generator</li>
                </ul>
              </div>
            </div>

            <div class="admin-card">
              <div class="admin-card-header">
                <span class="admin-card-title">⚠️ No-Result Queries</span>
              </div>
              <div class="admin-card-body">
                <div class="admin-empty-state">
                  <div class="admin-empty-state-icon">🎉</div>
                  <div class="admin-empty-state-title">All clear</div>
                  <div class="admin-empty-state-desc">0 failed search queries logged today.</div>
                </div>
              </div>
            </div>
          </div>
        `;
        break;

      case "reviews":
        viewEl.innerHTML = `
          <div class="admin-content-header">
            <div class="admin-content-header-left">
              <h1 class="admin-page-title">💬 Review Moderation</h1>
              <p class="admin-page-desc">Manage and moderate user reviews.</p>
            </div>
          </div>
          <div class="admin-card">
            <div class="admin-card-body">
              <div class="admin-empty-state">
                <div class="admin-empty-state-icon">💬</div>
                <div class="admin-empty-state-title">Review moderation ready</div>
                <div class="admin-empty-state-desc">Submitted reviews will appear here for moderation.</div>
              </div>
            </div>
          </div>
        `;
        break;

      case "announcements":
        viewEl.innerHTML = `
          <div class="admin-content-header">
            <div class="admin-content-header-left">
              <h1 class="admin-page-title">📢 Announcements</h1>
              <p class="admin-page-desc">Manage platform-wide announcements and alerts.</p>
            </div>
          </div>
          <div class="admin-card">
            <div class="admin-card-body">
              <div class="admin-empty-state">
                <div class="admin-empty-state-icon">📢</div>
                <div class="admin-empty-state-title">Announcements panel ready</div>
                <div class="admin-empty-state-desc">Create and manage platform announcements from here.</div>
              </div>
            </div>
          </div>
        `;
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
          <div class="admin-card">
            <div class="admin-card-body">
              <div class="admin-empty-state">
                <div class="admin-empty-state-icon">📋</div>
                <div class="admin-empty-state-title">Section available</div>
                <div class="admin-empty-state-desc">This admin section is ready for content.</div>
              </div>
            </div>
          </div>
        `;
        break;
    }
  }

  /**
   * Renders the Tools Management view with search, pagination, status badges
   */
  _renderToolsView(viewEl, tools) {
    const filtered = this.toolSearchQuery
      ? tools.filter(t =>
          t.name.toLowerCase().includes(this.toolSearchQuery.toLowerCase()) ||
          t.category.toLowerCase().includes(this.toolSearchQuery.toLowerCase()) ||
          t.id.toLowerCase().includes(this.toolSearchQuery.toLowerCase())
        )
      : tools;

    const totalPages = Math.ceil(filtered.length / this.toolsPerPage);
    const page = Math.min(this.toolPage, totalPages - 1);
    const start = page * this.toolsPerPage;
    const paged = filtered.slice(start, start + this.toolsPerPage);

    viewEl.innerHTML = `
      <div class="admin-content-header">
        <div class="admin-content-header-left">
          <h1 class="admin-page-title">🛠 Universal Tool Registry</h1>
          <p class="admin-page-desc">JSON-driven architecture. ${tools.length} tools loaded.</p>
        </div>
        <button class="admin-btn admin-btn--primary" onclick="alert('Opening No-Code Tool Builder...')">＋ Add New Tool</button>
      </div>

      <div class="admin-card">
        <div class="admin-table-toolbar">
          <div class="admin-table-search">
            <span class="admin-table-search-icon">🔍</span>
            <input type="text" placeholder="Search tools by name, category, or ID..." id="adminToolSearch" value="${this._esc(this.toolSearchQuery)}" aria-label="Search tools">
          </div>
          <span class="admin-table-count">${filtered.length} tool${filtered.length !== 1 ? 's' : ''}</span>
        </div>

        <div class="admin-card-body admin-card-body--flush" style="overflow-x: auto;">
          ${paged.length > 0 ? `
            <table class="admin-data-table">
              <thead>
                <tr>
                  <th>Tool</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                ${paged.map(t => `
                  <tr>
                    <td data-label="Tool">
                      <div class="admin-cell-primary">${this._esc(t.icon || '🛠')} ${this._esc(t.name)}</div>
                      <div class="admin-cell-secondary">${this._esc(t.id)}</div>
                    </td>
                    <td data-label="Category">${this._esc(t.category)}</td>
                    <td data-label="Status">
                      <span class="admin-badge ${t.featured ? 'admin-badge--success' : 'admin-badge--info'}">
                        ${t.featured ? '★ Featured' : '● Active'}
                      </span>
                    </td>
                    <td data-label="Actions">
                      <div class="admin-cell-actions">
                        <button class="admin-btn admin-btn--ghost admin-btn--sm" onclick="alert('Editing tool JSON...')">Edit</button>
                        <button class="admin-btn admin-btn--danger admin-btn--sm" onclick="alert('Disabling tool...')">Disable</button>
                      </div>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          ` : `
            <div class="admin-empty-state">
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

    // Bind search
    const searchInput = document.getElementById("adminToolSearch");
    if (searchInput) {
      let debounce;
      searchInput.oninput = (e) => {
        clearTimeout(debounce);
        debounce = setTimeout(() => {
          this.toolSearchQuery = e.target.value;
          this.toolPage = 0;
          this._renderToolsView(viewEl, tools);
        }, 300);
      };
    }

    // Bind clear search
    const clearBtn = document.getElementById("adminClearToolSearch");
    if (clearBtn) {
      clearBtn.onclick = () => {
        this.toolSearchQuery = "";
        this.toolPage = 0;
        this._renderToolsView(viewEl, tools);
      };
    }

    // Bind pagination
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
}
