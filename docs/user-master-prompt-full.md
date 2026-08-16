<USER_REQUEST>
🚀 SSDK TOOLS HUB — ANTIGRAVITY MASTER PROMPT
Phases 17–21 Complete Build Guide
> **Copy this entire document and paste it into Antigravity. It contains everything Antigravity needs to understand your project and build the remaining phases.**
---
📋 PROJECT CONTEXT (READ THIS FIRST)
You are working on SSDK TOOLS HUB, a browser-based, privacy-first, all-in-one web utility platform created by Swarnava Das.
Current State of the Codebase:
967 tools registered in `core/registry/tools.json`, across 41 categories
976 `logic.js` files on disk (9 orphaned — reconcile these)
967 manifest JSON files in `core/registry/manifests/`
43 category folders under `tools/` (6 are empty: `business-finance`, `education`, `productivity`, `science`, `social-media`, `text-document`, `video-audio`, `travel`)
6 duplicate category names in `tools.json` (same name, different emojis) — FIX THIS FIRST
Architecture Summary:
```
bootstrap.js → CoreEngine (core.js) → registers 40+ sub-engines
ToolEngine → loads tool manifest JSON → renders schema-driven UI → imports tools/<category>/<tool-id>/logic.js
SearchEngine → pre-indexed in-memory, tokenization, Levenshtein typo tolerance, 100+ synonyms
Design System → Vanilla CSS tokens (design-tokens.css), glassmorphism, dark/light/high-contrast themes
Backend → FastAPI (backend/main.py), thin API gateway, client-side-first processing
Auth → Supabase (supabase-engine.js), anon key, auth state listeners
PWA → Service Worker (sw.js), offline caching
i18n → English, Bengali, Hindi
```
Key Files:
File	Purpose
`core/core.js`	CoreEngine orchestrator
`core/bootstrap.js`	App bootloader, registers all 40+ engines
`engines/tool-engine.js`	Universal tool loader (manifest → schema UI → logic.js)
`engines/supabase-engine.js`	Supabase auth, profiles, cloud sync
`engines/search/engine.js`	Production search with typo tolerance
`engines/seo/seo-engine.js`	Dynamic SEO metadata
`engines/analytics/engine.js`	Usage analytics
`engines/homepage-engine.js`	Homepage rendering
`engines/admin-engine.js`	Admin dashboard controller
`assets/css/design-tokens.css`	Central design system
`core/registry/tools.json`	Master tool registry (967 entries)
`core/registry/manifests/*.json`	Per-tool schema manifests
`core/registry/tool-folder-map.json`	Maps tool ID → folder path
`backend/main.py`	FastAPI gateway
`templates/tool-template/index.html`	Universal tool page template
Module Contract (ALL tool logic.js files MUST follow):
```javascript
export async function execute(inputs) {
  // inputs = { toolInput: "...", fieldId: "value", ... }
  // Must return: { toolOutput: "result string" } OR { outputBlob: Blob, filename: "out.ext" } OR { htmlPreview: "<div>..." }
  return { toolOutput: "processed result" };
}

export function validate(inputs) {
  // Return true if inputs are valid, false or throw Error otherwise
  return true;
}

// Optional: init(toolEngine) for custom UI bindings
export function init(toolEngine) {
  // Bind custom event listeners, mount canvas, etc.
}
```
---
⚠️ PRE-FLIGHT FIXES (DO THESE BEFORE ANY PHASE)
Fix 1: Deduplicate Category Names in `tools.json`
These categories have duplicate names with different emojis. Unify them to ONE emoji each:
Current Duplicates	Keep This One
`🛠 Developer Tools` / `👨💻 Developer Tools`	`🛠 Developer Tools`
`💵 Finance Tools` / `💰 Finance Tools`	`💰 Finance Tools`
`🔤 Text Tools` / `📝 Text Tools`	`📝 Text Tools`
`📊 SEO Tools` / `📈 SEO Tools`	`📈 SEO Tools`
`🔒 Security Tools` / `🔐 Security Tools`	`🔐 Security Tools`
`🤖 AI Tools` / `⚡ AI Tools`	`⚡ AI Tools`
Update ALL entries in `tools.json` to use the unified category name. Also update `core/registry/categories.json` and `core/registry/tool-folder-map.json` accordingly.
Fix 2: Remove Orphaned logic.js Files
Find the 9 `logic.js` files that exist in `tools/` but have no matching entry in `tools.json`. Either add them to the registry or delete them.
Fix 3: Remove Empty Category Folders
Delete these empty folders under `tools/`: `business-finance`, `education`, `productivity`, `science`, `social-media`, `text-document`, `video-audio`, `travel`
---
🔵 PHASE 17: SEO + Google Indexing
Goal:
Make all 967 tools individually indexable by Google with rich structured data, dynamic sitemaps, and proper meta tags.
Tasks:
17.1 — Dynamic Sitemap Generator
Create `scripts/generate-sitemap.js` (Node.js script):
```
- Read core/registry/tools.json
- Generate sitemap.xml with all 967 tool URLs: https://ssdktoolshub.com/pages/tool.html?id=<tool-id>
- Include <lastmod> from tool.addedDate or manifest version
- Generate sitemap-index.xml if >50,000 URLs (not needed now but structure for it)
- Add to vercel.json: rewrite /sitemap.xml → /scripts/generate-sitemap.js (or pre-build)
- Also generate robots.txt dynamically:
    User-agent: *
    Allow: /
    Sitemap: https://ssdktoolshub.com/sitemap.xml
    Disallow: /admin/
    Disallow: /backend/
```
17.2 — Per-Tool Structured Data (JSON-LD)
Update `engines/seo/seo-engine.js` → `updateMetadata(tool)` method to inject:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "<tool.name>",
  "description": "<tool.description>",
  "url": "https://ssdktoolshub.com/pages/tool.html?id=<tool.id>",
  "applicationCategory": "<tool.category without emoji>",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "author": {
    "@type": "Person",
    "name": "Swarnava Das"
  },
  "datePublished": "<tool.addedDate>",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "120"
  }
}
</script>
```
17.3 — Open Graph + Twitter Card Meta Tags
In `seo-engine.js`, also inject:
```html
<meta property="og:title" content="<tool.name> - Free Online Tool | SSDK TOOLS HUB">
<meta property="og:description" content="<tool.description>">
<meta property="og:url" content="https://ssdktoolshub.com/pages/tool.html?id=<tool.id>">
<meta property="og:type" content="website">
<meta property="og:image" content="https://ssdktoolshub.com/assets/images/og/<tool.id>.png">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<tool.name> - SSDK TOOLS HUB">
<meta name="twitter:description" content="<tool.description>">
```
17.4 — Canonical URLs
Add to every tool page:
```html
<link rel="canonical" href="https://ssdktoolshub.com/pages/tool.html?id=<tool.id>">
```
17.5 — Breadcrumb Schema
Add JSON-LD breadcrumb:
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://ssdktoolshub.com" },
    { "@type": "ListItem", "position": 2, "name": "<category>", "item": "https://ssdktoolshub.com/#<category>" },
    { "@type": "ListItem", "position": 3, "name": "<tool.name>", "item": "https://ssdktoolshub.com/pages/tool.html?id=<tool.id>" }
  ]
}
```
17.6 — SEO Content Blocks per Tool Page
Already partially implemented in `tool-engine.js` → `loadSEOContentBlocks()`. Enhance it:
Add "How to use" step-by-step with numbered instructions
Add "Related tools" cross-links (already done via `loadRelatedTools`)
Add FAQ schema (JSON-LD `FAQPage` type) from manifest FAQ data
Add tool-specific keywords from `manifest.keywords`
17.7 — Vercel/Hosting Config for SEO
Update `vercel.json`:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Robots-Tag", "value": "index, follow" },
        { "key": "Cache-Control", "value": "public, max-age=3600" }
      ]
    }
  ],
  "redirects": [
    { "source": "/tools/:id", "destination": "/pages/tool.html?id=:id", "permanent": true }
  ]
}
```
17.8 — Pre-render / SSR for Critical Pages
Since this is a client-side SPA, Google may not fully render JS. Options:
Option A (recommended): Use a build script that generates static HTML snapshots for each tool page at deploy time
Option B: Use `<noscript>` fallback with full tool metadata visible without JS
Create `scripts/prerender.js` that reads `tools.json` and generates `dist/pages/<tool-id>.html` with all meta tags baked in
17.9 — Google Search Console Verification
Already has `google-site-verification` meta tag in `index.html`. Verify it matches the current Search Console property.
Phase 17 Deliverables:
[ ] `scripts/generate-sitemap.js`
[ ] Updated `engines/seo/seo-engine.js` with JSON-LD, OG, Twitter, canonical
[ ] `robots.txt` (dynamic or static)
[ ] `vercel.json` SEO headers
[ ] FAQ schema per tool
[ ] Pre-render script or `<noscript>` fallback
---
🟢 PHASE 18: User Account + Favorites + History (Supabase)
Goal:
Full user authentication, cloud-synced favorites, cross-device history, and user profiles.
Tasks:
18.1 — Supabase Schema (Run in Supabase SQL Editor)
```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  subscription_tier TEXT DEFAULT 'free',
  subscription_expires TIMESTAMPTZ
);

