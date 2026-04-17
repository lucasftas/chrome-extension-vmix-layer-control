// loader.js — GUID Panel for Broadcast Content Script
// Injeta a interface GUID Panel na página da API do vMix.

(function () {
    const apiUrl = window.location.href;

    while (document.firstChild) document.removeChild(document.firstChild);

    const ns = 'http://www.w3.org/1999/xhtml';
    const html = document.createElementNS(ns, 'html');
    const body = document.createElementNS(ns, 'body');
    const iframe = document.createElementNS(ns, 'iframe');

    html.setAttribute('style', 'height:100%;width:100%;overflow:hidden;');
    body.setAttribute('style', 'height:100%;width:100%;margin:0;overflow:hidden;background:#0a0a0a;');

    iframe.setAttribute('src', chrome.runtime.getURL('index.html') + '?api=' + encodeURIComponent(apiUrl));
    iframe.setAttribute('style', 'width:100%;height:100%;border:none;display:block;');
    iframe.setAttribute('allow', 'clipboard-write');

    body.appendChild(iframe);
    html.appendChild(body);
    document.appendChild(html);
})();
