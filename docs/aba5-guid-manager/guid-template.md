# Catálogo de GUIDs legíveis — Padrão Facial Academy

Padrão proposto pra GUIDs fixos de inputs estruturais. Aplicável a qualquer projeto `.vmix` da Facial Academy.

---

## Estrutura

```
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  (1º)   (2º) (3º) (4º)    (5º)
```

| Grupo | Tamanho | Função | Exemplos |
|---|---|---|---|
| 1º | 8 | Categoria + ID numérico | `cam00001`, `mix00002`, `base0001` |
| 2º | 4 | Mnemônico específico do item | `sd11`, `mxct`, `lark` |
| 3º | 4 | Tag de tipo | `cafe`, `dead`, `beef` |
| 4º | 4 | Tag de organização | `face` (Facial Academy) |
| 5º | 12 | Assinatura organizacional | `000000facebed` |

---

## Tags de tipo (3º grupo)

| Tag | Significado | Usa em |
|---|---|---|
| `cafe` | Input regular (fonte de mídia) | Câmeras, NDI, audio, video files |
| `dead` | Mosaico / virtual / Colour-based | Mosaicos, MultiViews, Stinger compose |
| `beef` | Vídeo / mídia tempo-codificado | Files .mp4, .mov, .wav |
| `feed` | Live / streaming input | SRT, RTMP, NDI live |
| `c0de` | Title / script / browser | Title.gtzip, Browser, XAML |
| `ba5e` | Estrutural / BASE / fundo | Logos, fundos, bordas reutilizáveis |

---

## Categorias (1º grupo)

| Categoria | Prefixo | Faixa | Tag tipo |
|---|---|---|---|
| Câmeras | `cam0NNNN` | 00001-00099 | `cafe` |
| Mix inputs | `mix0NNNN` | 00002-00016 | `cafe` |
| Áudio | `audi0NNN` | 0001-0099 | `cafe` |
| NDI fixo | `ndi0NNNN` | 00001-00099 | `feed` |
| BASE imagens | `base0NNN` | 0001-0999 | `ba5e` |
| Browser/web | `web0NNNN` | 00001-00099 | `c0de` |
| Title/script | `titl0NNN` | 0001-0999 | `c0de` |
| Mosaico cam-pair | `cmb0NNNN` | 00102-04599 (par CamA+CamB) | `dead` |
| Mosaico nomeado | `mosa0NNN` | 0001-0999 | `dead` |
| Output return | `outp0NNN` | 0001-0099 | `cafe` |

---

## Catálogo seed — Projeto Jornada Full Face (referência)

Aplicável a qualquer projeto da Facial Academy que reuse esses inputs.

### Câmeras (Type=5 SDI / Type=22 Blackmagic)

| Input original | GUID proposto |
|---|---|
| SDI 1 | `cam00001-sd11-cafe-face-000000facebed` |
| SDI 2 | `cam00002-sd12-cafe-face-000000facebed` |
| SDI 3 (RODE) | `cam00003-sd13-cafe-face-000000facebed` |
| SDI 4 | `cam00004-sd14-cafe-face-000000facebed` |
| SDI 5 | `cam00005-sd15-cafe-face-000000facebed` |
| SDI 6 | `cam00006-sd16-cafe-face-000000facebed` |
| Blackmagic CAM 7 | `cam00007-bmdc-cafe-face-000000facebed` |

### Mix inputs (Type=11000)

| Input original | GUID proposto |
|---|---|
| Mix2 CORTE CAMERAS | `mix00002-mxct-cafe-face-000000facebed` |
| Mix3 RETORNO PRÁTICA EXT4 | `mix00003-mxrp-cafe-face-000000facebed` |
| Mix4 RETORNO TEÓRICA EXT3 | `mix00004-mxrt-cafe-face-000000facebed` |
| FELIPE Mix5 | `mix00005-mxfe-cafe-face-000000facebed` |

### Áudio (Type=7 vMix Audio)

| Input original | GUID proposto |
|---|---|
| LARK | `audi0001-lark-cafe-face-000000facebed` |

### NDI fixo (Type=4000)

