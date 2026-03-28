# Implementations

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
