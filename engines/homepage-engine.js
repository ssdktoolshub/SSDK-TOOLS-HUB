// SSDK Homepage Engine - Dynamically renders category blocks, tool grids, binds searches, and manages filters.
// Integrates metadata configurations from settings, featured, and popular databases.

export class HomepageEngine {
  constructor() {
    this.core = null;
    this.container = null;
    this.activeFilter = "all";
    this.selectedSuggestionIndex = -1;
  }

  async init(core) {
    this.core = core;
    
    // Bind after DOM renders
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.mount());
    } else {
      this.mount();
    }
  }

  async mount() {
    this.container = document.getElementById("toolContainer");
    if (!this.container) return; // Exit if not on landing index page

    // Dynamic hero text injection from homepage.json
    await this.applyHomepageMetadata();

    // 1. Inject Premium Search & Suggestions structure
    await this.injectSearchUI();

    // 2. Inject Sticky Categories Bar & Popular Categories
    this.renderFilterBar();
    await this.renderPopularCategories();
    
    // 4. Initial Render
    await this.render();

    // 5. Bind Search events & Voice recognition
    this.bindSearch();
    this.initCategoryRedirectionScrolls();
    this.initScrollReveal();
    this.initStatsObserver();
    this.initFAQAccordion();

    // Curated Collections card filter triggers
    document.querySelectorAll(".collection-card").forEach(card => {
      card.onclick = (e) => {
        e.preventDefault();
        const filter = card.getAttribute("data-filter");
        let catName = "all";
        if (filter === "developer") catName = "Developer Tools";
        else if (filter === "image") catName = "Image Tools";
        else if (filter === "medical") catName = "Medical & Laboratory Tools";
        this.filterByCategory(catName);
        
        // Scroll to tools container
        const toolsSec = document.getElementById("tools");
        if (toolsSec) {
          toolsSec.scrollIntoView({ behavior: "smooth" });
        }
      };
    });

    // Global Event Delegation for dynamic cards (O(1) memory)
    this.container.addEventListener("click", async (e) => {
      // Handle subcategory collapse toggle
      const subTitle = e.target.closest(".subcat-title");
      if (subTitle) {
        const block = subTitle.closest(".subcat-block");
        if (block) block.classList.toggle("collapsed");
        return;
      }
      
      // Handle favorite star toggle
      const favBtn = e.target.closest(".fav-btn");
      if (favBtn) {
        e.preventDefault();
        e.stopPropagation();
        const id = favBtn.getAttribute("data-id");
        const config = this.core.getEngine("config");
        const favorites = this.core.getEngine("favorites");
        
        if (favorites && config) {
          const tools = await config.getTools();
          const targetTool = tools.find(x => x.id === id);
          if (targetTool) {
            await favorites.toggleFavorite(targetTool);
            favBtn.classList.toggle("on", favorites.isFavorite(id));
            if (window.updateFavoritesBadge) window.updateFavoritesBadge();
          }
        }
      }
    });

    // Listen to language change to re-translate homepage elements
    window.addEventListener("ssdk-lang-change", () => {
      this.render();
    });

    // Check if URL hash is #favorites on load
    if (window.location.hash === "#favorites") {
      const favBtn = document.getElementById("filterFavBtn");
      if (favBtn) favBtn.click();
    }
  }

  async applyHomepageMetadata() {
    const config = this.core.getEngine("config");
    const meta = await config.loadJSON("home.json", true);
    if (meta) {
      const heroBadge = document.querySelector(".hero-badge");
      const heroTitle = document.querySelector(".hero h1.text-3d");
      const heroSub = document.querySelector(".hero p.subtitle");
      if (heroBadge && meta.heroBadge) {
        heroBadge.textContent = meta.heroBadge;
      }
      if (heroTitle && meta.heroTitle) {
        heroTitle.textContent = meta.heroTitle;
      }
      if (heroSub && meta.heroSub) {
        heroSub.textContent = meta.heroSub;
      }
    }
  }

  async injectSearchUI() {
    const suggestionsPanel = document.getElementById("searchSuggestions");
    if (suggestionsPanel && !suggestionsPanel.innerHTML.trim()) {
      suggestionsPanel.innerHTML = `
        <div id="suggestionsSection" style="display:none">
          <div class="suggestion-group-title" data-translate="suggestTitle">Suggestions</div>
          <div class="suggestion-list" id="autocompleteSuggestions"></div>
        </div>
        <div class="suggestion-group-title" data-translate="recentTitle">Recent Searches</div>
        <div class="tags-container" id="recentSearches"></div>
      `;
    }

    // Populate searchCategorySelect with all registry categories
    const categorySelect = document.getElementById("searchCategorySelect");
    const config = this.core ? this.core.getEngine("config") : null;
    if (categorySelect && config) {
      try {
        const categories = await config.getCategories();
        if (Array.isArray(categories) && categories.length > 0) {
          const currentVal = categorySelect.value || "all";
          categorySelect.innerHTML = `<option value="all">All Categories</option>` +
            categories.map(c => `<option value="${c.name}">${c.emoji ? c.emoji + ' ' : ''}${c.name}</option>`).join('');
          categorySelect.value = currentVal;
        }
      } catch (err) {
        console.warn("[HomepageEngine] Could not populate category dropdown:", err);
      }
    }
  }

  renderFilterBar() {
    const toolsSec = document.getElementById("tools");
    if (!toolsSec) return;

    if (document.getElementById("homepageFilterBar")) return;

    const filterBar = document.createElement("div");
    filterBar.className = "filter-bar";
    filterBar.id = "homepageFilterBar";

    filterBar.innerHTML = `
      <div class="filter-group">
        <span class="filter-label" data-translate="sortLabel">Sort:</span>
        <select class="filter-select" id="sortSelect">
          <option value="alphabetical">Alphabetical (A-Z)</option>
          <option value="reverse">Alphabetical (Z-A)</option>
          <option value="newest">Newest Tools</option>
          <option value="popular">Most Popular</option>
          <option value="trending">Trending Tools</option>
        </select>
      </div>

      <div class="filter-btn-group">
        <button class="filter-btn active" id="filterAllBtn" data-translate="filterAll">All Tools</button>
        <button class="filter-btn" id="filterFavBtn" data-translate="filterFav">⭐ Favorites</button>
        <button class="filter-btn" id="filterRecentBtn" data-translate="filterRecent">🕒 Recently Used</button>
      </div>
    `;

    const stickyBar = document.getElementById("stickyCatsBar");
    if (stickyBar) {
      stickyBar.after(filterBar);
    } else {
      toolsSec.insertBefore(filterBar, toolsSec.firstChild);
    }

    // Bind filters
    const allBtn = filterBar.querySelector("#filterAllBtn");
    const favBtn = filterBar.querySelector("#filterFavBtn");
    const recentBtn = filterBar.querySelector("#filterRecentBtn");
    const sortSelect = filterBar.querySelector("#sortSelect");

    const clearActive = () => {
      allBtn.classList.remove("active");
      favBtn.classList.remove("active");
      recentBtn.classList.remove("active");
    };

    allBtn.onclick = () => {
      clearActive();
      allBtn.classList.add("active");
      this.activeFilter = "all";
      this.render();
    };

    favBtn.onclick = () => {
      clearActive();
      favBtn.classList.add("active");
      this.activeFilter = "favorites";
      this.render();
    };

    recentBtn.onclick = () => {
      clearActive();
      recentBtn.classList.add("active");
      this.activeFilter = "recents";
      this.render();
    };

    sortSelect.onchange = () => {
      this.render();
    };
  }

  /**
   * Builds the category rows and child cards.
   */
  async render(filterQuery = "") {
    const config = this.core.getEngine("config");
    const search = this.core.getEngine("search");
    const favorites = this.core.getEngine("favorites");

    const categories = await config.getCategories();
    let toolsList = [];

    // Category Context Search Filter
    const categorySelect = document.getElementById("searchCategorySelect");
    const selectedCategory = categorySelect ? categorySelect.value : "all";

    if (filterQuery.trim()) {
      toolsList = await search.search(filterQuery, { category: selectedCategory === "all" ? undefined : selectedCategory });
    } else {
      toolsList = await config.getTools();
      if (selectedCategory !== "all") {
        toolsList = toolsList.filter(t => t.category === selectedCategory);
      }
    }

    this.container.innerHTML = "";

    // 1. Filter toolsList based on active button
    if (this.activeFilter === "favorites") {
      toolsList = toolsList.filter(t => favorites && favorites.isFavorite(t.id));
    } else if (this.activeFilter === "recents") {
      let recents = [];
      try {
        recents = JSON.parse(localStorage.getItem("ssdk-tool-history") || "[]");
      } catch (e) {
        console.warn("History parse failed", e);
      }
      toolsList = toolsList.filter(t => recents.some(r => r.id === t.id));
    }

    // 3. Sort toolsList
    const sortSelect = document.getElementById("sortSelect");
    const sortBy = sortSelect ? sortSelect.value : "alphabetical";

    if (sortBy === "alphabetical") {
      toolsList.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "reverse") {
      toolsList.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === "newest") {
      toolsList.sort((a, b) => new Date(b.addedDate || 0) - new Date(a.addedDate || 0));
    } else if (sortBy === "popular") {
      toolsList.sort((a, b) => {
        const aScore = a.featured ? 100 : (a.name.charCodeAt(0) % 50);
        const bScore = b.featured ? 100 : (b.name.charCodeAt(0) % 50);
        return bScore - aScore;
      });
    } else if (sortBy === "trending") {
      toolsList.sort((a, b) => {
        const aScore = (a.name.charCodeAt(a.name.length - 1) || 0) % 100;
        const bScore = (b.name.charCodeAt(b.name.length - 1) || 0) % 100;
        return bScore - aScore;
      });
    }

    // Category View details rendering
    const categoryViewContainer = document.getElementById("categoryViewContainer");
    const exploreTitle = document.getElementById("exploreCategoriesTitle");
    const exploreSub = document.getElementById("exploreCategoriesSubtitle");
    const relatedSec = document.getElementById("relatedCategoriesSection");
    
    if (selectedCategory !== "all") {
      // Hide explore titles
      if (exploreTitle) exploreTitle.style.display = "none";
      if (exploreSub) exploreSub.style.display = "none";
      
      const categoryDetails = categories.find(c => c.name === selectedCategory || c.id === selectedCategory);
      if (categoryViewContainer && categoryDetails) {
        categoryViewContainer.style.display = "block";
        document.getElementById("categoryBreadcrumbActive").textContent = categoryDetails.name;
        document.getElementById("categoryHeroIcon").textContent = categoryDetails.emoji;
        document.getElementById("categoryHeroName").textContent = categoryDetails.name;
        document.getElementById("categoryHeroDesc").textContent = categoryDetails.description;
        document.getElementById("categoryHeroCount").textContent = `${toolsList.length} Tools`;
        
        // Bind explore tools button
        const exploreBtn = document.getElementById("categoryHeroCTA");
        if (exploreBtn) {
          exploreBtn.onclick = () => {
            const grid = document.querySelector("#toolContainer");
            if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });
          };
        }
        
        // Bind category home breadcrumb
        const homeBreadcrumb = document.getElementById("categoryHomeBreadcrumb");
        if (homeBreadcrumb) {
          homeBreadcrumb.onclick = (e) => {
            e.preventDefault();
            this.filterByCategory("all");
          };
        }

        // Bind Category Search bar in Category Hero Toolbar
        const catSearch = document.getElementById("categorySearchInput");
        if (catSearch) {
          catSearch.placeholder = `Search in ${categoryDetails.name}...`;
          if (!catSearch.dataset.bound) {
            catSearch.dataset.bound = "true";
            catSearch.oninput = () => {
              this.render(catSearch.value);
            };
          }
        }
        
        // Sort inside Category select
        const catSortSelect = document.getElementById("categorySortSelect");
        if (catSortSelect) {
          if (!catSortSelect.dataset.bound) {
            catSortSelect.dataset.bound = "true";
            catSortSelect.onchange = () => {
              this.render();
            };
          }
          const catSortVal = catSortSelect.value;
          if (catSortVal === "name") {
            toolsList.sort((a, b) => a.name.localeCompare(b.name));
          } else if (catSortVal === "new") {
            toolsList.sort((a, b) => new Date(b.addedDate || 0) - new Date(a.addedDate || 0));
          } else if (catSortVal === "popular") {
            toolsList.sort((a, b) => {
              const aScore = a.featured ? 100 : (a.name.charCodeAt(0) % 50);
              const bScore = b.featured ? 100 : (b.name.charCodeAt(0) % 50);
              return bScore - aScore;
            });
          }
        }

        // View Mode Grid/List bindings
        if (!this.viewMode) this.viewMode = localStorage.getItem("ssdk-view-mode") || "grid";
        const gridBtn = document.getElementById("viewToggleGrid");
        const listBtn = document.getElementById("viewToggleList");
        if (gridBtn && listBtn) {
          gridBtn.classList.toggle("active", this.viewMode === "grid");
          listBtn.classList.toggle("active", this.viewMode === "list");
          
          if (!gridBtn.dataset.bound) {
            gridBtn.dataset.bound = "true";
            gridBtn.onclick = () => {
              this.viewMode = "grid";
              localStorage.setItem("ssdk-view-mode", "grid");
              this.render();
            };
          }
          if (!listBtn.dataset.bound) {
            listBtn.dataset.bound = "true";
            listBtn.onclick = () => {
              this.viewMode = "list";
              localStorage.setItem("ssdk-view-mode", "list");
              this.render();
            };
          }
        }

        // Render related categories list
        this.renderRelatedCategories(categoryDetails.name, categories);
      }
    } else {
      // Reset view states
      if (categoryViewContainer) categoryViewContainer.style.display = "none";
      if (exploreTitle) exploreTitle.style.display = "block";
      if (exploreSub) exploreSub.style.display = "block";
      if (relatedSec) relatedSec.style.display = "none";
    }

    // 4. Render Recently Used section at the top (if no query and in 'All' or 'Recents' filters)
    if (!filterQuery.trim() && this.activeFilter !== "favorites") {
      let recents = [];
      try {
        recents = JSON.parse(localStorage.getItem("ssdk-tool-history") || "[]");
      } catch (e) {
        console.warn("History parse failed", e);
      }
      if (recents.length > 0) {
        this.renderRecentsSection(recents);
      }
    }

    // 5. Render Redesigned Discovery Sections
    if (!filterQuery.trim() && this.activeFilter === "all" && selectedCategory === "all") {
      const featuredSec = document.getElementById("featuredSection");
      const trendingSec = document.getElementById("trendingSection");
      const newSec = document.getElementById("newSection");
      const collectionsSec = document.getElementById("collectionsSection");
      
      if (collectionsSec) collectionsSec.style.display = "block";

      const featuredTools = toolsList.filter(t => t.featured === true);
      if (featuredTools.length > 0 && featuredSec) {
        featuredSec.style.display = "block";
        this.renderToolCardsGrid("featuredToolsGrid", featuredTools.slice(0, 3), favorites);
      } else if (featuredSec) {
        featuredSec.style.display = "none";
      }

      // Sort popular/trending
      const popularTools = [...toolsList];
      popularTools.sort((a, b) => {
        const aScore = a.featured ? 100 : (a.name.charCodeAt(0) % 50);
        const bScore = b.featured ? 100 : (b.name.charCodeAt(0) % 50);
        return bScore - aScore;
      });
      if (trendingSec) {
        trendingSec.style.display = "block";
        this.renderToolCardsGrid("trendingToolsGrid", popularTools.slice(0, 8), favorites);
      }

      // Sort newest tools
      const newestTools = [...toolsList];
      newestTools.sort((a, b) => new Date(b.addedDate || 0) - new Date(a.addedDate || 0));
      if (newSec) {
        newSec.style.display = "block";
        this.renderToolCardsGrid("newToolsGrid", newestTools.slice(0, 4), favorites);
      }
    } else {
      // Hide sections when searching or filtering
      const featuredSec = document.getElementById("featuredSection");
      const trendingSec = document.getElementById("trendingSection");
      const newSec = document.getElementById("newSection");
      const collectionsSec = document.getElementById("collectionsSection");
      if (featuredSec) featuredSec.style.display = "none";
      if (trendingSec) trendingSec.style.display = "none";
      if (newSec) newSec.style.display = "none";
      if (collectionsSec) collectionsSec.style.display = "none";
    }

    // 6. Render standard categories
    let found = false;
    categories.sort((a, b) => a.order - b.order);

    if (selectedCategory !== "all") {
      found = toolsList.length > 0;
      if (found) {
        const block = document.createElement("div");
        block.className = "cat-block open";
        
        let bodyHTML = "";
        if (this.viewMode === "list") {
          bodyHTML = `<div class="list-container" style="display:flex; flex-direction:column; gap:var(--space-12); width:100%;">
            ${toolsList.map(t => {
              const isFav = favorites ? favorites.isFavorite(t.id) : false;
              const favClass = isFav ? "fav-btn on" : "fav-btn";
              const highlightedName = this.highlightMatch(this.translate(t.name), filterQuery);
              const highlightedDesc = this.highlightMatch(this.translate(t.description), filterQuery);
              return `
                <a class="card-list-view" href="${this.core.prefix}/${t.url}" target="_blank">
                  <div class="card-list-left">
                    <span class="icon" style="font-size:2rem; flex-shrink:0;">${t.icon}</span>
                    <div class="card-list-text" style="display:flex; flex-direction:column; gap:4px; text-align:left;">
                      <h3 style="margin:0; font-size:var(--font-size-card-heading); font-weight:var(--font-weight-semibold); color:var(--color-foreground);">${highlightedName}</h3>
                      <p style="margin:0; font-size:var(--font-size-small); color:var(--color-muted);">${highlightedDesc}</p>
                    </div>
                  </div>
                  <div class="card-list-right" style="display:flex; align-items:center; gap:var(--space-16); flex-shrink:0;">
                    <button class="${favClass}" data-id="${t.id}" title="Toggle Favorite" style="background:transparent; border:none; color:var(--color-muted); font-size:1.2rem; cursor:pointer;">★</button>
                    <span class="badge badge-free">${t.category}</span>
                    <span class="btn ghost" style="padding:6px 12px; font-size:var(--font-size-small);">Open Tool →</span>
                  </div>
                </a>
              `;
            }).join("")}
          </div>`;
        } else {
          bodyHTML = `<div class="saas-grid saas-grid-sm-2 saas-grid-md-3 saas-grid-lg-4" style="width:100%;">
            ${toolsList.map(t => {
              const isFav = favorites ? favorites.isFavorite(t.id) : false;
              const favClass = isFav ? "fav-btn on" : "fav-btn";
              const isFeatured = t.featured ? "card-featured" : "card-default";
              const highlightedName = this.highlightMatch(this.translate(t.name), filterQuery);
              const highlightedDesc = this.highlightMatch(this.translate(t.description), filterQuery);
              return `
                <a class="card card-interactive ${isFeatured} card-tool show" href="${this.core.prefix}/${t.url}" target="_blank">
                  <div style="display:flex; justify-content:space-between; align-items:flex-start; width:100%;">
                    <span class="icon" style="font-size:1.8rem; margin-bottom:12px;">${t.icon}</span>
                    <button class="${favClass}" data-id="${t.id}" title="Toggle Favorite">★</button>
                  </div>
                  <h3 class="card-heading mb-8">${highlightedName}</h3>
                  <p class="small-text text-muted mb-20" style="min-height:40px;">${highlightedDesc}</p>
                  <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
                    <span class="micro-text badge badge-free">${t.category}</span>
                    <span class="arrow-link" style="font-weight:700; color:var(--color-primary);">Open →</span>
                  </div>
                </a>
              `;
            }).join("")}
          </div>`;
        }
        
        block.innerHTML = `<div class="cat-body" style="padding:0;">${bodyHTML}</div>`;
        
        block.querySelectorAll(".fav-btn").forEach(btn => {
          btn.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = btn.getAttribute("data-id");
            const targetTool = toolsList.find(x => x.id === id);
            if (favorites && targetTool) {
              await favorites.toggleFavorite(targetTool);
              btn.classList.toggle("on", favorites.isFavorite(id));
              if (window.updateFavoritesBadge) window.updateFavoritesBadge();
            }
          };
        });

        this.container.appendChild(block);
      }
    } else {
      categories.forEach(cat => {
        // Group tools under their normalized category properties
        const catTools = toolsList.filter(t => {
          const tCat = t.category.replace(/[^a-zA-Z]/g, "").toLowerCase();
          const cName = cat.name.replace(/[^a-zA-Z]/g, "").toLowerCase();
          return tCat === cName;
        });

        if (catTools.length > 0) {
          found = true;
          const block = document.createElement("div");
          block.className = filterQuery.trim() ? "cat-block open" : "cat-block";
          block.setAttribute("data-cat", cat.name);
        
        // Subcategory Grouping Logic
        const subcatGroups = {};
        const standaloneTools = [];

        catTools.forEach(t => {
          if (t.subcategory) {
            if (!subcatGroups[t.subcategory]) subcatGroups[t.subcategory] = [];
            subcatGroups[t.subcategory].push(t);
          } else {
            standaloneTools.push(t);
          }
        });

        const renderCards = (tools) => {
          return tools.map(t => {
            const isFav = favorites ? favorites.isFavorite(t.id) : false;
            const favClass = isFav ? "fav-btn on" : "fav-btn";
            const highlightedName = this.highlightMatch(this.translate(t.name), filterQuery);
            const highlightedDesc = this.highlightMatch(this.translate(t.description), filterQuery);
            
            return `
              <a class="card show" href="${this.core.prefix}/${t.url}" target="_blank">
                <button class="${favClass}" data-id="${t.id}" title="Toggle Favorite">★</button>
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                  <span class="icon">${t.icon}</span>
                  <h3>${highlightedName}</h3>
                </div>
                <p>${highlightedDesc}</p>
              </a>
            `;
          }).join("");
        };

        block.innerHTML = `
          <div class="cat-head">
            <span class="left">${cat.emoji} ${this.translate(cat.name)} <span class="cnt">${catTools.length} ${this.translate("tools")}</span></span>
            <span class="arrow">▾</span>
          </div>
          <div class="cat-body"></div>
        `;

        const head = block.querySelector(".cat-head");
        const body = block.querySelector(".cat-body");
        let isRendered = false;

        const injectDOM = () => {
          if (isRendered) return;

          let catBodyHTML = "";
          if (standaloneTools.length > 0) {
            catBodyHTML += `<div class="grid">${renderCards(standaloneTools)}</div>`;
          }

          const subcatNames = Object.keys(subcatGroups).sort();
          subcatNames.forEach(subName => {
            catBodyHTML += `
              <div class="subcat-block">
                <h4 class="subcat-title">${this.translate(subName)}</h4>
                <div class="grid">${renderCards(subcatGroups[subName])}</div>
              </div>
            `;
          });

          body.innerHTML = catBodyHTML;
          isRendered = true;

          // Translate injected nodes immediately if necessary
          const activeLang = localStorage.getItem("ssdk-lang") || "en";
          if (window.ssdkTranslate) {
            window.ssdkTranslate(activeLang, body);
          }
        };

        const removeDOM = () => {
          body.innerHTML = "";
          isRendered = false;
        };

        head.onclick = () => {
          block.classList.toggle("open");
          if (block.classList.contains("open")) {
            injectDOM();
          } else {
            removeDOM();
          }
        };

        if (filterQuery.trim()) {
          injectDOM();
        }

        this.container.appendChild(block);
      }
    });
    }

    const noResult = document.getElementById("noResult");
    if (noResult) {
      noResult.style.display = found ? "none" : "block";
      if (!found) {
        const query = filterQuery.trim();
        search.getTypoSuggestions(query).then(typoSuggestions => {
          let typoHTML = "";
          if (typoSuggestions.length > 0) {
            typoHTML = `
              <div class="typo-suggestions" style="margin-top:15px; font-size:0.95rem; color:var(--color-foreground);">
                <span>Did you mean:</span>
                ${typoSuggestions.map(s => `<button class="tag-btn typo-suggestion-btn" style="margin-left:8px; background:var(--color-surface); border:1px solid var(--color-border); border-radius:15px; padding:4px 12px; color:var(--color-primary); cursor:pointer; font-weight:600;">${s}</button>`).join("")}
              </div>
            `;
          }
          
          noResult.innerHTML = `
            <div class="empty-state">
              <div class="empty-state-icon">🔍</div>
              <div class="empty-state-title">No tools found ${query ? `for "${this.escapeHTML(query)}"` : ''}</div>
              <div class="empty-state-desc">Try checking your spelling, using different keywords, or browse all categories below.</div>
              <button class="btn btn-primary" id="emptyStateBrowseBtn">Browse Categories</button>
              ${typoHTML}
            </div>
          `;

          // Bind browse button
          const browseBtn = noResult.querySelector("#emptyStateBrowseBtn");
          if (browseBtn) {
            browseBtn.onclick = () => {
              if (categorySelect) {
                categorySelect.value = "all";
                categorySelect.dispatchEvent(new Event("change"));
              }
              const toolsSec = document.getElementById("tools");
              if (toolsSec) {
                toolsSec.scrollIntoView({ behavior: "smooth", block: "start" });
              }
            };
          }

          // Bind fallback buttons action
          noResult.querySelectorAll(".typo-suggestion-btn").forEach(btn => {
            btn.onclick = () => {
              const val = btn.textContent;
              const searchBar = document.getElementById("search");
              if (searchBar) {
                searchBar.value = val;
                searchBar.dispatchEvent(new Event("input"));
              }
            };
          });
        });
      }
    }

    // Apply translation to all currently rendered elements
    const activeLang = localStorage.getItem("ssdk-lang") || "en";
    if (window.ssdkTranslate) {
      window.ssdkTranslate(activeLang);
    }
  }

  renderRecentsSection(recents) {
    const activeLang = localStorage.getItem("ssdk-lang") || "en";
    const translations = window.ssdkTranslations || {
      en: { recentsTitle: "🕒 Recently Visited Tools", clearHistory: "Clear History" }
    };
    const langDict = translations[activeLang] || translations["en"] || {
      recentsTitle: "🕒 Recently Visited Tools",
      clearHistory: "Clear History"
    };
    const titleText = langDict.recentsTitle;
    const clearText = langDict.clearHistory;

    const block = document.createElement("div");
    block.className = "recents-section";
    
    block.innerHTML = `
      <div class="recents-title-row">
        <h3>${titleText}</h3>
        <button class="clear-recents-btn" id="clearHistoryBtn">${clearText}</button>
      </div>
      <div class="grid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 20px;">
        ${recents.slice(0, 4).map(t => `
          <a class="card show" href="${this.core.prefix}/${t.url}" target="_blank">
            <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
              <span class="icon">${t.icon}</span>
              <h3>${t.name}</h3>
            </div>
            <p>${t.description ? t.description.substring(0, 60) + "..." : "Visited recently"}</p>
          </a>
        `).join("")}
      </div>
    `;

    block.querySelector("#clearHistoryBtn").onclick = () => {
      localStorage.removeItem("ssdk-tool-history");
      this.render();
    };

    this.container.appendChild(block);
  }

  renderSpecialSection(title, tools, favorites, isOpen = true) {
    const block = document.createElement("div");
    block.className = isOpen ? "cat-block open" : "cat-block";
    block.style.border = "1px solid var(--accent)";
    
    const cardsHTML = tools.map(t => {
      const isFav = favorites ? favorites.isFavorite(t.id) : false;
      const favClass = isFav ? "fav-btn on" : "fav-btn";
      
      return `
        <a class="card show" href="${this.core.prefix}/${t.url}" target="_blank" style="background: var(--card2)">
          <button class="${favClass}" data-id="${t.id}" title="Toggle Favorite">★</button>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <span class="icon">${t.icon}</span>
            <h3>${this.translate(t.name)}</h3>
          </div>
          <p>${this.translate(t.description)}</p>
        </a>
      `;
    }).join("");

    block.innerHTML = `
      <div class="cat-head" style="background: var(--card2)">
        <span class="left">${this.translate(title)}</span>
        <span class="arrow">▾</span>
      </div>
      <div class="cat-body">
        <div class="grid">${cardsHTML}</div>
      </div>
    `;

    const head = block.querySelector(".cat-head");
    head.onclick = () => {
      block.classList.toggle("open");
    };

    block.querySelectorAll(".fav-btn").forEach(btn => {
      btn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        const targetTool = tools.find(x => x.id === id);
        if (favorites) {
          await favorites.toggleFavorite(targetTool);
          btn.classList.toggle("on", favorites.isFavorite(id));
          if (window.updateFavoritesBadge) window.updateFavoritesBadge();
        }
      };
    });

    this.container.appendChild(block);
  }

  bindSearch() {
    const searchBar = document.getElementById("search");
    const suggestionsPanel = document.getElementById("searchSuggestions");
    const suggestionsList = document.getElementById("autocompleteSuggestions");
    const suggestionsSec = document.getElementById("suggestionsSection");
    const recentsContainer = document.getElementById("recentSearches");
    const voiceBtn = document.getElementById("voiceSearchBtn");

    if (!searchBar) return;

    const searchEngine = this.core.getEngine("search");

    // Populate Popular Searches and bind tags click
    document.querySelectorAll(".pop-search-tag").forEach(btn => {
      btn.onclick = () => {
        searchBar.value = btn.textContent;
        this.render(btn.textContent);
        suggestionsPanel.classList.remove("active");
        
        const toolsSec = document.getElementById("tools");
        if (toolsSec) {
          toolsSec.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };
    });

    const updateRecentSearchesUI = () => {
      const recentsList = document.getElementById("recentSearches");
      if (!recentsList || !searchEngine) return;
      const recents = searchEngine.getRecentSearches();
      if (recents.length > 0) {
        recentsList.innerHTML = recents.map(r => `<button class="tag-btn">${r}</button>`).join("");
        recentsList.querySelectorAll(".tag-btn").forEach(btn => {
          btn.onclick = () => {
            searchBar.value = btn.textContent;
            this.render(btn.textContent);
            suggestionsPanel.classList.remove("active");
          };
        });
      } else {
        recentsList.innerHTML = `<span style="font-size:0.8rem;color:var(--color-muted)">No recent searches.</span>`;
      }
    };

    // Category Select Dropdown change handler
    const categorySelect = document.getElementById("searchCategorySelect");
    if (categorySelect) {
      categorySelect.onchange = (e) => {
        const cat = e.target.value;
        if (cat === "all") {
          searchBar.placeholder = "Search 100+ tools... (Press '/' to focus)";
        } else {
          searchBar.placeholder = `Search in ${cat}...`;
        }
        this.render(searchBar.value);
      };
    }

    // Search bar submit button
    const searchBarSubmit = document.getElementById("searchBarSubmit");
    if (searchBarSubmit) {
      searchBarSubmit.onclick = () => {
        this.render(searchBar.value);
        suggestionsPanel.classList.remove("active");
        const toolsSec = document.getElementById("tools");
        if (toolsSec) {
          toolsSec.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      };
    }

    // Show suggestions panel on focus
    searchBar.addEventListener("focus", () => {
      updateRecentSearchesUI();
      suggestionsPanel.classList.add("active");
    });

    // Hide suggestions panel on click outside
    document.addEventListener("click", (e) => {
      if (!searchBar.contains(e.target) && !suggestionsPanel.contains(e.target) && !e.target.closest(".pop-search-tag")) {
        suggestionsPanel.classList.remove("active");
      }
    });

    searchBar.addEventListener("input", async (e) => {
      const val = e.target.value;
      this.render(val);
      this.selectedSuggestionIndex = -1;
      
      const suggestionsSec = document.getElementById("suggestionsSection");
      const suggestionsList = document.getElementById("autocompleteSuggestions");
      if (searchEngine && val.trim().length > 1 && suggestionsSec && suggestionsList) {
        const suggs = await searchEngine.getSuggestions(val);
        if (suggs.length > 0) {
          suggestionsSec.style.display = "block";
          suggestionsList.innerHTML = suggs.map((s, idx) => `
            <div class="suggestion-item" data-index="${idx}">
              <span>🔍 ${s}</span>
            </div>
          `).join("");
          
          suggestionsList.querySelectorAll(".suggestion-item").forEach(item => {
            item.onclick = () => {
              const text = item.textContent.replace("🔍", "").trim();
              searchBar.value = text;
              this.render(text);
              searchEngine.addRecentSearch(text);
              suggestionsPanel.classList.remove("active");
            };
          });
        } else {
          suggestionsSec.style.display = "none";
        }
      } else if (suggestionsSec) {
        suggestionsSec.style.display = "none";
      }
    });

    // Keyboard Navigation for Suggestions
    searchBar.addEventListener("keydown", (e) => {
      const suggestionsList = document.getElementById("autocompleteSuggestions");
      const items = suggestionsList ? suggestionsList.querySelectorAll(".suggestion-item") : [];
      if (items.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        this.selectedSuggestionIndex = (this.selectedSuggestionIndex + 1) % items.length;
        this.highlightSuggestion(items);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        this.selectedSuggestionIndex = (this.selectedSuggestionIndex - 1 + items.length) % items.length;
        this.highlightSuggestion(items);
      } else if (e.key === "Enter") {
        if (this.selectedSuggestionIndex >= 0 && this.selectedSuggestionIndex < items.length) {
          e.preventDefault();
          const selectedText = items[this.selectedSuggestionIndex].textContent.replace("🔍", "").trim();
          searchBar.value = selectedText;
          this.render(selectedText);
          if (searchEngine) searchEngine.addRecentSearch(selectedText);
          suggestionsPanel.classList.remove("active");
        } else {
          // Normal enter pushes search history
          if (searchEngine && searchBar.value.trim().length > 1) {
            searchEngine.addRecentSearch(searchBar.value);
          }
          suggestionsPanel.classList.remove("active");
        }
      }
    });

    // Bind global header search button trigger to focus search bar
    const globalSearchBtn = document.getElementById("globalSearchBtn");
    if (globalSearchBtn) {
      globalSearchBtn.onclick = (e) => {
        e.preventDefault();
        searchBar.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          searchBar.focus();
          searchBar.select();
        }, 300);
      };
    }

    // Global keyboard listener for '/' focus and 'Esc' blur
    document.addEventListener("keydown", (e) => {
      const isSearchKey = (e.key === "/") || (e.ctrlKey && e.key === "k");
      if (isSearchKey && document.activeElement !== searchBar && 
          document.activeElement.tagName !== "INPUT" && 
          document.activeElement.tagName !== "TEXTAREA") {
        e.preventDefault();
        searchBar.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(() => {
          searchBar.focus();
          searchBar.select();
        }, 100);
      }
      if (e.key === "Escape") {
        suggestionsPanel.classList.remove("active");
        searchBar.blur();
      }
    });
  }

  async renderPopularCategories() {
    const grid = document.getElementById("popularCategoriesGrid");
    if (!grid) return;
    
    const config = this.core.getEngine("config");
    if (!config) return;
    
    const tools = await config.getTools();
    const categories = await config.loadJSON("categories.json", false) || [];
    
    // Count tools per category id
    const toolCounts = {};
    tools.forEach(t => {
      const matchedCat = categories.find(c => c.name === t.category);
      const catId = matchedCat ? matchedCat.id : t.category;
      toolCounts[catId] = (toolCounts[catId] || 0) + 1;
    });

    const popularIds = ["image-tools", "pdf-tools", "developer-tools", "ai-tools", "text-tools", "medical-tools", "unit-converters", "security-tools"];
    let popularCats = categories.filter(c => popularIds.includes(c.id));
    if (popularCats.length === 0 && categories.length > 0) {
      popularCats = categories.slice(0, 8);
    }

    grid.innerHTML = popularCats.map(cat => {
      const count = toolCounts[cat.id] || 0;
      return `
        <div class="card card-interactive card-category" data-cat="${cat.name}">
          <div style="font-size:2rem; margin-bottom:12px; transition: transform var(--transition-normal); display:inline-block;" class="cat-icon">${cat.emoji}</div>
          <h3 class="card-heading mb-8">${cat.name}</h3>
          <p class="small-text text-muted mb-16" style="min-height: 40px;">${cat.description}</p>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span class="micro-text badge badge-free">${count} Tools</span>
            <span class="arrow-link" style="font-weight:700; color:var(--color-primary); transition:transform var(--transition-normal);">Explore →</span>
          </div>
        </div>
      `;
    }).join("");

    grid.querySelectorAll(".card-category").forEach(card => {
      card.onclick = (e) => {
        e.preventDefault();
        const catName = card.getAttribute("data-cat");
        this.filterByCategory(catName);
      };
    });
  }

  filterByCategory(catName) {
    const sel = document.getElementById("searchCategorySelect");
    if (sel) {
      for (let i = 0; i < sel.options.length; i++) {
        if (sel.options[i].value === catName) {
          sel.selectedIndex = i;
          sel.dispatchEvent(new Event("change"));
          break;
        }
      }
    }
    
    const catBlocks = document.querySelectorAll(".cat-block");
    let found = false;
    catBlocks.forEach(b => {
      const dataCat = b.getAttribute("data-cat") || "";
      const head = b.querySelector(".cat-head").textContent.toLowerCase();
      const searchCat = catName.toLowerCase().replace(/[^a-z0-9]/g, "");
      const normHead = head.replace(/[^a-z0-9]/g, "");
      const normDataCat = dataCat.toLowerCase().replace(/[^a-z0-9]/g, "");
      if (normHead.includes(searchCat) || normDataCat.includes(searchCat)) {
        if (!b.classList.contains("open")) {
          const catHead = b.querySelector(".cat-head");
          if (catHead) catHead.click();
        }
        b.scrollIntoView({ behavior: "smooth", block: "start" });
        found = true;
      }
    });

    if (!found) {
      const toolsSec = document.getElementById("tools");
      if (toolsSec) toolsSec.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  highlightSuggestion(items) {
    items.forEach(item => item.classList.remove("selected"));
    if (this.selectedSuggestionIndex >= 0) {
      items[this.selectedSuggestionIndex].classList.add("selected");
      // Scroll into view if needed
      items[this.selectedSuggestionIndex].scrollIntoView({ block: "nearest" });
    }
  }

  initCategoryRedirectionScrolls() {
    const catToOpen = sessionStorage.getItem("ssdk-open-category");
    if (catToOpen) {
      sessionStorage.removeItem("ssdk-open-category");
      setTimeout(() => {
        const blocks = document.querySelectorAll(".cat-block");
        blocks.forEach(b => {
          const head = b.querySelector(".cat-head").textContent.toLowerCase();
          if (head.includes(catToOpen.toLowerCase())) {
            if (!b.classList.contains("open")) {
              const catHead = b.querySelector(".cat-head");
              if (catHead) catHead.click();
            }

            requestAnimationFrame(() => {
                b.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });

            return;
          }
        });
      }, 300);
    }
  }

  highlightMatch(text, query) {
    if (!query || !query.trim()) return text;
    const q = query.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const reg = new RegExp(`(${q})`, 'gi');
    return text.replace(reg, '<mark class="search-highlight" style="background:rgba(168,85,247,0.22);color:var(--accent);border-radius:4px;padding:0 2px;">$1</mark>');
  }

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }

  translate(key) {
    const activeLang = localStorage.getItem("ssdk-lang") || "en";
    const dict = window.ssdkTranslations || {};
    const langDict = dict[activeLang] || {};
    return langDict[key] || key;
  }

  renderToolCardsGrid(containerId, tools, favorites) {
    const grid = document.getElementById(containerId);
    if (!grid) return;
    
    if (!Array.isArray(tools) || tools.length === 0) {
      grid.innerHTML = "";
      const sec = grid.closest(".home-section");
      if (sec) sec.style.display = "none";
      return;
    }

    const sec = grid.closest(".home-section");
    if (sec) sec.style.display = "block";
    
    grid.innerHTML = tools.map(t => {
      const isFav = favorites ? favorites.isFavorite(t.id) : false;
      const favClass = isFav ? "fav-btn on" : "fav-btn";
      const isFeatured = t.featured ? "card-featured" : "card-default";
      
      return `
        <a class="card card-interactive ${isFeatured} card-tool" href="${this.core.prefix}/${t.url}" target="_blank">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; width:100%;">
            <span class="icon" style="font-size:1.8rem; margin-bottom:12px;">${t.icon}</span>
            <button class="${favClass}" data-id="${t.id}" title="Toggle Favorite">★</button>
          </div>
          <h3 class="card-heading mb-8">${this.translate(t.name)}</h3>
          <p class="small-text text-muted mb-20" style="min-height: 40px;">${this.translate(t.description)}</p>
          <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
            <span class="micro-text badge badge-free">${t.category}</span>
            <span class="arrow-link" style="font-weight:700; color:var(--color-primary); transition:transform 0.2s;">Open →</span>
          </div>
        </a>
      `;
    }).join("");

    // Bind favorites toggle
    grid.querySelectorAll(".fav-btn").forEach(btn => {
      btn.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const id = btn.getAttribute("data-id");
        const targetTool = tools.find(x => x.id === id);
        if (favorites && targetTool) {
          await favorites.toggleFavorite(targetTool);
          btn.classList.toggle("on", favorites.isFavorite(id));
          if (window.updateFavoritesBadge) window.updateFavoritesBadge();
        }
      };
    });
  }

  initScrollReveal() {
    const reveals = document.querySelectorAll(".reveal-on-scroll, .home-section");
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => observer.observe(el));
  }

  initStatsObserver() {
    const statsGrid = document.querySelector(".stats-grid");
    if (!statsGrid) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          document.querySelectorAll(".stat-num").forEach(numEl => {
            const target = parseInt(numEl.getAttribute("data-val"));
            let current = 0;
            const updateCounter = () => {
              current += Math.ceil(target / 20);
              if (current >= target) {
                numEl.textContent = target + (numEl.getAttribute("data-val").includes("250") ? "K+" : "");
                if (numEl.getAttribute("data-val").includes("100")) numEl.textContent += "+";
                if (numEl.getAttribute("data-val").includes("99")) numEl.textContent += "%";
              } else {
                numEl.textContent = current;
                setTimeout(updateCounter, 30);
              }
            };
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
              numEl.textContent = target + (numEl.getAttribute("data-val").includes("250") ? "K+" : "");
              if (numEl.getAttribute("data-val").includes("100")) numEl.textContent += "+";
              if (numEl.getAttribute("data-val").includes("99")) numEl.textContent += "%";
            } else {
              updateCounter();
            }
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(statsGrid);
  }

  initFAQAccordion() {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach(item => {
      const q = item.querySelector(".faq-q");
      const a = item.querySelector(".faq-a");
      if (!q || !a) return;

      const toggle = () => {
        const isOpen = item.classList.toggle("open");
        q.setAttribute("aria-expanded", isOpen ? "true" : "false");
        a.style.maxHeight = isOpen ? "200px" : "0";
        a.style.padding = isOpen ? "16px 20px" : "0 20px";
        const plus = q.querySelector(".plus");
        if (plus) plus.textContent = isOpen ? "－" : "＋";
      };

      q.onclick = toggle;
      q.onkeydown = (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      };
    });
  }

  renderRelatedCategories(activeCategoryName, categories) {
    const grid = document.getElementById("relatedCategoriesGrid");
    const sec = document.getElementById("relatedCategoriesSection");
    if (!grid || !sec) return;

    sec.style.display = "block";
    const related = categories.filter(c => c.name !== activeCategoryName).slice(0, 4);
    
    grid.innerHTML = related.map(cat => {
      return `
        <div class="card card-interactive card-category" data-cat="${cat.name}" style="padding: var(--space-20);">
          <div style="font-size:1.8rem; margin-bottom:8px;" class="cat-icon">${cat.emoji}</div>
          <h4 style="margin:0 0 4px; font-size:var(--font-size-small); font-weight:var(--font-weight-semibold);">${cat.name}</h4>
          <span class="arrow-link" style="font-size:var(--font-size-micro); font-weight:700; color:var(--color-primary);">Explore →</span>
        </div>
      `;
    }).join("");

    // Bind click events
    grid.querySelectorAll(".card-category").forEach(card => {
      card.onclick = (e) => {
        e.preventDefault();
        const catName = card.getAttribute("data-cat");
        this.filterByCategory(catName);
      };
    });
  }
}
