# Operations Log

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
