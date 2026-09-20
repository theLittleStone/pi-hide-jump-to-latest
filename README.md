# pi-hide-jump-to-latest

Hide Pi's fullscreen **“↓ Jump to latest message”** overlay.

Pi 0.85+ 在全屏模式、transcript 未跟到底时会叠一行跳转提示。本扩展把它去掉。`End` / `tui.altScreen.bottom` 仍可滚到最新消息。

> **Unofficial.** This patches private TUI internals, not a stable API. A future Pi release may break it; the extension then no-ops instead of crashing.

[English](#english) · [简体中文](#简体中文)

---

## 简体中文

### 要求

- Pi **0.85.0** 或更高
- 交互式 TUI（print / json 模式无界面，会自动跳过）

### 安装

发布后：

```bash
pi install npm:pi-hide-jump-to-latest
pi install git:github.com/OldSuns/pi-hide-jump-to-latest
```

开发期（当前目录）：

本仓库若放在 `~/.pi/agent/extensions/pi-hide-jump-to-latest/`，根目录 `index.ts` 会被 Pi 自动发现。也可以：

```bash
pi install /absolute/path/to/pi-hide-jump-to-latest
pi -e /absolute/path/to/pi-hide-jump-to-latest/extensions/hide-jump-to-latest.ts
```

装完 `/reload` 或重启 Pi。

**不要双开：** 发布并 `pi install` 之后，请把源码目录移出 `~/.pi/agent/extensions/`，否则会加载两次。

### 卸载

```bash
pi remove npm:pi-hide-jump-to-latest
```

卸载后需要 **重启 Pi**。原型补丁不会随 `/reload` 还原。

### 行为

- 只隐藏全屏横幅，不改变滚动、搜索条或快捷键
- Pi 内部字段改名或消失时静默失效，不抛错

---

## English

### Requirements

- Pi **0.85.0+**
- Interactive TUI (print / json modes are skipped)

### Install

After publish:

```bash
pi install npm:pi-hide-jump-to-latest
pi install git:github.com/OldSuns/pi-hide-jump-to-latest
```

During development, a checkout at `~/.pi/agent/extensions/pi-hide-jump-to-latest/` is auto-discovered via `index.ts`. You can also:

```bash
pi install /absolute/path/to/pi-hide-jump-to-latest
pi -e /absolute/path/to/pi-hide-jump-to-latest/extensions/hide-jump-to-latest.ts
```

Then `/reload` or restart Pi.

Do not leave this folder under `~/.pi/agent/extensions/` after installing the npm/git package, or it will load twice.

### Uninstall

```bash
pi remove npm:pi-hide-jump-to-latest
```

Restart Pi after uninstall. The prototype patch is not undone by `/reload`.

### Behavior

- Hides the fullscreen overlay only. Scrolling, the search bar, and the End shortcut stay as they are.
- If Pi's internals change, the extension fails closed (no-op) instead of throwing.
