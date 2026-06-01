# Tmux for Acode

A plugin to use tmux terminal multiplexer in Acode editor on Android.

## Features

- Opens tmux terminal in the current file's directory
- Side button for quick access to tmux
- Automatic tmux installation if not present

## Requirements

- Acode app installed
- Termux or similar terminal app with tmux

## Installation

1. Download the plugin from Acode plugin store
2. Or build from source:
   ```bash
   npm install
   npm run build
   ```

## Usage

1. Open any file in Acode
2. Tap the "Tmux" button in the sidebar
3. The plugin will:
   - Install tmux (if not already installed)
   - Open tmux in the current file's directory

## Basic Tmux Commands

### Session Management

| Command | Description |
|---------|-------------|
| `tmux` | Start a new session |
| `tmux new -s <name>` | Start a named session |
| `tmux ls` | List sessions |
| `tmux attach -t <name>` | Attach to a session |
| `tmux detach` | Detach from session (Ctrl+b, d) |

### Windows

| Command | Description |
|---------|-------------|
| `Ctrl+b c` | Create new window |
| `Ctrl+b n` | Next window |
| `Ctrl+b p` | Previous window |
| `Ctrl+b ,` | Rename window |
| `Ctrl+b &` | Close window |

### Panes

| Command | Description |
|---------|-------------|
| `Ctrl+b %` | Split vertically |
| `Ctrl+b "` | Split horizontally |
| `Ctrl+b arrows` | Navigate panes |
| `Ctrl+b x` | Close pane |
| `Ctrl+b z` | Toggle pane zoom |

### Other

| Command | Description |
|---------|-------------|
| `Ctrl+b ?` | Show key bindings |
| `Ctrl+b [` | Copy/Scroll mode |

## Building

```bash
npm install
npm run build
```

## License

MIT