-- Favorites table
CREATE TABLE public.favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  tool_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tool_id)
);

-- Tool usage history
CREATE TABLE public.tool_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  tool_id TEXT NOT NULL,
  tool_category TEXT,
  visited_at TIMESTAMPTZ DEFAULT NOW(),
  processing_time_ms INTEGER,
  input_size_bytes INTEGER,
  output_type TEXT
);

-- User settings/preferences
CREATE TABLE public.user_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  theme TEXT DEFAULT 'dark',
  language TEXT DEFAULT 'en',
  search_shortcuts BOOLEAN DEFAULT true,
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- Policies: users can only read/write their own data
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own favorites" ON public.favorites FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own history" ON public.tool_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own history" ON public.tool_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own history" ON public.tool_history FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own settings" ON public.user_settings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own settings" ON public.user_settings FOR ALL USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'display_name');
  INSERT INTO public.user_settings (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```
18.2 — Upgrade `engines/supabase-engine.js`
The current file already has the Supabase URL and anon key. Enhance it:
```javascript
// Add these methods to SupabaseEngine class:

async signIn(email, password) {
  const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
  return { data, error };
}

async signUp(email, password, displayName) {
  const { data, error } = await this.supabase.auth.signUp({
    email, password,
    options: { data: { display_name: displayName } }
  });
  return { data, error };
}

async signInWithGoogle() {
  const { data, error } = await this.supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin + '/pages/dashboard.html' }
  });
  return { data, error };
}

