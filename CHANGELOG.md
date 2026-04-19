# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/).

## [4.1.9] — 2026-04-19 · Versão estável final

Consolida a série 4.1.4 → 4.1.9 numa release de produção. Foco total em refinamento de UX, consistência entre abas e correção matemática do Anchor Slip X.

### Added
- **Modo "Grupos" (Explorer-style)** na aba Inputs: toggle `Lista ↔ Grupos` na toolbar. No modo Grupos, inputs ficam agrupados por `displayType` com header colapsável colorido na cor do tipo (mesmo padrão dos cards).
- Ordenação de grupos com prioridade: **Capture → Cor → Mic/Line → Vídeo → resto** (ordem natural).
- Header de grupo colapsável individualmente (state em memória `STATE.collapsedGroups`).
- Toggle com label dinâmico ("Lista" ou "Grupos") ao lado do ícone SVG.
- Helper `_buildInputCard(input)` para evitar duplicação entre os dois modos.

### Changed
- Painel Histórico (aba Inputs) agora inicia **colapsado por padrão** — faixa vertical de 36px com ícone estilo TimeMachine (relógio + seta circular). Click no header expande/colapsa. Marcado internamente como candidato a remoção em releases futuras.
- Cor da `.inputs-toolbar` unificada com headers de grupo (`#e5e7eb`).
- Labels com cor clara (`#ddd`) em fundo claro substituídos por `#374151` (contraste adequado).

### Fixed
- **Anchor Slip X agora preserva a posição da layer** no canvas do vMix (efeito máscara real). `lcToVMix` compensa `panX = panX_base − 2·slipOffsetX`; `lcFromVMix` reverte via `cx = (panX + 1)/2 + slipOffsetX`. Validado ao vivo via API com sweep de `slipX = -1..+1`.
- Round-trip matemático: `slipX=+0.5` → `panX=-0.75, cropX 0.375..0.875` → volta pra `x=0, w=0.5, slipX=0.5` (6 casas de precisão).

### UX
- **Badge `SLIP`** (chip verde) na row da layer quando `|slipX| > 0.001` — visível em ambas as abas com tooltip do valor.
- **Tarja de warning** amarela no Multilayer quando o target tem slip ativo: `N layer(s) com anchor deslocado (L1, L3, ...) — aplicar preset vai centralizar`.
- **Sincronização de target entre abas**: ao trocar entre Multilayer e Anchor, o `targetInputKey` é espelhado; `_posSet` é resetado pra forçar pull fresh do vMix (mudanças feitas na aba anterior aparecem imediatamente).
- **Dispatch consistente**: Multilayer agora envia ao vMix **apenas no `mouseup`**, igual Anchor Slip X. Drag local segue a 30fps; os 7 comandos `SetLayer{N}*` saem uma única vez no release.

### Validated
- Testes via API HTTP direto no vMix 29 (localhost:8088, Input 1 "TESTE MULTLAYER") com animação sweep `slipX = -1 ↔ +1` em ciclo de 4s.
- Smoke test Node.js de `lcToVMix` / `lcFromVMix` com casos `slipX ∈ {+0.5, -1}`.
- Sintaxe validada em cada fase (`node -c extension/app.js extension/lc-engine.js`).

## [4.1.8] — 2026-04-19

### Changed
- **Painel Histórico (aba Inputs) colapsado por padrão**: agora abre como faixa vertical estreita (36px) com o título rotacionado. Clique no header alterna entre colapsado/expandido.
- Adicionada nota `⚠ Em avaliação — se não for útil, será removido em releases futuras` dentro do painel expandido.

### Why
- Ocupava muito espaço lateral sem uso comprovado. Fica acessível a um clique mas não rouba área da lista de inputs. Marca como candidato a remoção em release futura.

## [4.1.7] — 2026-04-19

### Changed
- **Multilayer agora envia ao vMix apenas no release do mouse** (mouseup), igual à aba Anchor Slip X. Drag local só re-renderiza o canvas; comandos `SetLayer{N}*` são disparados uma única vez quando o usuário solta.
- Remoção das chamadas `lcThrottleSend` em mousemove (`free` e `snap`). Comportamento consistente entre as duas abas de edição.

