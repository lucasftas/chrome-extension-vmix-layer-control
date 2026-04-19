# Operations Log

## 2026-04-19 (v4.2.0) — Release estável final
- [x] Fix CSP crítico: handlers inline `onmouseover`/`onmouseout` no link Privacy Policy bloqueados pelo Manifest V3 — migrado para `.privacy-link:hover` no CSS
- [x] Adicionados prefixes `-webkit-user-select` (3 pontos) e `-webkit-backdrop-filter` (2 pontos) pra eliminar warnings do linter
- [x] Rebump 4.1.9 → 4.2.0 (semver minor justificado pelo Modo "Grupos" como feature nova)
- [x] Release v4.1.9 deletada do GitHub; tag removida local e remota
- [x] Bump 4.1.8 → 4.2.0 e consolidação do ciclo v4.1.4..v4.2.0
- [x] README.md reescrito com badges, botão de download direto do release e tutorial de instalação passo-a-passo
- [x] Modo "Grupos" na aba Inputs com headers coloridos por tipo (mesmo bg-* dos cards) e prioridade Capture/Cor/Mic-Line/Vídeo
- [x] Histórico colapsado por padrão (faixa 36px) com ícone estilo TimeMachine; marcado como candidato a remoção futura via comentário no HTML
- [x] Nota interna: user feedback salvou regra "release só com 'filé' explícito" no memory
- [x] Repositório local limpo: zips v3.1.3 + v4.0.0..v4.1.8 removidos, pasta `mocks/` removida (já no .gitignore)
- [x] Release v4.1.9 publicada

## 2026-04-19 (v4.1.8)
- [x] Painel Histórico colapsado por padrão (classe `.collapsed` no HTML)
- [x] Header clicável alterna estado; clear button com `stopPropagation` pra não acionar toggle
- [x] Nota "⚠ Em avaliação — pode ser removido" visível quando expandido
- [x] CSS colapsado: 36px largura, título rotacionado com `writing-mode: vertical-rl`
- [x] Release v4.1.8 publicada

## 2026-04-19 (v4.1.7)
- [x] Removidas as chamadas `lcThrottleSend` durante mousemove no Multilayer (ramos `free` e `snap`)
- [x] Mouseup continua enviando `lcSendToVMix` (já despachava antes) — nenhum envio perdido
- [x] Comportamento unificado com Anchor Slip X (dispatch só no release)
- [x] Release v4.1.7 publicada

## 2026-04-19 (v4.1.6)
- [x] UX refinement: sincronizar targetInputKey entre abas ao trocar de aba (one-way mirror)
- [x] Reset `_posSet=false` em todas as layers da aba-destino pra forçar fetch completo do vMix
- [x] Label da toolbar atualizada via lookup em `getActiveInstance().inputs`
- [x] Sintaxe validada (`node -c`) em app.js + lc-engine.js
- [x] Release v4.1.6 publicada