| Input original | GUID proposto |
|---|---|
| COMENTÁRIO YOUTUBE PC LUCAS | `ndi00001-yt00-feed-face-000000facebed` |
| SORTEADOR (PC Lucas 4070 #1) | `ndi00002-sort-feed-face-000000facebed` |
| NDI MACBOOK MURILO | `ndi00003-mac0-feed-face-000000facebed` |

### Browser / Web (Type=5000)

| Input original | GUID proposto |
|---|---|
| MODO APRESENTADOR (localhost) | `web00001-pres-c0de-face-000000facebed` |

### BASE images (Type=1 com prefixo "BASE -")

| Input original | GUID proposto |
|---|---|
| BASE - Fundo | `base0001-fund-ba5e-face-000000facebed` |
| BASE - Área Timer | `base0002-arti-ba5e-face-000000facebed` |
| BASE - Área intervalo almoço | `base0003-alm0-ba5e-face-000000facebed` |
| BASE - Logo Facial Academy | `base0004-lgfa-ba5e-face-000000facebed` |
| BASE - Logo Jornada Full Face | `base0005-lgjf-ba5e-face-000000facebed` |
| BASE - Só borda | `base0006-bord-ba5e-face-000000facebed` |
| BASE - Borda no Wide | `base0007-bdwd-ba5e-face-000000facebed` |
| BASE - Borda menor Cam slides | `base0008-bdcs-ba5e-face-000000facebed` |
| BASE - Fundo Roxo Jornada | `base0009-frjr-ba5e-face-000000facebed` |
| BASE - Borda Slide Roxo | `base0010-bdsr-ba5e-face-000000facebed` |
| BASE - Estúdio 1 e 2 | `base0011-es12-ba5e-face-000000facebed` |

### Title / Timer (Type=9000)

| Input original | GUID proposto |
|---|---|
| Timer Regressivo | `titl0001-tmrg-c0de-face-000000facebed` |
| Timer Regressivo com Hora | `titl0002-tmhr-c0de-face-000000facebed` |
| Relógio MULTVIEW | `titl0003-rlmv-c0de-face-000000facebed` |
| TEXTO RETORNO MULTVIEW | `titl0004-trmv-c0de-face-000000facebed` |
| BULLET POINTS | `titl0005-bull-c0de-face-000000facebed` |

### Mosaico cam-pair (Type=12 com nome "X e Y")

Pattern: `cmb0NaNb` onde Na = cam A, Nb = cam B.

| Input original | GUID proposto |
|---|---|
| 1 e 2 | `cmb00102-c1c2-dead-face-000000facebed` |
| 1 e 3 | `cmb00103-c1c3-dead-face-000000facebed` |
| 1 e 5 | `cmb00105-c1c5-dead-face-000000facebed` |
| 2 e 3 | `cmb00203-c2c3-dead-face-000000facebed` |
| 2 e 5 | `cmb00205-c2c5-dead-face-000000facebed` |
| 3 e 5 | `cmb00305-c3c5-dead-face-000000facebed` |
| 4 e 1 | `cmb00401-c4c1-dead-face-000000facebed` |
| 4 e 2 | `cmb00402-c4c2-dead-face-000000facebed` |
| 4 e 3 | `cmb00403-c4c3-dead-face-000000facebed` |
| 4 e 5 | `cmb00405-c4c5-dead-face-000000facebed` |

### Mosaico nomeado (Type=12 Colour com Title específico)

| Input original | GUID proposto |
|---|---|
| MOSAICO SPLITVIEW | `mosa0001-spvw-dead-face-000000facebed` |
| MULTCAM | `mosa0002-mtcm-dead-face-000000facebed` |
| MULTCAM PRÁTICA | `mosa0003-mtpr-dead-face-000000facebed` |
| Multview Teórica | `mosa0004-mvte-dead-face-000000facebed` |
| ESTÚDIO TEÓRICA E PRÁTICA | `mosa0005-estp-dead-face-000000facebed` |
| SÓ CAM PRÁTICA | `mosa0006-socp-dead-face-000000facebed` |

### Output return (Type=11200)

| Input original | GUID proposto |
|---|---|
| Output (return) | `outp0001-rtrn-cafe-face-000000facebed` |

---

## Convenções de nomenclatura

### Mnemônicos do 2º grupo (4 chars hex)

- 2-4 letras hex que abreviem o nome do input
- Quando o nome tem letras não-hex (i, l, o, s, etc), substituir ou abreviar:
  - "Lark" → `lark` (todas hex ✓)
  - "RETORNO PRÁTICA" → `mxrp` (mx = mix, rp = retorno prática)
  - "CORTE CAMERAS" → `mxct` (mx = mix, ct = corte)
  - "Logo Facial Academy" → `lgfa`
  - "Borda Slide Roxo" → `bdsr`
- Manter consistência: sempre 4 chars, sempre lowercase, sempre hex válido

### Quando o nome é longo

Priorizar **prefixo de categoria** + **letras-chave**:
- "Timer Regressivo com Hora" → `tmhr` (timer + hora)
- "ESTÚDIO TEÓRICA E PRÁTICA" → `estp`

### Quando há ambiguidade

Sufixar com número (no 1º grupo, não no 2º):
- Mosaico "MULTCAM" vs "MULTCAM PRÁTICA" → IDs diferentes (`mosa0002` vs `mosa0003`)
- Mnemônicos: `mtcm` vs `mtpr` (diferenciar via mnemônico distinto)

---

## Validações antes de aplicar

1. Cada GUID gerado é **único no catálogo global**
2. Mnemônico **não conflita** com outros da mesma categoria
3. Assinatura organizacional `000000facebed` é constante
4. Todos chars hex válidos (`0-9 a-f`)
5. Total = 36 chars com hífens nas posições 9, 14, 19, 24

---

## Resolução de conflitos

Se ao aplicar em `.vmix` existente:
- GUID novo já está no arquivo apontando pra OUTRO input → **conflito** → reportar, não aplicar
- Input do tipo correto mas Title/OriginalTitle não bate → **sugestão** → pedir confirmação manual
- Múltiplos inputs com mesmo Type+Title → **ambíguo** → usar ordem da lista no XML

---

## Exportar pra Companion

Cada entry do catálogo gera:

```
# Bitfocus Companion variable
$(vmix:input_<mnemonico>) = <GUID>

# Ex:
$(vmix:input_sdi1) = cam00001-sd11-cafe-face-000000facebed
$(vmix:input_sdi2) = cam00002-sd12-cafe-face-000000facebed
$(vmix:input_lark) = audi0001-lark-cafe-face-000000facebed
```

Botões do Stream Deck usam variável, não GUID hardcoded → muda projeto, mantém botão.
