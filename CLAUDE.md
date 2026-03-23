# vMix Layer Control

Extensão Chrome para controle visual ao vivo de layers do vMix via API HTTP.

## Estrutura

```
extension/
  app.js           # UI principal (GUID Panel, tabs, sidebar, inputs, events)
  lc-engine.js     # Motor SplitView (math, render, drag, presets, API sync)
  style.css        # Estilos
  index.html       # Entry point (carrega lc-engine.js antes de app.js)
  manifest.json    # Chrome Extension Manifest V3
  loader.js        # Content script (injeta em páginas vMix API)
  background.js    # Service worker
  privacy-policy.html  # Privacy policy (Chrome Web Store)
```

## vMix API (validada no vMix 29 4K)

- GET `/api` — Estado completo XML (inputs, overlays, position, crop)
- `SetLayer{N}PanX`, `SetLayer{N}PanY`, `SetLayer{N}Zoom` — posição da layer N
- `SetLayer{N}CropX1`, `SetLayer{N}CropX2`, `SetLayer{N}CropY1`, `SetLayer{N}CropY2` — crop
- `SetMultiViewOverlay` — atribuir input a layer slot
- `MultiViewOverlayOn` / `MultiViewOverlayOff` — visibilidade
- **Border via API NÃO existe** no vMix 29 (testado exaustivamente)

## SplitView Math (center crop)

Estado normalizado (0-1): x, y, w, h

```
Z = max(w, h)
PanX = (x + w/2) * 2 - 1
PanY = 1 - (y + h/2) * 2
CropX = (Z - w) / 2 / Z  →  CropX1 = CropX, CropX2 = 1 - CropX
CropY = (Z - h) / 2 / Z  →  CropY1 = CropY, CropY2 = 1 - CropY
```

## Convenções

- `_userHidden` flag: previne sync bidirecional de reativar layers que o usuário desligou
- `_posSet` flag: indica que a layer tem posição definida (não sobrescrever com dados do vMix)
- API dispatch: fila sequencial `_flushVMix()` com await (não paralelo)
- O input alvo é filtrado dos dropdowns (não pode ser layer de si mesmo)