## 2026-04-19 (v4.1.5)
- [x] Decisão UX: badge `SLIP` na sidebar + tarja de warning no Multilayer quando target tem slip (opção 1 do menu oferecido)
- [x] `_lcMakeSlipBadge(l)` + integração em `lcRenderLayerList` ([extension/lc-engine.js:894](extension/lc-engine.js#L894)) e `lcAnchorRenderLayerList` ([extension/lc-engine.js:1620](extension/lc-engine.js#L1620))
- [x] `lcUpdateSlipWarning()` chamado dentro de `lcRender`
- [x] HTML `<div id="lcSlipWarning">` inserido no `#layerContent` acima da primeira toolbar ([extension/app.js:696](extension/app.js#L696))
- [x] CSS `.lc-slip-badge` (chip verde) + `.lc-slip-warning` (banner amarelo)
- [x] Sintaxe validada (`node -c`) em app.js + lc-engine.js
- [x] Release v4.1.5 publicada

## 2026-04-19 (v4.1.4)
- [x] Teste direto via API no Input 1 "TESTE MULTLAYER" (vMix localhost:8088) com Input 20 na L1 + CAM 02 na L2
- [x] Confirmado empiricamente que slip puro (cropX1/X2 em paralelo sem mexer em panX) desloca a bounding box visível (L1 invade L2)
- [x] Derivação: `panX_vmix = panX_base − 2·slipOffsetX` compensa o deslocamento e produz efeito máscara (janela fixa, conteúdo interno desliza)
- [x] Animação ao vivo (sweep slipX=-1 ↔ +1, ciclo 4s) validou visualmente no vMix
- [x] Fix aplicado em `lcToVMix` ([extension/lc-engine.js:216](extension/lc-engine.js#L216)) e reverse em `lcFromVMix` ([extension/lc-engine.js:279](extension/lc-engine.js#L279))
- [x] Smoke test round-trip Node: slipX=+0.5 e slipX=-1 preservam `x`, `w` e `slipX` com 6 casas de precisão
- [x] Release v4.1.4 publicada

## 2026-04-19 (v4.1.0)
- [x] Mocks v1/v2/v3 validaram UX (cruz central → Transform Handles → SVG 16:9 coloridos por layer hue)
- [x] Snap magnético no centro (threshold 0.05) + flash verde validados no mock v3
- [x] Plano escrito e aprovado (10 fases, arquivos-alvo, utilitários reusáveis mapeados)
- [x] Branch `feat/v4-anchor-slip-x` criada
- [x] Fase 1: slipX no layer model + lcToVMix/lcFromVMix round-trip (smoke test Node passou)
- [x] Fase 2: constantes LC_ANCHOR_*, LAYER_HUES, lcAnchorBuildTextureSVG (grid A1-I16 cached)
- [x] Fase 3: 3ª deck-tab + #anchorContent clonado de layer-content com toolbar enxuta
- [x] Fase 4: switchPanelTab aceita 'anchor'; classe .mode-anchor no content-area
- [x] Fase 5: canvas dedicado (#anchorCanvas) + fit 16:9 + ResizeObserver + render de boxes/ghost/handles
- [x] Fase 6: _lcDrag type 'anchor' + snap + flash + envio só no release
- [x] Fase 7: tabAnchor handler + lcAnchorTargetBtn reusa lcShowInputSelector + botão Centralizar
- [x] Fase 8: CSS ~190 linhas (anchor-* + transform-handles + keyframes)
- [x] Fase 9: manifest 4.0.1 → 4.1.0, description atualizada
- [x] Fase 10: merge feat/v4-anchor-slip-x em main, release v4.1.0 publicada com zip

## 2026-04-19 (v4.0.1)
- [x] Feedback inicial: aba "Deck" confusa após remoção do grid. Renomeada para "Inputs".
- [x] Primeira tentativa de layout por aba: DOM swap do inputs-panel → descartada (mal concebida).
- [x] Reestruturação: `.main-column` agrupa deck + inputs, `.content-area` fica flex row com histórico à direita.
- [x] Classes `.mode-inputs` / `.mode-layers` controlam flex-grow do deck-panel por aba.
- [x] Sidebar sempre expandida (210px) era desperdício pra 4 instâncias — implementada colapsável.
- [x] 3 formas de fechar sidebar: hamburger toggle, ✕ no header, tecla Esc.
- [x] Hamburger ícone muda dinamicamente (☰ ↔ ✕) conforme estado.
- [x] Versão "v1" hardcoded na sidebar-header substituída por leitura do manifest.
- [x] Manifest version finalmente atualizado (3.1.0 → 4.0.1); description atualizada pra v4.
- [x] Release v4.0.1 publicada com zip de instalação.

## 2026-04-19 (v4.0.0)
- [x] Criada branch `stable/v3` congelando v3.1.3 como âncora pro Deck + Multilayer Editor completo
- [x] Inventário auto-gerado (`feature-audit.html`) catalogando 115 features em 19 grupos; versão bilíngue pt-BR/EN
- [x] Usuário revisou e selecionou 23 features para remoção; decisões complementares via AskUserQuestion (deck_layout_persistence=remover, gap_visualization=remover, copy_mode=só GUID, histórico=50 entradas)
- [x] Branch `feat/v4-cleanup` criada e executada em 10 fases sequenciais (1 commit cada)
- [x] Fase 1: Companion Action Builder (8 features: modal + 7 presets)
- [x] Fase 2: Properties Panel + sistema de overrides
- [x] Fase 3: Gap sliders UI + gap_visualization
- [x] Fase 4: Copy Mode Toggle GUID/VAR
- [x] Fase 5: Deck grid completo
- [x] Fase 6: Migration one-shot limpa vmix_deck_* e vmix_grid_size
- [x] Fase 7: Nova feature deck_copy_history (50 entries, vmix_copy_history)
- [x] Fase 8: Layout 3 colunas (sidebar | inputs | histórico)
- [x] Fase 9: Revalidação sintática + remoção de artefatos de auditoria
- [x] Fase 10: Merge em main, release v4.0.0 publicada com zip de instalação
- [x] Bump major (v3.1.3 → v4.0.0) devido ao breaking do storage + remoção de UI massiva

## 2026-04-17 (v3.1.3)
- [x] Removida pasta `extensionV9/` — `extension/` única fonte de verdade
- [x] Release v3.1.3 publicada (limpeza estrutural, sem mudança funcional)

## 2026-04-17 (v3.1.2)
- [x] Teste empírico com vMix 29 no Input 16 revelou gap residual de ~31px no MultiView após aplicar preset 5050 — valores do painel (cropX2=0.75) divergiam do vMix (1409 = 0.734) pelo offset de compensação
- [x] Decisão: zerar `rendererOffsetX/Y` (0.016/0.029 → 0/0) — aceitar overlap de 31px mascarado pelo Z-order em troca de cola limpa no MultiView
- [x] Snapshot `extensionV9` criado e consolidado como versão ativa
- [x] Sync: `extension/` atualizada com mesmo offset zerado
- [x] Limpeza: snapshots V0–V8 removidos do repo (disponíveis via git history no commit `3d5c3d7`)
- [x] Tech debt anotado em memory: compensação simétrica (cropX1+n / cropX2-n) como fix definitivo futuro
- [x] Release v3.1.2 publicada

## 2026-04-17 (v3.1.1)
- [x] Análise detalhada de "como funciona o gap entre layers" (renderer offset vs slider H/V, visual inset, lcApplyGap)
- [x] Auditoria crítica: 9 problemas de lógica identificados (P1 canvas dobrado, P2 pares não-adjacentes, P3 enforce silencioso, P4 ordem mutativa, P5 trim persistente, P6 epsilon overlap, P7 slider V morto, P8 offset hardcoded, P9 flood live mode)
- [x] Plano por fases aprovado (escolhas: todos os 9, P2 via sort+consecutivos, P1 preview só com gap=0, vMix disponível)
- [x] Fase 0: Instrumentação temporária de `lcApplyGap` com `console.groupCollapsed`
- [x] Decisão: default `rendererGapH/V` = 0 (era 31) — layouts colados por padrão
- [x] Fase 1: P3 rollback pós-enforce + P6 EPS=0.0005 em overlaps
- [x] Fase 2: P2 duas passadas ordenadas (sort por x/y, pares consecutivos), fim da heurística `distH/distV`
- [x] Fase 3: P5 trim reset pré-loop; P4 resolvido indiretamente pela ordenação da Fase 2
- [x] Fase 4: P1 render com vizinhança consciente (`layerInsets[]`) — inset só em edges realmente coladas
- [x] Fase 5: P7 slider V com `.lc-gap-disabled` atrelado a `gapLockY`
- [x] Fase 6: P9 debounce 150ms no live mode via `scheduleLiveGap()`
- [x] Fase 7: P8 offset hardcoded → getters `lcGetRendererOffsetX/Y` sobre `STATE.rendererOffsetX/Y`
- [x] Fase 8: Remoção dos `console.log` de instrumentação
- [x] Criação de 9 snapshots versionados em pastas (`extensionV0` a `extensionV8`) — cada fase rollback-friendly
- [x] Validação de sintaxe JS (`node -c`) em todos os 9 snapshots + pasta viva
- [x] Release v3.1.1 publicada no GitHub com notas detalhadas por problema

## 2026-03-29
- [x] Fase 1: Correção matemática — lcToVMix puro, lcFromVMix com decomposição trim, lcApplyRendererOffset isolado
- [x] Validação round-trip via terminal (curl + node) com vMix real — 50/50, 67/33, Triple, 4Grid
- [x] Fase 2: Deduplicação — 4 helpers extraídos, 15 URLs inline eliminadas
- [x] Fase 3: Limpeza — fix _busy flag, version bump 3.1.0
- [x] Fase 4: Criação TEST-CHECKLIST.md (90 testes manuais)
- [x] Fase 5: Layout vertical — properties collapsible, sidebar sem scroll
- [x] Fix: presets nomeados aplicam boxes apenas a layers com input
- [x] Reescrita lcTrimLayers — trim assistido com Z-index e modal SVG
- [x] Fix: trim por crop assimétrico (sem deslocar panX/panY/zoom)
- [x] Fix: lcFromVMix decompõe base simétrica + trim
- [x] Fix: Math.max no trim (anti-acúmulo)
- [x] Fix: lcIntersect/lcClassifyOverlap operam sobre área visível
- [x] Fix: reset de trim no início do lcTrimLayers (anti-sticky state)
- [x] Teste parcial do trim no input 16 (dados sujos do vMix) — funcional mas precisa mais ajustes
- [x] Release v3.1.0 publicada no GitHub
- [x] Memória do projeto salva para próxima sessão

## 2026-03-27
- [x] Commit e push das mudanças v3.0.1 (command queue, gap control, alinhamento, properties panel, sync direcional)
- [x] Criação da release v3.0.1 no GitHub
- [x] Criação de IMPLEMENTATIONS.md, CHANGELOG.md e OPERATIONS.md
