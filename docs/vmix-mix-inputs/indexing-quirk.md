# Mix Indexing — A Pegadinha 0-based vs 1-based

A maior fonte de bug no controle de Mixes via API.

---

## Regra única

| Contexto | Indexação |
|---|---|
| Parâmetro `Mix=N` da HTTP API | **0-based** |
| Label visível na UI do vMix (thumbnail) | **1-based** |

### Tabela de conversão

| `Mix=N` (API) | UI Label | Significado |
|---|---|---|
| `Mix=0` | "Mix1" (PGM thumbnail) | PGM/Main/Output principal |
| `Mix=1` | "Mix2" | 1º Mix input adicionado |
| `Mix=2` | "Mix3" | 2º Mix input adicionado |
| `Mix=3` | "Mix4" | 3º Mix input adicionado |
| ... | ... | ... |
| `Mix=15` | "Mix16" | 15º (e último) Mix input |

### Fórmula

```
N (API) = N (UI) - 1
N (UI) = N (API) + 1
```

---

## Por que isso é confuso

A UI conta a partir de 1 incluindo o PGM como "Mix1". O scripting/API conta a partir de 0 com o PGM sendo `Mix=0`. Resultado: o **primeiro Mix input adicionado** (chamado de "Mix2" no thumbnail da UI) é `Mix=1` na API.

Citação de Roy Sinclair (mod vMix forum):

> *"The Mix number you use in Scripting is the Mix number from the description − 1. It's Zero based in scripting, 1 based in the names."*
> — [forum t20968](https://forums.vmix.com/posts/t20968-How-to-Set-Mix-Input-2-3-4-----Preview-and-Outputs-with-script)

Confirmação independente (wiki tvcrew.ch):

> *"Mix=0 is the OUTPUT/PGM, Mix=1 is the first input MIX, which is then labeled Mix2 in the small preview window. Confusing, but that's how it is."*

---

## Como expor na Chrome Extension

Mostrar **os dois rótulos** ao usuário para evitar confusão:

```
PGM (Mix=0)
Mix2 — primeiro Mix input (Mix=1)
Mix3 — segundo Mix input (Mix=2)
...
```

Ou usar mesma nomenclatura que a UI do vMix (1-based) e converter internamente ao mandar o request:

```js
function vmixApiMixParam(uiMixNumber) {
  // uiMixNumber: 1=PGM, 2=primeiro Mix input, ...
  return uiMixNumber - 1;
}

const url = `http://${host}/api/?Function=Cut&Mix=${vmixApiMixParam(2)}`;
// → ...Mix=1 (corta o primeiro Mix input adicionado)
```

---

## Reordenar Mix inputs no vMix renumera tudo

**Crítico**: o parâmetro `Mix=N` **não aceita GUID**, só número. E o número é a posição do Mix input dentro da lista (na ordem em que aparecem em `<inputs>` filtrados por `type="Mix"`).

> *"the mix numbers always go in sequential order"*
> — [forum t31525](https://forums.vmix.com/posts/t31525-Order-of-mix-inputs)

Implicação: se o usuário arrastar Mix inputs reordenando no vMix, o `Mix=N` que aponta para um Mix específico **muda**. Shortcuts/triggers configurados por número quebram.

### Mitigação na extensão

Não armazenar `Mix=N` em cache permanente. A cada fetch:

1. GET `/api/` → parse XML
2. Listar `<input type="Mix">` em ordem
3. Mapear: `mixIndex[i+1] = element.getAttribute('key')` (GUID do container)
4. Para encontrar `Mix=N` correspondente a um GUID conhecido: iterar a lista atual e achar o index correspondente

Pseudocódigo:

```js
function resolveMixApiIndex(targetGuid, xmlDoc) {
  const mixes = [...xmlDoc.querySelectorAll('input[type="Mix"]')];
  const idx = mixes.findIndex(el => el.getAttribute('key') === targetGuid);
  if (idx === -1) return null;  // Mix sumiu — alertar usuário
  return idx + 1;  // 0-based para API, +1 porque mixes[0] = Mix=1
}
```

PGM (Mix=0) não tem container input — é o próprio vMix root. Tratar separado.