### Note
- Perda de preview "live" no vMix durante drag. Em troca, tráfego HTTP muito menor e animação local mais fluida.

## [4.1.6] — 2026-04-19

### Changed
- `switchPanelTab`: ao entrar em Multilayer ou Anchor, espelha o `targetInputKey` da aba oposta (se definido) e **reseta `_posSet=false`** em todas as layers da aba-destino, forçando pull fresh do vMix.
- Efeito: selecionar um input no Multilayer e trocar pro Anchor mantém a seleção; aplicar um preset 33/66 no Multilayer e voltar pro Anchor reflete a nova geometria imediatamente.

## [4.1.5] — 2026-04-19

### Added
- **Badge `SLIP`** (chip verde) na row da layer sempre que `slipX ≠ 0`. Aparece em ambas as abas (Multilayer e Anchor), tooltip mostra o valor exato do slip.
- **Tarja de warning** amarela no topo da aba Multilayer quando o target atual tem layers com slip ativo: `N layer(s) com anchor deslocado (L1, L3, …) — aplicar preset vai centralizar`.
- `_lcMakeSlipBadge(l)` e `lcUpdateSlipWarning()` em `lc-engine.js`. Warning atualizado em cada `lcRender`.

### Changed
- `lcRenderLayerList` e `lcAnchorRenderLayerList` agora anexam o badge após o resto da row.
- HTML do `#layerContent` ganha `<div id="lcSlipWarning">` (hidden por padrão).

## [4.1.4] — 2026-04-19

### Fixed
- **Anchor Slip X agora preserva a posição da layer (efeito máscara real).** Antes, deslocar `cropX1`/`cropX2` em paralelo fazia a bounding box da layer se mover no canvas do vMix (overlap na layer vizinha). Validado via API ao vivo com preset 50/50 no Input 1.
- `lcToVMix`: adicionada compensação `panX = panX_base − 2 · slipOffsetX` — a bounding box é deslocada no sentido oposto ao crop, mantendo a janela visível no mesmo lugar enquanto o conteúdo interno desliza.
- `lcFromVMix`: reverse ajustado — `cx = (panX + 1)/2 + slipOffsetX` remove a compensação antes de reconstruir a geometria original.

### Validated
- Round-trip matemático: `slipX=+0.5` → `panX=-0.75, cropX1=0.375, cropX2=0.875` → reverso retorna `x=0, w=0.5, slipX=0.5` exatos.
- Caso extremo `slipX=-1` → `panX=0, cropX1=0, cropX2=0.5` (toda a metade esquerda da textura aparece na janela esquerda do canvas).

## [4.1.0] — 2026-04-19

### Added
- **Nova aba "Anchor Slip X"** (3ª tab): desliza a âncora do crop horizontalmente dentro de cada layer mantendo a layer no mesmo lugar do canvas. Efeito máscara — só `cropX1`/`cropX2` movem em paralelo.
- Campo `slipX` (-1..+1) no modelo da layer (`lcMakeLayer`).
- `LAYER_HUES[10]` (hue HSL por índice derivado de `LC_COLORS`): Layer 1 → 240 (azul), Layer 2 → 0 (vermelho), ...
- `lcAnchorBuildTextureSVG(hue)` gera SVG de referência 16:9 (grid A1–I16, cruz central, diagonais) tingido por layer.
- `lcAnchorRender`, `lcAnchorRenderCanvas`, `lcAnchorRenderOverlay` — render dedicado do canvas anchor.
- `lcAnchorFitCanvas`, `lcAnchorStartResizeObserver` — equivalentes do multilayer apontando para `#anchorCanvas`.
- `lcAnchorShowWelcome` — placeholder quando sem input-alvo.
- `lcAnchorStartDrag`, `lcAnchorReset`, `lcAnchorResetSelected` — drag horizontal com snap no centro + reset.
- `_lcDrag` ganha tipo `'anchor'`; mousemove/mouseup globais tratam o tipo separadamente.
- Constantes: `LC_ANCHOR_SNAP_THRESHOLD` (0.05), `LC_ANCHOR_NEAR_EDGE` (0.75), `LC_ANCHOR_AT_EDGE` (0.92).
- CSS: `.anchor-*`, `.ghost-texture`, `.transform-handles` + 8 `.handle` (E/W destacadas), `.near-edge`, `.at-edge`, `.snapped`, keyframes `anchor-pulse-red` e `anchor-snap-flash`.

