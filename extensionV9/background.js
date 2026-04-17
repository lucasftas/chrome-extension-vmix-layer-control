// background.js — Service Worker
// Abre a página principal da extensão em uma nova aba ao clicar no ícone.
// Se já existe uma aba aberta com a página, foca nela em vez de abrir outra.

const MAIN_PAGE = 'index.html';

chrome.action.onClicked.addListener(async () => {
    const extensionUrl = chrome.runtime.getURL(MAIN_PAGE);

    // Verifica se já existe uma aba com a página aberta
    const existing = await chrome.tabs.query({ url: extensionUrl });
    if (existing.length > 0) {
        // Foca a aba existente
        await chrome.tabs.update(existing[0].id, { active: true });
        await chrome.windows.update(existing[0].windowId, { focused: true });
    } else {
        // Abre uma nova aba
        chrome.tabs.create({ url: extensionUrl });
    }
});
