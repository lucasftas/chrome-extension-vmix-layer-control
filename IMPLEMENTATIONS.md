# Implementations

## v4.0.0 — 2026-04-19

### Redesign do Deck: de Grid para Lista + Histórico

O painel Deck tinha evoluído com muitas features periféricas (Stream-Deck style grid, Companion Action Builder, Properties Panel, Gap sliders) que o usuário não utilizava mais. A v4 é uma remoção cirúrgica de 23 features mapeadas, substituindo o grid 16/32/40/64 botões por:
- **Lista vertical de inputs** no centro — click copia GUID diretamente
- **Painel de histórico** à direita — últimas 50 cópias com botão "recopiar"

### Migração automática v3 → v4

`migrateV3ToV4()` roda uma vez em `init()`:
1. Varre `localStorage` por chaves `vmix_deck_*` e `vmix_grid_size`
2. Remove todas
3. Seta `vmix_v4_migrated=1` para não re-executar

### Inventário de auditoria

Antes da v4 foi gerado um `feature-audit.html` standalone com 115 features catalogadas (19 grupos). O usuário desmarcou 23 + decidiu 3 casos limítrofes (deck_layout_persistence, gap_visualization, copy_mode_toggle) via AskUserQuestion. JSON exportado guiou a implementação faseada.

### Fases de execução

10 fases, 1 commit cada:
- **Fase 1**: Companion Action Builder (8 features)
- **Fase 2**: Properties Panel (5 features + overrides system)
- **Fase 3**: Gap sliders UI + gap_visualization (4 features)
- **Fase 4**: Copy Mode Toggle (1 feature)
- **Fase 5**: Deck grid (6 features)
- **Fase 6**: Storage cleanup migration (vmix_deck_*, vmix_grid_size)
- **Fase 7**: deck_copy_history (novo feature)
- **Fase 8**: Layout 3 colunas (CSS)
- **Fase 9**: Revalidação + remoção de artefatos
- **Fase 10**: Merge em main + filé

### Dependências compartilhadas preservadas

- `copy_system`, `toast_system`, `modal_system`: usados por outras features, mantidos
- `gap_lock_y`: sobrevive sem sliders porque `layer_snap_resize` usa
- `reset_crop_y`: independente dos sliders, mantido

### Redução de tamanho

- app.js: ~2.5k → ~1.85k linhas
- lc-engine.js: ~1.8k → ~1.5k linhas
- style.css: ~3.2k → ~2.6k linhas
- **Total: ~1.400 linhas a menos** no bundle ativo

## v3.1.3 — 2026-04-17

### Limpeza estrutural
- Removida pasta `extensionV9/` do repo. `extension/` já continha o mesmo estado consolidado — manter ambas gerava risco de dessincronia em futuras edições.
- Sem mudança funcional; release é apenas para marcar a limpeza.

## v3.1.2 — 2026-04-17

### Renderer offset zerado por padrão

- `STATE.layerControl.rendererOffsetX` e `rendererOffsetY` alterados de `0.016/0.029` (31px horizontal / 31px vertical) para `0/0`.
- Motivo: após aplicar preset 5050 no Input 16, o vMix renderizava com gap visível de ~31px entre Layer 1 e Layer 2. A compensação que existia para evitar overlap do renderer estava criando o problema oposto (gap em vez de cola).
- Agora `lcApplyRendererOffset` retorna valores idênticos ao `lcToVMix` puro — painel de propriedades e vMix exibem os mesmos números.

### Consolidação em V9

- Removidos os 9 snapshots incrementais `extensionV0`–`extensionV8` do repositório (um por fase da refatoração da v3.1.1).
- `extensionV9` consolidada como versão de trabalho, em sync com `extension/`.
- Rollback para versões intermediárias da v3.1.1 continua possível via histórico git (commit `3d5c3d7`).

### Tech debt registrado

Overlap de 31px esperado com offset=0 devido à expansão interna de edge do renderer vMix 29. Mascarado pelo Z-order na maioria dos presets. Fix definitivo planejado: compensação simétrica (cropX1 += n, cropX2 -= n) em vez de unilateral.

## v3.1.1 — 2026-04-17

### Refatoração profunda de `lcApplyGap` (9 bugs de lógica corrigidos)

- **Duas passadas ordenadas**: substituído loop duplo `(i,j)` por (1) ordenação por `x` e processamento de pares consecutivos com `yOverlap`, depois (2) ordenação por `y` com `xOverlap`. Elimina o bug de engolir layers intermediárias em layouts 3+ colunas.
- **EPS = 0.0005**: tolerância em `yOverlap/xOverlap` que aceita edges exatamente coladas (antes pulava grade 2×2 e 4grid).
- **Snapshot + rollback no enforce**: `lcEnforceGapLockY` pode anular ajuste de `w`; agora há verificação pós-mutação — se não moveu, restaura coords e não conta como mudança. Toast reflete realidade.
- **Trim reset pré-loop**: `active.forEach(l => l.trim = lcMakeTrim())` no início, igual a `lcApplyPreset`. Evita crops assimétricos fantasma sobre geometria nova.
- **Heurística `distH >= distV` removida**: eixo é determinado pela passada, não por proximidade de centros.