### Changed
- `lcToVMix`: incorpora `slipX * baseCropX` em `cropX1` e `cropX2` (paralelo).
- `lcFromVMix`: heurística média/diff separa `baseCropX` de `slipX` (trim.left/right zerados no pull — slip tem prioridade em X).
- `lcSnapshotState` / `lcRestoreSnapshot`: incluem `slipX`; restore escolhe entre `lcRender` e `lcAnchorRender` baseado em `STATE.activeTab`.
- `lcApplyPreset`: zera `slipX` junto com trim.
- `lcFetchInputLayers` + `lcSyncFromVMix`: aplicam `ov.slipX`.
- `lcRenderLayerList` / `lcUpdateRowVisuals`: aceitam `containerId` opcional (default `'layerList'`).
- `lcShowInputSelector`: atualiza label em ambas as abas; escolhe render baseado na aba ativa.
- `switchPanelTab` aceita `'anchor'`; classe `.mode-anchor` no `.content-area`; polling `lcStartSync` roda também em anchor.
- Ctrl+Z/Y funcionam em aba `anchor`.
- `manifest.json`: version 4.0.1 → 4.1.0; description menciona Anchor Slip X.

## [4.0.1] — 2026-04-19

### Added
- Sidebar colapsável via botão hamburger (☰) no topbar esquerdo. Default: fechada.
- Hamburger alterna entre ☰ e ✕ conforme estado da sidebar.
- Botão ✕ no header da sidebar + tecla **Esc** para fechar (respeita modais abertos).
- Preferência de sidebar persistida em `vmix_sidebar_open`.
- Classe `.sidebar-open` / `.sidebar-closed` no `.app-layout` controla visibilidade.
- Função `getExtensionVersion()` lê de `chrome.runtime.getManifest().version`.

### Changed
- **Layout por aba reestruturado**: `content-area` agora tem `.main-column` (flex column) + `.copy-history-panel` à direita.
  - Modo Inputs: `.deck-panel` colapsa (`flex: 0 0 auto`), `.inputs-panel` preenche.
  - Modo Multilayer: `.deck-panel` ocupa o topo (`flex: 3`), `.inputs-panel` no rodapé (`flex: 2`).
- `switchPanelTab` agora usa classes `.mode-inputs`/`.mode-layers` no `.content-area` em vez de DOM swap.
- Aba "Deck" renomeada para **"Inputs"** (ícone `layers`); Multilayer ganhou ícone `grid`.
- Versão exibida na sidebar-header agora é dinâmica (era "v1" hardcoded).
- `manifest.json` version bump: 3.1.0 → 4.0.1. Description atualizada.

### Removed
- `.deck-content` (era placeholder vazio); `.layer-content` herdou seus estilos.
- DOM swap do `.inputs-panel` (substituído por classes `.mode-*`).

## [4.0.0] — 2026-04-19

### Added
- **Copy History**: painel à direita no modo Deck com lista de até 50 cópias (timestamp, número, título, GUID). Cada linha tem botão "Copiar" para recopiar; botão global "Limpar". Storage em `vmix_copy_history`.
- `migrateV3ToV4()`: one-shot no boot remove chaves `vmix_deck_*` e `vmix_grid_size` do localStorage, marca `vmix_v4_migrated=1`.

