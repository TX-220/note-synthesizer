# Publishing to GitHub

## Prerequisites
1. GitHub account (https://github.com/signup)
2. Git installed locally
3. Your Anthropic API key (for testing, not for repo)

## Step-by-Step

### 1. Create Repository on GitHub
```bash
# Visit https://github.com/new
# Repository name: note-synthesizer
# Description: Obsidian plugin for synthesizing multiple notes using Claude API
# Public (required for community plugins)
# Initialize with README: NO (we have one)
# License: MIT
# .gitignore: Node
```

### 2. Push Code to GitHub
```bash
cd /path/to/note-synthesizer
git init
git config user.name "Your Name"
git config user.email "your.email@example.com"
git add .
git commit -m "Initial commit: Note Synthesizer v1.0.0"
git branch -M main
git remote add origin https://github.com/TX-220/note-synthesizer.git
git push -u origin main
```

### 3. Create Release
```bash
git tag 1.0.0
git push origin 1.0.0

# On GitHub, go to Releases → Create new release from tag
# Title: Note Synthesizer v1.0.0
# Body: See CHANGELOG in README.md
# Upload files:
#   - main.js (built plugin)
#   - manifest.json
#   - main.ts (source)
```

### 4. Register with Obsidian Community Plugins
1. Fork https://github.com/obsidianmd/obsidian-sample-plugin
2. Update `manifest.json` in your repo (already done ✓)
3. Submit PR to obsidian-sample-plugin with your plugin info
   - PR should add entry to community-plugins.json
   - Format: `{ "id": "note-synthesizer", "name": "Note Synthesizer", "author": "Your Name", "repo": "TX-220/note-synthesizer" }`
4. Obsidian team reviews → merged → available in community plugins

## Repository Structure After Push

```
note-synthesizer/
├── README.md                    # Setup + usage
├── LICENSE                      # MIT
├── manifest.json                # Plugin metadata
├── main.ts                       # Source code
├── main.js                       # Built plugin (after npm run build)
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── esbuild.config.mjs           # Build config
├── .gitignore                   # Exclude build artifacts
└── .github/
    └── workflows/
        └── release.yml          # (Optional) Auto-build releases
```

## Build Before Publishing

```bash
npm install
npm run build
git add main.js manifest.json
git commit -m "Build v1.0.0"
git push
```

## After Submission

- Community plugins registry updates ~1-2 weeks after PR merge
- Users can install from Settings → Community Plugins
- Updates via GitHub releases are automatically synced

## Maintenance

- Update version in `manifest.json`
- Tag release: `git tag X.Y.Z`
- Push: `git push origin X.Y.Z`
- Create GitHub release with built artifacts
- Update README changelog

## Optional: Auto-Build with GitHub Actions

Create `.github/workflows/release.yml`:
```yaml
name: Build Plugin

on:
  push:
    tags:
      - '*'

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '16'
      - run: npm install
      - run: npm run build
      - uses: softprops/action-gh-release@v1
        with:
          files: |
            main.js
            manifest.json
          fail_on_unmatched_files: true
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

This auto-builds and uploads main.js + manifest.json when you push a tag.
