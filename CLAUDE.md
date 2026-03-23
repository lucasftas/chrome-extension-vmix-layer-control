# vMix Layer Control

Extensão Chrome para controle visual ao vivo de layers do vMix via API HTTP.

## Estrutura

```
extension/
  app.js           # UI principal (GUID Panel, tabs, sidebar, inputs, temas, events)
  lc-engine.js     # Motor SplitView (math, render, drag, presets, API, undo, trim)
  style.css        # Estilos (temas Deck roxo / Layers laranja)
  index.html       # Entry point (carrega lc-engine.js antes de app.js)
  manifest.json    # Chrome Extension Manifest V3
  loader.js        # Content script (injeta em páginas vMix API)
  background.js    # Service worker
  privacy-policy.html  # Política de privacidade
```

## vMix API (validada no vMix 29 4K)

- GET `/api` — Estado completo XML (inputs, overlays, position, crop)
- `SetLayer{N}PanX/PanY/Zoom` — posição da layer N (1-based)
- `SetLayer{N}CropX1/CropX2/CropY1/CropY2` — crop (X2/Y2 são boundary, não trim)
- `SetMultiViewOverlay&Value=N,{key}` — atribuir input + `MultiViewOverlayOn` para ligar
- `SetMultiViewOverlay&Value=N,` — remover input (vírgula sem key) + `MultiViewOverlayOn` para deixar ON+None
- `MultiViewOverlayOn/Off` — visibilidade (não aparece no XML, invisível ao polling)
- **Border via API NÃO existe** no vMix 29

## SplitView Math

Estado normalizado (0-1): x, y, w, h → traduzido para vMix com compensação de 31px.

```
Z = max(w, h)
PanX = (x + w/2) * 2 - 1
PanY = 1 - (y + h/2) * 2
CropX = (Z - w) / 2 / Z  →  CropX1 = CropX, CropX2 = 1 - CropX - 0.016 (se cropX > 0)
CropY = (Z - h) / 2 / Z  →  CropY1 = CropY, CropY2 = 1 - CropY - 0.029 (se cropY > 0)
```

## Flags internos (por layer)

- `_posSet` — layer tem posição definida (não sobrescrever com dados do vMix)
- `_knownState` — estado ON/OFF é conhecido (false = checkbox indeterminado —)
- `_checkOff` — usuário/preset desligou o checkbox (sync e fetch não reativam)

## API Dispatch

- **Fire-and-forget** (estilo Companion): 7 fetches paralelos sem await
- **Verify-and-Resend**: 1s após envio, lê XML e reenvia mismatches (2 tentativas)
- **`_busy` flag**: bloqueia sync bidirecional durante aplicação de preset
- **Debounce 300ms** nos presets: último click wins
- **Throttle 33ms** (~30fps) para drag em tempo real

## Convenções

- Input alvo filtrado dos dropdowns (não pode ser layer de si mesmo)
- Preset OFF usa `MultiViewOverlayOff` (mantém input atribuído no vMix)
- Limpar layers usa `SetMultiViewOverlay&Value=N,` + `MultiViewOverlayOn` (None + ON)
- Undo: snapshot completo das 10 layers, max 30 etapas, em memória
- Canvas: 16:9 fixo calculado via JS com ResizeObserver, margem mínima 20px
