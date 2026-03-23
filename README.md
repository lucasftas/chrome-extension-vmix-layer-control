# vMix Layer Control

> Chrome extension for real-time visual control of vMix layers and multiview layouts — with a Stream Deck-style button grid, live layer editor, and Bitfocus Companion integration.

![vMix](https://img.shields.io/badge/vMix_29-Compatible-orange.svg)
![Chrome](https://img.shields.io/badge/Chrome-Extension_MV3-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## What it does

**vMix Layer Control** connects to the vMix HTTP API on your local network and gives you two powerful tools in a single Chrome extension:

### GUID Panel (Deck)
- **32-button grid** — drag vMix inputs from the panel to create quick-access buttons
- **Click or right-click** to copy GUID or Title Variable to clipboard
- **Companion Action Builder** — generate ready-to-paste actions for Bitfocus Companion
- **Multi-instance** — manage multiple vMix PCs from a single panel
- **Network Discovery** — scan your local subnet to find vMix instances automatically
- **Real-time tally** — visual feedback for PGM, streaming, and recording states

### Live MultiLayer Editor
- **Visual canvas** (16:9) for positioning vMix layers in real-time
- **10 layers** with dropdown selectors and scroll-to-change
- **SplitView Engine** — mathematically correct center-crop with zero distortion
- **Two drag modes**: Free (move) and Snap (resize neighbors at borders)
- **Snap sliders** on shared borders with pixel-position tooltips
- **Layout presets** with visual thumbnails:
  - **Split**: 50/50, 2/3+1/3, 1/3+2/3, Triple
  - **Multiview**: Symmetric (equal cells) and PGM (program + PIPs) modes
  - **AUTO**: detects active layer count and applies the best layout (1–10 layers)
- **Bidirectional sync** — changes made in the vMix GUI reflect in the extension within 1 second
- **Sequential API queue** — prevents request flooding (~30fps throttle)

---

## How to Install

### Step 1 — Download

1. Click the green **`< > Code`** button on this page
2. Click **`Download ZIP`**
3. Extract the ZIP to any folder on your computer

### Step 2 — Load in Chrome

1. Open **Google Chrome**
2. Navigate to `chrome://extensions/`
3. Enable **Developer Mode** (toggle in the top-right corner)
4. Click **Load unpacked**
5. Select the **`extension`** folder inside the extracted ZIP
6. The extension icon will appear in your toolbar

### Step 3 — Connect to vMix

1. Make sure **vMix is running** with the **Web Controller enabled**:
   - In vMix: `Settings → Web Controller → Enable`
   - Default port: `8088`
2. Open the extension and add your vMix instance (IP + port)
3. Or navigate to `http://<your-vmix-ip>:8088/api` — the extension auto-injects

---

## vMix API Reference

The extension uses these vMix HTTP API functions (validated on vMix 29 4K):

### Layer Position (per-layer)
| Function | Description |
|---|---|
| `SetLayer{N}PanX` | Horizontal position (-1 to 1) |
| `SetLayer{N}PanY` | Vertical position (1 to -1, inverted) |
| `SetLayer{N}Zoom` | Uniform scale |
| `SetLayer{N}CropX1` | Left crop (0 to 1) |
| `SetLayer{N}CropX2` | Right crop boundary (1 - trim) |
| `SetLayer{N}CropY1` | Top crop (0 to 1) |
| `SetLayer{N}CropY2` | Bottom crop boundary (1 - trim) |

### Layer Management
| Function | Description |
|---|---|
| `SetMultiViewOverlay` | Assign input to layer slot |
| `MultiViewOverlayOn` | Show layer |
| `MultiViewOverlayOff` | Hide layer |

### SplitView Math (Center Crop)
```
Z = max(w, h)
PanX = (x + w/2) * 2 - 1
PanY = 1 - (y + h/2) * 2
CropX = (Z - w) / 2 / Z     →  CropX1 = CropX,  CropX2 = 1 - CropX
CropY = (Z - h) / 2 / Z     →  CropY1 = CropY,  CropY2 = 1 - CropY
```

---

## Project Structure

```
vmix-layer-control/
├── extension/              # Chrome Extension (Manifest V3)
│   ├── app.js              # Main UI: GUID Panel, tabs, sidebar, inputs
│   ├── lc-engine.js        # SplitView Engine: math, render, drag, API sync
│   ├── style.css           # All styles
│   ├── index.html          # Entry point
│   ├── manifest.json       # Chrome extension manifest
│   ├── loader.js           # Content script (injects into vMix API pages)
│   ├── background.js       # Service worker
│   ├── privacy-policy.html # Privacy policy for Chrome Web Store
│   └── icon*.png           # Extension icons (16, 48, 128px)
├── CLAUDE.md               # Technical documentation
└── README.md
```

---

## Privacy & Security

- Runs **100% locally** on your network
- **No data leaves your machine** — no external servers, no analytics, no telemetry
- All settings stored in browser `localStorage`
- The `http://*/*` permission is used exclusively to reach vMix instances on your LAN
- [Full Privacy Policy](extension/privacy-policy.html)

---

## Requirements

- **Google Chrome** (or Chromium-based browser)
- **vMix** with Web Controller enabled (port 8088/8089/8090)
- Tested on **vMix 29 4K**

---

## License

MIT — free to use, modify, and distribute.

---

Developed by [Lucas Ftas](https://github.com/lucasftas)
