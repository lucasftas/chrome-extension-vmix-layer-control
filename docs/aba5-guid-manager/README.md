# Aba 4 — GUID Manager

Feature planejada pra extensão Chrome `vmix-layer-control`. Permite gerenciar **GUIDs personalizados fixos** pra inputs estruturais que se repetem entre projetos vMix.

**Data do planejamento:** 2026-05-13
**Status:** 🚧 Documentação inicial — feature ainda não implementada
**Validação:** Lucas confirmou caso de uso após testes empíricos de limites do parser GUID do vMix

---

## Caso de uso

Lucas é Supervisor TI de produtora audiovisual (Facial Academy). Cada live/evento tem um `.vmix` próprio, mas **certos inputs se repetem em todo projeto**:

- Câmeras SDI 1-7 (Decklink + Blackmagic)
- Audio Lark
- NDIs fixos (PC Lucas comentários, MacBook Murilo, Sorteador)
- BASE PNGs (logos, fundos, bordas reutilizáveis)
- Mix inputs estruturais (CORTE CAMERAS, RETORNO PRÁTICA, RETORNO TEÓRICA)

Hoje cada novo projeto gera **GUIDs random novos**. Resultado:
- **Bitfocus Companion** precisa reconfigurar cada botão por evento (mapeia input por GUID)
- Templates de cena perdem referências cross-projeto
- Scripts/triggers HTTP API por GUID quebram entre projetos

**Solução**: GUIDs **fixos, legíveis e mnemônicos** pra inputs estruturais. Configurar Companion uma vez → funciona em qualquer `.vmix` que use os GUIDs padronizados.

---

## Descobertas técnicas (testadas empiricamente em vMix 29 4K)

Ver [findings.md](findings.md) pra detalhes completos. Resumo das regras de parsing GUID do vMix:

| Regra | Validado? | Observação |
|---|---|---|
| Exatos **32 hex digits** | ✓ Obrigatório | "Guid should contain 32 digits with 4 dashes" |
| Hífens posicionados em 9, 14, 19, 24 | ✓ Obrigatório | "Dashes are in the wrong position for GUID parsing" |
| Versão UUID v4 (`4` no 13º char) | ✗ **Não valida** | Pode usar qualquer hex |
| Variant RFC 4122 (`8/9/a/b` no 17º char) | ✗ **Não valida** | Pode usar qualquer hex |
| Case-insensitive (`ABCDEF` ↔ `abcdef`) | ✓ Aceita ambos | vMix provavelmente normaliza |
| Pode usar **32 hex sem hífens** | ✓ Aceita | Surpreendente — parser flexível |
| `Key=""` vazio | ✓ Aceita | vMix provavelmente gera novo GUID em runtime |

**Implicação**: tem **grande liberdade** pra criar GUIDs mnemônicos legíveis.

---

## Padrão de GUID legível proposto

Ver [guid-template.md](guid-template.md) pra catálogo completo. Estrutura:

```
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
[categ ] [mnem] [tag1] [tag2] [signature  ]
```

| Grupo | Tamanho | Função |
|---|---|---|
| 1º | 8 chars | Categoria + ID numérico (ex: `cam00001`, `mix00002`, `base0001`) |
| 2º | 4 chars | Mnemônico curto do item (ex: `sd11` = SDI 1, `mxct` = Mix CoRTe) |
| 3º | 4 chars | Tag tipo (`cafe` = input regular, `dead` = mosaico, `beef` = video) |
| 4º | 4 chars | Tag org (`face` = Facial Academy) |
| 5º | 12 chars | Assinatura org (`000000facebed`) |

Exemplo aplicado a inputs do projeto Jornada Full Face:

```
cam00001-sd11-cafe-face-000000facebed   ← SDI 1
cam00002-sd12-cafe-face-000000facebed   ← SDI 2
cam00007-bmdc-cafe-face-000000facebed   ← Blackmagic CAM 7
mix00002-mxct-cafe-face-000000facebed   ← Mix2 CORTE CAMERAS
mix00003-mxrp-cafe-face-000000facebed   ← Mix3 RETORNO PRÁTICA
audi0001-lark-cafe-face-000000facebed   ← LARK audio
ndi00001-yt00-cafe-face-000000facebed   ← NDI YouTube
ndi00002-sort-cafe-face-000000facebed   ← NDI Sorteador
base0001-fund-cafe-face-000000facebed   ← BASE Fundo
base0002-logo-cafe-face-000000facebed   ← BASE Logo Facial
cmb00102-c1c2-dead-face-000000facebed   ← Mosaico Cam1+Cam2
cmb00103-c1c3-dead-face-000000facebed   ← Mosaico Cam1+Cam3
```

---

## Arquitetura da Aba 4 (proposta)

### UI

Aba laranja escuro (4º tema, depois de Inputs/Multilayer/Anchor). Layout:

```
┌─────────────────────────────────────────────────────────────┐
│ [Inputs] [Multilayer] [Anchor] [GUID Manager]               │
├─────────────────────────────────────────────────────────────┤
│ Catálogo de GUIDs fixos                          [+ Novo]   │
├─────────────────────────────────────────────────────────────┤
│ 📷 Câmeras (7)                                              │
│   SDI 1          cam00001-sd11-cafe-face-000000facebed  ⎘  │
│   SDI 2          cam00002-sd12-cafe-face-000000facebed  ⎘  │
│   SDI 3 RODE     cam00003-sd13-cafe-face-000000facebed  ⎘  │
│   ...                                                       │
│ 🎚 Mixes estruturais (4)                                    │
│   Mix2 CORTE     mix00002-mxct-cafe-face-000000facebed  ⎘  │
│   ...                                                       │
│ 🎤 Áudio (1)                                                │
│ 📡 NDIs (3)                                                 │
│ 🖼 BASE PNGs (8)                                            │
│ 🪟 Mosaicos cam-pair (10)                                   │
├─────────────────────────────────────────────────────────────┤
│ [Aplicar padrão a .vmix...] [Exportar catálogo] [Importar]  │
└─────────────────────────────────────────────────────────────┘
```

### Funcionalidades

1. **Catálogo persistente** (localStorage da extensão)
   - Lista categorias + entries `nome → GUID`
   - Edição inline (renomear, regenerar GUID seguindo padrão)
   - Drag-drop pra reordenar dentro da categoria

2. **Copy GUID** (botão `⎘`)
   - Click → clipboard com formato escolhido (hífens, sem hífens, uppercase)
   - Contextmenu → "Copy as Companion variable", "Copy as vMix script line"

3. **Aplicar padrão a `.vmix`**
   - Input: path do `.vmix` (drop zone ou file picker)
   - vMix precisa estar **fechado** (validar via API ping)
   - Backup `.bak` automático
   - Estratégia de match: por `Type` + `OriginalTitle` regex (ex: `Type="5" + OriginalTitle="SDI 1"` → GUID `cam00001-...`)
   - Relatório: quantos inputs encontrados, quantos GUIDs aplicados, conflitos detectados
   - Reabrir vMix carregando o `.vmix` modificado (via `OpenPreset` API se vMix estiver ligado, senão `Start-Process`)

4. **Gerador de GUID por categoria**
   - Botão "+ Novo" → modal pede: categoria, nome, mnemônico
   - Gera GUID seguindo template + valida não-duplicado no catálogo
   - Adiciona ao catálogo

5. **Importar/Exportar catálogo**
   - JSON com toda lista — compartilhar entre máquinas da produtora
   - Companion config export — gera arquivo `.companionconfig` com variáveis pré-mapeadas

### Storage schema

```js
// localStorage key: 'vmix-guid-catalog'
{
  version: 1,
  signature: "000000facebed",  // assinatura org
  categories: [
    {
      id: "cam",
      name: "Câmeras",
      icon: "📷",
      tagType: "cafe",
      tagOrg: "face",
      entries: [
        { id: "cam00001", mnem: "sd11", name: "SDI 1", guid: "cam00001-sd11-cafe-face-000000facebed" },
        { id: "cam00002", mnem: "sd12", name: "SDI 2", guid: "cam00002-sd12-cafe-face-000000facebed" },
        // ...
      ]
    },
    {
      id: "mix",
      name: "Mixes estruturais",
      icon: "🎚",
      tagType: "cafe",
      tagOrg: "face",
      entries: [/* ... */]
    },
    // ...
  ]
}
```

---

## Workflow operacional (produção)

### Setup inicial (1ª vez)
1. Lucas abre Aba 4
2. Importa catálogo base (JSON com inputs padrão da Facial Academy)
3. Catálogo populado com ~30 GUIDs estruturais

### Novo evento
1. Cria projeto vMix do zero (ou parte de template `.vmix`)
2. Adiciona inputs conforme roteiro do evento
3. **Antes de gravar/streamar**: Aba 4 → "Aplicar padrão a .vmix..."
4. Seleciona arquivo do projeto
5. Extensão fecha vMix, edita arquivo, reabre
6. Inputs estruturais agora têm GUIDs do catálogo
7. Companion já tá configurado → tudo funciona sem reprogramar

### Manutenção
1. Adicionou nova câmera permanente? Aba 4 → "+ Novo" em Câmeras → mnemônico → GUID gerado
2. Exporta catálogo → distribui pras outras máquinas da produtora
3. Companion: importa variáveis novas

---

## Estrutura desta pasta

```
docs/aba4-guid-manager/
├── README.md           # Este arquivo — visão geral + arquitetura
├── findings.md         # Descobertas técnicas (limites do parser GUID do vMix)
└── guid-template.md    # Catálogo de padrões + tabela inputs estruturais
```

## Próximos passos

- [ ] Validar regras adicionais do parser GUID (3 hífens? 1 hífen? hex maiúsculo+minúsculo mix?)
- [ ] Testar se vMix regrava `Key=""` com GUID novo ao salvar
- [ ] Implementar UI da Aba 4 em `extension/app.js` + tema laranja escuro em `style.css`
- [ ] Implementar action "Aplicar padrão a .vmix" (frontend pede path, mas Chrome extension não acessa filesystem — pesquisar workaround: download de versão modificada, native messaging host, ou orquestrar via vMix API `OpenPreset`)
- [ ] Definir convenção de categorias + tags definitiva com Lucas
- [ ] Gerar catálogo seed pro projeto Jornada Full Face como teste real
