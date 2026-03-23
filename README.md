# vMix Layer Control

> Extensão Chrome para controle visual em tempo real de layers e multiview do vMix — com grid de botões estilo Stream Deck, editor de layers ao vivo e integração com Bitfocus Companion.

![vMix](https://img.shields.io/badge/vMix_29-Compatível-orange.svg)
![Chrome](https://img.shields.io/badge/Chrome-Extension_MV3-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## O que faz

**vMix Layer Control** conecta à API HTTP do vMix na sua rede local e oferece duas ferramentas em uma única extensão Chrome:

### GUID Panel (Deck)
- **Grid de 32 botões** estilo Stream Deck com drag-and-drop
- **Click ou clique direito** para copiar GUID ou Variável de Título
- **Companion Action Builder** — gera ações prontas para colar no Bitfocus Companion
- **Multi-instância** — gerencie vários PCs com vMix em um único painel
- **Descoberta de Rede** — scan automático da sub-rede para encontrar instâncias vMix
- **Tally em tempo real** — feedback visual para PGM, streaming e gravação
- **Tema roxo** (cores Stream Deck)

### Live MultiLayer Editor
- **Canvas visual 16:9** responsivo para posicionar até 10 layers em tempo real
- **10 layers** com dropdowns, scroll-to-change e checkbox com 3 estados (—/✓/☐)
- **Motor SplitView** — center-crop matematicamente correto com compensação de 31px do renderer vMix
- **Dois modos de drag**: Free (mover) e Snap (redimensionar vizinhos nas bordas)
- **Snap sliders** nas fronteiras compartilhadas com tooltip em pixels (0–1920px)
- **Presets com miniaturas SVG**:
  - **Split**: 50/50, 2/3+1/3, 1/3+2/3, Triple, 4-Grid
  - **Multiview**: modos Simétrico + PGM (1–10 layers)
  - **AUTO**: detecta quantidade de layers e aplica o melhor layout
- **Botão Aparar** — corta layers que extrapolam o canvas e resolve sobreposições
- **Sync Layers** — liga todos os checkboxes no vMix de uma vez
- **Limpar layers** — remove inputs de layers desligadas
- **Undo/Redo** — Ctrl+Z / Ctrl+Y (Ctrl+Shift+Z) com histórico de até 30 etapas
- **Painel de histórico** — modal com lista de ações e timestamps
- **Verify-and-Resend** — após envio, verifica o XML do vMix e reenvia mismatches (2 tentativas)
- **Sync bidirecional** — polling 1s com proteção contra conflitos durante preset
- **Tela de boas-vindas** — "Selecione um input abaixo para começar"
- **Tema laranja** (cores Itaú)

---

## Como Instalar

### Passo 1 — Download

1. Clique no botão verde **`< > Code`** nesta página
2. Clique em **`Download ZIP`**
3. Extraia o ZIP em qualquer pasta

### Passo 2 — Carregar no Chrome

1. Abra o **Google Chrome**
2. Acesse `chrome://extensions/`
3. Ative o **Modo Desenvolvedor** (canto superior direito)
4. Clique em **Carregar sem compactação**
5. Selecione a pasta **`extension`** dentro do ZIP extraído

### Passo 3 — Conectar ao vMix

1. Certifique-se que o **vMix está rodando** com o **Web Controller ativado**:
   - No vMix: `Settings → Web Controller → Enable`
   - Porta padrão: `8088`
2. Abra a extensão e adicione sua instância vMix (IP + porta)
3. Ou navegue para `http://<ip-do-vmix>:8088/api` — a extensão injeta automaticamente

---

## Referência da API vMix

Funções HTTP validadas no **vMix 29 4K**:

### Posição por layer
| Função | Descrição |
|---|---|
| `SetLayer{N}PanX` | Posição horizontal (-1 a 1) |
| `SetLayer{N}PanY` | Posição vertical (1 a -1, invertido) |
| `SetLayer{N}Zoom` | Escala uniforme |
| `SetLayer{N}CropX1` | Crop esquerdo (0 a 1) |
| `SetLayer{N}CropX2` | Crop direito boundary (1 - trim) |
| `SetLayer{N}CropY1` | Crop superior (0 a 1) |
| `SetLayer{N}CropY2` | Crop inferior boundary (1 - trim) |

### Gerenciamento de layers
| Função | Descrição |
|---|---|
| `SetMultiViewOverlay` | Atribuir input a slot de layer |
| `SetMultiViewOverlay Value=N,` | Remover input do slot (vírgula sem key) |
| `MultiViewOverlayOn` | Ligar checkbox da layer |
| `MultiViewOverlayOff` | Desligar checkbox da layer |

### Matemática SplitView (Center Crop)
```
Z = max(w, h)
PanX = (x + w/2) * 2 - 1
PanY = 1 - (y + h/2) * 2
CropX = (Z - w) / 2 / Z     →  CropX1 = CropX,  CropX2 = 1 - CropX - 0.016
CropY = (Z - h) / 2 / Z     →  CropY1 = CropY,  CropY2 = 1 - CropY - 0.029
```
*Offset de 0.016 (X) e 0.029 (Y) compensa expansão de ~31px do renderer do vMix.*

### Aparar (Trim)
```
visLeft  = x + (cropX1 * width)     // posição visível em pixels
visRight = x + (cropX2 * width)
Se visLeft < 0:     cropX1 += (-visLeft / width)
Se visRight > 1920: cropX2 -= ((visRight - 1920 + 31) / width)   // 31px GAP
```

---

## Estrutura do Projeto

```
vmix-layer-control/
├── extension/              # Chrome Extension (Manifest V3)
│   ├── app.js              # UI: GUID Panel, tabs, sidebar, inputs, temas
│   ├── lc-engine.js        # Motor SplitView: math, render, drag, presets, API, undo
│   ├── style.css           # Estilos (temas Deck/Layers, canvas, layer list)
│   ├── index.html          # Entry point
│   ├── manifest.json       # Chrome extension manifest
│   ├── loader.js           # Content script (injeta em páginas vMix API)
│   ├── background.js       # Service worker
│   ├── privacy-policy.html # Política de privacidade
│   └── icon*.png           # Ícones (16, 48, 128px)
├── CLAUDE.md               # Documentação técnica
└── README.md
```

---

## Privacidade e Segurança

- Roda **100% localmente** na sua rede
- **Nenhum dado sai da sua máquina** — sem servidores externos, sem analytics, sem telemetria
- Configurações salvas no `localStorage` do navegador
- A permissão `http://*/*` é usada exclusivamente para acessar instâncias vMix na LAN
- [Política de Privacidade completa](extension/privacy-policy.html)

---

## Requisitos

- **Google Chrome** (ou navegador baseado em Chromium)
- **vMix** com Web Controller ativado (porta 8088/8089/8090)
- Testado no **vMix 29 4K**

---

## Licença

MIT — livre para usar, modificar e distribuir.

---

Desenvolvido por [Lucas Ftas](https://github.com/lucasftas)
