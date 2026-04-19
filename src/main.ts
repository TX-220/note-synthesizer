import { Plugin, TFile, Notice } from 'obsidian';
import { NoteSynthesizerSettings, DEFAULT_SETTINGS } from './types';
import { NoteSynthesizerSettingTab } from './settings';
import { SynthesizeModal, ErrorModal } from './synthesize-modal';
import { sendToApi } from './api-client';

export default class NoteSynthesizerPlugin extends Plugin {
  settings: NoteSynthesizerSettings;

  async onload(): Promise<void> {
    await this.loadSettings();

    this.addSettingTab(new NoteSynthesizerSettingTab(this.app, this));

    this.addCommand({
      id: 'synthesize-notes',
      name: 'Synthesize Notes',
      callback: () => {
        if (!this.settings.apiKey) {
          new Notice('API key not configured. Open Settings and configure the API key.');
          return;
        }
        new SynthesizeModal(this.app, this).open();
      },
    });

    console.log('Note Synthesizer plugin loaded');
  }

  async onunload(): Promise<void> {
    console.log('Note Synthesizer plugin unloaded');
  }

  async loadSettings(): Promise<void> {
    const data = await this.loadData();
    this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

  async runSynthesis(files: TFile[]): Promise<void> {
    const fileNames = files.map((f) => f.name).join(', ');

    try {
      new Notice(`Synthesizing ${files.length} notes...`);

      const fileContents: string[] = [];
      for (const file of files) {
        try {
          const content = await this.app.vault.read(file);
          fileContents.push(`--- File: ${file.name} ---\n${content}`);
        } catch (error) {
          console.warn(`Failed to read file ${file.name}:`, error);
          new Notice(`Warning: Could not read ${file.name}, skipping...`);
        }
      }

      if (fileContents.length === 0) {
        new Notice('No files could be read. Synthesis cancelled.');
        return;
      }

      const userContent = fileContents.join('\n\n');

      const systemPrompt = this.buildSystemPrompt(this.settings.summaryLength);

      const synthesis = await sendToApi(
        this.settings.apiEndpoint,
        this.settings.apiKey,
        this.settings.modelName,
        systemPrompt,
        userContent
      );

      const timestamp = this.getTimestamp();
      const outputFileName = `Synthesis_${timestamp}.md`;
      const outputContent = `# Synthesis: ${fileNames}\n\n${synthesis}`;

      const newFile = await this.app.vault.create(outputFileName, outputContent);
      await this.app.workspace.getLeaf().openFile(newFile);

      new Notice(`Synthesis complete: ${outputFileName}`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      new ErrorModal(this.app, errorMsg, () => this.runSynthesis(files)).open();
    }
  }

  private buildSystemPrompt(length: 'brief' | 'medium' | 'comprehensive'): string {
    const basePrompt =
      'You are a document analyst. Synthesize these sources by: 1) Identifying overlapping sections and merging them, 2) Highlighting unique insights from each source. Output as a structured document.';

    const lengthGuidance = {
      brief: 'Produce a brief synthesis of 2–3 paragraphs.',
      medium: 'Produce a medium-length synthesis of 1–2 pages.',
      comprehensive: 'Produce a comprehensive synthesis covering all key points in depth.',
    };

    return `${basePrompt}\n\n${lengthGuidance[length]}`;
  }

  private getTimestamp(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
  }
}
