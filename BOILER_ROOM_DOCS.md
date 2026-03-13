# 🖤 The Boiler Room Gentleman — CI Pipeline Docs

_He works quietly. He works faithfully. Do not disturb him unless a token has expired._


https://saltthoughts.co.uk/
---

## Overview

This project uses a GitHub Actions workflow to automatically deploy the game (clickbrain https://github.com/daoslies/CCYW2AI) (in its own repo) into the main website repo (this one) whenever changes are pushed.

**The flow:**
1. You push changes to the **game repo**
2. A GitHub Action spins up a temporary virtual machine
3. It builds the game with Vite (`npm run build`)
4. It clones the **main site repo** onto that same machine
5. It copies the fresh `dist/` build into `public/game/` in the main site
6. It commits and pushes to the main site repo as _"The Boiler Room Gentleman"_
7. That commit triggers the existing **Kinsta CI pipeline**, which redeploys the main site
8. Virtual machine is discarded

You never have to think about it. Push to the game repo, the site updates.

---

## File Locations

| What | Where |
|------|-------|
| Workflow file | `.github/workflows/deploy-game.yml` in the **game repo** |
| Game build output | `public/game/` in the **main site repo** |
| Game accessible at | `yoursite.com/game/index.html` |

---

## Token Rotation (Do This When The Gentleman Falls Over)

The GitHub Personal Access Token (PAT) that authorises the Gentleman to push to the main site repo **expires annually**. When it expires, the Action will fail with an authentication error and you'll get an email from GitHub.

**To rotate the token:**

1. Go to **GitHub → Settings → Developer Settings → Personal Access Tokens → Fine-grained tokens**
2. Generate a new token:
   - Set expiration to **1 year**
   - Set repository access to **the main site repo only**
   - Set permissions: **Contents → Read and write** (everything else: No access)
3. Copy the token value (you won't see it again)
4. Go to the **game repo → Settings → Secrets and variables → Actions**
5. Find `MAIN_REPO_TOKEN` and update it with the new token value
6. Done — the Gentleman is back at his furnace

**Reminder:** Set a calendar reminder for ~11 months time so you're not caught off guard.

---

## Vite Base Path

The game's `vite.config.js` has `base: '/game/'` set. This is important — without it, the built assets look for files at the root (`/assets/...`) instead of (`/game/assets/...`) and the game loads as a white screen.

Don't remove this.

---

## If Something Goes Wrong

Check the **Actions tab** in the game repo. Each push creates a workflow run — click into it to see which step failed and why.

**Common failures:**

| Error | Cause | Fix |
|-------|-------|-----|
| Authentication error | Token expired | See Token Rotation above |
| `package.json` not found | Wrong `working-directory` in workflow | Check the subfolder name in `deploy-game.yml` |
| White screen on the site | Vite base path missing | Ensure `base: '/game/'` is in `vite.config.js` |
| Build errors | Dependency issues | Run `npm install && npm run build` locally first |

---

## The Workflow File (for reference)

```yaml
# 🖤 The Boiler Room Gentleman - he works quietly, he works faithfully
# Do not disturb him unless a token has expired (see BOILER_ROOM_DOCS.md)

name: Boiler Room - Deploy game to main site

on:
  push:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 22

      - run: npm install
        working-directory: gmerpo

      - run: npm run build
        working-directory: gmerpo

      - name: The gentleman copies the files 🖤
        run: |
          git clone https://x-access-token:${{ secrets.MAIN_REPO_TOKEN }}@github.com/YOUR_USERNAME/YOUR_MAIN_REPO.git main-site
          rm -rf main-site/public/game
          cp -r gmerpo/dist/ main-site/public/game
          cd main-site
          git config user.email "boilerroom@spiritedaway.com"
          git config user.name "The Boiler Room Gentleman"
          git add .
          git commit -m "🖤 soot sprite delivery: update game build" --allow-empty
          git push
```
