# SSDK TOOLS HUB — Discovery Engine Audit Report

**Date:** 2026-08-16  
**Scope:** Tool Discovery, Recommendations, Related Tools, Curated Collections, and Category Navigation.

---

## 1. Current Discovery Architecture
- **Component File:** `core/discovery/recommendation-engine.js` (Class: `RecommendationEngine`)
- **Category Engine:** `engines/category-engine.js` (Class: `CategoryEngine`)
- **Homepage Engine:** `engines/homepage-engine.js` (Manages Popular, Trending, Featured, New, and Curated Collections grids)

## 2. Discovery Features Currently Implemented
1. **Featured Tools Section:** Displays tools marked `featured: true` from `core/registry/tools.json`.
2. **Trending Tools Section:** Real-time / heuristic ranking of most active tools.
3. **Recently Added Tools:** Chronologically sorted by `addedDate`.
4. **Recently Used Tools:** LocalStorage-persisted history (`ssdk-tool-history`).
5. **Curated Collections:** Role-based toolkits (Developer Essentials, Image & Media Toolkit, Medical Utilities, etc.).
6. **Related Tools Engine:** Calculates similarity based on:
   - Same Category (+100)
   - Same Subcategory (+50)
   - Tag Overlap (+20 per shared tag)
   - Keyword Overlap (+15 per shared keyword)
   - Featured Bonus (+5)

## 3. Current Limitations & Areas for Optimization
1. **Shared Input/Output Matching:** Tools that process similar media types (e.g. PNG tools to other image tools, PDF to PDF) can be correlated by input/output MIME types.
2. **Category Mega-Menu & Browsing:** Category toolbar navigation and quick filters can be enhanced with live tool count badges and subcategory drill-downs.
3. **Search within Category:** When viewing a specific category, searches should prioritize tools inside that active category while maintaining a clear option to search globally.
4. **Anonymous & Logged-In User Parity:** Recommendations must work seamlessly for anonymous users based on session activity and current tool context, without requiring login.

---

## 4. Planned Phase 16 Discovery Enhancements
- Multi-dimensional similarity scoring for `RecommendationEngine` (category + subcategory + tags + keywords + input/output types).
- Context-aware related tools grid on tool workspace pages.
- Category-scoped search with smooth cross-category transition.
