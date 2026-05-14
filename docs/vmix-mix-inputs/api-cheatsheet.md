# vMix MIX — API Cheatsheet

URLs prontas para copy/paste. Base: `http://127.0.0.1:8088/api/`

> **Regra 0-based**: `Mix=0` = PGM, `Mix=1..15` = Mix inputs adicionados. UI mostra 1-based ("Mix2" na UI = `Mix=1` na API).

---

## Estado / leitura

| Ação | URL |
|---|---|
| Snapshot XML completo | `/api/` |
| (Não há endpoint dedicado por Mix — parse `<input type="Mix">` do XML) | — |

## Controle transição por Mix

| Ação | URL |
|---|---|
| Cut no PGM | `/api/?Function=Cut` |
| Cut no Mix N | `/api/?Function=Cut&Mix=N` |
| Fade no PGM (default duration) | `/api/?Function=Fade` |
| Fade 1500ms no Mix N | `/api/?Function=Fade&Duration=1500&Mix=N` |
| Wipe 500ms no Mix N | `/api/?Function=Wipe&Duration=500&Mix=N` |
| Slide / Zoom / Fly / Cube / CubeZoom / CrossZoom / FlyRotate / VerticalWipe / VerticalSlide / Merge | `/api/?Function=<Effect>&Duration=<ms>&Mix=N` |
| Versão reverse das transições | `/api/?Function=<Effect>Reverse&Duration=<ms>&Mix=N` |

## Setar input em Preview/Active de Mix

| Ação | URL |
|---|---|
| Setar Input X em Preview do Mix N | `/api/?Function=PreviewInput&Input=<X>&Mix=N` |
| Cortar Input X para Output do Mix N | `/api/?Function=ActiveInput&Input=<X>&Mix=N` |
| Promover Preview atual do Mix N para Output | `/api/?Function=ActiveInput&Input=0&Mix=N` |
| Mandar Active atual para Preview do Mix N | `/api/?Function=PreviewInput&Input=-1&Mix=N` |

**`<X>`** pode ser: número (1+), nome (case-sensitive), GUID. Preferir GUID para estabilidade.

## Multi-Mix (lista comma-separated, vMix 29+)

| Ação | URL |
|---|---|
| Overlay 1 em PGM + Mix 1 + Mix 2 | `/api/?Function=OverlayInput1In&Input=<X>&Mix=0,1,2` |
| Stinger 1 em múltiplos Mixes | `/api/?Function=Stinger1&Mix=0,1` |

## NÃO suportam parâmetro Mix

| Função | Limitação |
|---|---|
| `CutDirect` | Só PGM. Use `ActiveInput&Mix=N` em vez |
| `SetFader` (T-Bar) | Exclusivo do PGM |
| `Transition1..4` | Comportamento com Mix não garantido — testar |
| Stinger, T-Bar, auto play/pause, audio auto-mixing | Não disponíveis **dentro** de um Mix input |

## Edição vs capacidade

| Edição | Mixes |
|---|---|
| Basic / HD | 1 (só PGM) |
| 4K / Pro / Max | PGM + até 15 Mix inputs = **16 total** |

Detectar via `<edition>` no XML antes de habilitar UI de Mixes.

## Endereçamento `Input=`

| Valor | Significado |
|---|---|
| Número (1, 2, ...) | Por position no XML |
| Nome | Title do input (case-sensitive) |
| GUID (`key`) | Mais estável |
| `0` | Preview do Mix corrente (combinar com `Mix=N`) |
| `-1` | Active do Mix corrente (combinar com `Mix=N`) |

## Adicionar Mix programaticamente

```
/api/?Function=AddInput&Value=Mix|
```

Retorna texto com info do input criado. **Limite hard: 15** — tentativa 16 gera erro nativo `AddNewInput.MixInput: A maximum of 15 Mix inputs can be added at the same time.`

## Sintaxe comma-separated de Mix (uso comum)

```
&Mix=0       PGM apenas
&Mix=1       Primeiro Mix input apenas
&Mix=0,1     PGM + primeiro Mix input
&Mix=0,1,2   PGM + dois primeiros Mix inputs
&Mix=1,2,3   Os três primeiros Mix inputs (sem PGM)
```

Espaços não permitidos entre números.
