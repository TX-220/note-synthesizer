# Note Synthesizer

## Author

TX-220 — Concept, design, direction. Claude (Anthropic) — Implementation. Claude Code & Claude Desktop — Development. Gemini (UI/styling) — *dendrite, nodebook only*.

An Obsidian plugin that synthesizes multiple notes by identifying overlapping sections and unique insights. Perfect for integrating information across technical documents, research notes, and knowledge bases.

## Features

- **Multi-note synthesis**: Select 2+ markdown files and generate an integrated summary
- **Overlap detection**: Automatically identifies and merges redundant content
- **Unique insights highlighting**: Preserves original perspectives from each source
- **Flexible API support**: Works with Claude API (default) or any OpenAI-compatible endpoint
- **Advanced configuration**: Full control over API endpoint, model selection, and output length
- **Encrypted key storage**: API keys stored securely in Obsidian settings
- **Cross-platform**: Works on Windows, macOS, and Linux

## Installation

### From Obsidian Community Plugins (Coming Soon)
1. Open Obsidian Settings → Community Plugins
2. Search for "Note Synthesizer"
3. Click Install
4. Enable the plugin

### Manual Installation
1. Download the latest release from [GitHub Releases](https://github.com/TX-220/note-synthesizer/releases)
2. Extract the zip file
3. Copy the folder to `VaultFolder/.obsidian/plugins/note-synthesizer/`
4. Reload Obsidian or restart the app
5. Enable "Note Synthesizer" in Settings → Community Plugins

### Development Installation
```bash
git clone https://github.com/TX-220/note-synthesizer.git
cd note-synthesizer
npm install
npm run dev
```

Then copy the plugin folder to your vault's `.obsidian/plugins/` directory.

## Usage

### Basic Workflow

1. **Configure API Settings**
   - Open Obsidian Settings → Note Synthesizer
   - Enter your API key
   - (Optional) Adjust model, endpoint, and summary length

2. **Run Synthesis**
   - Press `Ctrl+P` (or `Cmd+P` on Mac) to open command palette
   - Search for "Synthesize Notes"
   - Select 2 or more markdown files from your vault
   - Click "Synthesize"
   - A new timestamped note is created with the synthesis

3. **Review Output**
   - The generated note includes source file list and synthesis timestamp
   - Copy/edit as needed in your workflow

### Configuration

#### API Endpoint
- **Default**: `https://api.anthropic.com/v1/messages` (Anthropic Claude)
- **For local LLM**: `http://localhost:11434/v1/messages` (Ollama format)
- **Custom**: Any OpenAI-compatible endpoint

#### Model Name
- **Claude (Anthropic)**: `claude-3-5-sonnet-20241022`, `claude-3-opus-20240229`
- **Local (Ollama)**: `llama2`, `mistral`, `neural-chat`, etc.
- Fully customizable—enter any model your endpoint supports

#### API Key
- Encrypted in Obsidian settings
- Required for any API call
- Does NOT store in plaintext

#### Summary Length
- **Brief**: 2-3 paragraphs (default)
- **Medium**: 1-2 pages
- **Comprehensive**: Detailed with subsections

## API Configuration Examples

### Anthropic Claude (Default)
```
Endpoint: https://api.anthropic.com/v1/messages
Model: claude-3-5-sonnet-20241022
API Key: sk-ant-... (from https://console.anthropic.com)
```

### Local Ollama
```
Endpoint: http://localhost:11434/v1/messages
Model: llama2 (or mistral, neural-chat, etc.)
API Key: (can be empty or any string)
```

## Synthesis Process

The plugin:
1. Reads all selected markdown files
2. Combines their content into a single document
3. Sends to your configured API with a synthesis prompt
4. Prompt instructs the model to:
   - Identify overlapping sections and merge them
   - Extract unique insights from each source
   - Format output according to selected length
5. Creates a new timestamped note with the synthesis
6. Opens the note in your active editor

## Supported Models

### Anthropic Claude
- claude-3-5-sonnet-20241022 (recommended for balance)
- claude-3-opus-20240229 (best quality, slower)
- claude-3-haiku-20240307 (fastest, lower quality)

### Open Source (via Ollama, LM Studio, vLLM)
- llama2
- mistral
- neural-chat
- phi
- Any model your local setup supports

## Troubleshooting

### "API key not configured"
- Settings → Note Synthesizer
- Enter your API key in the "API Key" field
- Save and retry

### "API Error: 401"
- Check your API key is correct
- Verify it has API access permissions
- For Anthropic: https://console.anthropic.com/account/keys

### "API Error: 404"
- Verify API endpoint URL is correct
- If using local LLM, ensure it's running: `ollama serve`
- Check model name matches your endpoint

### "Failed to read [filename], skipping"
- Ensure file exists and is readable
- Check file is valid markdown (.md)
- Retry operation

### Plugin doesn't appear in Community Plugins
- Reload Obsidian or restart the app
- Check Settings → Community Plugins → Installed, toggle off/on

## Development

### Prerequisites
- Node.js 16+
- npm or yarn
- Obsidian installed (for testing)

### Build
```bash
npm run build  # Production build (minified)
npm run dev    # Development build (watch mode)
```

### Testing
1. Create a test vault with sample markdown files
2. Copy the built plugin to `.obsidian/plugins/note-synthesizer/`
3. Enable the plugin in Obsidian Settings
4. Run "Synthesize Notes" command with test files

## Architecture

```
main.ts
├── NoteSynthesizerPlugin (main plugin class)
│   ├── Command: "Synthesize Notes"
│   ├── File Picker Modal
│   ├── Synthesis API caller
│   └── Output note generator
├── FilePickerModal (UI for file selection)
└── NoteSynthesizerSettingTab (settings UI)
```

## Security

- API keys are stored in Obsidian's secure data store (encrypted at rest)
- No API calls are made without explicit user action
- No telemetry or external tracking
- Open source—audit the code anytime

## License

MIT — See [LICENSE](LICENSE) file for details.

## Support

Found a bug or have a feature request?
- [GitHub Issues](https://github.com/TX-220/note-synthesizer/issues)
- [GitHub Discussions](https://github.com/TX-220/note-synthesizer/discussions)

## Changelog

### v1.0.0 (Initial Release)
- Multi-note file picker
- Synthesis with overlap detection
- Configurable API endpoint and model
- Encrypted API key storage
- Summary length options
- Cross-platform support (Windows, macOS, Linux)