### Changed
- **Layout 3 colunas** no modo Deck: sidebar | inputs (central) | histórico (direita). Multilayer Editor inalterado.
- `content-area` muda de `flex-direction: column` para `row`.
- Header do Deck agora é texto fixo "Inputs do vMix — clique para copiar o GUID" (era título dinâmico + botão Limpar Tudo).
- `copyData(data, btn)` sem parâmetro de modo; sempre copia `data.key` (GUID) e registra em histórico.
- `lcApplyPreset` não reseta mais overrides (removidos).

### Removed (23 features, breaking)
- **Companion Action Builder**: modal + 7 presets (PGM, Mute, Bus, Layer Set, Layer Toggle, Output, code copy).
- **Deck grid**: `renderDeck`, `renameButton`, `handleDrop`, `resizeAllLayouts`; HTML `.deck-grid`, `.btn-clear`, `.sd-btn*`; CSS `.sd-btn-*`, `.btn-companion`.
- **Grid Size Selector** (16/32/40/64 botões) + persistência em `vmix_grid_size`.
- **Properties Panel**: `lcRenderPropsPanel`, `LC_PROPS_FIELDS`; toggle collapsible; sistema de overrides (`_overrides`, `lcMakeOverrides`, `lcResetOverrides`); aplicação de overrides em `lcSendToVMix`; CSS `.lc-props-*`.
- **Gap sliders UI H/V** + `lcApplyGap`, `lcGetGapH/V`, `lcUpdateGapControlsUI`; HTML toolbar gap; STATE `rendererGapH`, `rendererGapV`, `gapLiveMode`.
- **Gap visualization**: cálculo de `layerInsets[]` em `_lcRenderBoxes` (inset visual por edge).
- **Copy Mode Toggle** (GUID/Variável) + `STATE.copyMode`, `#modeToggle`, CSS `.toggle-switch/.toggle-dot`.
- **deck_layout_persistence**: `loadInstanceDB`, `saveInstanceDB`, campo `deckLayout` no instance model, chaves `vmix_deck_*`.
- Feature audit tooling (`feature-audit.html`, `feature-inventory.json`) — ignorados via `.gitignore`.

## [3.1.3] — 2026-04-17

### Removed
- Pasta `extensionV9/` — `extension/` é a única fonte de verdade, já em estado V9. Evita dessincronia entre pasta viva e snapshot.

## [3.1.2] — 2026-04-17

### Changed
- `rendererOffsetX/Y` default: **0.016/0.029 → 0/0** — layers coladas no modelo agora renderizam sem gap no vMix (cropX2 vai para 1440 em vez de 1409 no preset 5050)

### Removed
- Snapshots incrementais `extensionV0` a `extensionV8` — apenas `extensionV9` (consolidada) permanece

### Known Issues (tech debt)
- Renderer do vMix 29 expande cada edge de crop ~15.5px internamente. Com offset=0, layers adjacentes no modelo produzem overlap de ~31px na faixa central. Z-order mascara visualmente, mas borda/shadow da layer inferior pode ficar oclusa. Fix planejado: compensação simétrica em cropX1 e cropX2 ou controle fino via UI avançada.

## [3.1.1] — 2026-04-17

### Fixed
- **P1** Canvas deixava de mostrar gap dobrado: inset visual agora só se aplica em edges realmente coladas no modelo
- **P2** `lcApplyGap` processava todos os pares `(i,j)` e engolia layers do meio em layouts 3+; substituído por duas passadas ordenadas (H por `x`, V por `y`) operando apenas em pares consecutivos
- **P3** `lcEnforceGapLockY` anulava o ajuste mas `changedCount++` já havia rodado — agora há rollback e toast honesto
- **P4** Ordem determinística via `sort` prévio (cada par opera em coords não invalidadas por outros)
- **P5** `lcApplyGap` agora zera `l.trim` antes do loop (mesmo padrão de `lcApplyPreset`)
- **P6** `yOverlap/xOverlap` com tolerância EPS=0.0005 aceita edges exatamente coladas (grade 2×2, 4grid)
- **P7** Slider V recebe classe `.lc-gap-disabled` (opacity 0.35, pointer-events none) quando `gapLockY=true`
- **P8** `LC_CROP_OFFSET_X/Y` hardcoded migrados para `STATE.rendererOffsetX/Y` via getters `lcGetRendererOffsetX/Y`
- **P9** Debounce de 150ms no live mode evita flood de requests durante arrasto do slider

