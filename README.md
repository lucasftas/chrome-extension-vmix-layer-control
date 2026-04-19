# vMix Layer Control

> Extensão Chrome para controle visual em tempo real de **inputs, multilayer e anchor slip** do vMix — toda a orquestração da sua live ao lado do browser.

![Version](https://img.shields.io/badge/version-4.2.0-brightgreen.svg)
![vMix](https://img.shields.io/badge/vMix_29-Compatível-orange.svg)
![Chrome](https://img.shields.io/badge/Chrome-Extension_MV3-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## 📥 Download

<div align="center">

### [⬇️ Baixar v4.2.0 (instalação sem compactação)](https://github.com/lucasftas/chrome-extension-vmix-layer-control/releases/download/v4.2.0/vmix-layer-control-v4.2.0.zip)

**[📋 Ver todas as releases](https://github.com/lucasftas/chrome-extension-vmix-layer-control/releases)**

</div>

---

## 🚀 Como Instalar no Chrome

### Passo 1 · Baixar e extrair
1. Clique no botão **⬇️ Baixar v4.2.0** acima
2. Salve o arquivo `vmix-layer-control-v4.2.0.zip` em uma pasta fixa (ex: `C:\Tools\vmix-layer-control\`)
3. Clique com o botão direito no zip → **Extrair tudo** → confirme

> 💡 **Importante:** não apague nem mova a pasta depois de carregar no Chrome — a extensão aponta pra esse caminho físico.

### Passo 2 · Carregar no Chrome
1. Abra o Chrome e digite na barra de endereços: `chrome://extensions/`
2. No canto superior direito, ative o **Modo do desenvolvedor** (toggle)
3. Clique em **Carregar sem compactação**
4. Selecione a pasta **`extension`** que está **dentro** da pasta extraída

A extensão aparece na barra de ferramentas com o ícone `v` em roxo. Fixe clicando no ícone de quebra-cabeça 🧩 → alfinete ao lado de "vMix Layer Control".

### Passo 3 · Configurar o vMix
1. No vMix: `Settings → Web Controller → Enable`
2. A porta padrão é `8088` (mantenha ou anote se mudar)
3. Garanta que o PC do vMix está na mesma rede que você vai acessar

### Passo 4 · Conectar
1. Clique no ícone da extensão no Chrome
2. Adicione sua instância: **IP + Porta** do vMix (ex: `192.168.1.50:8088`)
3. Se aparecer **🟢 Online** na sidebar, está pronto

> 🔁 **Atualizar a extensão:** quando sair uma nova versão, baixe o novo zip, extraia **substituindo** os arquivos da pasta, e em `chrome://extensions/` clique em **Recarregar** (↻) no card da extensão.

---

## 🎯 O que faz

Três abas em uma única extensão, cada uma com tema visual próprio:

### 🟣 Aba **Inputs** — catálogo de GUIDs
- **Lista completa** de inputs do vMix com drag, click e contextmenu
- **Modo Grupos** (novo em v4.2.0): agrupa por tipo (Capture, Cor, Mic, Vídeo, …) com headers coloridos colapsáveis
- **Filtros** por tipo + busca textual por nome
- **Copy GUID** (click) ou **Copy Variável de Título** (contextmenu) — formato pronto pra colar no Bitfocus Companion
- **Painel Histórico** (colapsado por padrão) — últimas 50 cópias com recopy rápido
- **Multi-instância** — gerencie vários PCs com vMix numa única sidebar

### 🟠 Aba **Live MultiLayer Editor** — posicione até 10 layers ao vivo
- **Canvas visual 16:9** responsivo com ResizeObserver
- **Drag Free** (mover layer) e **Drag Snap** (redimensionar fronteiras compartilhadas)
- **Presets** com miniaturas SVG:
  - Split: 50/50, 2/3+1/3, 1/3+2/3, Triple, 4-Grid
  - MultiView: Simétrico + PGM (1–10 layers) + AUTO
- **Sliders** de borda entre layers (tooltip em pixels 0–1920/1080)
- **Lock Y / Reset Y / Aparar / Swap / Sync / Align**
- **Undo/Redo** (Ctrl+Z / Ctrl+Y) com até 30 snapshots
- **Sync bidirecional** — polling 1s, pull fresh ao trocar de aba
- **Verify-and-Resend** — reenvio automático de mismatches (2 tentativas)
- **Dispatch no mouseup** — 7 comandos `SetLayer{N}*` enviados uma vez, sem flood

### 🟢 Aba **Anchor Slip X** — reenquadramento por crop deslizante
- **Slip horizontal** dentro do crop: mostra um pedaço diferente da textura **sem mover a layer** no canvas (efeito máscara real)
- **Transform Handles** pontilhados sobre o crop visível
- **Ghost Texture** transbordando o canvas com SVG de referência (grid A1–I16) tingido com o hue da layer
- **Snap magnético no centro** (threshold 0.05) com flash verde
- **Duplo-click** ou **Centralizar** para reset rápido
- **Envio só no release** — zero tráfego durante drag

### Integração entre abas
- **Target compartilhado**: ao trocar de aba, o input selecionado é preservado
- **Badge `SLIP`** na row da layer quando `slipX ≠ 0` (visível nas duas abas)
- **Tarja de warning** no Multilayer quando o target tem slip ativo — avisa que aplicar preset zera
- **Temas por aba**: Inputs roxo, Multilayer laranja, Anchor verde

---

## 📐 Matemática

### Multilayer (Center Crop)
```
Z = max(w, h)
panX = (x + w/2)·2 − 1
panY = 1 − (y + h/2)·2
baseCropX = (Z − w) / 2·Z
baseCropY = (Z − h) / 2·Z
cropX1 = baseCropX + trim.left/Z
cropX2 = (1 − baseCropX) − trim.right/Z
```

### Anchor Slip X (efeito máscara)
```
slipOffsetX = slipX · baseCropX           (slipX ∈ [−1, +1])
panX_vmix   = panX_base − 2·slipOffsetX   ← compensa deslocamento
cropX1_vmix = baseCropX + slipOffsetX
cropX2_vmix = (1 − baseCropX) + slipOffsetX
```

A bounding box é deslocada no sentido oposto ao crop: a janela visível fica fixa, só o conteúdo desliza internamente.

---

## 🔌 Referência vMix HTTP API

### Posição por layer
| Função | Range | Descrição |
|---|---|---|
| `SetLayer{N}PanX` | -1..+1 | Posição horizontal |
| `SetLayer{N}PanY` | -1..+1 (invertido) | Posição vertical |
| `SetLayer{N}Zoom` | 0+ | Escala uniforme |
| `SetLayer{N}CropX1/Y1` | 0..1 | Crop superior-esquerdo |
| `SetLayer{N}CropX2/Y2` | 0..1 | Crop inferior-direito (boundary) |

### Gerenciamento de layers
| Função | Descrição |
|---|---|
| `SetMultiViewOverlay&Value=N,{key}` | Atribui input ao slot N |
| `SetMultiViewOverlay&Value=N,` | Remove input (vírgula sem key) |
| `MultiViewOverlayOn&Value=N` | Liga visibilidade |
| `MultiViewOverlayOff&Value=N` | Desliga visibilidade |

---

## 📂 Estrutura

```
chrome-extension-vmix-layer-control/
├── extension/
│   ├── app.js              # UI: inputs, tabs, sidebar, handlers
│   ├── lc-engine.js        # Motor: math SplitView + Anchor, render, drag, API
│   ├── style.css           # Temas + componentes
│   ├── index.html          # Entry point
│   ├── manifest.json       # Chrome extension manifest V3
│   ├── loader.js           # Content script (injeta em /api)
│   ├── background.js       # Service worker
│   └── icon*.png + privacy-policy.html
├── CHANGELOG.md            # Histórico de versões
├── IMPLEMENTATIONS.md      # Notas técnicas por release
├── OPERATIONS.md           # Log operacional
├── TEST-CHECKLIST.md       # Checklist manual de validação
└── CLAUDE.md               # Convenções e contexto para automação
```

---

## 🔒 Privacidade

- Roda **100% localmente**. Zero servidores externos, zero analytics, zero telemetria.
- Configurações salvas apenas no `localStorage` do Chrome.
- Permissão `http://*/*` usada exclusivamente para falar com instâncias vMix na sua LAN.
- [Política de Privacidade completa](extension/privacy-policy.html)

---

## ✅ Requisitos

- **Google Chrome** (ou Chromium/Edge/Brave)
- **vMix** com Web Controller ativado (porta 8088/8089/8090)
- Testado no **vMix 29 4K** em Windows 11

---

## 📜 Licença

MIT — livre para usar, modificar e distribuir.

---

Desenvolvido por **[Lucas Ftas](https://github.com/lucasftas)** · Co-autoria técnica: Claude Opus 4.7