async signOut() {
  await this.supabase.auth.signOut();
  this.currentUser = null;
  window.dispatchEvent(new CustomEvent('ssdk-auth-change', { detail: null }));
}

async getProfile() {
  if (!this.currentUser) return null;
  const { data, error } = await this.supabase
    .from('profiles')
    .select('*')
    .eq('id', this.currentUser.id)
    .single();
  return data;
}

async updateProfile(updates) {
  const { data, error } = await this.supabase
    .from('profiles')
    .update(updates)
    .eq('id', this.currentUser.id);
  return { data, error };
}

// Cloud-synced favorites
async getCloudFavorites() {
  if (!this.currentUser) return [];
  const { data } = await this.supabase
    .from('favorites')
    .select('tool_id')
    .eq('user_id', this.currentUser.id)
    .order('created_at', { ascending: false });
  return data || [];
}

async addCloudFavorite(toolId) {
  if (!this.currentUser) return;
  await this.supabase.from('favorites').upsert({
    user_id: this.currentUser.id,
    tool_id: toolId
  });
}

async removeCloudFavorite(toolId) {
  if (!this.currentUser) return;
  await this.supabase.from('favorites')
    .delete()
    .eq('user_id', this.currentUser.id)
    .eq('tool_id', toolId);
}

// Cloud-synced history
async addHistoryEntry(toolId, category, processingTime, inputSize, outputType) {
  if (!this.currentUser) return;
  await this.supabase.from('tool_history').insert({
    user_id: this.currentUser.id,
    tool_id: toolId,
    tool_category: category,
    processing_time_ms: processingTime,
    input_size_bytes: inputSize,
    output_type: outputType
  });
}