### Changed
- Defaults `rendererGapH` e `rendererGapV` de 31 → **0** (layouts colados por padrão; gap é opt-in)
- Sliders H/V iniciam em `value="0"`
- Heurística `distH >= distV` removida — eixo é decidido pela passada H ou V, não por distância dos centros

### Added
- Snapshots `extensionV0` a `extensionV8` versionando cada fase da refatoração (uma pasta por fix incremental, carregável direto em `chrome://extensions` para rollback)
- Função `lcUpdateGapControlsUI` para sincronizar estado visual do slider V com `gapLockY`
- Classe CSS `.lc-gap-disabled` no container do slider

## [3.1.0] — 2026-03-29

### Added
- Propriedade `trim` no modelo da layer para crops assimétricos sem deslocar conteúdo
- `lcApplyRendererOffset` isolado — offset de 31px aplicado apenas no despacho API
- `lcEnforceGapLockY` como constraint no modelo (não mais na conversão)
- `lcVisibleRect` calcula área visível após trim
- Reescrita completa do `lcTrimLayers` com oclusão por Z-index
- Modal SVG interativo para conflitos de sobreposição em L (corner overlap)
- Helpers: `lcVMixBase`, `lcSetDefaultPos`, `lcActivateAndSend`, `lcSetupDropTarget`
- `TEST-CHECKLIST.md` com 12 categorias e ~90 testes manuais
- Properties panel collapsible (recolhido por padrão)

### Changed
- `lcToVMix` agora é função pura — gera crops assimétricos via `l.trim`
- `lcFromVMix` decompõe crop vMix em base simétrica + trim assimétrico
- `lcIntersect` e `lcClassifyOverlap` operam sobre área visível (não caixa base)
- `lcAutoTrimAxis` e `lcClampToCanvas` usam `Math.max` (sem acúmulo)
- Presets nomeados aplicam boxes apenas a layers com input
- Sidebar, layer list e properties sem barra de rolagem vertical
- Undo/Redo snapshot inclui propriedade trim
- Manifest version bump 3.0.0 → 3.1.0

### Fixed
- `_busy` flag leak em `lcVerifyAndResend` (sync travava após erro de rede)
- Checkboxes não ativavam ao aplicar presets nomeados em layers com input
- Round-trip matemático corrigido — canvas = vMix em todos os presets

## [3.0.1] — 2026-03-27

### Added
- VMixCommandQueue com controle de concorrência (max 3, delay 50ms, detecção de erros consecutivos)
- Gap Control H/V com sliders, modo ao vivo e botão aplicar
- Lock Y (trava crop vertical) e Reset Y (restaura altura total)
- 6 botões de alinhamento: esquerda, centro H, direita, topo, centro V, base
- Properties Panel na sidebar com edição de parâmetros e overrides lock/unlock
- Sync direcional: "↓ vMix" (pull) e "↑ vMix" (push)
- Swap Inputs (⇄) para inverter ordem dos inputs
- Sidebar expandida (280px) com divisor e painel de propriedades
- Segunda toolbar (lc-toolbar-2) com controles avançados

### Changed
- Substituição de `fetch()` direto por `VMixCommandQueue.enqueue()` em todo o engine
- Sync buttons separados substituem botão único "Sync Layers"
- `lcToVMix()` agora respeita Lock Y (força Z = h quando w > h)
- Snapshots incluem `_overrides` para undo/redo completo

### Removed
- Permissão `https://*/*` do manifest (desnecessária)

## [3.0.0] — 2026-03-23

### Added
- Documentação completa (CLAUDE.md, README)
- Welcome screen para primeiro uso
- Undo/redo inteligente com histórico visual (max 30 etapas)
- Fire-and-forget + verify-and-resend (2 tentativas)
- Canvas 16:9 fixo com fit responsivo via ResizeObserver

### Fixed
- Correção do flag `_checkOff` no code audit
