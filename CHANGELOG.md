# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/).

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
