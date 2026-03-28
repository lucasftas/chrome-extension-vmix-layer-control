# Changelog

Todas as mudanças notáveis deste projeto serão documentadas neste arquivo.
Formato baseado em [Keep a Changelog](https://keepachangelog.com/).

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
