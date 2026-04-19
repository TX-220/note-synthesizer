# Note Synthesizer — Obsidian Plugin

A TypeScript Obsidian plugin that synthesizes multiple notes using an AI API (Anthropic or OpenAI-compatible).

## Features

- **Settings Panel**: Configure API endpoint, model name, API key, and summary length
- **File Picker Command**: Select 2+ markdown files from your vault
- **Synthesis Engine**: Sends file contents to API and creates timestamped output note
- **Error Handling**: Graceful failures with retry options

## Installation & Setup

### Build from Source

```bash
cd ~/projects/note-synthesizer
npm install
npm run build
```

This produces `main.js` (14KB bundled + minified).

### Install to Obsidian Vault

1. Create or open an Obsidian vault at `~/obsidian-vault` (or your preferred location)
2. Install the plugin:
   ```bash
   mkdir -p ~/obsidian-vault/.obsidian/plugins/note-synthesizer
   cp main.js manifest.json ~/obsidian-vault/.obsidian/plugins/note-synthesizer/
   ```
3. Open Obsidian → Settings → Community Plugins → Enable "Note Synthesizer"

### Configuration

1. Open Obsidian Settings → "Note Synthesizer"
2. Configure:
   - **API Endpoint**: `https://api.anthropic.com/v1/messages` (or compatible OpenAI endpoint)
   - **Model Name**: `claude-3-5-sonnet-20241022` (or your preferred model)
   - **API Key**: Your Anthropic or OpenAI API key (stored securely by Obsidian)
   - **Summary Length**: Brief, Medium, or Comprehensive

## Usage

1. Run command: **"Synthesize Notes"** (Ctrl/Cmd+P → search "Synthesize")
2. Select 2+ markdown files from the checklist
3. Click "Synthesize"
4. A new note `Synthesis_YYYY-MM-DD_HH-MM-SS.md` is created at vault root with the synthesis

## Development

### Dev Mode with Hot Reload

```bash
npm run dev
```

Then symlink the plugin into your vault:
```bash
ln -s ~/projects/note-synthesizer ~/obsidian-vault/.obsidian/plugins/note-synthesizer
```

Obsidian will reload the plugin when `main.js` changes.

### File Structure

```
src/
├── main.ts              # Plugin entry point, command registration, synthesis orchestration
├── types.ts             # Shared interfaces (Settings, ApiRequest, ApiResponse)
├── settings.ts          # Settings UI panel
├── synthesize-modal.ts   # File picker modal + error modal
└── api-client.ts        # HTTP client using Obsidian's requestUrl API
```

### Key Design Decisions

- **Obsidian requestUrl API**: Bypasses CORS, works on mobile
- **Timestamp filenames**: Ensures unique output files
- **Immutable settings**: Settings stored in plugin data (encrypted by Obsidian on device)
- **Skip-on-error**: If a file can't be read, logs warning and continues with others

## API Support

Works with:
- **Anthropic Claude API** (primary target)
- **OpenAI-compatible APIs** (same `/v1/messages` format)

System prompt adjusts based on selected summary length.

## Testing

To test in Obsidian:

1. Create or open a vault
2. Create a few test markdown files with different content
3. Enable the plugin in Community Plugins
4. Run "Synthesize Notes" command
5. Select 2+ files and synthesize
6. Verify the output note is created and opens in editor

## Build Output

- `main.js` (14KB): Bundled, minified plugin code
- `manifest.json` (287B): Plugin metadata
- Requires: Obsidian 0.15.0+
