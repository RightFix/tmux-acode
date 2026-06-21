import plugin from '../plugin.json';

interface AcodeAlert {
  (title: string, message: string): void;
}

interface AcodeConfirm {
  (title: string, message: string): Promise<boolean>;
}

interface AcodeSelect {
  (title: string, options: string[]): Promise<string | null>;
}

interface Terminal {
  id: string;
}

interface TerminalModule {
  create(options: { name: string }): Promise<Terminal>;
  write(id: string, content: string): Promise<void>;
}

interface AcodeCommand {
  name: string;
  description: string;
  exec: () => void | Promise<void>;
}

interface EditorManager {
  isCodeMirror: boolean;
  activeFile?: { path?: string; filename?: string } | null;
  on(event: string, callback: () => void): void;
  off(event: string, callback: () => void): void;
  editor: EditorCommands;
  getActiveFile?: () => { path?: string; filename?: string } | null;
}

interface EditorCommands {
  commands: {
    addCommand: (cmd: AcodeCommand) => void;
    removeCommand: (name: string) => void;
  };
  activeFile?: { path?: string; filename?: string } | null;
  on(event: string, callback: () => void): void;
  off(event: string, callback: () => void): void;
}

interface AcodeModule {
  require: (module: string) => unknown;
  setPluginInit: (id: string, initFn: (baseUrl: string, $page: unknown, ctx: { cacheFileUrl: string; cacheFile: unknown }) => Promise<void>) => void;
  setPluginUnmount: (id: string, unmountFn: () => void) => void;
}

let acode: AcodeModule;
let editorManager: EditorManager;
let alert: AcodeAlert;
let terminal: TerminalModule;

class OpenCodeAlpinePlugin {
  baseUrl = '';
  private sideBtn: { show: () => void; hide: () => void } | null = null;

  async init(): Promise<void> {
    const win = window as Window & { acode?: AcodeModule; editorManager?: EditorManager };
    acode = win.acode as AcodeModule;
    editorManager = win.editorManager as EditorManager;
    
    alert = acode.require('alert') as AcodeAlert;
    terminal = acode.require('terminal') as TerminalModule;

    this.setupSideButton();
  }

  private getDirectory(filePath: string): string {
    const parts = filePath.split('/');
    parts.pop();
    let newPath = parts.join('/') || '/';
    if (newPath.includes('files/alpine/home')) {
      const paths = newPath.split('files/alphine/home')
      newPath = paths[1] || ''
    }
    else {
      const paths = newPath.split('storage/emulated/0')
      newPath = `../sdcard${paths[1]}`
    }
    return newPath
  }

  private getHeader(): HTMLElement | null {
    const root = document.querySelector("#root");
    return root?.querySelector('header') as HTMLElement | null;
  }

  private setupSideButton(): void {
    const self = this;
    const SideButton = acode.require('sideButton') as (options: {
      text: string;
      icon: string;
      onclick: () => void | Promise<void>;
      backgroundColor?: string;
      textColor?: string;
    }) => { show: () => void; hide: () => void };

    const runOpenCode = async () => {
      let filePath = '';
      
      const file = editorManager.activeFile as { path?: string; uri?: string; location?: string } | null;
      if (file?.path) filePath = file.path;
      else if (file?.uri) filePath = file.uri;
      else if (file?.location) filePath = file.location;
      
      if (!filePath && editorManager.editor) {
        const editorView = editorManager.editor as { state?: { doc?: { toString?: () => string } } };
        if (editorView.state?.doc?.toString) {
          alert('Tmux Terminal', 'Terminal active but no file path. Using default directory.');
          const term = await terminal.create({ name: 'Tmux' });
          await terminal.write(term.id, "apk add  tmux\r\n");
          await terminal.write(term.id, "tmux\r\n");
          return;
        }
      }
      
      if (!filePath) {
        const term = await terminal.create({ name: 'Tmux' });
        await terminal.write(term.id, "apk add tmux\r\n");
        await terminal.write(term.id, "tmux\r\n");  
        return;
      }
      
      const dir = self.getDirectory(filePath);
      const term = await terminal.create({ name: 'Tmux' });
      await terminal.write(term.id, "cd " + dir + "\r\n");
      await terminal.write(term.id, "tmux\r\n");
    };

    this.sideBtn = SideButton({
      text: 'Tmux',
      icon: 'tmux-icon',
      onclick: runOpenCode,
      backgroundColor: '#4CAF50',
      textColor: '#fff',
    });

    this.sideBtn.show();
  }


  async destroy(): Promise<void> {
    if (this.sideBtn) {
      this.sideBtn.hide();
      this.sideBtn = null;
    }
  }
}

const win = window as Window & { acode?: AcodeModule };
if (win.acode) {
  const opencodePlugin = new OpenCodeAlpinePlugin();
  win.acode.setPluginInit(plugin.id, async (baseUrl: string, $page: unknown, { cacheFileUrl, cacheFile }: { cacheFileUrl: string; cacheFile: unknown }) => {
    if (!baseUrl.endsWith('/')) baseUrl += '/';
    opencodePlugin.baseUrl = baseUrl;
    await opencodePlugin.init();
  });
  win.acode.setPluginUnmount(plugin.id, () => opencodePlugin.destroy());
}

export {};