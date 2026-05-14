# Documentação Técnica — MIX do vMix

Pesquisa consolidada sobre os **Mix inputs** do vMix (mini-mixers internos). Foco em integração via HTTP API porta 8088 para a Chrome Extension `vmix-layer-control`.

Fontes oficiais (help26–help29), fórum oficial, validação cruzada com Roy Sinclair (mod vMix forum) e referências de terceiros confiáveis.

**Data da pesquisa:** 2026-05-13
**vMix testado:** 29 4K (confirmação visual do limite de 15 via screenshot do usuário)

---

## TL;DR — Resumo executivo

1. **16 Mixes totais** em vMix 4K/Pro/Max: PGM (Mix 0) + **15 Mix inputs** adicionais. Confirmado por erro nativo do vMix: *"A maximum of 15 Mix inputs can be added at the same time."*
2. Cada Mix input = **Input regular do tipo Mix**, com GUID estável próprio (igual qualquer input).
3. **Trocar input ativo dentro do Mix NÃO muda o GUID do container Mix.** Resposta direta para a Chrome Extension.
4. Parâmetro `Mix=N` da API é **0-based** (Mix=0 = PGM, Mix=1..15 = Mix inputs), mas a UI exibe 1-based ("Mix2" na UI = `Mix=1` na API).
5. **Pegada crítica**: parâmetro `Mix=N` só aceita número (não GUID). Reordenar Mix inputs no vMix renumera tudo. Solução: cachear GUID + reconciliar o índice numérico a cada fetch contando `<input type="Mix">` no XML.
6. XML em `/api/` **não tem tag raiz** `<mix>` ou `<mixes>` — Mix inputs aparecem como `<input>` normais. Estado per-Mix lê-se do próprio nó do input.

---

## 1. Capacidade e ativação

### 1.1 Limites de Mix (vídeo)

| Edição | Mix inputs adicionais | Total de Mixes controláveis |
|---|---|---|
| **Basic / HD** | 0 | 1 (apenas PGM principal) |
| **4K / Pro / Max** | até **15** | **16** (PGM + 15 Mix inputs) |