async getHistory(limit = 50) {
  if (!this.currentUser) return [];
  const { data } = await this.supabase
    .from('tool_history')
    .select('*')
    .eq('user_id', this.currentUser.id)
    .order('visited_at', { ascending: false })
    .limit(limit);
  return data || [];
}

async clearHistory() {
  if (!this.currentUser) return;
  await this.supabase.from('tool_history')
    .delete()
    .eq('user_id', this.currentUser.id);
}
```
18.3 — Upgrade `engines/favorites-engine.js`
Merge local + cloud favorites:
```
- On toggle: save to localStorage (existing) AND call supabase.addCloudFavorite/removeCloudFavorite
- On init: if user is logged in, merge cloud favorites with local (cloud wins on conflicts)
- On auth change (login): pull cloud favorites, merge with local
- On auth change (logout): keep local favorites only
```
18.4 — Upgrade `engines/history-engine.js`
Same merge pattern:
```
- On addVisited: save locally AND call supabase.addHistoryEntry
- On getHistory: if logged in, fetch from cloud; else use localStorage
- On clearHistory: clear both local and cloud
```
18.5 — Login/Signup Page (`pages/login.html`)
Already exists. Enhance it:
Email + password form
Google OAuth button
"Forgot password" flow (Supabase `resetPasswordForEmail`)
Error/success toast notifications via `notification-engine`
Redirect to dashboard on success
18.6 — User Dashboard (`pages/dashboard.html`)
Already exists. Enhance it:
User profile card (avatar, name, email, join date)
Favorites grid (cloud-synced)
Recent history timeline
Usage stats (total tools used, favorite category, streak days)
Settings panel (theme, language, notifications)
"Upgrade to Pro" CTA (for Phase 17 monetization)
18.7 — Auth UI in Header
Update header to show:
Logged out: "Sign In" button
Logged in: Avatar + display name + dropdown (Dashboard, Settings, Sign Out)
Phase 18 Deliverables:
[ ] Supabase SQL schema applied
[ ] Updated `supabase-engine.js` with all CRUD methods
[ ] Cloud-synced favorites engine
[ ] Cloud-synced history engine
[ ] Enhanced login page with OAuth
[ ] Enhanced dashboard page
[ ] Header auth UI
---
🟡 PHASE 19: Admin Panel + Analytics Dashboard
Goal:
Internal admin dashboard to manage tools, view analytics, monitor health, and moderate content.
Tasks:
19.1 — Admin Authentication Gate
`pages/admin.html` and `admin/` folder must be protected
Add Supabase RLS: only users with `role = 'admin'` in profiles table can access
Add a `role TEXT DEFAULT 'user'` column to `profiles` table
Client-side: check `profile.role === 'admin'` before rendering admin UI; redirect to login otherwise
19.2 — Supabase Admin Tables
```sql
ALTER TABLE public.profiles ADD COLUMN role TEXT DEFAULT 'user';

-- Analytics events table
CREATE TABLE public.analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  event_type TEXT NOT NULL,
  event_category TEXT,
  tool_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tool reports (broken tool, wrong output, etc.)
