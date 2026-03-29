# Test Checklist — vMix Layer Control

Checklist manual para validar todas as funcionalidades da extensão.
Testar com vMix 29 4K rodando e pelo menos 4 inputs disponíveis.

---

## 1. Round-Trip Matemático

- [ ] Aplicar preset 50/50 → Pull do vMix → canvas mostra exatamente o mesmo layout
- [ ] Aplicar preset 67/33 → Pull do vMix → idem
- [ ] Aplicar preset 33/67 → Pull do vMix → idem
- [ ] Aplicar preset Triple → Pull do vMix → idem
- [ ] Aplicar preset 4Grid → Pull do vMix → idem
- [ ] Aplicar preset AUTO com 2 inputs → Pull → idem
- [ ] Aplicar preset AUTO com 5 inputs → Pull → idem
- [ ] Aplicar preset AUTO com 10 inputs → Pull → idem
- [ ] Mover layer manualmente no canvas → Pull do vMix → posição bate
- [ ] Resize via snap handle → Pull do vMix → tamanho bate
- [ ] Modo SIM vs PGM → layouts diferentes, ambos round-trip correto

## 2. Gap Control

- [ ] Slider H=31, aplicar → gap horizontal visível no vMix
- [ ] Slider V=31, aplicar → gap vertical visível no vMix
- [ ] Slider H=0, aplicar → layers encostam sem gap
- [ ] Slider H=80 (máximo), aplicar → gap grande visível
- [ ] Modo Ao Vivo → mover slider H → gap atualiza em tempo real no vMix
- [ ] Lock Y ativo + gap H → cropY não muda no vMix
- [ ] Lock Y desligado + gap V → cropY ajusta corretamente
- [ ] Reset Y → todas as layers voltam para altura total (h=1)
- [ ] Gap aplica apenas entre layers adjacentes (pares com overlap)

## 3. Presets & Layout

- [ ] 50/50: duas metades iguais lado a lado
- [ ] 67/33: 2/3 esquerda, 1/3 direita
- [ ] 33/67: 1/3 esquerda, 2/3 direita
- [ ] Triple: três terços iguais
- [ ] 4Grid: quatro quadrantes iguais
- [ ] AUTO com N inputs → layout automático correto para N layers
- [ ] Preset aplica boxes apenas a layers com input (não por índice fixo)
- [ ] Layers extras ficam hidden + recebem MultiViewOverlayOff
- [ ] Layers sem input ficam hidden (não recebem box)
- [ ] Checkboxes ativam corretamente para layers do preset
- [ ] Modo SIM → layout simétrico
- [ ] Modo PGM → program + PIPs (última layer grande)

## 4. Sync Bidirecional

- [ ] ↓ vMix (Pull) → canvas atualiza do estado real do vMix
- [ ] ↑ vMix (Push) → vMix recebe estado do canvas
- [ ] Sync Layers → todos os 10 checkboxes ligados no vMix
- [ ] Polling automático (1s) → mudanças externas no vMix refletem no canvas
- [ ] Mover layer no vMix externamente → canvas atualiza em ~1s
- [ ] Layer selecionada no canvas → sync NÃO sobrescreve posição (evita fight com drag)
- [ ] _busy flag → sync não atualiza durante aplicação de preset
- [ ] Polling para se tab ≠ layers ou instância offline

## 5. Canvas Interativo

- [ ] Drag livre → move layer, snap em bordas/centros de outras layers
- [ ] Snap handle (E/W/N/S) → resize com layer adjacente
- [ ] Snap slider na borda compartilhada → arrasta borda entre layers
- [ ] Snap slider mostra posição em pixels no tooltip
- [ ] Snap toggle ON/OFF → ativa/desativa magnético
- [ ] Canvas 16:9 responsivo → resize da janela mantém proporção
- [ ] Drop input do painel de inputs → atribui à layer no canvas
- [ ] Drop input na lista de layers → atribui à layer na lista
- [ ] Seleção de layer → highlight no canvas E na lista
- [ ] Aparar → layers que extrapolam o canvas são cortadas (crop ajustado)
- [ ] Swap (⇄) → inverte posições dos inputs ativos

## 6. Alinhamento

- [ ] Alinhar esquerda → layer selecionada em x=0
- [ ] Alinhar direita → layer em x=1-w
- [ ] Alinhar centro H → layer centralizada horizontalmente
- [ ] Alinhar topo → layer em y=0
- [ ] Alinhar base → layer em y=1-h
- [ ] Alinhar centro V → layer centralizada verticalmente
- [ ] Alinhamento envia posição ao vMix imediatamente
- [ ] Alinhamento registra undo

## 7. Properties Panel (Overrides)

- [ ] Painel inicia recolhido (collapsible)
- [ ] Click no toggle PROPERTIES → expande/recolhe com animação
- [ ] Selecionar layer no dropdown → mostra valores computados (readonly)
- [ ] Unlock campo (🔒 → 🔓) → valor fica editável
- [ ] Editar valor manualmente → vMix recebe valor manual
- [ ] Lock de volta (🔓 → 🔒) → restaura valor computado
- [ ] Reset (↺) → volta ao valor auto-calculado
- [ ] Aplicar preset → todos os overrides resetam para locked
- [ ] Painel não tem barra de rolagem vertical

## 8. Undo/Redo

- [ ] Ctrl+Z → desfaz última ação (posição, preset, gap, alinhamento)
- [ ] Ctrl+Y → refaz ação desfeita
- [ ] Ctrl+Shift+Z → refaz (alternativo)
- [ ] Histórico visual (botão) → lista de ações com timestamps
- [ ] Max 30 etapas → entradas mais antigas descartadas
- [ ] Undo de preset → restaura posições E estados de visibilidade
- [ ] Undo envia estado ao vMix (MultiViewOverlayOn/Off + posições)

## 9. VMixCommandQueue

- [ ] Max 3 fetches simultâneos → não sobrecarrega vMix
- [ ] 5 erros consecutivos → toast "vMix offline"
- [ ] Sucesso após erro → reseta contador de erros
- [ ] Queue.isBusy() → sync polling espera queue esvaziar

## 10. Checkboxes & Visibilidade

- [ ] Checkbox indeterminado (—) → primeiro click liga (ON)
- [ ] Checkbox ON → OFF → MultiViewOverlayOff enviado ao vMix
- [ ] Checkbox OFF → ON → MultiViewOverlayOn + posição enviados
- [ ] _checkOff=true → sync automático não reativa a layer
- [ ] Limpar layers → remove input de layers hidden (libera slots)
- [ ] Dropdown de input → mudar seleção → atribui novo input

## 11. Layout de Interface

- [ ] Painel Layers → sem barra de rolagem vertical
- [ ] Painel Properties → sem barra de rolagem vertical
- [ ] Painel Inputs → barra de rolagem vertical quando lista grande
- [ ] Properties toggle → recolhido por padrão ao abrir extensão
- [ ] Sidebar 280px → não quebra em telas pequenas

## 12. Infraestrutura

- [ ] Manifest v3 com versão 3.1.0
- [ ] Content script injeta em portas 8088/8089/8090
- [ ] Background.js → click no ícone abre/foca tab existente
- [ ] Loader.js → passa URL da API como query parameter
- [ ] Permissão apenas http://*/* (sem https)
