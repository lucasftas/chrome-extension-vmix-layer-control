# Descobertas técnicas — Parser GUID do vMix

Resultado de testes empíricos no vMix 29 4K com o arquivo `teste-guid.vmix` modificado iterativamente.

**Data dos testes:** 2026-05-13
**Operador:** Lucas (abertura manual de cada .vmix variação)

---

## Setup dos testes

- Base: `teste-guid.vmix` com 2 inputs (SRT + Colour)
- Em cada teste, apenas o **Key do SRT input** foi modificado
- Key do Colour mantido válido como controle (`abcdef01-2345-6789-abcd-ef0123456789`)
- Abertura via File → Open Preset no vMix
- Erros capturados via screenshot

---

## Matriz de resultados

| Variação | Key SRT | Resultado | Mensagem de erro |
|---|---|---|---|
| Random aleatório (baseline) | `e060f2ca-f64b-4ca2-bb77-a3019d87f75d` | ✓ aceita | — |
| Versão errada + variant errado | `12345678-1234-1234-1234-123456789012` | ✓ aceita | — |
| Char não-hex (`z`) | `zzzzzzzz-zzzz-zzzz-zzzz-zzzzzzzzzzzz` | ❌ rejeita | "Could not find any recognizable digits" |
| **A**: 35 chars (1 a menos) | `1234567-1234-1234-1234-123456789012` | ❌ rejeita | "Guid should contain 32 digits with 4 dashes (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)" |
| **B**: 37 chars (1 a mais) | `123456789-1234-1234-1234-123456789012` | ❌ rejeita | "Guid should contain 32 digits with 4 dashes" |
| **C**: 32 hex sem hífens | `12345678123412341234123456789012` | ✓ **aceita** | — |
| **D**: uppercase ABCDEF | `ABCDEF12-3456-7890-ABCD-EF0123456789` | ✓ aceita | — |
| **E**: hífens em posição errada (4-8-4-4-12) | `1234-56781234-1234-1234-123456789012` | ❌ rejeita | "Dashes are in the wrong position for GUID parsing" |
| **F**: Key vazio | `""` | ✓ aceita | — |

---

## Regras inferidas do parser

### Obrigatórias
1. **32 hex digits exatos** (0-9, a-f, case-insensitive). Char não-hex = rejeita
2. **Total = 36 chars com hífens** OU **32 chars sem hífens** — ambos válidos
3. Se tem hífens → exatos 4 hífens nas posições **9, 14, 19, 24** (chars 1-indexed)

### Opcionais / NÃO validadas
1. **Versão UUID v4** (`4` no char 13, 1-indexed) — **vMix não valida**
2. **Variant RFC 4122** (`8/9/a/b` no char 17) — **vMix não valida**
3. **Unicidade** dentro do projeto — não testada, mas provável que vMix simplesmente trate duplicatas como mesmo input (ou último ganha)

### Caso especial
- **Key="" vazio** = aceito. Hipótese: vMix gera GUID novo random em runtime. Não validado se vMix regrava o `.vmix` ao salvar com o novo Key gerado

---

## Mensagens de erro literais (referência futura)

| Cenário | Mensagem |
|---|---|
| Char não-hex no Key | `Could not find any recognizable digits.` |
| Tamanho ≠ 32 hex (com ou sem hífens errados) | `Guid should contain 32 digits with 4 dashes (xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx).` |
| Hífens em posição errada | `Dashes are in the wrong position for GUID parsing.` |

Todos os erros vêm com `OpenPreset` como contexto na caixa de detalhes. Ao receber qualquer um, vMix **aborta o load completo** do preset — não carrega nada (não é parcial).

---

## Implicações pro design da Aba 4

### Caracteres utilizáveis
- Hex: `0 1 2 3 4 5 6 7 8 9 a b c d e f` (16 chars)
- Mnemônicos possíveis (palavras formáveis com hex): `face`, `cafe`, `dead`, `beef`, `babe`, `feed`, `c0de`, `ba5e`, `decade`, `b00b`, `bad`, `cab`, `bed`, `bee`, `fab`, `dab`, `dec`, `add`, `ace`, `ada`, `aff`, `ebb`

### Restrições
- **NÃO usar**: `g h i j k l m n o p q r s t u v w x y z` (não-hex)
- Palavras como `facial`, `lucas`, `mix`, `cam`, `audio`, `live` têm letras não-hex
- Truque: substituir por **homófono hex** quando possível:
  - `i` → `1` (`facia1`? não, `i` ≠ `1` em conceito mnemônico. Melhor evitar)
  - `o` → `0` (`fa0d` em vez de `food` mantém similar)
  - `l` → `1`
  - `s` → `5`
  - `g` → `9`
  - `t` → `7`
  - Ex: `facia1` (face + leetspeak l→1 não funciona, `i` ainda quebra). Melhor: `face` (4 chars perfeito)

### Estratégia recomendada
1. **Mnemônicos prioritários nos grupos curtos** (2º e 3º grupos = 4 chars cada — palavras hex)
2. **IDs numéricos no 1º grupo** (`cam00001`, `mix00002`)
3. **Tags de classificação no 3º/4º grupo** (`cafe` = input regular, `dead` = mosaico, `beef` = vídeo)
4. **Assinatura organizacional no 5º grupo** (`000000facebed` ou `000000c0c0c0c0c0` — 12 chars hex)

### Sem hífens é viável?
Sim — vMix aceita. Mas:
- Menos legível visualmente (32 chars contíguos)
- Convenção universal usa hífens
- **Recomendado**: sempre gerar com hífens. Manter compatibilidade com outras ferramentas que esperam formato canônico.

---

## Testes pendentes (não cobertos ainda)

| Cenário | Hipótese | Importância |
|---|---|---|
| 3 hífens (em vez de 4) | Provável rejeita | Baixa |
| 5 hífens (em vez de 4) | Provável rejeita | Baixa |
| Hífens mas com 32 chars (`12345678-1234-1234-12341234-12345678`) | Provável rejeita (posição) | Baixa |
| Caractere especial (`_`, `.`, espaço) em vez de hífen | Provável rejeita | Baixa |
| Unicode/emoji | Provável rejeita | Baixa |
| Duplicar Key entre 2 inputs do mesmo projeto | ??? | **Alta** — saber se vMix dedup, sobrescreve, ou erra |
| Key="" → salvar projeto → vMix regravou? | Provável sim (gera GUID novo) | **Alta** — define fluxo de "criar input sem GUID predefinido" |
| Key com case **misto** (`Aa1B-...`) | Provável aceita + normaliza | Média |
| vMix abre arquivo com Key inválido em meio a vários válidos | Aborta todo load ou skip input bad? | Média |

---

## Workflow de teste seguido

```
1. Backup do estado válido (.bak)
2. Modificar Key via sed
3. Lucas abre arquivo manualmente no vMix
4. Captura screenshot do erro OU confirmação de sucesso
5. Documentar resultado nesta matriz
```

Arquivos de teste preservados em `C:\Users\Lucas\Documents\`:
- `teste-guid.vmix.bak` — original (random)
- `teste-guid.vmix.v1bak` — GUIDs legíveis válidos (1º experimento bem-sucedido)
- `teste-guid.vmix` — estado corrente
- `teste-guid-A-short35.vmix` até `teste-guid-F-empty.vmix` — variações da matriz

Para repetir teste: abrir cada arquivo de variação no vMix → observar comportamento.