CREATE TABLE public.tool_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  reporter_id UUID REFERENCES public.profiles(id),
  tool_id TEXT NOT NULL,
  report_type TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'open',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ
);
```
19.3 — Admin Dashboard UI (`admin/index.html`)
Build a full admin panel with these sections:
Overview Tab:
Total tools: 967
Total users (from Supabase)
Tools used today / this week / this month
Top 10 most-used tools (bar chart)
Search queries with no results (for content gap analysis)
Error rate percentage
Tools Management Tab:
Table of all 967 tools with: ID, Name, Category, Status (working/broken), Usage count, Last updated
Search/filter by category
"Edit Manifest" button → opens modal to edit the JSON manifest
"Disable/Enable" toggle per tool
"Add New Tool" form (creates folder + logic.js + manifest + registry entry)
Analytics Tab:
Line chart: daily active users (last 30 days)
Pie chart: usage by category
Table: top search queries
Table: tools with highest error rates
Export as CSV button
User Management Tab:
Table of registered users with: email, display name, join date, subscription tier, total tool uses
Search by email
Role management (user/admin)
Reports Tab:
List of tool reports (broken tool, wrong output)
Status: open / in-progress / resolved
Assign to fix, mark resolved
19.4 — Analytics Engine Upgrade (`engines/analytics/engine.js`)
Enhance to send events to Supabase (not just localStorage):
```javascript
async logEvent(type, category, toolId, metadata = {}) {
  // 1. Save to localStorage (existing behavior)
  // 2. If user is logged in, also insert into analytics_events table
  // 3. Batch insert every 10 events to reduce API calls
}
```
19.5 — Admin API Endpoints (Backend)
Add to `backend/api/gateway.py`:
```python
# GET /api/v1/admin/stats — aggregate dashboard stats
# GET /api/v1/admin/tools — list all tools with usage counts
# PUT /api/v1/admin/tools/:id — update tool manifest
# POST /api/v1/admin/tools — create new tool scaffold
# DELETE /api/v1/admin/tools/:id — disable tool
# GET /api/v1/admin/users — list users (paginated)
# PUT /api/v1/admin/users/:id/role — change user role
# GET /api/v1/admin/analytics — query analytics events
# GET /api/v1/admin/reports — list tool reports
# PUT /api/v1/admin/reports/:id — update report status
```
All admin endpoints must check `role = 'admin'` server-side.
Phase 19 Deliverables:
[ ] Admin role in Supabase
[ ] Protected admin dashboard UI
[ ] Analytics events pipeline (client → Supabase)
[ ] Admin API endpoints
[ ] Dashboard charts (use Chart.js or similar CDN library)
[ ] Tool management CRUD
[ ] User management view
[ ] Report management system
---
🔴 PHASE 20: Performance + Security + Production Deployment
Goal:
Production hardening — make the platform fast, secure, and deployable at scale.
Tasks:
20.1 — Performance: Bundle & Minify
Create `scripts/build.js` (Node.js):
Minify all CSS files (use `csso` or `clean-css`)
Bundle and minify JS where possible (use `terser`)
Generate `dist/` folder with optimized assets
Add content hash to filenames for cache busting: `ssdk-style.a1b2c3.css`
Update all `<link>` and `<script>` references to use hashed filenames
Add to `package.json`:
```json
  "scripts": {
    "build": "node scripts/build.js",
    "dev": "npx serve .",
    "deploy": "npm run build && vercel --prod"
  }
  ```
20.2 — Performance: Lazy Loading
Tool `logic.js` files are already lazy-loaded via dynamic `import()`
Add lazy loading for engine modules that aren't needed on first paint
Defer loading of: `ai-engine`, `python-engine`, `marketplace-engine`, `community-engine`, `billing-engine` until first use
Add `loading="lazy"` to all `<img>` tags
20.3 — Performance: Caching Strategy
Update `sw.js` Service Worker:
```javascript
// Cache strategies:
// - HTML: Network First, fallback to cache
// - CSS/JS: Cache First, fallback to network
// - Images: Cache First with 7-day expiry
// - Fonts: Cache First with 30-day expiry
// - Tool logic.js: Cache First with version check
// - API responses: Network First with 5-min cache
```
20.4 — Performance: Critical CSS
Extract above-the-fold CSS into a `<style>` tag in `index.html` (inline critical path)
Defer non-critical CSS loading with `media="print" onload="this.media='all'"`
20.5 — Security: Content Security Policy Audit
Current CSP in `index.html`:
```
default-src 'self';
script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://www.gstatic.com;
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
font-src 'self' https://fonts.gstatic.com;
img-src 'self' data: blob:;
connect-src 'self' https://ssdk-tools-hub.firebaseapp.com https://api.ssdktoolshub.com https://*.googleapis.com;
```
Fix:
Remove `'unsafe-eval'` — replace any `eval()` usage with safe alternatives
Remove `'unsafe-inline'` from script-src — move all inline scripts to external files with nonce
Add `frame-ancestors 'none'` to prevent clickjacking
Add `form-action 'self'` to restrict form submissions
Add Supabase URL to `connect-src`: `https://wyqdfwtslkfzmorvggdq.supabase.co`
Final CSP:
```
  default-src 'self';
  script-src 'self' 'nonce-<random>' https://cdnjs.cloudflare.com https://cdn.jsdelivr.net;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: blob: https:;
  connect-src 'self' https://wyqdfwtslkfzmorvggdq.supabase.co https://api.ssdktoolshub.com;
  frame-ancestors 'none';
  form-action 'self';
  ```
