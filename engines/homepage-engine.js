// SSDK Homepage Engine - Dynamically renders category blocks, tool grids, and binds searches

export class HomepageEngine {
  constructor() {
    this.core = null;
    this.container = null;
  }

  async init(core) {
    this.core = core;
    
    // Bind after dynamic layouts are active
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.mount());
    } else {
      this.mount();
    }
  }

  mount() {
    this.container = document.getElementById("toolContainer");
    if (!this.container) return; // Exit if not on index landing page

    this.render();
    this.bindSearch();
    this.initCategoryRedirectionScrolls();
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

    if (filterQuery.trim()) {
      toolsList = await search.search(filterQuery);
    } else {
      toolsList = await config.getTools();
    }

    this.container.innerHTML = "";
    let found = false;

    // Sort categories by designated priority order
    categories.sort((a, b) => a.order - b.order);

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
        block.className = "cat-block";
        
        // Build cards HTML grid string
        const cardsHTML = catTools.map(t => {
          const isFav = favorites ? favorites.isFavorite(t.id) : false;
          const favClass = isFav ? "fav-btn on" : "fav-btn";
          
          return `
            <a class="card show" href="${this.core.prefix}/${t.url}" target="_blank">
              <button class="${favClass}" data-id="${t.id}" title="Toggle Favorite">★</button>
              <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                <span class="icon">${t.icon}</span>
                <h3>${t.name}</h3>
              </div>
              <p>${t.description}</p>
            </a>
          `;
        }).join("");

        block.innerHTML = `
          <div class="cat-head">
            <span class="left">${cat.emoji} ${cat.name} <span class="cnt">${catTools.length} tools</span></span>
            <span class="arrow">▾</span>
          </div>
          <div class="cat-body" style="max-height: 0px; overflow: hidden; transition: max-height 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);">
            <div class="grid">${cardsHTML}</div>
          </div>
        `;

        const head = block.querySelector(".cat-head");
        const body = block.querySelector(".cat-body");
        
        head.onclick = () => {
          const isOpen = block.classList.toggle("open");
          body.style.maxHeight = isOpen ? "1600px" : "0px";
        };

        // Open categories automatically during searches
        if (filterQuery.trim()) {
          block.classList.add("open");
          body.style.maxHeight = "1600px";
        }

        // Bind stars clicks favorites togglers
        block.querySelectorAll(".fav-btn").forEach(btn => {
          btn.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = btn.getAttribute("data-id");
            const targetTool = catTools.find(x => x.id === id);
            
            if (favorites) {
              await favorites.toggleFavorite(targetTool);
              btn.classList.toggle("on", favorites.isFavorite(id));
            }
          };
        });

        this.container.appendChild(block);
      }
    });

    const noResult = document.getElementById("noResult");
    if (noResult) {
      noResult.style.display = found ? "none" : "block";
    }
  }

  bindSearch() {
    const searchBar = document.getElementById("search");
    if (!searchBar) return;

    searchBar.addEventListener("input", (e) => {
      const val = e.target.value;
      this.render(val);
      
      const searchEngine = this.core.getEngine("search");
      if (searchEngine && val.trim().length > 2) {
        searchEngine.addRecentSearch(val);
      }
    });
  }

  initCategoryRedirectionScrolls() {
    // If a subpage redirected with a pending scroll request, handle it now
    const catToOpen = sessionStorage.getItem("ssdk-open-category");
    if (catToOpen) {
      sessionStorage.removeItem("ssdk-open-category");
      setTimeout(() => {
        const blocks = document.querySelectorAll(".cat-block");
        blocks.forEach(b => {
          const head = b.querySelector(".cat-head").textContent.toLowerCase();
          if (head.includes(catToOpen.toLowerCase())) {
            b.classList.add("open");
            const body = b.querySelector(".cat-body");
            if (body) body.style.maxHeight = "1600px";
            b.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        });
      }, 300);
    }
  }
}
