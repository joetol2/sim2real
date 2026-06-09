# Sim2Real — Claude Code Context

## Repos
- **Live site**: `joetol2/sim2real` → deployed to `https://sim2real.bot` via GitHub Pages
- **Preview/v2**: `joetol2/sim2real-v2` → will deploy to `https://joetol2.github.io/sim2real-v2/`
- Local working directory: `/home/user/realsim` (maps to `joetol2/sim2real` via proxy)

## Project
React + TypeScript + Vite + Tailwind CSS single-page app. GitHub Actions deploys `main` → GitHub Pages on every push.

## What the live site (`sim2real`) currently has
- **Home (`/`)**: Hero with video background (stealth mode messaging), "What we do" section with Dan Miller video
- **Demos (`/demos`)**: Two demo sections with alternating layout — pit-in-cup and socks videos, "4x playback" caption, muted with controls
- **Physics (`/physics`)**: Fizx soft-body simulation canvas with Reset button (in-page remount, not page reload)
- **3D Models (`/models`)**: 3D model viewer
- **Press (`/press`)**: Placeholder "Coverage coming soon"
- **Footer**: Responsive with hamburger at md breakpoint, Sim2Real logo, social icon links (still placeholders `href="#"`)

## Key technical details
- `vite.config.ts`: `base: "/"` — required for custom domain `sim2real.bot`
- `src/App.tsx`: `basename="/"` in BrowserRouter
- `public/404.html`: SPA redirect trick for GitHub Pages (root-based, no prefix)
- Favicon: glossy 3D blue sphere SVG (`public/favicon.svg`), old `favicon.ico` deleted
- CSS: Space Grotesk font, all foreground vars set to white (`0 0% 100%`), background gradient `#016fb5 → #012b62`
- No Lovable references remaining (lovable-tagger removed from deps and vite config)

## MCP / push setup
- MCP GitHub tools currently restricted to `joetol2/realsim` (the proxy repo name)
- To push to `sim2real-v2`, need a new session with expanded repo access
- User has set GitHub app to "All repositories" — just needs a new session to take effect

## Pending: sim2real-v2 setup (4 manual edits needed OR push in new session)

The `sim2real-v2` repo was created by importing from `joetol2/sim2real`. It needs these 4 changes before GitHub Pages will work:

### 1. `vite.config.ts`
Change `base: "/"` → `base: "/sim2real-v2/"`
Also ensure `lovable-tagger` is removed (import and plugin usage).

### 2. `src/App.tsx`
Change `<BrowserRouter basename="/">` → `<BrowserRouter basename="/sim2real-v2">`

### 3. `public/404.html`
Replace entire file with:
```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Sim2Real</title>
    <script>
      var l = window.location;
      var base = '/sim2real-v2';
      var path = l.pathname.startsWith(base) ? l.pathname.slice(base.length) : l.pathname;
      l.replace(
        l.protocol + '//' + l.hostname + (l.port ? ':' + l.port : '') +
        base + '/?p=' + path.slice(1).replace(/&/g, '~and~') +
        (l.search ? '&q=' + l.search.slice(1).replace(/&/g, '~and~') : '') +
        l.hash
      );
    </script>
  </head>
  <body></body>
</html>
```

### 4. Create `.github/workflows/deploy.yml`
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          lfs: true
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

### 5. Enable GitHub Pages on sim2real-v2
`github.com/joetol2/sim2real-v2` → Settings → Pages → Source: **GitHub Actions** → Save

After these steps, preview URL will be: `https://joetol2.github.io/sim2real-v2/`

## What comes next (the v2 site)
The user wants to build a full non-stealth website on `sim2real-v2`. The live site (`sim2real`) stays in stealth mode while v2 is built and reviewed. Once approved, v2 becomes the live site.

The stealth messaging ("Stealth Mode", "We're not ready to say more yet") will be replaced with real content about what Sim2Real does.

## Social icon links
Footer social icons currently all have `href="#"` placeholders. User needs to provide real URLs.

## Git workflow
- Always push to `main` on whichever repo you're working on
- MCP push via `mcp__github__push_files` → then `git fetch origin main && git reset --hard origin/main` to sync local
- Never push to `claude/fix-github-pages-display-qAkcs` feature branch (stale, work is merged)
