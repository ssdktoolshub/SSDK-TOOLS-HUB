const fs = require('fs');
const path = require('path');

const componentsPath = path.join(__dirname, '../components/glass-components.js');

const additionalMethods = `
  /**
   * Generates a Toast notification.
   */
  static createToast(message, type = "info", duration = 3000) {
    const toast = document.createElement("div");
    toast.className = \`toast-notification toast-\${type}\`;
    toast.textContent = message;
    
    // Default styling if no external CSS exists
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.padding = "12px 20px";
    toast.style.borderRadius = "8px";
    toast.style.background = type === "error" ? "#ff4757" : type === "success" ? "#2ed573" : "rgba(255,255,255,0.1)";
    toast.style.color = "#fff";
    toast.style.backdropFilter = "blur(10px)";
    toast.style.border = "1px solid rgba(255,255,255,0.2)";
    toast.style.zIndex = "9999";
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";
    
    document.body.appendChild(toast);
    
    requestAnimationFrame(() => {
      toast.style.opacity = "1";
    });
    
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  /**
   * Generates a Modal Dialog.
   */
  static createModal(title, contentElement, onClose = null) {
    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.5)";
    overlay.style.backdropFilter = "blur(5px)";
    overlay.style.display = "flex";
    overlay.style.justifyContent = "center";
    overlay.style.alignItems = "center";
    overlay.style.zIndex = "9998";
    overlay.style.opacity = "0";
    overlay.style.transition = "opacity 0.3s ease";
    
    const modal = document.createElement("div");
    modal.className = "modal-content glass-panel";
    modal.style.background = "rgba(25,25,35,0.85)";
    modal.style.padding = "24px";
    modal.style.borderRadius = "12px";
    modal.style.minWidth = "300px";
    modal.style.maxWidth = "90%";
    modal.style.boxShadow = "0 8px 32px rgba(0,0,0,0.3)";
    
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-between";
    header.style.alignItems = "center";
    header.style.marginBottom = "16px";
    
    const titleEl = document.createElement("h3");
    titleEl.textContent = title;
    titleEl.style.margin = "0";
    titleEl.style.color = "#fff";
    
    const closeBtn = document.createElement("button");
    closeBtn.textContent = "×";
    closeBtn.style.background = "transparent";
    closeBtn.style.border = "none";
    closeBtn.style.color = "#fff";
    closeBtn.style.fontSize = "24px";
    closeBtn.style.cursor = "pointer";
    closeBtn.onclick = () => {
      overlay.style.opacity = "0";
      setTimeout(() => {
        overlay.remove();
        if (onClose) onClose();
      }, 300);
    };
    
    header.appendChild(titleEl);
    header.appendChild(closeBtn);
    modal.appendChild(header);
    modal.appendChild(contentElement);
    overlay.appendChild(modal);
    
    document.body.appendChild(overlay);
    
    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
    });
    
    return overlay;
  }

  /**
   * Generates a Skeleton Loader block.
   */
  static createSkeleton(width = "100%", height = "20px", borderRadius = "4px") {
    const skel = document.createElement("div");
    skel.className = "skeleton-loader";
    skel.style.width = width;
    skel.style.height = height;
    skel.style.borderRadius = borderRadius;
    skel.style.background = "linear-gradient(90deg, rgba(255,255,255,0.05) 25%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 75%)";
    skel.style.backgroundSize = "200% 100%";
    skel.style.animation = "shimmer 1.5s infinite";
    
    // Add shimmer animation if not exists
    if (!document.getElementById("shimmer-style")) {
      const style = document.createElement("style");
      style.id = "shimmer-style";
      style.textContent = \`@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }\`;
      document.head.appendChild(style);
    }
    
    return skel;
  }

  /**
   * Generates Pagination controls.
   */
  static createPagination(currentPage, totalPages, onPageChange) {
    const wrap = document.createElement("div");
    wrap.className = "pagination-wrap";
    wrap.style.display = "flex";
    wrap.style.gap = "8px";
    wrap.style.justifyContent = "center";
    wrap.style.marginTop = "20px";
    
    const createBtn = (text, page, disabled) => {
      const btn = document.createElement("button");
      btn.textContent = text;
      btn.className = \`glass-btn \${disabled ? 'disabled' : ''} \${page === currentPage ? 'active' : ''}\`;
      if (page === currentPage) {
        btn.style.background = "rgba(100,100,255,0.3)";
      }
      btn.disabled = disabled;
      if (!disabled) {
        btn.onclick = () => onPageChange(page);
      }
      return btn;
    };
    
    wrap.appendChild(createBtn("Prev", currentPage - 1, currentPage <= 1));
    
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
       wrap.appendChild(createBtn(i.toString(), i, false));
    }
    
    wrap.appendChild(createBtn("Next", currentPage + 1, currentPage >= totalPages));
    return wrap;
  }

  /**
   * Generates Breadcrumb navigation.
   */
  static createBreadcrumb(paths) {
    const nav = document.createElement("nav");
    nav.setAttribute("aria-label", "Breadcrumb");
    const ol = document.createElement("ol");
    ol.style.listStyle = "none";
    ol.style.display = "flex";
    ol.style.gap = "8px";
    ol.style.padding = "0";
    ol.style.margin = "0";
    
    paths.forEach((path, idx) => {
      const li = document.createElement("li");
      if (idx === paths.length - 1) {
        li.textContent = path.name;
        li.style.color = "rgba(255,255,255,0.6)";
        li.setAttribute("aria-current", "page");
      } else {
        const a = document.createElement("a");
        a.href = path.url;
        a.textContent = path.name;
        a.style.color = "#fff";
        a.style.textDecoration = "none";
        li.appendChild(a);
        
        const sep = document.createElement("span");
        sep.textContent = " / ";
        sep.style.color = "rgba(255,255,255,0.4)";
        li.appendChild(sep);
      }
      ol.appendChild(li);
    });
    
    nav.appendChild(ol);
    return nav;
  }
`;

try {
  let content = fs.readFileSync(componentsPath, 'utf8');
  
  // Find the last closing brace for the class
  const lastBraceIndex = content.lastIndexOf('}');
  
  if (lastBraceIndex !== -1) {
    const updatedContent = content.slice(0, lastBraceIndex) + additionalMethods + content.slice(lastBraceIndex);
    fs.writeFileSync(componentsPath, updatedContent);
    console.log("✅ Successfully injected missing components into glass-components.js");
  } else {
    console.log("❌ Could not find closing brace in glass-components.js");
  }
} catch (e) {
  console.error("❌ Error:", e);
}
