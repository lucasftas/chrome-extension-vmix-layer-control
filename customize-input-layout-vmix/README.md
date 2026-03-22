# vMix Layout Editor

Editor visual de layouts multiview para vMix. Aplicativo single-page (HTML puro, sem dependencias) para criar, editar e exportar arquivos `.vMixLayout`.

## Funcionalidades

- **Canvas interativo** (1440x810) com drag, resize, crop e snap magnetico
- **Ate 10 layers** por layout com controle individual de posicao, zoom, corte, borda e rotacao
- **Presets** prontos (50/50, 2/3+1/3, triple split, AUTO grid)
- **Guias visuais** estilo Sony FX3 (tercos, grade, marcadores de aspecto, zonas de seguranca)
- **Alinhamento** estilo Photoshop/Illustrator (esquerda, centro, direita, distribuir)
- **Galeria de imagens** de referencia (preview no editor, nao exportadas)
- **Importar/Exportar** `.vMixLayout` (UTF-16 LE com BOM, compativel com vMix)
- **Copy/Paste** de parametros entre layers via JSON
- **Undo/Redo** com historico de 100 passos
- **Menu de contexto** (clique direito) com reset por categoria

## Como usar

1. Abra `index.html` no navegador
2. Crie ou importe um layout
3. Arraste e redimensione as layers no canvas
4. Exporte o `.vMixLayout` e importe no vMix

## Formato de exportacao

O nome do arquivo segue o padrao:
```
vMixLayout_{nome}_{visíveis}of{total}_{YYYYMMDD_HHmm}.vMixLayout
```
Exemplo: `vMixLayout_Multiview_2x2_4of4_20260308_1430.vMixLayout`

## Atalhos de teclado

| Tecla | Acao |
|-------|------|
| Q | Toggle auto-select |
| N | Nova layer |
| D | Duplicar selecionadas |
| Del | Deletar selecionadas |
| Setas | Pan (mover) |
| Ctrl+Setas | Pan 10px |
| Shift+Setas | Redimensionar simetrico |
| Ctrl+Z | Undo |
| Ctrl+Y | Redo |
| Ctrl+A | Selecionar todas |

## Sistema de coordenadas vMix

- **panX/Y**: -2 a 2 (0 = centro)
- **zoomX/Y**: fracao da canvas (0.5 = metade, 1.0 = tela cheia)
- **cropX1/Y1/X2/Y2**: recorte da fonte (0-1)
- **postZoomX/Y**: escala pos-layout (default 1.0)

## Requisitos

- Navegador moderno (Chrome, Edge, Firefox)
- Otimizado para monitor QHD 21:9 (2560x1080)
