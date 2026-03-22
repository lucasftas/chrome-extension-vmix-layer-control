# vMix Layer Control

Extensão Chrome para controle visual ao vivo de layers do vMix via API HTTP.

## Estrutura

```
extension/       # Chrome Extension (Manifest V3)
  app.js         # Lógica principal (GUID Panel + Layer Control)
  style.css      # Estilos
  index.html     # Entry point
  manifest.json  # Chrome extension manifest
  loader.js      # Content script (injeta em páginas vMix API)
  background.js  # Service worker
```

## Arquitetura

- **Single-page app** embutida em Chrome Extension
- Conecta via HTTP GET/POST à API REST do vMix (`http://<ip>:8088/api`)
- Duas abas centrais: **Deck** (grid de botões GUID) e **Layer Control** (canvas 16:9 ao vivo)
- Layer Control envia `SetInputPosition` para o vMix em tempo real

## vMix API

- GET `/api` — Estado completo (XML)
- GET `/api?Function=SetInputPosition&Input=<key>&Value=<params>` — Posicionar layer
- Parâmetros de posição: `PanX`, `PanY`, `ZoomX`, `ZoomY`, `CropX1`, `CropY1`, `CropX2`, `CropY2`

## Coordenadas vMix

- **PanX/PanY**: -2 a 2 (0 = centro)
- **ZoomX/ZoomY**: escala (1.0 = tela cheia)
- **CropX1/Y1/X2/Y2**: recorte 0-1 (0,0,1,1 = sem corte)
