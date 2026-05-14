# Sessions

## 2026-05-14 — Aba Companion v4.3.0 (Card Builder + .companionconfig export)

### Contexto
Lucas usa Bitfocus Companion (v4.2.6+) no PC editor D4 (`vMix_D4` connectionId `2e-JDhjjo8EG2rBi1ykoQ`) pra controlar live. Criar botões manualmente na UI do Companion é lento — cada botão pede ~20 cliques pra configurar action + feedback + style. Pedido: aba nova na extensão pra gerar `.companionconfig` arrastando inputs do vMix.

### Desafios e soluções

- **Spec do .companionconfig sem documentação pública**: o formato JSON v9 do Companion 4.2.6 não tem schema oficial. Resolvido lendo o `.companionconfig` real do Lucas (7.4MB, 14757 linhas) + cruzando com o source TypeScript do módulo `bitfocus/companion-module-studiocoast-vmix` no GitHub. Catalogados 8 patterns únicos de botão vMix usados no setup atual.

- **Assumi tipo "MultiView" como input dedicado**: dropdown filtrava `rawType === 'MultiView'`. Lucas viu o menu "Add Input" do vMix moderno (sem opção MultiView) e perguntou. Doc oficial [vMix help26](https://www.vmix.com/help26/InputSettingsMultiView.html) confirma que **qualquer input** suporta até 10 layers via tab "Layers/MultiView" das settings. Fix: dropzone Layer aceita qualquer input.

- **`set_page` internal opts errados na primeira tentativa**: assumi `{pageNumber: "<str>"}`. Real (visto no config do user): `{controller_from_variable, controller: "self", controller_variable: "self", page_from_variable, page: <int>, page_variable: "1"}`. Fix antes de testar.

- **Bug delete cell P apaga vizinho não-par**: `companionDeleteCellOnly` deletava cegamente `col+1` e `col-1` quando type=slide. Se par está em (0,1)+(0,2) e botão independente em (0,3), deletar (0,2) apagava (0,3) também. Fix: validar `cardId` da adjacente antes de deletar.

- **Bug par Slide colidindo com nav Next em (3,7)**: drop card Slide em (3,6) cria right em (3,7) que também é cell NEXT. Solução escolhida pelo Lucas: remover multi-page completo, deixar single page só. Simplificou bastante: 32 cells livres, sem overflow, sem nav buttons, sem page pills.

- **Mock v1 vs v2 — pivô de UX**: implementei aba 4 v1 (drag input direto pro grid, chip cicla 6 tipos). Lucas viu funcionando e pediu mudança: precisa de campos múltiplos por botão (step + feedback) com inputs separados. Pivô completo pra **Card Builder**: cards reusáveis na esquerda com dropzones por campo, drag card→cell na direita. Implementação maior mas modela melhor o multi-input por botão (especialmente Layer Layout mode com 10 slots).

### Decisões tomadas

- **Single page** no output `.companionconfig` (depois de remover multi-page). Decisão do user pra simplificar fluxo: 32 cells por export, sem nav. Quer mais botões → exporta de novo com `pageNum` diferente.

- **3 modos de card** (Clone/One-shot/Linked) com tooltip rico. Permite reuso do mesmo card em N cells (Linked = sync ao vivo, Clone = snapshot, One-shot = template descartável).

- **Validação strict**: card inválido tem borda vermelha + drag desabilitado. Botão "Validar" na toolbar dispara check global. Export skipa cells inválidos.

- **Hardcoded connectionId D4** (`2e-JDhjjo8EG2rBi1ykoQ`). Output JSON tem `instances: {}` vazio — Companion casa pelo ID na import. Lucas confirmou que a connection já existe no Companion dele.

- **Cores broadcast convention**: live=verde (Cut, Layer feedback), mute=vermelho (Audio inputAudio invertido), output=azul (Output), mix=vermelho escuro (Mix cut N).

- **Layer toggle Rápido/Layout**: Rápido = 1 setMultiViewOverlay (target + layer + source); Layout = N slots compartilhando target (configura multiview inteiro num click). Cobre uso normal (Rápido) e uso "layout preset" (Layout).

### Estado atual

✅ v4.3.0 release publicada. Extension testada com setup screen carrega sem erro JS. Smoke test no Companion D4 do Lucas pendente (carregar extension no Chrome → criar cards → exportar → import).

### Próximos passos

- Smoke test real com vMix + Companion D4 (Lucas).
- Bugs conhecidos pra próximas releases (lista no v4.3.x se necessário):
  - chrome.storage rate limit (color picker drag chama persist em cada `oninput` — adicionar debounce).
  - One-shot sem undo (drag acidental consome card, sem recuperar).
  - Cell linked stale: edits em numField/selField/colorField não rerenderizam grid (só painel).
  - Drag de card sobre input num/select interno pode disparar drag spurious.
  - GUIDs órfãos ao trocar instance vMix.