20.6 — Security: Input Sanitization
Add DOMPurify (via CDN) to sanitize all user inputs before rendering
Update `tool-engine.js` → `runTool()` to sanitize inputs:
```javascript
  const sanitized = {};
  for (const [key, value] of Object.entries(inputs)) {
    if (typeof value === 'string') {
      sanitized[key] = DOMPurify.sanitize(value);
    } else {
      sanitized[key] = value;
    }
  }
  ```
Sanitize all HTML rendered via `innerHTML` throughout the codebase
20.7 — Security: Rate Limiting (Backend)
Add to `backend/main.py`:
```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

# Apply to API routes:
@app.post("/api/v1/...")
@limiter.limit("60/minute")
async def some_endpoint(request: Request):
    ...
```
20.8 — Security: Environment Variables
Move Supabase URL and anon key to `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
Update `.env.example`:
```
  VITE_SUPABASE_URL=https://wyqdfwtslkfzmorvggdq.supabase.co
  VITE_SUPABASE_ANON_KEY=your_anon_key_here
  API_BASE_URL=https://api.ssdktoolshub.com
  ```
Update `supabase-engine.js` to read from `import.meta.env` or a config module
20.9 — Production Deployment (Vercel)
Update `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": null,
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=()" }
      ]
    }
  ],
  "redirects": [
    { "source": "/tools/:id", "destination": "/pages/tool.html?id=:id", "permanent": true }
  ]
}
```
20.10 — Error Monitoring
Integrate Sentry (free tier) for client-side error tracking
Add to `engines/error-engine.js`:
```javascript
  // After logging error locally, send to Sentry
  if (window.Sentry) {
    window.Sentry.captureException(error);
  }
  ```
Add Sentry DSN to env vars: `VITE_SENTRY_DSN=...`
20.11 — Lighthouse Audit Targets
Run Lighthouse and ensure:
Metric	Target
Performance	90+
Accessibility	95+
Best Practices	95+
SEO	100
Phase 20 Deliverables:
[ ] Build script with minification
[ ] Optimized Service Worker caching
[ ] Hardened CSP headers
[ ] DOMPurify input sanitization
[ ] Backend rate limiting
[ ] Environment variable migration
[ ] Production `vercel.json`
[ ] Sentry error monitoring
[ ] Lighthouse 90+ scores
---
🟣 PHASE 21: Final QA + Launch Certification
Goal:
Comprehensive testing, bug fixing, and launch readiness verification.
Tasks:
21.1 — Automated Testing Suite
The `tests/` folder already has subdirectories. Populate them:
Unit Tests (`tests/unit/`):
```
- test-search-engine.js — test tokenization, typo tolerance, ranking
- test-favorites-engine.js — test add/remove/sync
- test-history-engine.js — test add/clear/merge
- test-seo-engine.js — test meta tag injection
- test-tool-engine.js — test manifest loading, schema rendering
- test-core-engine.js — test engine registration, boot sequence
```
Integration Tests (`tests/integration/`):
```
- test-supabase-auth.js — test sign up, sign in, sign out flow
- test-cloud-favorites.js — test local ↔ cloud sync
- test-cloud-history.js — test local ↔ cloud merge
- test-tool-execution.js — test 50 most popular tools end-to-end
```
E2E Tests (`tests/e2e/`):
```
- test-homepage.js — load homepage, search, navigate to tool
- test-tool-flow.js — open tool, input data, process, get output, download
- test-auth-flow.js — sign up, login, dashboard, favorites, logout
- test-admin-flow.js — login as admin, view stats, edit tool
- test-offline.js — go offline, use cached tool, verify output
```
Use Playwright or Cypress for E2E. Simple Node.js + assert for unit/integration.
21.2 — Tool Quality Audit
Run a script that checks every `logic.js`:
```javascript
// scripts/audit-tools.js
const fs = require('fs');
const path = require('path');
const registry = require('./core/registry/tools.json');

