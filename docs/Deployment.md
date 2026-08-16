# SSDK Tools Hub - Deployment Guide

The SSDK Tools Hub V1.0 is a strictly static frontend paired with a BaaS (Backend-as-a-Service) via Supabase. It can be deployed anywhere that serves static files.

## 1. Web Deployment (Vercel, Cloudflare Pages, Netlify)

Because the project is entirely client-side HTML, CSS, and JS:
1. Connect your GitHub repository to Vercel/Cloudflare Pages.
2. Ensure the Build Command is empty (or run a custom minifier if configured).
3. Set the Output Directory to the root (`./`).

The platform automatically handles dynamic routing and parameters without Server-Side Rendering.

## 2. Backend & Auth (Supabase)

The platform requires Supabase for User Authentication, History Syncing, and Favorites.

1. Create a Supabase Project.
2. In `engines/supabase-engine.js`, update the `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
3. Enable Email/Password Auth in Supabase Dashboard.
4. (Optional) Run the provided SQL migrations to establish `users`, `history`, and `favorites` tables with Row Level Security (RLS) policies.

## 3. Desktop Application (Electron)

To package the platform as a native Windows/Mac/Linux application:

```bash
cd desktop
npm install
npm run start # Test locally
npm run build # Package into .exe / .dmg
```

## 4. Browser Extension

The platform is pre-configured as a Manifest V3 extension.
1. Open Chrome/Edge and go to `chrome://extensions`.
2. Enable "Developer Mode".
3. Click "Load unpacked" and select the `extensions/chrome/` folder.
4. The extension will open the Hub as a lightweight popup.
