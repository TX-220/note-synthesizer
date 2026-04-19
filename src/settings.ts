import { App, PluginSettingTab, Setting } from 'obsidian';
import NoteSynthesizerPlugin from './main';
import { NoteSynthesizerSettings } from './types';

export class NoteSynthesizerSettingTab extends PluginSettingTab {
  plugin: NoteSynthesizerPlugin;

  constructor(app: App, plugin: NoteSynthesizerPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl('h2', { text: 'Note Synthesizer Settings' });

    new Setting(containerEl)
      .setName('API Endpoint')
      .setDesc('The API endpoint URL for synthesis requests')
      .addText((text) =>
        text
          .setPlaceholder('https://api.anthropic.com/v1/messages')
          .setValue(this.plugin.settings.apiEndpoint)
          .onChange(async (value) => {
            this.plugin.settings.apiEndpoint = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Model Name')
      .setDesc('The AI model to use for synthesis')
      .addText((text) =>
        text
          .setPlaceholder('claude-3-5-sonnet-20241022')
          .setValue(this.plugin.settings.modelName)
          .onChange(async (value) => {
            this.plugin.settings.modelName = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('API Key')
      .setDesc('Your API key (stored securely by Obsidian)')
      .addText((text) =>
        text
          .setPlaceholder('Enter your API key')
          .setValue(this.plugin.settings.apiKey)
          .onChange(async (value) => {
            this.plugin.settings.apiKey = value;
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName('Summary Length')
      .setDesc('Choose the length of the synthesized summary')
      .addDropdown((dropdown) =>
        dropdown
          .addOption('brief', 'Brief (2-3 paragraphs)')
          .addOption('medium', 'Medium (1-2 pages)')
          .addOption('comprehensive', 'Comprehensive')
          .setValue(this.plugin.settings.summaryLength)
          .onChange(async (value) => {
            this.plugin.settings.summaryLength = value as 'brief' | 'medium' | 'comprehensive';
            await this.plugin.saveSettings();
          })
      );
  }
}
