# GUID Panel for Broadcast

> Extensão para Google Chrome que transforma a API do vMix em um painel visual de botões — estilo Stream Deck — com suporte a múltiplas máquinas, descoberta de rede e integração com o Bitfocus Companion.

![vMix](https://img.shields.io/badge/vMix-Compatible-orange.svg)
![Chrome](https://img.shields.io/badge/Chrome-Extension-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)

---

## ✨ O que este painel faz?

O **GUID Panel for Broadcast** conecta-se localmente à API do vMix e exibe todos os seus inputs em uma grade de botões interativos. Você pode arrastar inputs para o deck, copiar GUIDs, renomear botões e gerar ações prontas para o Companion — **sem latência, sem servidor externo, 100% local**.

---

## 🚀 Funcionalidades

### 🖥️ Multi-instância
- Gerencie **vários PCs com vMix** a partir de um único painel
- Adicione, edite e remova conexões por modal (sem sair da tela)
- Código de cor exclusivo por instância
- Status em tempo real: 🟢 Online · 🟡 Conectando · 🔴 Offline

### 📡 Descoberta de Rede
- Varredura automática da sub-rede local (ex: `192.168.90.x`) via botão **Descobrir**
- Scan paralelo de 254 IPs com barra de progresso em tempo real
- Cada máquina encontrada exibe: versão do vMix, edição, total de inputs, status de External/Streaming/Recording, contagem de NDI/SRT
- Botão **ℹ️** abre painel lateral com detalhes completos dos inputs SRT (modo Listener/Caller, porta, latência, hostname), NDI (fonte) e lista de **todos os inputs** da máquina
- Nome editável pré-preenchido no formato `PC-vMix.10` (prefixo + último octeto do IP)
- Adicionar máquinas individualmente ou **Adicionar Todos** de uma vez

### 🎛️ Deck / Grid de Botões
- Arraste inputs do painel inferior para o deck para criar botões
- **Clique ou clique direito** copia o **GUID** ou **Variável de Título** (conforme toggle no topo)
- **Duplo clique** renomeia o botão com rótulo personalizado
- **Botão ✕** remove o botão do grid
- **Botão ⚡** (ao passar o mouse) abre o **Companion Action Builder**
- Tally em tempo real: destaque visual para input em PGM, gravando ou streamando

### ⚡ Companion Action Builder
Gerador de ações para o Bitfocus Companion integrado a cada botão do deck:
1. Passe o mouse no botão → clique no ⚡ roxo
2. Escolha o tipo de ação:
   - **Enviar para PGM** — Corta o input direto ao programa
   - **Mudo de Mic / Áudio** — Liga/desliga o mudo do input
   - **Envia Áudio para Output BUS** — Roteia o áudio para um bus de saída (A, B, C...)
   - **Definir Input em uma Layer (Color/Blank)** — Define o input como uma layer
   - **Liga / Desliga Layer em um Input** — Toggle de visibilidade na layer
   - **Envia Input para Output Direto** — Define o input como fonte de um output
3. Copie a **Action** (`PRESS`) e o **Feedback** (`STATUS`) com um clique — prontos para colar no Companion

### ⚙️ Painel de Configuração (LocalStorage)
- Visualize todos os dados salvos (instâncias, layouts, preferências)
- Apague entradas individuais com confirmação ou **limpe tudo** de uma vez

### 🔧 Outros recursos
- **Importar / Exportar** layouts em JSON
- **Auto-refresh** configurável
- **Modo GUID / VAR** via toggle no topo da tela
- Todos os modais fecham com **ESC** ou clique fora

---

## 📦 Como Instalar no Google Chrome

> Não é necessário ter conhecimento técnico. Siga o passo a passo abaixo:

### Passo 1 — Baixe os arquivos

1. Nesta página do GitHub, clique no botão verde **`< > Code`**
2. Clique em **`Download ZIP`**
3. Salve o arquivo `.zip` em qualquer lugar do seu computador
4. **Extraia** o ZIP (clique com o botão direito → "Extrair Tudo..." no Windows)
5. Você terá uma pasta chamada `vMixAPILayout-main` (ou similar) com todos os arquivos dentro

### Passo 2 — Abra as Extensões do Chrome

1. Abra o **Google Chrome**
2. Na barra de endereço, digite exatamente:
   ```
   chrome://extensions/
   ```
   e pressione **Enter**
3. No canto **superior direito** da tela, ative o botão **"Modo do desenvolvedor"**

   > ⚠️ Esse modo é necessário para instalar extensões que não estão na Chrome Web Store. É seguro para uso local.

### Passo 3 — Carregar a Extensão

1. Clique no botão **"Carregar sem compactação"** (em inglês: *Load unpacked*)
2. Na janela que abrir, **navegue até a pasta** que você extraiu no Passo 1
3. Selecione a **pasta raiz** (a que contém os arquivos `manifest.json`, `app.js`, `style.css`, etc.)
4. Clique em **"Selecionar Pasta"**

✅ A extensão **GUID Panel for Broadcast** aparecerá na lista de extensões instaladas.

### Passo 4 — Usar a Extensão

1. Certifique-se de que o **vMix está aberto** e com o **Web Controller ativado**:
   - No vMix: `Settings → Web Controller → Enable`
   - A porta padrão é `8088`
2. No Chrome, acesse o endereço da API do seu vMix:
   ```
   http://192.168.90.10:8088/api
   ```
   *(Substitua `192.168.90.10` pelo IP do PC com vMix)*
3. O painel **GUID Panel for Broadcast** será carregado automaticamente nessa aba

> 💡 **Dica:** Você também pode adicionar outras instâncias do vMix clicando no botão `+` na barra lateral do painel.

---

## 🔒 Privacidade e Segurança

- Roda **100% localmente** na sua rede
- **Nenhum dado sai da sua máquina**
- Nenhum servidor externo, nenhuma coleta de informações
- A permissão `http://*/*` é usada exclusivamente para acessar a API do vMix em qualquer IP local

---

## 📄 Licença

Este projeto está sob a licença **MIT**. Você é livre para usar, modificar e distribuir.

---

Desenvolvido por [Lucas Ftas](https://github.com/lucasftas)
