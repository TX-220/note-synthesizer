import { App, Modal, TFile, ButtonComponent } from 'obsidian';
import NoteSynthesizerPlugin from './main';

export class SynthesizeModal extends Modal {
  plugin: NoteSynthesizerPlugin;
  selectedFiles: Set<TFile> = new Set();
  synthesizeBtn: ButtonComponent | null = null;

  constructor(app: App, plugin: NoteSynthesizerPlugin) {
    super(app);
    this.plugin = plugin;
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();

    contentEl.createEl('h2', { text: 'Synthesize Notes' });
    contentEl.createEl('p', { text: 'Select 2 or more files to synthesize:' });

    const markdownFiles = this.app.vault.getMarkdownFiles();
    if (markdownFiles.length === 0) {
      contentEl.createEl('p', {
        text: 'No markdown files found in vault.',
        cls: 'note-synthesizer-warning',
      });
      return;
    }

    const fileListEl = contentEl.createDiv('note-synthesizer-file-list');
    fileListEl.style.maxHeight = '300px';
    fileListEl.style.overflowY = 'auto';
    fileListEl.style.border = '1px solid var(--background-secondary-alt)';
    fileListEl.style.padding = '10px';
    fileListEl.style.marginBottom = '15px';

    markdownFiles.forEach((file) => {
      const fileItemEl = fileListEl.createDiv('note-synthesizer-file-item');
      fileItemEl.style.display = 'flex';
      fileItemEl.style.alignItems = 'center';
      fileItemEl.style.padding = '5px 0';

      const checkbox = fileItemEl.createEl('input', {
        type: 'checkbox',
        attr: { id: `file-${file.path}` },
      }) as HTMLInputElement;
      checkbox.style.marginRight = '10px';

      const label = fileItemEl.createEl('label', {
        text: file.name,
        attr: { htmlFor: `file-${file.path}` },
      });
      label.style.cursor = 'pointer';
      label.style.flex = '1';

      checkbox.addEventListener('change', (e) => {
        if ((e.target as HTMLInputElement).checked) {
          this.selectedFiles.add(file);
        } else {
          this.selectedFiles.delete(file);
        }
        this.updateSynthesizeButton();
      });
    });

    const buttonContainerEl = contentEl.createDiv('note-synthesizer-buttons');
    buttonContainerEl.style.display = 'flex';
    buttonContainerEl.style.gap = '10px';
    buttonContainerEl.style.justifyContent = 'flex-end';

    this.synthesizeBtn = new ButtonComponent(buttonContainerEl)
      .setButtonText('Synthesize')
      .onClick(async () => {
        if (this.selectedFiles.size < 2) {
          return;
        }

        const files = Array.from(this.selectedFiles);
        this.close();
        await this.plugin.runSynthesis(files);
      });

    new ButtonComponent(buttonContainerEl)
      .setButtonText('Cancel')
      .onClick(() => {
        this.close();
      });

    this.updateSynthesizeButton();
  }

  private updateSynthesizeButton(): void {
    if (this.synthesizeBtn) {
      this.synthesizeBtn.setDisabled(this.selectedFiles.size < 2);
    }
  }
}

export class ErrorModal extends Modal {
  message: string;
  onRetry: (() => Promise<void>) | null = null;

  constructor(app: App, message: string, onRetry?: () => Promise<void>) {
    super(app);
    this.message = message;
    this.onRetry = onRetry || null;
  }

  onOpen(): void {
    const { contentEl } = this;
    contentEl.empty();

    contentEl.createEl('h2', { text: 'Synthesis Error' });
    contentEl.createEl('p', { text: this.message });

    const buttonContainerEl = contentEl.createDiv('note-synthesizer-buttons');
    buttonContainerEl.style.display = 'flex';
    buttonContainerEl.style.gap = '10px';
    buttonContainerEl.style.justifyContent = 'flex-end';
    buttonContainerEl.style.marginTop = '20px';

    if (this.onRetry) {
      new ButtonComponent(buttonContainerEl)
        .setButtonText('Retry')
        .onClick(async () => {
          this.close();
          try {
            await this.onRetry!();
          } catch (error) {
            const errorMsg = error instanceof Error ? error.message : 'Unknown error';
            new ErrorModal(this.app, errorMsg, this.onRetry).open();
          }
        });
    }

    new ButtonComponent(buttonContainerEl)
      .setButtonText('Close')
      .onClick(() => {
        this.close();
      });
  }
}
