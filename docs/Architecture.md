# SSDK Tools Hub - Version 1.0 Architecture

This document outlines the core architecture of the SSDK Tools Hub. The platform is designed to be a **Registry-Driven**, **Configuration-Driven**, and **Free-First** enterprise utility platform capable of scaling to thousands of tools.

## Core Principles

1. **Free First Philosophy**: All user-facing tools must be entirely free. Premium architectures (via Supabase RLS and Feature Flags) exist but must remain disabled by default.
2. **Registry-Driven**: The source of truth for all tools is the `manifests/` directory. No tool should be hardcoded into the UI.
3. **Engine Abstraction**: All heavy lifting (Search, Analytics, Authentication, UI generation) is decoupled into standalone "Engines" found in `engines/`.

## Directory Structure

```text
├── assets/          # Static assets (CSS, Images, Fonts)
├── components/      # Reusable UI primitives (GlassComponents)
├── core/            # Bootstrapper (core.js, bootstrap.js)
├── docs/            # Developer and Architectural documentation
├── engines/         # Business logic modules (Search, Auth, Analytics, etc.)
├── manifests/       # JSON configuration files (Registry)
├── modules/         # Complex JavaScript execution logic for specific tools
├── pages/           # Platform pages (login, register, admin, tool-viewer)
├── schemas/         # UI schemas for dynamically generated tools
├── scripts/         # Developer Experience tools (TDK, DX Validators)
├── tools/           # Custom HTML templates for specific tools
```

## Boot Sequence

The platform boot sequence is strictly controlled by `core/core.js` and `core/bootstrap.js` to ensure optimal Core Web Vitals and dependency safety:

1. **Critical Initialization (Synchronous)**
   - `LoggerEngine`: Attaches safe logging hooks.
   - `StateEngine`: Mounts global state.
   - `ErrorEngine`: Attaches global error boundaries.
   - `ConfigEngine`: Loads the `global.json` and parses all `manifests/*.json`.
   - `SearchEngine`: Rebuilds the search index immediately.

2. **Deferred Initialization (Asynchronous)**
   - `SupabaseEngine`: Connects to backend for Auth/Profiles (Delayed 500ms).
   - `AnalyticsEngine`: Binds usage, upload, and download tracking.
   - `RecommendationEngine`: Calculates dynamic relationships.
   - `CommunityEngine` & `ReputationEngine`: Advanced SaaS features.

## The Tool Engine (`engines/tool-engine.js`)

When a user visits `pages/tool.html?id=json-formatter`:
1. The Tool Engine queries `ConfigEngine` for the `json-formatter` manifest.
2. It hydrates the SEO meta tags instantly.
3. It determines the UI method:
   - Does `tools/json-formatter.html` exist? (Custom DOM mapping).
   - Does `schemas/json-formatter.json` exist? (Auto-generated UI).
4. It attaches `CapabilityEngine` hooks: Drag & Drop, File Reading, Export, Copy-to-Clipboard.

## Data Layer (Supabase Engine)

The platform utilizes Supabase as the central SaaS backbone. 
- **Authentication**: Email/Password and OAuth mapped to `currentUser`.
- **Favorites & History**: Synced seamlessly to the Cloud when logged in, or `localStorage` when anonymous.

## Security & Scalability

- **No Hardcoded Links**: All links use `core.prefix` to ensure the platform can be deployed on nested paths, Electron, Chrome Extensions, or Web.
- **Lazy Loading**: Non-essential features (AI, Community) wait for the main thread to unblock.