### Render visual com vizinhança consciente

- `_lcRenderBoxes` agora calcula `layerInsets[]` analisando quais edges realmente tocam outras layers no modelo. Inset só aplica nessas edges específicas — elimina o "gap dobrado" (inset + gap real somados) após `lcApplyGap`.

### UX do slider V

- Nova função `lcUpdateGapControlsUI` sincroniza estado visual: container `.lc-gap-disabled` (opacity 0.35 + pointer-events none) quando `gapLockY=true`.

### Live mode saudável

- Debounce de 150ms no dispatch via `scheduleLiveGap()` com `_gapLiveTimer`. Inset visual continua em tempo real (feedback imediato), mas a rede recebe só o valor estabilizado.

### Renderer offset configurável

- `LC_CROP_OFFSET_X/Y` hardcoded viraram `STATE.layerControl.rendererOffsetX/Y` (defaults 0.016 / 0.029) acessados via `lcGetRendererOffsetX()` / `lcGetRendererOffsetY()`. Calibrável sem editar código.

### Versionamento em pastas

- 9 snapshots `extensionV0` a `extensionV8` gravam cada fase incremental da refatoração. Cada pasta é uma extensão Chrome válida independente. Rollback granular: basta carregar outra pasta em `chrome://extensions`.

### Mudança de default

- `rendererGapH = 0`, `rendererGapV = 0` (eram 31). Presets agora aplicam layouts matematicamente colados; gap é opt-in explícito via slider.

## v3.1.0 — 2026-03-29
- **Math Pura**: `lcToVMix` refatorado como função pura (sem gapLockY, sem offset). `lcApplyRendererOffset` isolado para despacho API
- **lcFromVMix**: decompõe crop do vMix em base simétrica + trim assimétrico — suporta dados "sujos" criados manualmente no vMix
- **Trim Assistido com Z-Index**: propriedade `trim {left,right,top,bottom}` no modelo da layer. Crops assimétricos sem mover conteúdo (panX/panY/zoom intactos)
- **Reescrita lcTrimLayers**: auto-trim canvas, oclusão por Z-index (layer 10 = topo), classificação de overlap (total/fullW/fullH/corner)
- **Modal SVG para conflitos em L**: quando sobreposição não é retangular, modal interativo com preview e escolha de eixo (X/Y/Pular)
- **lcVisibleRect**: interseção e classificação operam sobre área visível (após trim), não caixa base bruta
- **Deduplicação**: helpers `lcVMixBase`, `lcSetDefaultPos`, `lcActivateAndSend`, `lcSetupDropTarget` eliminam ~15 URLs inline
- **Fix presets nomeados**: agora aplicam boxes apenas a layers com input (mesmo comportamento do AUTO)
- **Fix _busy flag leak**: `lcVerifyAndResend` não trava mais o sync após erro de rede
- **Layout vertical**: sidebar/layers/properties sem scroll. Properties panel collapsible (recolhido por padrão)
- **TEST-CHECKLIST.md**: 12 categorias, ~90 testes manuais
- **Undo/Redo**: snapshot/restore inclui propriedade trim

## v3.0.1 — 2026-03-27
- **VMixCommandQueue**: fila de comandos com controle de concorrência (max 3 paralelos, delay 50ms, detecção de erro consecutivo com toast)
- **Gap Control H/V**: sliders para ajustar gap horizontal e vertical entre layers, com modo "Ao Vivo" (aplica no vMix em tempo real) e botão "Aplicar"
- **Lock Y / Reset Y**: trava crop vertical (Lock Y) e restaura Y de todas as layers para altura total
- **Alinhamento**: 6 botões de alinhamento — esquerda, centro H, direita, topo, centro V, base
- **Properties Panel**: painel na sidebar com edição por parâmetro (PanX, PanY, Zoom, CropX1/X2, CropY1/Y2) e sistema de overrides com lock/unlock
- **Sync Direcional**: substituição do botão único por "↓ vMix" (pull) e "↑ vMix" (push)
- **Swap Inputs**: botão ⇄ que inverte a ordem dos inputs entre layers ativas
- **Sidebar expandida**: largura 280px, divisor visual, painel de propriedades abaixo da lista de layers
- **Manifest**: removida permissão `https://*/*` desnecessária

## v3.0.0 — 2026-03-23
- Documentação completa e versão final
- Welcome screen, code audit cleanup, _checkOff fix
- Undo/redo inteligente com histórico visual
- Fire-and-forget + verify-and-resend, presets OFF mantém input
- Canvas 16:9 fixo com fit responsivo