Fonte oficial v29: *"You can add up to 15 additional 'mini mixers' that support basic transitions and cuts. Mix is only available in 4K, Pro and Max editions of vMix."* ([help29/Mix.html](https://www.vmix.com/help29/Mix.html))

**Confirmação visual** (usuário, vMix 29 4K): erro nativo ao tentar adicionar o 16º Mix input:

> *"A maximum of 15 Mix inputs can be added at the same time."*
> Origem: `AddNewInput.MixInput`

Discrepância histórica: `help26/DeveloperAPI.html` ainda diz *"up to three separate Mix inputs"*. Texto desatualizado — limite expandido para 15 em versões posteriores. Em vMix 29 confirme sempre via `/api` runtime.

### 1.2 Como adicionar um Mix

Não há "habilitar mais N" em Settings. Cada Mix é adicionado como um **Input**:

> Click na seta ao lado de **Add Input → Mix**.

A partir desse momento aparece como input regular na lista de inputs do projeto.

### 1.3 Limites de áudio (NÃO confundir)

vMix tem também **8 audio buses** (Master + A..G). Coisas separadas dos Mix de vídeo. Audio buses ativam-se em **Settings → Audio Outputs**. ([help25/AudioOutputs.html](https://www.vmix.com/help25/AudioOutputs.html))

---

## 2. O que é um "Mix" no vMix — desambiguação obrigatória

O termo "Mix" no vMix é **polissêmico**. Três conceitos diferentes:

| Conceito | O que é | Onde aparece |
|---|---|---|
| **Mix principal (PGM/Main/Output)** | A saída programa única tradicional do vMix | Sempre presente. `Mix 0` na API |
| **Mix input** | Mini-mixer interno adicionado como Input. Tem Preview/Output próprios + Cut/Fade entre dois inputs quaisquer | Adicionado via *Add Input → Mix*. Type=`Mix` na lista |
| **Mix parameter** (API) | Parâmetro que diz *em qual Mix* a função opera | Querystring HTTP: `&Mix=N` |

### 2.1 Mix principal (PGM) vs Mix inputs

- **PGM/Mix principal**: switcher tradicional. T-Bar, todas as overlays, stingers, recording/streaming padrão. Sempre Mix 0 na API.
- **Mix inputs**: switchers adicionais (mini-mixers/M-E auxiliares). Cada um age como sub-switcher independente com Preview e Output próprios.

### 2.2 "Mix as Input" — usando saída de um Mix como input de outro lugar

Como cada Mix é um Input regular, pode ser:
- Fonte de outro Mix input
- Fonte de MultiView
- Output físico (Output 2/3/4)
- Fonte de uma layer / overlay

**Restrição de nesting**: *"You can use a Mix input as a source of another Mix input as long as they are done in order. For example using Mix 3 in Mix 4 is possible, but Mix 4 in 2 is not."* Backward nesting introduz pelo menos **1 frame de delay**. ([help29/Mix.html](https://www.vmix.com/help29/Mix.html))

---

## 3. Funcionamento interno de cada Mix

### 3.1 Cada Mix = Preview + Output independentes

Dentro de um Mix input, dois dropdowns selecionam:
- **Preview**: input "em standby"
- **Output**: input saindo no Mix

Botões **Cut** e **Fade** alternam entre os dois (mesmo paradigma do PGM). Cut troca instantâneo; Fade transiciona pelo tempo configurado (seta ao lado de Fade).

### 3.2 Inputs compartilhados ou separados?

**Compartilhados.** Todos os Mix inputs acessam a **mesma lista global de inputs** do vMix. O que muda é qual input está roteado para Preview/Output **de cada Mix**. Não existe input "exclusivo" de um Mix.

### 3.3 Recursos NÃO disponíveis dentro de um Mix input

- Stinger transitions
- Overlays a partir do próprio Mix (overlays globais do PGM podem ser direcionadas a Mix — ver §5.4)
- Auto play/pause/restart de inputs
- Audio auto-mixing
- T-Bar transitions
- Re-entrancy backward (Mix 4 → Mix 2 só com 1 frame de delay)

([help29/Mix.html](https://www.vmix.com/help29/Mix.html))

### 3.4 Display

- **Modo padrão**: input do Mix mostra Preview + Output lado a lado no thumbnail e MultiView.
- **Output Only**: right-click no Mix input → *Show Output Only*. Esconde split mas mantém shortcuts/API.

---

## 4. GUID e identificação — CRÍTICO para o projeto

### 4.1 GUID do Mix input (o "container")

Cada Mix input é um Input regular → tem `key` (GUID) próprio no XML:

```xml
<input key="abc12345-..." number="7" type="Mix" title="Mix" ...>
```

**Como referenciar um Mix específico via API:**

| Quando | Identificador | Estabilidade |
|---|---|---|
| Identificar o Mix input como **container** (input em si) | `key` (GUID) ou `number` ou `title` | GUID estável até remover/recriar ou reabrir sem preset |
| Selecionar o **Mix-alvo** de um shortcut (parâmetro `Mix=N`) | **APENAS número 1..15** (0-based na API) | **Não aceita GUID** — limitação documentada |

**Limitação confirmada no fórum oficial**: shortcuts/triggers só endereçam o "Mix de destino" por **posição numérica**, não por nome ou GUID. Se reordenar Mix inputs, *"the mix numbers always go in sequential order"* — atalhos que apontavam para Mix N por número quebram. ([forum t31525](https://forums.vmix.com/posts/t31525-Order-of-mix-inputs))

### 4.2 GUID muda quando troca o input ativo do Mix?

**NÃO.** Resposta direta para o caso de uso da Chrome Extension:

- O **container Mix input** tem GUID próprio estável.
- Trocar input ativo dentro do Mix (`PreviewInput` / `ActiveInput` com `Mix=N`) **não altera** o GUID do container.
- O que muda no XML: apenas o estado de "qual input está em Output/Preview daquele Mix". O objeto Mix input em si segue lá com o mesmo `key`.

Por analogia: botão *Change* (mudar source de um input) preserva *"all settings including colour adjustments, chroma key, position and multi view"* — não muda o `key`. Mix segue a mesma lógica. ([help23/InputSettingsGeneral.html](https://www.vmix.com/help23/InputSettingsGeneral.html))

### 4.3 Quando o GUID **muda**

- Ao **deletar e re-adicionar** o Mix input (vMix gera novo GUID).
- Ao reabrir vMix sem preset salvo: *"if you save your layout as a Preset then the GUID is saved in the preset. Without a preset, inputs receive new GUID's."* ([forum t3445](https://forums.vmix.com/posts/t3445-Where-does-the-GUID-come-from-to-use-in-API-command))

**Implicação para a extensão**: armazene GUID + `number` no estado local. Reconcilie no fetch comparando GUIDs primeiro; se GUID não existir no XML atual, use `number` + `title` como fallback ou notifique reset.

---

## 5. Comandos HTTP API

### 5.1 Endpoint e parâmetros base

```
http://127.0.0.1:8088/api/?Function=<nome>&<params>
```

Parâmetros relevantes ([help29/DeveloperAPI.html](https://www.vmix.com/help29/DeveloperAPI.html)):

| Param | Significado |
|---|---|
| `Function` | Nome da função |
| `Input` | Número (1+), nome (case-sensitive), GUID, ou `0`=Preview do Mix corrente, `-1`=Active |
| `Mix` | Qual Mix alvo (ver §5.2) |
| `Duration` | Tempo de transição em ms |
| `Value` | Para SetText/SetImage/SetPosition/SetCountdown/SetFader/AddInput |
| `SelectedName`, `SelectedIndex` | Para inputs Title/XAML/VideoList |

### 5.2 Indexação do parâmetro `Mix` — **a parte confusa**

**Regra oficial (0-based)**:

| `Mix=N` na API | Significado | Como aparece na UI |
|---|---|---|
| `Mix=0` (ou omitido) | **PGM/Main/Output principal** | Aparece como "Mix1" em alguns lugares (PGM thumbnail) |
| `Mix=1` | Primeiro Mix input adicionado | UI label "Mix2" no thumbnail |
| `Mix=2` | Segundo Mix input | UI label "Mix3" |
| ... | ... | ... |
| `Mix=15` | Décimo-quinto Mix input | UI label "Mix16" |

Citação literal:

> *"Mix=0 is the OUTPUT/PGM, Mix=1 is the first input MIX, which is then labeled Mix2 in the small preview window. Confusing, but that's how it is."* — [scripting_examples wiki](https://tvcrew.ch/wiki/doku.php?id=scripting_examples)

> *"The Mix number you use in Scripting is the Mix number from the description − 1. It's Zero based in scripting, 1 based in the names."* — Roy Sinclair, mod vMix forum ([t20968](https://forums.vmix.com/posts/t20968-How-to-Set-Mix-Input-2-3-4-----Preview-and-Outputs-with-script))

**Lista comma-separated**: `Mix=0,1` aplica a função simultaneamente ao PGM e ao primeiro Mix input. Usado em Overlays e Stingers para mostrar a mesma overlay em múltiplos Mixes (vMix 29 expande isso). ([blog v29](https://blog.vmix.com/vmix-29-is-available-now/))

### 5.3 Funções principais com suporte a Mix

| Function | Parâmetros | Aceita Mix? | Descrição |
|---|---|---|---|
| `ActiveInput` | `Input`, `Mix` | Sim | Joga `Input` no Output do Mix N (cut imediato) |
| `PreviewInput` | `Input`, `Mix` | Sim | Coloca `Input` em Preview do Mix N |
| `Cut` | `Mix` | Sim | Cut no Mix N (Preview↔Output) |
| `Fade` | `Mix`, `Duration` | Sim | Fade no Mix N |
| `Zoom`, `Wipe`, `Slide`, `Fly`, `CrossZoom`, `FlyRotate`, `Cube`, `CubeZoom`, `VerticalWipe`, `VerticalSlide`, `Merge` + variantes `Reverse` | `Mix`, `Duration` | Sim | Demais transições nomeadas, mesma assinatura de `Fade` |
| `Transition1` ... `Transition4` | `Mix`? | Parcial | Clica nos 4 botões de transição. Operação automática geralmente no PGM; comportamento com Mix nem sempre garantido — testar |
| `CutDirect` | `Input` | **Não** | **Só funciona no Mix 0 (PGM).** |
| `OverlayInputNIn/Out/All` | `Input`, `Mix` (vMix 29+) | Sim (v29) | Em v29, overlays podem ser direcionadas a Mix(es) específicos |
| `Stinger1`..`Stinger8` | `Input`, `Mix` | Sim | Stingers podem cortar Mixes específicos no cut |
| `SetFader` | `Value` (0-255) | Não | T-Bar — exclusivo do PGM |

### 5.4 Exemplos de URL completos

Cut no PGM (Mix omitido = Mix 0):
```
http://127.0.0.1:8088/api/?Function=Cut
```

Cut dentro do primeiro Mix input:
```
http://127.0.0.1:8088/api/?Function=Cut&Mix=1
```

Fade de 1500ms no segundo Mix input:
```
http://127.0.0.1:8088/api/?Function=Fade&Duration=1500&Mix=2
```

Setar Input "CAMERA" em Preview do primeiro Mix input:
```
http://127.0.0.1:8088/api/?Function=PreviewInput&Input=CAMERA&Mix=1
```

Cortar imediatamente Input 5 para o Output do terceiro Mix input:
```
http://127.0.0.1:8088/api/?Function=ActiveInput&Input=5&Mix=3
```

Mesma overlay em PGM + Mix 1 + Mix 2 (lista comma-separated):
```
http://127.0.0.1:8088/api/?Function=OverlayInput1In&Input=Title.gtzip&Mix=0,1,2
```

Stinger 1 disparado em Mix 2:
```
http://127.0.0.1:8088/api/?Function=Stinger1&Mix=2
```

Endereçar input por GUID (preferido para estabilidade):
```
http://127.0.0.1:8088/api/?Function=ActiveInput&Input=26cae087-b7b6-4d45-98e4-de03ab4feb6b&Mix=1
```

Endereçar input pelo "Preview corrente do Mix" (`Input=0`) ou "Active corrente" (`Input=-1`):
```
# promove o Preview do Mix 2 para Output do Mix 2
http://127.0.0.1:8088/api/?Function=ActiveInput&Input=0&Mix=2

# coloca o Active corrente em Preview do Mix 2
http://127.0.0.1:8088/api/?Function=PreviewInput&Input=-1&Mix=2
```

### 5.5 Resposta às chamadas

Toda chamada retorna texto plain — geralmente `200 OK` com corpo `Function completed successfully` ou XML mínimo. Sem retry/idempotência server-side. Fire-and-forget consistente com o padrão Companion.

---

## 6. Estrutura do XML em `/api`

Endpoint para snapshot completo:
```
http://127.0.0.1:8088/api/
```
(sem `?Function=...` — qualquer chamada sem `Function` retorna XML de estado)

### 6.1 Estrutura geral (oficial, help29)

```xml
<vmix>
  <version>11.0.0.16</version>
  <edition>4K</edition>
  <inputs>
    <input key="26cae087-b7b6-4d45-98e4-de03ab4feb6b" number="1" type="Xaml" title="NewsHD.xaml"
           state="Paused" position="0" duration="0" muted="True" loop="False" selectedIndex="0">
      NewsHD.xaml
      <text index="0" name="Headline">Hello</text>
      <text index="1" name="Description">Hello</text>
    </input>
    <input key="55cbe357-a801-4d54-8ff2-08ee68766fae" number="2" type="VirtualSet" title="LateNightNews"
           state="Paused" position="0" duration="0" muted="True" loop="False" selectedIndex="0">
      LateNightNews
      <overlay index="0" key="2fe8ff9d-e400-4504-85ab-df7c17a1edd4"/>
      <overlay index="1" key="20e4ee9a-05cc-4f58-bb69-cd179e1c1958"/>
      <overlay index="2" key="94b88db0-c5cd-49d8-98a2-27d83d4bf3fe"/>
    </input>
    <!-- ... -->
  </inputs>
  <overlays>
    <overlay number="1"/>
    <overlay number="2">1</overlay>
    <overlay number="3"/>
    <overlay number="4"/>
    <overlay number="5"/>
    <overlay number="6"/>
  </overlays>
  <preview>1</preview>
  <active>2</active>
  <fadeToBlack>False</fadeToBlack>
  <transitions>
    <transition number="1" effect="Fade" duration="500"/>
    <transition number="2" effect="Wipe" duration="500"/>
    <transition number="3" effect="Fly" duration="500"/>
    <transition number="4" effect="CubeZoom" duration="3000"/>
  </transitions>
  <recording>False</recording>
  <external>False</external>
  <streaming>False</streaming>
  <playList>False</playList>
  <multiCorder>False</multiCorder>
</vmix>
```

Fonte: [help29/DeveloperAPI.html](https://www.vmix.com/help29/DeveloperAPI.html)

### 6.2 Onde estão os Mixes no XML?

**Não há tag `<mix>` ou `<mixes>` raiz no XML do vMix.** Confirmado em múltiplas amostras de fórum e docs oficiais (help24–help29).

Em vez disso:

- **PGM principal** → `<preview>N</preview>` e `<active>N</active>` no root. São os números do Mix 0.
- **Mix inputs** → aparecem como inputs normais dentro de `<inputs>`, com `type="Mix"` (ou afim — confirmar via dump em runtime).
- **Preview/Active de cada Mix input** → **não aparecem como atributos de root**. Estado interno do Mix input precisa ser lido do próprio elemento `<input type="Mix" ...>`. Em versões recentes esses atributos podem aparecer como `preview="..."` e `active="..."` dentro do nó.

**Recomendação prática**: faça um GET `/api/` com vMix 4K rodando e dois Mix inputs adicionados, inspecione o `<input>` correspondente. A documentação oficial não documenta esses atributos explicitamente — é "vMix internal".

> Pedido pendente no fórum: usuários reclamam que o XML não expõe estado dos Mix inputs de forma estruturada. Em v29 melhorias, mas sem seção dedicada `<mixes>`. ([forum t26797](https://forums.vmix.com/posts/t26797-XML-API-should-include-more-data-of-each-overlay))

### 6.3 Como descobrir programaticamente N de Mixes ativos

Loop pelos `<input>` filtrando por `type="Mix"`. Conte → número de Mix inputs. Some 1 (PGM) → total de Mixes endereçáveis.

```js
const xml = await fetch('http://127.0.0.1:8088/api/').then(r => r.text());
const doc = new DOMParser().parseFromString(xml, 'application/xml');
const mixInputs = [...doc.querySelectorAll('input[type="Mix"]')];
// mixInputs[0] → Mix=1 na API (UI: Mix2)
// mixInputs[1] → Mix=2 na API (UI: Mix3)
// ...
// PGM (Mix=0) → doc.querySelector('preview') / doc.querySelector('active')
```

**Sincronização da ordem**: a posição do Mix input em `<inputs>` (filtrada por `type="Mix"`) corresponde ao índice 1..N do parâmetro `Mix=`. Se reordenar Mix inputs no vMix, a numeração da API muda junto — re-fetch e remapeie.

### 6.4 Transição em curso

Não há atributo explícito "transition in progress". Estado real de transição é inferível pelo cruzamento de `<preview>` e `<active>` antes/depois do disparo. Para UI tipo Companion, comando + verify-and-resend após delay = duration (mesma estratégia das layers).

---

## 7. Casos de uso típicos

### 7.1 Multi-output (cada Mix → output físico)

Em **Settings → Outputs / NDI / SRT**, cada Output (1–4 em 4K+) tem dropdown de source que aceita: `Output`, `Preview`, `MultiView`, `MultiView2`, e **`Mix1`..`MixN`** (nomenclatura UI 1-based onde Mix2 = primeiro Mix input). Output 1 fixo no PGM principal.

vMix 29: *"Mix inputs can now also be assigned directly to an Output"* nativamente via UI, sem workaround. ([blog v29](https://blog.vmix.com/vmix-29-is-available-now/))

Recording/Streaming: **Settings → Recording / Streaming** permite escolher Output 1 ou Output 2 como fonte. Combinando Mix→Output, dá pra gravar/streamar Mixes diferentes simultaneamente.

### 7.2 Recording independente

vMix tem **MultiCorder** (grava múltiplos inputs separadamente). Para gravar Mix N como arquivo separado: roteie Mix N → Output 2, configure Recording para usar Output 2. Em v29, com 5 destinos de streaming + outputs flexíveis, dá pra ter pipelines paralelos.

### 7.3 Streaming com Mix diferente do PGM

Configure Streaming Destination → Output Source = `Output 2` (que tem `Mix2` como source). Combine com áudio bus separado se quiser mix-minus. ([help28/SettingsOutputs.html](https://www.vmix.com/help28/SettingsOutputs.html))

### 7.4 Mix as Input

Coberto em §2.2 — usar saída de um Mix como source em outro Mix, MultiView, layer ou output físico. Respeitar a ordem (Mix N pode entrar em Mix N+1...M, nunca para trás sem 1 frame de delay).

---

## 8. Limitações e gotchas

| Limitação | Impacto | Mitigação |
|---|---|---|
| **Parâmetro `Mix=N` só aceita número** | Reordenar Mix inputs no vMix renumera tudo, quebra shortcuts/triggers por número | Cachear GUID do Mix container; recalcular `Mix=N` da API a cada fetch contando `<input type="Mix">` no XML |
| **Indexação 0-based na API vs 1-based na UI** | Confusão: Mix2 na UI = `Mix=1` na API | Documentar explicitamente no código e UI. Mostrar ambos: "Mix2 (API: Mix=1)" |
| **Sem tag `<mix>` raiz no XML** | Estado per-Mix não fácil de ler | Iterar `<input type="Mix">` e parsear atributos do próprio nó |
| **CutDirect só PGM** | `CutDirect&Input=X` ignora `Mix=N` | Use `ActiveInput&Input=X&Mix=N` |
| **Stinger, T-Bar, auto play/pause indisponíveis dentro de Mix** | Mix é mini-mixer simples | Transições disponíveis: Cut, Fade, Wipe, Zoom, Slide, Fly, Cube, CubeZoom, CrossZoom, Merge + Reverse |
| **Nesting backward = 1 frame delay** | Mix 4 em Mix 2 sincroniza com 1f delay | Estruturar ordens crescentes (Mix N alimenta Mix M onde M > N) |
| **Performance** | Cada Mix custa CPU/GPU. 15 Mixes em projeto pesado pode estourar | Monitorar via tab *Performance*. Mix com fontes leves (NDI/Stream) ok; Mix nesting com Virtual Sets caro |
| **Audio dentro de Mix** | Auto-mix desabilitado | Configurar manualmente via Audio Mixer/Buses |
| **GUID novo sem preset** | Reabrir vMix sem preset gera GUIDs novos | Salvar preset sempre; extensão invalida cache se GUID não bater |
| **`Input=` aceita 0 e -1 contextual ao Mix** | `Input=0&Mix=2` = Preview do Mix 2; `Input=-1&Mix=2` = Active do Mix 2 | Útil para "promover Preview do Mix" sem saber qual input está lá |
| **Não há "Border" Mix-level** | Análogo às layers | Borders/keying é por input, não por Mix |
| **Edições HD/Basic não têm Mix** | `Mix=1` em edição básica = no-op silencioso | Detectar edição via `<edition>` no XML antes de habilitar UI de Mixes |

### 8.1 Diferenças entre versões relevantes

- **vMix 26** docs mencionam "3 Mix inputs" — outdated. Use vMix 29 como referência atual.
- **vMix 29** novidades relevantes para Mix:
  - Mix inputs podem ser fonte direta em Outputs (sem workaround)
  - MultiView sources podem selecionar Mix inputs diretamente
  - Overlays e Stingers podem ser direcionados a múltiplos Mix inputs via shortcut (`Mix=0,1,2`)
  - Overlay channels duplicados (4 → 8)
  - 5 destinos de streaming (era 3)

([blog v29](https://blog.vmix.com/vmix-29-is-available-now/), [forum v29 changelog](https://forums.vmix.com/posts/t33735-vMix-29-Changelog))

---

## 9. Pseudo-modelo para a extensão (sugestão arquitetural)

Espelho do que já é feito com layers, adaptado para Mixes:

```js
// Estado interno por Mix
{
  apiIndex: 1,                  // Mix=N na API (0=PGM, 1..15=Mix inputs)
  uiLabel: "Mix2",              // como aparece na UI do vMix
  containerKey: "abc-...",      // GUID do <input type="Mix"> — null se for PGM
  containerNumber: 7,           // number do input no XML — null se PGM
  preview: { key, number, title },  // input atualmente em preview deste Mix
  active:  { key, number, title },  // input atualmente em output deste Mix
  _busy: false                  // bloqueia sync durante apply preset
}
```

**Sync loop**:
1. GET `/api/` → parse XML
2. PGM: ler `<preview>` e `<active>` → mix[0]
3. Para cada `<input type="Mix">` em ordem: `mix[i+1].apiIndex = i+1`, `.containerKey = key`, ...
4. Estado interno (Preview/Active do Mix) → ler atributos do nó (descobrir em runtime quais existem em vMix 29)
5. Reconciliar com cache local por GUID; se GUID desapareceu, marcar mix como "stale"

**Dispatch padrão fire-and-forget** (mesmo da extensão atual):
- 1× `PreviewInput&Input=<key>&Mix=N` para setar Preview
- 1× `ActiveInput&Input=<key>&Mix=N` ou `Cut&Mix=N` / `Fade&Duration=X&Mix=N` para promover
- Verify-and-resend ~1s depois lendo XML

---

## 10. Fontes

### Docs oficiais
- [vMix Help 29 — Mix](https://www.vmix.com/help29/Mix.html) — limites, editions, nesting (v29 atual)
- [vMix Help 27 — Mix](https://www.vmix.com/help27/Mix.html) — confirmação 15 Mix inputs
- [vMix Help 26 — Mix](https://www.vmix.com/help26/Mix.html) — versão referenciada no projeto
- [vMix Help 29 — DeveloperAPI (HTTP Web API)](https://www.vmix.com/help29/DeveloperAPI.html) — endpoint, params, XML response, Mix parameter
- [vMix Help 29 — WebScripting](https://w.vmix.com/help29/WebScripting.html) — URL syntax para shortcuts em sequência
- [vMix Help 28 — Settings Outputs / NDI / SRT](https://www.vmix.com/help28/SettingsOutputs.html) — rotear Mix para Output físico
- [vMix Help 29 — Audio Mixer](https://www.vmix.com/help29/Mixer.html) — não confundir audio buses com video Mixes
- [vMix Help 25 — Audio Outputs](https://www.vmix.com/help25/AudioOutputs.html) — 8 audio buses M/A..G
- [vMix Help 23 — Input Settings General](https://www.vmix.com/help23/InputSettingsGeneral.html) — botão Change preserva configs
- [vMix Help 24 — Inputs](https://www.vmix.com/help24/Inputs.html) — referência geral

### Blog e changelog oficial
- [vMix 29 is Available Now (blog)](https://blog.vmix.com/vmix-29-is-available-now/) — novidades sobre Mix em v29
- [vMix 29 Changelog (forum)](https://forums.vmix.com/posts/t33735-vMix-29-Changelog)
- [vMix 29 Preview Released (forum)](https://forums.vmix.com/posts/t33505-vMix-29-Preview-Released)

### Forum oficial (technical Q&A)
- [Order of mix inputs (t31525)](https://forums.vmix.com/posts/t31525-Order-of-mix-inputs) — reordenar renumera; parâmetro só aceita número
- [Change Mix input settings through API (t27940)](https://forums.vmix.com/posts/t27940-Change-Mix--input--settings--like-input-source-and-transition--through-API) — exemplos REST/TCP
- [How to Set Mix Input 2/3/4 Preview/Outputs with script (t20968)](https://forums.vmix.com/posts/t20968-How-to-Set-Mix-Input-2-3-4-----Preview-and-Outputs-with-script) — Roy Sinclair confirma 0-based scripting vs 1-based UI
- [Assign inputs by unique ID GUID (t27137)](https://forums.vmix.com/posts/t27137-Assign-inputs-by-unique-ID--GUID) — GUID stability
- [Where does the GUID come from (t3445)](https://forums.vmix.com/posts/t3445-Where-does-the-GUID-come-from-to-use-in-API-command) — GUID persistence só com preset
- [Mix Input Selection (t24664)](https://forums.vmix.com/posts/t24664-Mix-Input-Selection) — quirks dos shortcuts numpad
- [XML API should include more data (t26797)](https://forums.vmix.com/posts/t26797-XML-API-should-include-more-data-of-each-overlay) — gap atual do XML
- [.xml (t9382)](https://forums.vmix.com/posts/t9382--xml) — sample completo do XML retornado pela API
- [vMix api XML & live cameras (t30084)](https://forums.vmix.com/posts/t30084-vMix-api-XML-and-live-cameras) — debug de inputs no XML

### Referências de terceiros
- [Unofficial vMix API Reference (vmixapi.com)](https://vmixapi.com/) — Nick Roberts, sourced from official docs
- [scripting_examples wiki (tvcrew.ch)](https://tvcrew.ch/wiki/doku.php?id=scripting_examples) — citação literal *"Mix=0 is OUTPUT/PGM, Mix=1 is first input MIX… Confusing, but that's how it is"*
- [node-vmix (jensstigaard, GitHub)](https://github.com/jensstigaard/node-vmix) — biblioteca Node.js de referência
- [vmix-rest-api (curtgrimes, GitHub)](https://github.com/curtgrimes/vmix-rest-api) — REST wrapper
