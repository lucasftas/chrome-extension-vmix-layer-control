# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/).

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