const results = { total: 0, working: 0, stub: 0, missing: 0, broken: 0 };

registry.forEach(tool => {
  results.total++;
  const map = require('./core/registry/tool-folder-map.json');
  const catSlug = map[tool.id] || tool.category.replace(...);
  const logicPath = `tools/${catSlug}/${tool.id}/logic.js`;
  
  if (!fs.existsSync(logicPath)) {
    results.missing++;
    console.log(`❌ MISSING: ${tool.id} → ${logicPath}`);
    return;
  }
  
  const content = fs.readFileSync(logicPath, 'utf-8');
  const size = content.length;
  
  if (size < 200) {
    results.stub++;
    console.log(`⚠️  STUB: ${tool.id} (${size} bytes) — needs real implementation`);
  } else if (content.includes('return { toolOutput: "') && !content.includes('inputs.')) {
    results.stub++;
    console.log(`⚠️  STATIC: ${tool.id} — returns hardcoded string`);
  } else {
    results.working++;
  }
});

console.log(`\n📊 AUDIT RESULTS:`);
console.log(`Total: ${results.total}`);
console.log(`Working: ${results.working}`);
console.log(`Stubs: ${results.stub}`);
console.log(`Missing: ${results.missing}`);
```
Target: 100% of top 100 most-visited tools must have real logic. 80%+ overall.
21.3 — Cross-Browser Testing
Test on:
Chrome (latest)
Firefox (latest)
Safari (latest)
Edge (latest)
Chrome Mobile (Android)
Safari Mobile (iOS)
Check:
[ ] Homepage renders correctly
[ ] Search works (Ctrl+K command palette)
[ ] Tool pages load and execute
[ ] Dark/Light/High-Contrast themes switch
[ ] Favorites add/remove
[ ] Auth flow (login/signup/logout)
[ ] Admin panel access
[ ] PWA install prompt
21.4 — Accessibility Audit
Run `engines/a11y-engine.js` checks:
[ ] All interactive elements have ARIA labels
[ ] Keyboard navigation works (Tab, Enter, Escape)
[ ] Color contrast meets WCAG AA (4.5:1 minimum)
[ ] Screen reader announces tool results
[ ] Focus management on modal open/close
[ ] Skip-to-content link present
21.5 — Performance Benchmarks
Measure and record:
Metric	Target
First Contentful Paint (FCP)	< 1.5s
Largest Contentful Paint (LCP)	< 2.5s
Total Blocking Time (TBT)	< 150ms
Cumulative Layout Shift (CLS)	< 0.1
Time to Interactive (TTI)	< 3.5s
Homepage load (3G)	< 5s
Tool page load	< 2s
Search response	< 50ms
21.6 — Security Penetration Checklist
[ ] No API keys exposed in client JS (except Supabase anon key — expected)
[ ] CSP headers block inline script injection
[ ] XSS: test tool inputs with `<script>alert(1)</script>` — should be sanitized
[ ] SQL injection: test Supabase queries with malicious input
[ ] CSRF: verify Supabase handles this (it does by default)
[ ] Clickjacking: verify `X-Frame-Options: DENY`
[ ] CORS: backend only allows production domain
[ ] Rate limiting: test >60 requests/minute returns 429
21.7 — Launch Readiness Checklist
[ ] All 967 tools registered and accessible
[ ] Top 100 tools have real implementations
[ ] No console errors on homepage or tool pages
[ ] Supabase auth working (email + Google OAuth)
[ ] Admin panel accessible and functional
[ ] Sitemap.xml generated and submitted to Google Search Console
[ ] robots.txt present and correct
[ ] SSL certificate valid (Vercel auto-handles)
[ ] Custom domain configured (ssdktoolshub.com)
[ ] Google Analytics or Plausible connected
[ ] Error monitoring (Sentry) active
[ ] Backup/restore procedure documented
[ ] README.md updated with deployment instructions
[ ] CHANGELOG.md updated with all phases
21.8 — Soft Launch Procedure
Deploy to staging: `vercel --preview`
Share with 5–10 beta testers
Collect feedback for 48 hours
Fix critical bugs
Deploy to production: `vercel --prod`
Submit to Google Search Console
Announce launch (social media, Product Hunt, etc.)
Phase 21 Deliverables:
[ ] Complete test suite (unit + integration + E2E)
[ ] Tool quality audit script + report
[ ] Cross-browser test report
[ ] Accessibility audit report
[ ] Performance benchmark report
[ ] Security checklist (all green)
[ ] Launch readiness checklist (all green)
[ ] Deployment documentation
---
📌 IMPORTANT RULES FOR ANTIGRAVITY
Never break existing functionality. The 967-tool registry, engine architecture, and design system must remain intact.
Follow the module contract. Every `logic.js` must export `execute(inputs)`, `validate(inputs)`, and optionally `init(toolEngine)`.
Client-side first. All tool processing must happen in the browser. Never send user files to a server unless explicitly required (e.g., AI tools).
Use the design tokens. All new UI must use CSS variables from `assets/css/design-tokens.css`. Never hardcode colors.
Maintain the engine pattern. New features should be implemented as engines registered in `core.js`, not as standalone scripts.
Privacy first. No user data leaves the browser unless the user explicitly opts into cloud sync (Supabase auth).
Mobile-first responsive. All new UI must work on mobile, tablet, and desktop.
No framework. This is a Vanilla JS project. Do NOT introduce React, Vue, Angular, or any UI framework.
---
🎯 EXECUTION ORDER
```
Pre-flight fixes (deduplicate categories, remove orphans, clean empty folders)
  ↓
Phase 17 (SEO + Indexing) — 2-3 days
  ↓
Phase 18 (Auth + Cloud Sync) — 3-4 days
  ↓
Phase 19 (Admin + Analytics) — 3-4 days
  ↓
Phase 20 (Performance + Security) — 2-3 days
  ↓
Phase 21 (QA + Launch) — 2-3 days
```
Total estimated time: 12-17 days of focused development.
---
Created for SSDK TOOLS HUB by Swarnava Das — August 2026
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-08-16T12:06:25+05:30.
</ADDITIONAL_METADATA>
<USER_SETTINGS_CHANGE>
The user changed setting `Model Selection` from Gemini 3.7 Flash (Medium) to Gemini 3.1 Pro (Low). No need to comment on this change if the user doesn't ask about it. If reporting what model you are, please use a human readable name instead of the exact string.
</USER_SETTINGS_CHANGE>