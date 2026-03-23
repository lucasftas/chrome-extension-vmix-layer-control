// =============================================
// GUID Panel for Broadcast — Full-Page Edition
// =============================================

// --- ÍCONES SVG ---
const ICONS = {
    download: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>',
    upload: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>',
    refresh: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>',
    grid: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/></svg>',
    layers: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>',
    x: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
    film: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>',
    camera: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>',
    image: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
    type: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/></svg>',
    music: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',
    monitor: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>',
    phone: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
    globe: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>',
    box: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" x2="12" y1="22.08" y2="12"/></svg>',
    list: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>',
    offline: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="1" x2="23" y1="1" y2="23"/><path d="M16.72 11.06A10.94 10.94 0 0 1 19 12.55"/><path d="M5 12.55a10.94 10.94 0 0 1 5.17-2.39"/><path d="M10.71 5.05A16 16 0 0 1 22.58 9"/><path d="M1.42 9a15.91 15.91 0 0 1 4.7-2.88"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" x2="12.01" y1="20" y2="20"/></svg>',
    mic: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/><line x1="8" x2="16" y1="22" y2="22"/></svg>',
    plus: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>',
    settings: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>',
    trash: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>',
    edit: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    copy: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>',
    wifi: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" x2="12.01" y1="20" y2="20"/></svg>',
    chevron: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>'
};

function getIcon(name) { return ICONS[name] || ICONS.box; }

// --- CORES DISPONÍVEIS ---
const INSTANCE_COLORS = ['#f97316', '#3b82f6', '#22c55e', '#a855f7', '#06b6d4', '#ec4899', '#eab308', '#ef4444'];

// --- ESTADO GLOBAL ---
const STATE = {
    instances: [],
    activeId: null,
    copyMode: 'GUID',
    filter: 'All',
    gridSize: 32,
    autoRefreshSecs: 0,
    _refreshTimer: null,
    _searchDebounce: null,
    _newInstColor: INSTANCE_COLORS[0],
    activeTab: 'deck',
    layerControl: {
        layers: [],
        selectedLayer: 0,
        targetInputKey: null,
        targetInputTitle: '',
        snapEnabled: true,
        layoutMode: 'sim',  // 'sim' = Simétrico, 'pgm' = PGM
        _syncTimer: null
    }
};

const LC_COLORS = ['#0000ff','#ff0000','#ffa500','#008000','#ffff00','#800080','#800000','#40e0d0','#a52a2a','#ff69b4'];

// =============================================
// INSTANCE MANAGEMENT
// =============================================

function getActiveInstance() {
    return STATE.instances.find(i => i.id === STATE.activeId) || null;
}

function makeInstanceId(host, port) {
    return `vmix_${host.replace(/\./g, '_')}_${port}`;
}

function createInstance(label, host, port, color) {
    port = String(port || '8088');
    const id = makeInstanceId(host, port);
    if (STATE.instances.find(i => i.id === id)) { showToast('Instância já cadastrada!'); return null; }
    const assignedColor = color || INSTANCE_COLORS[STATE.instances.length % INSTANCE_COLORS.length];
    const inst = {
        id, label, host, port, color: assignedColor,
        status: 'connecting', inputs: [],
        vmixInfo: { version: '', edition: '', status: {} },
        deckLayout: loadInstanceDB(host, port)
    };
    STATE.instances.push(inst);
    saveInstances();
    return inst;
}

// =============================================
// MODAL SYSTEM — replaces all browser alert/prompt/confirm
// =============================================

function showModal(htmlContent, onMounted) {
    closeModal(); // close any existing
    const overlay = document.createElement('div');
    overlay.id = 'vmatrix-modal';
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `<div class="modal-card">${htmlContent}</div>`;
    document.body.appendChild(overlay);
    // Close on backdrop click
    overlay.addEventListener('click', e => { if (e.target === overlay) closeModal(); });
    // Close on Escape
    const onKey = e => { if (e.key === 'Escape') { closeModal(); document.removeEventListener('keydown', onKey); } };
    document.addEventListener('keydown', onKey);
    overlay._removeKey = onKey;
    requestAnimationFrame(() => overlay.classList.add('visible'));
    if (onMounted) onMounted(overlay.querySelector('.modal-card'));
}

function closeModal() {
    const m = document.getElementById('vmatrix-modal');
    if (!m) return;
    if (m._removeKey) document.removeEventListener('keydown', m._removeKey);
    m.classList.remove('visible');
    setTimeout(() => m.remove(), 200);
}

// Detail Drawer — slides in from the RIGHT on top of any modal
function showDetailDrawer(title, sub, color, htmlContent) {
    closeDetailDrawer();

    const overlay = document.createElement('div');
    overlay.id = 'vmatrix-detail-drawer';
    overlay.className = 'drawer-overlay';
    overlay.innerHTML = `
        <aside class="drawer-panel">
            <div class="drawer-header" style="border-top:3px solid ${color};">
                <div class="drawer-header-info">
                    <div class="drawer-title">${title}</div>
                    <div class="drawer-sub">${sub}</div>
                </div>
                <button class="drawer-close" id="drawerClose" title="Fechar">${getIcon('x')}</button>
            </div>
            <div class="drawer-body">${htmlContent}</div>
        </aside>`;

    document.body.appendChild(overlay);

    // Animate in
    requestAnimationFrame(() => overlay.classList.add('open'));

    overlay.addEventListener('click', e => { if (e.target === overlay) closeDetailDrawer(); });
    const onKey = e => { if (e.key === 'Escape') closeDetailDrawer(); };
    document.addEventListener('keydown', onKey);
    overlay._removeKey = onKey;
    overlay.querySelector('#drawerClose').addEventListener('click', closeDetailDrawer);
}

function closeDetailDrawer() {
    const d = document.getElementById('vmatrix-detail-drawer');
    if (!d) return;
    if (d._removeKey) document.removeEventListener('keydown', d._removeKey);
    d.classList.remove('open');
    setTimeout(() => d.remove(), 260);
}


function duplicateInstance(id) {
    const src = STATE.instances.find(i => i.id === id);
    if (!src) return;
    const octets = src.host.split('.');
    const baseIP = octets.length === 4 ? octets.slice(0, 3).join('.') : src.host;
    const lastOctet = octets.length === 4 ? (octets[3] || '') : '';
    const nextColorIdx = (INSTANCE_COLORS.indexOf(src.color) + 1) % INSTANCE_COLORS.length;
    let dupColor = INSTANCE_COLORS[nextColorIdx];

    showModal(`
        ${PORT_DATALIST_HTML}
        <div class="modal-header">
            <div class="modal-icon" style="background:${src.color}">${getIcon('copy')}</div>
            <div>
                <div class="modal-title">Duplicar Conexão</div>
                <div class="modal-sub">Baseado em: <strong>${src.label}</strong> (${src.host}:${src.port})</div>
            </div>
        </div>
        <div class="modal-body">
            <div class="modal-field">
                <label>Nome da nova conexão</label>
                <input id="dupLabel" class="modal-input" value="${src.label} (cópia)" placeholder="Nome">
            </div>
            <div class="modal-field">
                <label>IP — apenas o último octeto muda</label>
                <div style="display:flex;align-items:center;gap:6px;">
                    <span class="modal-ip-base">${baseIP} .</span>
                    <input id="dupLastOctet" class="modal-input" style="width:70px;text-align:center;font-family:monospace;font-size:16px;"
                        value="${lastOctet}" maxlength="3" placeholder="___" inputmode="numeric">
                </div>
            </div>
            <div class="modal-field">
                <label>Porta</label>
                <input id="dupPort" class="modal-input" list="vmix-ports" value="${src.port}" style="width:100px;font-family:monospace;">
            </div>
            <div class="modal-field">
                <label>Cor</label>
                <div class="modal-colors">
                    ${INSTANCE_COLORS.map(c => `<button class="color-swatch${c === dupColor ? ' selected' : ''}" data-color="${c}" style="background:${c}"></button>`).join('')}
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button id="dupCancel" class="modal-btn-cancel">${getIcon('x')} Cancelar</button>
            <button id="dupConfirm" class="modal-btn-ok">${getIcon('copy')} Duplicar</button>
        </div>`,
        card => {
            // Color swatches
            card.querySelectorAll('.color-swatch').forEach(sw => {
                sw.addEventListener('click', () => {
                    dupColor = sw.dataset.color;
                    card.querySelectorAll('.color-swatch').forEach(s => s.classList.toggle('selected', s.dataset.color === dupColor));
                });
            });
            card.querySelector('#dupCancel').addEventListener('click', closeModal);
            const doCreate = async () => {
                const lastO = card.querySelector('#dupLastOctet').value.trim();
                const newHost = octets.length === 4 && lastO ? `${baseIP}.${lastO}` : (lastO || src.host);
                const newLabel = card.querySelector('#dupLabel').value.trim();
                const newPort = card.querySelector('#dupPort').value.trim() || '8088';
                if (!lastO) { card.querySelector('#dupLastOctet').focus(); return; }
                const inst = createInstance(newLabel || newHost, newHost, newPort, dupColor);
                if (!inst) return;
                STATE.activeId = inst.id;
                closeModal();
                renderSidebar();
                showToast('Conexão duplicada!');
                fetchVMixData(inst).then(() => renderAll());
            };
            card.querySelector('#dupConfirm').addEventListener('click', doCreate);
            card.querySelector('#dupLastOctet').addEventListener('keydown', e => { if (e.key === 'Enter') doCreate(); });
            card.querySelector('#dupLastOctet').focus();
            card.querySelector('#dupLastOctet').select();
        });
}

function removeInstance(id) {
    // Called directly from the edit panel without a confirm() dialog
    const inst = STATE.instances.find(i => i.id === id);
    if (!inst) return;
    STATE.instances = STATE.instances.filter(i => i.id !== id);
    if (STATE.activeId === id) STATE.activeId = STATE.instances[0]?.id || null;
    saveInstances();
    if (STATE.instances.length === 0) { renderSetupScreen(); return; }
    renderSidebar();
    renderAll();
}

/**
 * Shows a modal overlay for editing an instance.
 */
function showEditForm(id) {
    const inst = STATE.instances.find(i => i.id === id);
    if (!inst) return;

    const octets = inst.host.split('.');
    const [o0, o1, o2, o3] = octets.length === 4 ? octets : ['', '', '', ''];

    showModal(`
        ${PORT_DATALIST_HTML}
        <div class="modal-header">
            <div class="modal-icon" style="background:${inst.color}">${getIcon('settings')}</div>
            <div>
                <div class="modal-title">Editar Conexão</div>
                <div class="modal-sub">${inst.host}:${inst.port}</div>
            </div>
        </div>
        <div class="modal-body">
            <div class="modal-field">
                <label>Nome</label>
                <input id="sefLabel" class="modal-input" value="${inst.label}" placeholder="Nome">
            </div>
            <div class="modal-field">
                <label>IP do PC</label>
                ${buildIPInputHTML('sef')}
            </div>
            <div class="modal-field">
                <label>Porta</label>
                <input id="sefPort" class="modal-input" list="vmix-ports" value="${inst.port}" style="width:110px;font-family:monospace;">
            </div>
            <div class="modal-field">
                <label>Cor</label>
                <div class="modal-colors">
                    ${INSTANCE_COLORS.map(c => `<button class="color-swatch${c === inst.color ? ' selected' : ''}" data-color="${c}" style="background:${c}"></button>`).join('')}
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button id="sefDelete" class="modal-btn-delete">${getIcon('trash')} Excluir</button>
            <button id="sefCancel" class="modal-btn-cancel">${getIcon('x')} Cancelar</button>
            <button id="sefSave" class="modal-btn-ok">${getIcon('edit')} Salvar</button>
        </div>`,
        card => {
            // Pre-fill IP fields (buildIPInputHTML creates light-mode fields, we set values)
            const f = n => card.querySelector(`#sefIp${n}`);
            if (f(0)) f(0).value = o0;
            if (f(1)) f(1).value = o1;
            if (f(2)) f(2).value = o2;
            if (f(3)) f(3).value = o3;

            wireIPInput('sef', () => card.querySelector('#sefSave')?.click());

            let selectedColor = inst.color;
            card.querySelectorAll('.color-swatch').forEach(sw => {
                sw.addEventListener('click', () => {
                    selectedColor = sw.dataset.color;
                    card.querySelectorAll('.color-swatch').forEach(s => s.classList.toggle('selected', s.dataset.color === selectedColor));
                });
            });

            card.querySelector('#sefCancel').addEventListener('click', closeModal);

            card.querySelector('#sefSave').addEventListener('click', async () => {
                const newLabel = card.querySelector('#sefLabel').value.trim();
                const newHost = getIPFromInput('sef');
                const newPort = card.querySelector('#sefPort').value.trim() || '8088';
                if (!newHost || newHost === '0.0.0.0') { f(0)?.focus(); return; }

                const newId = makeInstanceId(newHost, newPort);
                const hostChanged = newHost !== inst.host || newPort !== inst.port;

                if (hostChanged && STATE.instances.find(i => i.id === newId && i.id !== id)) {
                    showToast('Já existe uma instância com esse IP:Porta!'); return;
                }

                inst.label = newLabel || inst.label;
                inst.color = selectedColor;

                if (hostChanged) {
                    const oldLayout = inst.deckLayout;
                    inst.host = newHost;
                    inst.port = newPort;
                    inst.id = newId;
                    inst.deckLayout = oldLayout;
                    if (STATE.activeId === id) STATE.activeId = newId;
                    saveInstanceDB(inst);
                }

                saveInstances();
                closeModal();
                showToast('Conexão atualizada!');
                renderSidebar();
                updateHeaderInfo();
                if (hostChanged) {
                    inst.status = 'connecting';
                    fetchVMixData(inst).then(() => renderAll());
                }
            });

            // Two-click delete
            let deleteArmed = false;
            const delBtn = card.querySelector('#sefDelete');
            delBtn.addEventListener('click', () => {
                if (!deleteArmed) {
                    deleteArmed = true;
                    delBtn.innerHTML = `${getIcon('trash')} Confirmar exclusão?`;
                    delBtn.classList.add('armed');
                    setTimeout(() => { if (deleteArmed) { deleteArmed = false; delBtn.innerHTML = `${getIcon('trash')} Excluir`; delBtn.classList.remove('armed'); } }, 3000);
                } else {
                    closeModal();
                    removeInstance(id);
                }
            });

            card.querySelector('#sefLabel').focus();
            card.querySelector('#sefLabel').select();
        });
}

function setActiveInstance(id) {
    STATE.activeId = id;
    STATE.filter = 'All';
    renderSidebar();
    renderDeck();
    generateFilters();
    renderInputs();
    updateHeaderInfo();
}

function saveInstances() {
    localStorage.setItem('vmix_instances', JSON.stringify(
        STATE.instances.map(({ id, label, host, port, color }) => ({ id, label, host, port, color }))
    ));
}

function loadInstances() {
    try { return JSON.parse(localStorage.getItem('vmix_instances') || '[]'); }
    catch { return []; }
}

function loadInstanceDB(host, port) {
    const key = `vmix_deck_${host.replace(/\./g, '_')}_${port}`;
    const layout = new Array(STATE.gridSize).fill(null);
    try {
        const saved = JSON.parse(localStorage.getItem(key) || 'null');
        if (Array.isArray(saved)) {
            for (let i = 0; i < Math.min(saved.length, layout.length); i++) layout[i] = saved[i];
        }
    } catch { }
    return layout;
}

function saveInstanceDB(inst) {
    localStorage.setItem(`vmix_deck_${inst.host.replace(/\./g, '_')}_${inst.port}`, JSON.stringify(inst.deckLayout));
}

function resizeAllLayouts(newSize) {
    STATE.instances.forEach(inst => {
        const old = inst.deckLayout;
        const next = new Array(newSize).fill(null);
        for (let i = 0; i < Math.min(old.length, newSize); i++) next[i] = old[i];
        inst.deckLayout = next;
        saveInstanceDB(inst);
    });
}

// =============================================
// VMIX API
// =============================================

async function fetchVMixData(inst) {
    if (!inst) return;
    inst.status = 'connecting';
    updateSidebarItem(inst.id);
    try {
        const res = await fetch(`http://${inst.host}:${inst.port}/api`, { signal: AbortSignal.timeout(5000) });
        const doc = new DOMParser().parseFromString(await res.text(), 'text/xml');
        inst.vmixInfo.version = doc.getElementsByTagName('version')[0]?.textContent || '';
        inst.vmixInfo.edition = doc.getElementsByTagName('edition')[0]?.textContent || '';
        inst.vmixInfo.status = {
            streaming: doc.getElementsByTagName('streaming')[0]?.textContent === 'True',
            recording: doc.getElementsByTagName('recording')[0]?.textContent === 'True',
            external: doc.getElementsByTagName('external')[0]?.textContent === 'True'
        };
        inst.inputs = Array.from(doc.getElementsByTagName('input')).map(el => {
            const rawType = el.getAttribute('type');
            const duration = parseInt(el.getAttribute('duration') || '0');
            const source = el.textContent || '';
            let displayType = rawType, meta = '', extension = '', isFile = false;
            if (source.includes('.')) {
                const ext = source.split('.').pop();
                if (ext && ext.length >= 2 && ext.length <= 4) { extension = ext.toUpperCase(); isFile = true; }
            }
            if (rawType === 'Image') displayType = 'Arte';
            else if (rawType === 'Video') { displayType = 'Vídeo'; meta = formatDuration(duration); }
            else if (rawType === 'Virtual') displayType = 'Virtual';
            else if (rawType === 'GT' || rawType === 'Title') displayType = 'Texto';
            else if (rawType === 'Photos') displayType = 'Slides';
            else if (rawType === 'Colour') displayType = 'Cor';
            else if (rawType === 'Audio') displayType = isFile ? 'Música' : 'Mic/Line';
            return {
                key: el.getAttribute('key'), number: parseInt(el.getAttribute('number')),
                rawType, displayType, title: el.getAttribute('title'),
                shortTitle: el.getAttribute('shortTitle'), state: el.getAttribute('state'),
                meta, extension, isFile, instanceId: inst.id
            };
        });
        inst.status = 'online';
    } catch {
        inst.status = 'offline';
    }
    updateSidebarItem(inst.id);
}

function formatDuration(ms) {
    if (!ms) return '';
    const s = Math.floor(ms / 1000);
    return `${Math.floor(s / 60)}m${s % 60}s`;
}

function setupAutoRefresh() {
    if (STATE._refreshTimer) { clearInterval(STATE._refreshTimer); STATE._refreshTimer = null; }
    if (STATE.autoRefreshSecs > 0) {
        STATE._refreshTimer = setInterval(async () => {
            await Promise.all(STATE.instances.map(i => fetchVMixData(i)));
            renderAll();
        }, STATE.autoRefreshSecs * 1000);
    }
    const sel = document.getElementById('refreshIntervalSel');
    if (sel) sel.value = String(STATE.autoRefreshSecs);
    const dot = document.getElementById('refreshDot');
    if (dot) dot.style.display = STATE.autoRefreshSecs > 0 ? 'inline-block' : 'none';
}

// =============================================
// IP OCTET INPUT BUILDER + PORT DATALIST
// =============================================

// Smart suggestions per octet position based on previous values
const IP_SUGGESTIONS = {
    0: ['192', '10', '172', '127'],
    // octet2 depends on octet1
    1: { '192': '168', '10': '0', '172': '16', '127': '0', '': '168' },
    // octet3 depends on octet1+2
    2: { '192.168': '0', '10.0': '0', '172.16': '0', '127.0': '0', '': '0' },
    3: ['1', '2', '10', '100', '101', '200', '254']
};

const PORT_DATALIST_HTML = `
<datalist id="vmix-ports">
    <option value="8088">8088 — Padrão vMix</option>
    <option value="8089">8089 — Secundária</option>
    <option value="8090">8090 — Terciária</option>
    <option value="80">80 — HTTP</option>
    <option value="443">443 — HTTPS</option>
</datalist>`;

/**
 * Creates a split IP input with 4 octet fields.
 * @param {string} idPrefix  — e.g. 'setup' produces #setupIp0..3
 * @param {string} dark      — if 'dark', applies dark variant CSS
 * @returns {string} HTML string
 */
function buildIPInputHTML(idPrefix, dark = false) {
    const cls = dark ? 'ip-input-group dark' : 'ip-input-group';
    const octets = [192, 168, '', ''];
    return `<div class="${cls}" id="${idPrefix}IpGroup">
        <input class="ip-octet" id="${idPrefix}Ip0" maxlength="3" placeholder="${octets[0]}" inputmode="numeric">
        <span class="ip-dot">.</span>
        <input class="ip-octet" id="${idPrefix}Ip1" maxlength="3" placeholder="${octets[1]}" inputmode="numeric">
        <span class="ip-dot">.</span>
        <input class="ip-octet" id="${idPrefix}Ip2" maxlength="3" placeholder="0" inputmode="numeric">
        <span class="ip-dot">.</span>
        <input class="ip-octet" id="${idPrefix}Ip3" maxlength="3" placeholder="1" inputmode="numeric">
    </div>`;
}

/** Wires up autocomplete and auto-advance on a set of 4 octet inputs. */
function wireIPInput(idPrefix, onEnter) {
    const fields = [0, 1, 2, 3].map(i => document.getElementById(`${idPrefix}Ip${i}`));
    fields.forEach((field, idx) => {
        if (!field) return;
        field.addEventListener('keydown', e => {
            if (e.key === 'Tab' || e.key === '.') {
                // advance on Tab or dot
                if (idx < 3) { e.preventDefault(); fields[idx + 1].select(); fields[idx + 1].focus(); }
            } else if (e.key === 'Backspace' && field.value === '' && idx > 0) {
                // go back on backspace in empty field
                e.preventDefault(); fields[idx - 1].focus(); fields[idx - 1].setSelectionRange(fields[idx - 1].value.length, fields[idx - 1].value.length);
            } else if (e.key === 'Enter' && onEnter) {
                onEnter();
            }
        });
        field.addEventListener('input', e => {
            // Only numbers
            field.value = field.value.replace(/[^0-9]/g, '').slice(0, 3);
            // Smart autocomplete: when 1 digit and it matches a known prefix, suggest in placeholder
            const v = field.value;
            if (idx === 0) {
                const match = IP_SUGGESTIONS[0].find(s => s.startsWith(v));
                fields[1].placeholder = match === '192' ? '168' : match === '10' ? '0' : match === '127' ? '0' : '168';
            } else if (idx === 1) {
                const o0 = fields[0].value;
                const key = `${o0}.${v.charAt(0)}`;
                // update octet3 hint
                const key2 = `${o0}.${v}`.replace(/\.$/, '');
                fields[2].placeholder = IP_SUGGESTIONS[2][key2] || '0';
            }
            // Auto-advance when 3 digits entered or value is 200-255
            if (v.length === 3 && idx < 3) fields[idx + 1].focus();
            // Auto-advance if value > 25 and length 2 for last possible 2-digit start of octet
            if (v.length === 2 && parseInt(v) > 25 && idx < 3) fields[idx + 1].focus();
        });
    });
}

/** Returns assembled IP from the 4 octet fields. Falls back to placeholder values for empty fields. */
function getIPFromInput(idPrefix) {
    const fields = [0, 1, 2, 3].map(i => document.getElementById(`${idPrefix}Ip${i}`));
    return fields.map(f => f?.value.trim() || f?.placeholder || '0').join('.');
}

// =============================================
// RENDER — SETUP SCREEN (first launch)
// =============================================

function renderSetupScreen() {
    document.getElementById('app-root').innerHTML = `
    ${PORT_DATALIST_HTML}
    <div class="setup-screen">
        <div class="setup-card">
            <div class="setup-logo">
                <div class="setup-logo-icon">${getIcon('wifi')}</div>
                <h1 class="setup-title">GUID Panel for Broadcast</h1>
                <p class="setup-sub">Painel de controle multi-vMix</p>
            </div>
            <div class="setup-body">
                <h2 class="setup-section-title">Adicionar conexão vMix</h2>
                <p class="setup-hint">Informe o IP do PC onde o vMix está rodando e a porta da API Web.</p>
                <div class="setup-form">
                    <div class="setup-field">
                        <label>Nome</label>
                        <input id="setupLabel" class="setup-input" placeholder="ex: PC Principal" autofocus>
                    </div>
                    <div class="setup-field">
                        <label>IP do PC</label>
                        ${buildIPInputHTML('setup')}
                    </div>
                    <div class="setup-field">
                        <label>Porta</label>
                        <input id="setupPort" class="port-combo" list="vmix-ports" value="8088" placeholder="8088">
                    </div>
                    <div class="setup-colors">
                        <label>Cor</label>
                        <div class="color-row">
                            ${INSTANCE_COLORS.map((c, i) => `<button class="color-swatch${i === 0 ? ' selected' : ''}" data-color="${c}" style="background:${c}"></button>`).join('')}
                        </div>
                    </div>
                    <button id="setupAddBtn" class="setup-btn-primary">${getIcon('plus')} Conectar</button>
                </div>
                <div class="setup-tip">
                    <strong>💡 Dica:</strong> certifique-se de que o vMix Web Controller está habilitado em
                    <em>Settings → Web Controller</em>, e que ambos os PCs estão na mesma rede.
                </div>
            </div>
        </div>
    </div>`;

    // Wire IP fields
    wireIPInput('setup', () => document.getElementById('setupAddBtn')?.click());

    // Color swatches
    document.querySelectorAll('.color-swatch').forEach(sw => {
        sw.addEventListener('click', () => {
            STATE._newInstColor = sw.dataset.color;
            document.querySelectorAll('.color-swatch').forEach(s => s.classList.toggle('selected', s.dataset.color === STATE._newInstColor));
        });
    });

    document.getElementById('setupAddBtn').addEventListener('click', async () => {
        const label = document.getElementById('setupLabel').value.trim();
        const host = getIPFromInput('setup');
        const port = document.getElementById('setupPort').value.trim() || '8088';
        if (!host || host === '0.0.0.0') { document.getElementById('setupIp0').focus(); return; }
        const inst = createInstance(label || host, host, port, STATE._newInstColor);
        if (!inst) return;
        STATE.activeId = inst.id;
        renderMainInterface();
        setupGlobalEvents();
        restoreSettings();
        await fetchVMixData(inst);
        renderAll();
    });

    document.getElementById('setupPort').addEventListener('keydown', e => {
        if (e.key === 'Enter') document.getElementById('setupAddBtn').click();
    });
}

// =============================================
// RENDER — MAIN INTERFACE
// =============================================

function renderMainInterface() {
    document.getElementById('app-root').innerHTML = `
    <div class="app-layout">

        <!-- SIDEBAR -->
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <span class="sidebar-logo">GUID Panel</span>
                <span class="sidebar-version">v1</span>
            </div>
            <div class="sidebar-instances" id="sidebar-instances"></div>
            <div class="sidebar-add-area">
                <button class="btn-sidebar-add" id="btnSidebarAdd">${getIcon('plus')} Adicionar vMix</button>
            </div>
            <div class="sidebar-footer">
                <div class="sidebar-ctrl">
                    <span class="ctrl-label">AUTO</span>
                    <span id="refreshDot" class="refresh-dot" style="display:none"></span>
                    <select id="refreshIntervalSel" class="ctrl-select">
                        <option value="0">OFF</option><option value="5">5s</option>
                        <option value="10">10s</option><option value="30">30s</option><option value="60">60s</option>
                    </select>
                </div>
                <div class="sidebar-ctrl">
                    <span class="ctrl-label">GRID</span>
                    <select id="gridSizeSel" class="ctrl-select">
                        <option value="16">16</option><option value="32">32</option>
                        <option value="40">40</option><option value="64">64</option>
                    </select>
                </div>
                <a href="https://lucasftas.github.io/guid-panel-for-broadcast/privacy-policy.html"
                   target="_blank"
                   style="display:block;text-align:center;margin-top:10px;font-size:10px;color:#555;text-decoration:none;letter-spacing:.4px;transition:color .2s;"
                   onmouseover="this.style.color='#888'" onmouseout="this.style.color='#555'">
                   🔒 Privacy Policy
                </a>
            </div>
        </aside>

        <!-- MAIN -->
        <div class="main-area">

            <!-- TOPBAR -->
            <header class="topbar">
                <div class="topbar-left">
                    <div id="topbarInfo" class="topbar-info"></div>
                    <div id="vmixStatus" class="status-bar"></div>
                </div>
                <div class="topbar-right">
                    <div class="toggle-wrapper" title="Esq: GUID | Dir: Variável">
                        <span class="ctrl-label" style="color:#999;">MODO:</span>
                        <label class="toggle-switch">
                            <input type="checkbox" id="modeToggle" style="display:none">
                            <span id="modeLabel" style="color:var(--accent-orange);width:35px;text-align:center;font-weight:bold;">GUID</span>
                            <div class="toggle-dot-container"><div id="toggleDot" class="toggle-dot"></div></div>
                        </label>
                    </div>
                    <button id="btnRefresh" class="btn-tool" title="Recarregar">${getIcon('refresh')}</button>
                    <button id="btnConfig" class="btn-tool" title="Configurações e Storage">${getIcon('settings')} Config</button>
                    <div class="badge clock" id="clock">--:--</div>
                </div>
            </header>

            <!-- CONTENT -->
            <div class="content-area">
                <!-- DECK + LAYER CONTROL (tabbed) -->
                <div class="deck-panel">
                    <div class="deck-tabs">
                        <button class="deck-tab active" id="tabDeck">${getIcon('grid')} Deck</button>
                        <button class="deck-tab" id="tabLayers">${getIcon('layers')} Live MultiLayer Editor</button>
                    </div>
                    <div class="deck-content" id="deckContent">
                        <div class="deck-header">
                            <span style="display:flex;align-items:center;gap:6px;">${getIcon('grid')} <span id="deckTitle">GUID Panel Grid</span></span>
                            <button id="btnClear" style="color:#ef4444;background:none;border:none;cursor:pointer;font-size:10px;text-decoration:underline;">Limpar Tudo</button>
                        </div>
                        <div class="deck-grid" id="deck-grid"></div>
                    </div>
                    <div class="layer-content hidden" id="layerContent">
                        <div class="lc-toolbar">
                            <button class="lc-target-btn" id="lcTargetBtn" title="Selecionar input">${getIcon('monitor')} <span id="lcTargetLabel">Selecionar input...</span></button>
                            <div class="lc-toolbar-sep"></div>
                            <button class="lc-snap-toggle active" id="lcSnapToggle" title="Snap magnético">${getIcon('grid')} Snap</button>
                            <div class="lc-toolbar-sep"></div>
                            <div class="layer-presets">
                                <span class="lc-presets-label">SPLIT</span>
                                <button class="preset-btn" data-preset="5050" title="50/50"><svg viewBox="0 0 32 18"><rect x="0" y="0" width="15.5" height="18" rx="1" fill="#0000ff"/><rect x="16.5" y="0" width="15.5" height="18" rx="1" fill="#ff0000"/></svg></button>
                                <button class="preset-btn" data-preset="6733" title="2/3 + 1/3"><svg viewBox="0 0 32 18"><rect x="0" y="0" width="21" height="18" rx="1" fill="#0000ff"/><rect x="22" y="0" width="10" height="18" rx="1" fill="#ff0000"/></svg></button>
                                <button class="preset-btn" data-preset="3367" title="1/3 + 2/3"><svg viewBox="0 0 32 18"><rect x="0" y="0" width="10" height="18" rx="1" fill="#0000ff"/><rect x="11" y="0" width="21" height="18" rx="1" fill="#ff0000"/></svg></button>
                                <button class="preset-btn" data-preset="333" title="Triple"><svg viewBox="0 0 32 18"><rect x="0" y="0" width="10" height="18" rx="1" fill="#0000ff"/><rect x="11" y="0" width="10" height="18" rx="1" fill="#ff0000"/><rect x="22" y="0" width="10" height="18" rx="1" fill="#ffa500"/></svg></button>
                                <div class="lc-toolbar-sep"></div>
                                <span class="lc-presets-label">MULTIVIEW</span>
                                <button class="lc-mode-toggle active" id="lcModeToggle" title="Alternar Simétrico / PGM">SIM</button>
                                <button class="preset-btn" data-preset="auto" title="AUTO (usa todas as layers)"><svg viewBox="0 0 32 18"><rect x="0" y="0" width="15.5" height="8.5" rx="1" fill="#0000ff"/><rect x="16.5" y="0" width="15.5" height="8.5" rx="1" fill="#ff0000"/><rect x="0" y="9.5" width="15.5" height="8.5" rx="1" fill="#ffa500"/><rect x="16.5" y="9.5" width="15.5" height="8.5" rx="1" fill="#008000"/></svg></button>
                            </div>
                        </div>
                        <div class="lc-main">
                            <div class="layer-canvas-wrapper">
                                <div class="layer-canvas" id="layerCanvas"></div>
                            </div>
                            <div class="lc-sidebar">
                                <div class="lc-sidebar-title">LAYERS</div>
                                <div class="layer-list" id="layerList"></div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- INPUTS -->
                <div class="inputs-panel">
                    <div class="inputs-info-bar" id="inputsInfoBar"><span>Selecione uma instância</span></div>
                    <div class="inputs-toolbar">
                        <span style="display:flex;align-items:center;gap:6px;font-weight:bold;font-size:12px;color:#ddd;">${getIcon('layers')} Inputs</span>
                        <input type="text" id="searchInput" placeholder="Filtrar por nome..." class="search-input">
                    </div>
                    <div class="filters-bar" id="filters-container"></div>
                    <div class="inputs-grid-container"><div class="inputs-grid" id="inputs-grid"></div></div>
                </div>
            </div>
        </div>
    </div>
    <div id="toast" class="toast">Copiado!</div>`;
}

// =============================================
// RENDER — SIDEBAR
// =============================================

function renderSidebar() {
    const container = document.getElementById('sidebar-instances');
    if (!container) return;
    container.innerHTML = '';
    STATE.instances.forEach(inst => {
        const isActive = inst.id === STATE.activeId;
        const stClass = { online: 'st-online', offline: 'st-offline', connecting: 'st-connecting' }[inst.status] || 'st-connecting';
        const item = document.createElement('div');
        item.className = `sidebar-item${isActive ? ' active' : ''}`;
        item.dataset.id = inst.id;
        if (isActive) {
            item.style.borderLeftColor = inst.color;
            item.style.background = `linear-gradient(90deg, ${inst.color}22 0%, transparent 80%)`;
        }
        item.innerHTML = `
            <div class="sidebar-item-color" style="background:${inst.color}"></div>
            <div class="sidebar-item-info">
                <span class="sidebar-item-name" style="color:${isActive ? inst.color : '#ccc'}">${inst.label}</span>
                <span class="sidebar-item-addr">${inst.host}:${inst.port}</span>
            </div>
            <span class="sidebar-item-status ${stClass}">●</span>
            <div class="sidebar-item-actions">
                <button class="sib-btn sib-rename" data-id="${inst.id}" title="Editar">${getIcon('edit')}</button>
                <button class="sib-btn sib-duplicate" data-id="${inst.id}" title="Duplicar">${getIcon('copy')}</button>
            </div>`;
        item.addEventListener('click', e => {
            if (e.target.closest('.sidebar-item-actions')) return;
            setActiveInstance(inst.id);
        });
        item.querySelector('.sib-rename').addEventListener('click', e => { e.stopPropagation(); showEditForm(inst.id); });
        item.querySelector('.sib-duplicate').addEventListener('click', e => { e.stopPropagation(); duplicateInstance(inst.id); });
        container.appendChild(item);
    });
}

function updateSidebarItem(id) {
    const item = document.querySelector(`.sidebar-item[data-id="${id}"]`);
    if (!item) return;
    const inst = STATE.instances.find(i => i.id === id);
    if (!inst) return;
    const stClass = { online: 'st-online', offline: 'st-offline', connecting: 'st-connecting' }[inst.status] || 'st-connecting';
    const dot = item.querySelector('.sidebar-item-status');
    if (dot) { dot.className = `sidebar-item-status ${stClass}`; }
}

// =============================================
// RENDER — DECK, INPUTS, FILTERS, HEADER
// =============================================

function renderAll() {
    renderSidebar();
    renderDeck();
    generateFilters();
    renderInputs();
    updateHeaderInfo();
}

function renderDeck() {
    const grid = document.getElementById('deck-grid');
    const title = document.getElementById('deckTitle');
    if (!grid) return;
    const inst = getActiveInstance();
    const cols = STATE.gridSize <= 16 ? 4 : 8;
    grid.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    if (title) title.textContent = `GUID Panel Grid (${STATE.gridSize}${inst ? ' — ' + inst.label : ''})`;
    if (!inst) { grid.innerHTML = '<div class="empty-state">Selecione uma instância na barra lateral</div>'; return; }
    grid.innerHTML = '';
    inst.deckLayout.forEach((data, index) => {
        const btn = document.createElement('div');
        const style = data ? getInputStyle(data.rawType, data.isFile) : null;
        btn.className = `sd-btn${data ? ' active ' + style.bgClass : ' empty'}`;
        btn.dataset.index = index;
        btn.draggable = !!data;
        btn.addEventListener('dragstart', e => {
            if (!data) { e.preventDefault(); return; }
            e.dataTransfer.setData('text/plain', JSON.stringify(data));
            e.dataTransfer.setData('grid-src', String(index));
            btn.classList.add('dragging');
        });
        btn.addEventListener('dragend', () => btn.classList.remove('dragging'));
        btn.addEventListener('dragover', e => { e.preventDefault(); btn.classList.add('hover-drag'); });
        btn.addEventListener('dragleave', () => btn.classList.remove('hover-drag'));
        btn.addEventListener('drop', e => handleDrop(e, index));
        btn.addEventListener('click', e => { if (!e.target.closest('.btn-clear') && !e.target.closest('.btn-companion') && data) copyData(data, btn); });
        btn.addEventListener('contextmenu', e => { e.preventDefault(); if (data) copyData(data, btn); });
        btn.addEventListener('dblclick', e => { if (!e.target.closest('.btn-clear') && !e.target.closest('.btn-companion') && data) renameButton(index, inst); });
        if (data) {
            const stateClass = data.state === 'Running' ? 'sd-btn-running' : '';
            btn.innerHTML = `
                <div class="btn-clear" data-index="${index}">${getIcon('x')}</div>
                <div class="btn-companion" data-index="${index}" title="Companion Actions">${getIcon('zap')}</div>
                <div class="sd-index">${index + 1}</div>
                <div class="sd-btn-icon ${stateClass}" style="width:18px;height:18px;">${getIcon(style.icon)}</div>
                <div class="sd-btn-title" title="${data.title}">${data.customLabel || data.shortTitle}</div>
                <div class="sd-btn-number" style="border-top:2px solid ${inst.color}">${data.number}</div>`;
            btn.querySelector('.btn-companion').addEventListener('click', e => {
                e.stopPropagation();
                showCompanionBuilder(data, inst);
            });
        } else {
            btn.innerHTML = `<span class="sd-index" style="color:#2a2a2a;font-size:10px;">${index + 1}</span>`;
        }
        grid.appendChild(btn);
    });
}


// =============================================
// COMPANION ACTION BUILDER
// =============================================

const COMPANION_PRESETS = [
    {
        id: 'pgm',
        label: 'Enviar para PGM',
        icon: 'layers',
        color: '#dc2626',
        bg: '#fee2e2',
        desc: 'Corta o input direto ao programa (Program)',
        actions: ['Transition - Send Input to Program'],
        feedbacks: ['Tally - Program state']
    },
    {
        id: 'mute',
        label: 'Mudo de Mic / \u00c1udio',
        icon: 'x',
        color: '#d97706',
        bg: '#fef3c7',
        desc: 'Liga ou desliga o mudo do input de \u00e1udio',
        actions: ['Audio - Input Mute'],
        feedbacks: ['Audio - Input mute']
    },
    {
        id: 'bus',
        label: 'Envia \u00c1udio para Output BUS',
        icon: 'wifi',
        color: '#0369a1',
        bg: '#e0f2fe',
        desc: 'Roteia o \u00e1udio do input para um bus de sa\u00edda (A, B, C...)',
        actions: ['Audio - Route Input to Bus'],
        feedbacks: ['Audio - Input Bus Routing', 'Audio - Bus Volume Meters']
    },
    {
        id: 'layer-set',
        label: 'Definir Input em uma Layer (Color/Blank)',
        icon: 'grid',
        color: '#7c3aed',
        bg: '#f5f3ff',
        desc: 'Define este input como uma layer dentro de um Color ou Blank',
        actions: ['Layer - Set Input as Multiview Layer'],
        feedbacks: ['Layers - check if X input is on Layer on Y input']
    },
    {
        id: 'layer-toggle',
        label: 'Liga / Desliga Layer em um Input',
        icon: 'list',
        color: '#059669',
        bg: '#ecfdf5',
        desc: 'Alterna a visibilidade desta layer dentro de um input destino',
        actions: ['Layer - Toggle/On/Off Multiview Layer on Input'],
        feedbacks: ['Layers - check if X input is on Layer on Y input']
    },
    {
        id: 'output',
        label: 'Envia Input para Output Direto',
        icon: 'download',
        color: '#6366f1',
        bg: '#eef2ff',
        desc: 'Define este input como fonte de um output espec\u00edfico',
        actions: ['Output - Set Output Source'],
        feedbacks: ['General - Output Status']
    }
];

function showCompanionBuilder(data, inst) {
    const inputName = data.customLabel || data.shortTitle || data.title;
    const inputNum = data.number || '\u2014';
    const inputType = data.rawType || data.type || 'Input';

    const optionCards = COMPANION_PRESETS.map(p => `
        <button class="cpn-option-card" data-preset="${p.id}"
            style="border-color:${p.color}30;background:${p.bg};">
            <div class="cpn-card-icon" style="background:${p.color};color:#fff;">${getIcon(p.icon)}</div>
            <div class="cpn-card-info">
                <div class="cpn-card-label" style="color:${p.color};">${p.label}</div>
                <div class="cpn-card-desc">${p.desc}</div>
            </div>
        </button>`).join('');

    showModal(`
        <div class="modal-header">
            <div class="modal-icon" style="background:${inst.color}">${getIcon('zap')}</div>
            <div>
                <div class="modal-title">Companion Action Builder</div>
                <div class="modal-sub">${inputName} <span style="font-family:monospace;opacity:.6">#${inputNum} \u00b7 ${inputType}</span></div>
            </div>
        </div>
        <div class="modal-body" style="padding-bottom:8px;">
            <div id="cpnStep1">
                <div style="font-size:10px;font-weight:700;color:#888;text-transform:uppercase;letter-spacing:.5px;margin-bottom:10px;">O que este bot\u00e3o deve fazer?</div>
                <div class="cpn-option-grid">${optionCards}</div>
            </div>
            <div id="cpnStep2" style="display:none;">
                <button class="cpn-back" id="cpnBack">${getIcon('list')} \u2190 Voltar</button>
                <div id="cpnResult" style="margin-top:10px;"></div>
            </div>
        </div>
        <div class="modal-footer">
            <button id="cpnClose" class="modal-btn-cancel">${getIcon('x')} Fechar</button>
        </div>`,
        card => {
            card.querySelector('#cpnClose').addEventListener('click', closeModal);
            card.querySelector('#cpnBack').addEventListener('click', () => {
                card.querySelector('#cpnStep1').style.display = '';
                card.querySelector('#cpnStep2').style.display = 'none';
            });

            const copyChip = (text, tag) => {
                const div = document.createElement('div');
                div.className = 'cpn-chip';
                div.innerHTML = `
                    <span class="cpn-chip-tag">${tag}</span>
                    <span class="cpn-chip-text">${text}</span>
                    <button class="cpn-chip-copy" title="Copiar">${getIcon('copy')}</button>`;
                div.querySelector('.cpn-chip-copy').addEventListener('click', () => {
                    navigator.clipboard.writeText(text).catch(() => {
                        const ta = document.createElement('textarea');
                        ta.value = text;
                        document.body.appendChild(ta);
                        ta.select();
                        document.execCommand('copy');
                        ta.remove();
                    });
                    const btn = div.querySelector('.cpn-chip-copy');
                    btn.innerHTML = getIcon('check');
                    btn.style.color = '#22c55e';
                    setTimeout(() => { btn.innerHTML = getIcon('copy'); btn.style.color = ''; }, 2000);
                    showToast('Copiado!');
                });
                return div;
            };

            card.querySelectorAll('.cpn-option-card').forEach(btn => {
                btn.addEventListener('click', () => {
                    const preset = COMPANION_PRESETS.find(p => p.id === btn.dataset.preset);
                    if (!preset) return;
                    const result = card.querySelector('#cpnResult');
                    result.innerHTML = `
                        <div class="cpn-result-header" style="border-left:3px solid ${preset.color};background:${preset.bg};">
                            <div class="cpn-card-icon" style="background:${preset.color};color:#fff;flex-shrink:0;">${getIcon(preset.icon)}</div>
                            <div>
                                <div style="font-weight:700;color:${preset.color};font-size:13px;">${preset.label}</div>
                                <div style="font-size:11px;color:#666;">Input: <strong>${inputName}</strong> (#${inputNum})</div>
                            </div>
                        </div>
                        <div class="cpn-section-label">⚡ Step 1 — Press <span style="font-weight:400;text-transform:none;letter-spacing:0;color:#6b7280;">cole em <em>Actions</em> no Companion</span></div>
                        <div id="cpnActions"></div>
                        <div class="cpn-section-label" style="margin-top:14px;">📊 Feedbacks — Status do Botão <span style="font-weight:400;text-transform:none;letter-spacing:0;color:#6b7280;">cole em <em>Feedbacks</em> no Companion</span></div>
                        <div id="cpnFeedbacks"></div>`;
                    const actEl = result.querySelector('#cpnActions');
                    preset.actions.forEach(a => actEl.appendChild(copyChip(a, 'PRESS')));
                    const fbEl = result.querySelector('#cpnFeedbacks');
                    preset.feedbacks.forEach(f => fbEl.appendChild(copyChip(f, 'STATUS')));
                    card.querySelector('#cpnStep1').style.display = 'none';
                    card.querySelector('#cpnStep2').style.display = '';
                });
            });
        });
}

function renameButton(index, inst) {
    const data = inst.deckLayout[index];
    if (!data) return;
    showModal(`
        <div class="modal-header">
            <div class="modal-icon" style="background:#6366f1">${getIcon('edit')}</div>
            <div>
                <div class="modal-title">Renomear Botão</div>
                <div class="modal-sub">${data.shortTitle}</div>
            </div>
        </div>
        <div class="modal-body">
            <div class="modal-field">
                <label>Rótulo personalizado</label>
                <input id="renameInput" class="modal-input" value="${data.customLabel || ''}" placeholder="${data.shortTitle}">
                <small style="color:#aaa;font-size:11px;">Deixe vazio para usar o nome original do vMix</small>
            </div>
        </div>
        <div class="modal-footer">
            <button id="renameClear" class="modal-btn-delete" style="margin-right:auto;" title="Remove o nome personalizado e fecha">${getIcon('trash')} Limpar Nome</button>
            <button id="renameCancel" class="modal-btn-cancel">${getIcon('x')} Cancelar</button>
            <button id="renameSave" class="modal-btn-ok">${getIcon('edit')} Aplicar</button>
        </div>`,
        card => {
            const input = card.querySelector('#renameInput');
            input.focus(); input.select();
            card.querySelector('#renameClear').addEventListener('click', () => {
                data.customLabel = null; saveInstanceDB(inst); closeModal(); renderDeck();
            });
            card.querySelector('#renameCancel').addEventListener('click', closeModal);
            const doRename = () => {
                data.customLabel = input.value.trim() || null;
                saveInstanceDB(inst); closeModal(); renderDeck();
            };
            card.querySelector('#renameSave').addEventListener('click', doRename);
            input.addEventListener('keydown', e => { if (e.key === 'Enter') doRename(); });
        });
}

function renderInputs() {
    const grid = document.getElementById('inputs-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const inst = getActiveInstance();
    if (!inst) { grid.innerHTML = '<div class="empty-state" style="grid-column:1/-1">Nenhuma instância ativa</div>'; return; }
    const term = document.getElementById('searchInput')?.value?.toLowerCase() || '';
    const filtered = (inst.inputs || []).filter(i => {
        return (STATE.filter === 'All' || i.displayType === STATE.filter) &&
            (i.title?.toLowerCase().includes(term) || i.shortTitle?.toLowerCase().includes(term));
    });
    if (filtered.length === 0) {
        const msg = { offline: '❌ vMix Offline', connecting: '⏳ Conectando...' }[inst.status] || '🔍 Nenhum input';
        grid.innerHTML = `<div class="empty-state" style="grid-column:1/-1">${msg}</div>`;
        return;
    }
    filtered.forEach(input => {
        const style = getInputStyle(input.rawType, input.isFile);
        const card = document.createElement('div');
        card.draggable = true;
        card.className = `input-card ${style.bgClass}`;
        card.title = `${input.title}\nGUID: ${input.key}`;
        card.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', JSON.stringify(input)); card.style.opacity = '0.5'; });
        card.addEventListener('dragend', () => card.style.opacity = '1');
        // Right-click also copies according to the current mode toggle
        card.addEventListener('contextmenu', e => {
            e.preventDefault();
            copyData(input, card);
        });
        // Left-click: Deck = copy GUID, Layers = select as target input
        card.addEventListener('click', () => {
            if (STATE.activeTab === 'layers') {
                STATE.layerControl.targetInputKey = input.key;
                STATE.layerControl.targetInputTitle = input.shortTitle || input.title;
                document.getElementById('lcTargetLabel').textContent = `#${input.number} ${input.shortTitle || input.title}`;
                // Reset _posSet so positions are fetched fresh
                STATE.layerControl.layers.forEach(l => { l._posSet = false; });
                lcFetchInputLayers().then(() => lcRender());
                renderInputs(); // update active highlight
            } else {
                copyData(input, card);
            }
        });
        // Highlight active target input in layers mode
        if (STATE.activeTab === 'layers' && input.key === STATE.layerControl.targetInputKey) {
            card.classList.add('lc-active');
        }
        card.innerHTML = `
            <div class="card-num">${input.number}</div>
            <div class="card-type">${input.displayType}</div>
            <div class="card-icon">
                <div style="width:24px;height:24px;">${getIcon(style.icon)}</div>
                ${input.meta ? `<div class="card-meta">${input.meta}</div>` : ''}
                ${input.extension ? `<div class="card-ext">${input.extension}</div>` : ''}
            </div>
            <div class="card-title">${input.shortTitle}</div>`;
        grid.appendChild(card);
    });
}

function generateFilters() {
    const container = document.getElementById('filters-container');
    if (!container) return;
    container.innerHTML = '';
    const inputs = getActiveInstance()?.inputs || [];
    const counts = inputs.reduce((a, i) => { a[i.displayType] = (a[i.displayType] || 0) + 1; return a; }, {});
    ['All', ...[...new Set(inputs.map(i => i.displayType))]].forEach(type => {
        const count = type === 'All' ? inputs.length : counts[type];
        if (count === undefined) return;
        const btn = document.createElement('button');
        btn.className = `filter-pill${STATE.filter === type ? ' active' : ''}`;
        btn.innerHTML = `${type} <span>(${count})</span>`;
        btn.addEventListener('click', () => {
            STATE.filter = type;
            renderInputs();
            container.querySelectorAll('.filter-pill').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
        container.appendChild(btn);
    });
}

function updateHeaderInfo() {
    const inst = getActiveInstance();
    const statusDiv = document.getElementById('vmixStatus');
    if (statusDiv) {
        const s = inst?.vmixInfo?.status || {};
        statusDiv.innerHTML = inst ? `
            <span class="status-item ${s.external ? 'status-active' : ''}">EXT</span>
            <span class="status-item ${s.streaming ? 'status-active' : ''}">STR</span>
            <span class="status-item ${s.recording ? 'status-active' : ''}">REC</span>` : '';
    }
    const info = document.getElementById('topbarInfo');
    if (info) {
        if (!inst) { info.innerHTML = '<span style="color:#555">Selecione um vMix</span>'; return; }
        const stMap = { online: '🟢', offline: '🔴', connecting: '🟡' };
        info.innerHTML = `<span style="color:${inst.color};font-weight:bold">${inst.label}</span>
            <span style="color:#555;font-size:11px;margin-left:6px">${inst.host}:${inst.port} ${stMap[inst.status] || ''}</span>
            ${inst.vmixInfo.version ? `<span style="color:#444;font-size:10px;margin-left:8px">vMix ${inst.vmixInfo.version} (${inst.vmixInfo.edition}) · ${inst.inputs.length} inputs</span>` : ''}`;
    }
    const infoBar = document.getElementById('inputsInfoBar');
    if (infoBar && inst) {
        const stMap2 = { online: '🟢 Online', offline: '🔴 Offline', connecting: '🟡 Conectando' };
        infoBar.innerHTML = `
            <span><strong style="color:${inst.color}">${inst.label}</strong> — ${inst.host}:${inst.port} ${stMap2[inst.status] || ''}</span>
            <span><strong>vMix:</strong> ${inst.vmixInfo.version} (${inst.vmixInfo.edition}) &nbsp;|&nbsp; <strong>Inputs:</strong> ${inst.inputs.length}</span>`;
    }
}

// =============================================
// EVENTS
// =============================================

function setupGlobalEvents() {
    document.getElementById('btnSidebarAdd')?.addEventListener('click', showSidebarAddForm);
    document.getElementById('btnConfig')?.addEventListener('click', showConfigPanel);
    document.getElementById('btnRefresh')?.addEventListener('click', async () => {
        const inst = getActiveInstance();
        if (!inst) { showToast('Selecione uma instância'); return; }
        await fetchVMixData(inst);
        renderAll();
        showToast('Atualizado!');
    });
    document.getElementById('btnClear')?.addEventListener('click', () => {
        const inst = getActiveInstance();
        if (!inst) return;
        if (confirm('Limpar todo o layout?')) { inst.deckLayout.fill(null); saveInstanceDB(inst); renderDeck(); }
    });
    document.getElementById('deck-grid')?.addEventListener('click', e => {
        const clearBtn = e.target.closest('.btn-clear');
        if (clearBtn) {
            const inst = getActiveInstance();
            if (!inst) return;
            const idx = parseInt(clearBtn.dataset.index);
            inst.deckLayout[idx] = null;
            saveInstanceDB(inst);
            renderDeck();
        }
    });
    document.getElementById('searchInput')?.addEventListener('keyup', () => {
        clearTimeout(STATE._searchDebounce);
        STATE._searchDebounce = setTimeout(renderInputs, 200);
    });
    document.getElementById('modeToggle')?.addEventListener('change', e => {
        STATE.copyMode = e.target.checked ? 'VAR' : 'GUID';
        document.getElementById('modeLabel').innerText = STATE.copyMode;
        document.getElementById('modeLabel').style.color = STATE.copyMode === 'GUID' ? 'var(--accent-orange)' : '#60a5fa';
        document.getElementById('toggleDot').style.left = e.target.checked ? '17px' : '1px';
    });
    document.getElementById('refreshIntervalSel')?.addEventListener('change', e => {
        STATE.autoRefreshSecs = parseInt(e.target.value);
        localStorage.setItem('vmix_auto_refresh', String(STATE.autoRefreshSecs));
        setupAutoRefresh();
        showToast(STATE.autoRefreshSecs > 0 ? `Auto-refresh: ${STATE.autoRefreshSecs}s` : 'Auto-refresh desligado');
    });
    document.getElementById('gridSizeSel')?.addEventListener('change', e => {
        const newSize = parseInt(e.target.value);
        if (newSize === STATE.gridSize) return;
        if (confirm(`Mudar grid para ${newSize} botões?`)) {
            resizeAllLayouts(newSize);
            STATE.gridSize = newSize;
            localStorage.setItem('vmix_grid_size', String(newSize));
            renderDeck();
        } else { e.target.value = String(STATE.gridSize); }
    });

    // --- Tab switching (Deck / Layer Control) ---
    document.getElementById('tabDeck')?.addEventListener('click', () => switchPanelTab('deck'));
    document.getElementById('tabLayers')?.addEventListener('click', () => switchPanelTab('layers'));

    // --- Layer Control preset buttons ---
    document.querySelectorAll('.preset-btn[data-preset]').forEach(btn => {
        btn.addEventListener('click', () => lcApplyPreset(btn.dataset.preset));
    });

    // --- Layer Control: target input selector ---
    document.getElementById('lcTargetBtn')?.addEventListener('click', () => lcShowInputSelector());

    // --- Layer Control: snap toggle ---
    document.getElementById('lcSnapToggle')?.addEventListener('click', () => {
        STATE.layerControl.snapEnabled = !STATE.layerControl.snapEnabled;
        document.getElementById('lcSnapToggle')?.classList.toggle('active', STATE.layerControl.snapEnabled);
    });

    // --- Layer Control: mode toggle (SIM / PGM) ---
    document.getElementById('lcModeToggle')?.addEventListener('click', () => {
        const lc = STATE.layerControl;
        lc.layoutMode = lc.layoutMode === 'sim' ? 'pgm' : 'sim';
        const btn = document.getElementById('lcModeToggle');
        if (btn) {
            btn.textContent = lc.layoutMode === 'sim' ? 'SIM' : 'PGM';
            btn.classList.toggle('pgm', lc.layoutMode === 'pgm');
        }
    });
}

// Modal add form (replacing inline sidebar form)
function showSidebarAddForm() {
    let selectedColor = STATE._newInstColor;

    showModal(`
        ${PORT_DATALIST_HTML}
        <div class="modal-header">
            <div class="modal-icon" style="background:${selectedColor}">${getIcon('plus')}</div>
            <div>
                <div class="modal-title">Adicionar Conexão vMix</div>
                <div class="modal-sub">Nova instância</div>
            </div>
        </div>
        <div class="modal-body">
            <div class="modal-field">
                <label>Nome</label>
                <input id="safLabel" class="modal-input" placeholder="ex: PC 2">
            </div>
            <div class="modal-field">
                <label>IP do PC</label>
                ${buildIPInputHTML('saf')}
            </div>
            <div class="modal-field">
                <label>Porta</label>
                <input id="safPort" class="modal-input" list="vmix-ports" value="8088" style="width:110px;font-family:monospace;">
            </div>
            <div class="modal-field">
                <label>Cor</label>
                <div class="modal-colors">
                    ${INSTANCE_COLORS.map(c => `<button class="color-swatch${c === selectedColor ? ' selected' : ''}" data-color="${c}" style="background:${c}"></button>`).join('')}
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button id="safDiscover" class="modal-btn-cancel" style="margin-right:auto;color:#6366f1;border-color:#c7d2fe;background:#eef2ff;">${getIcon('wifi')} Descobrir</button>
            <button id="safCancel" class="modal-btn-cancel">${getIcon('x')} Cancelar</button>
            <button id="safConfirm" class="modal-btn-ok">${getIcon('plus')} Conectar</button>
        </div>`,
        card => {
            const updateIconColor = () => {
                const icon = card.querySelector('.modal-icon');
                if (icon) icon.style.background = selectedColor;
            };

            card.querySelectorAll('.color-swatch').forEach(sw => {
                sw.addEventListener('click', () => {
                    selectedColor = sw.dataset.color;
                    STATE._newInstColor = selectedColor; // remember for next time
                    card.querySelectorAll('.color-swatch').forEach(s => s.classList.toggle('selected', s.dataset.color === selectedColor));
                    updateIconColor();
                });
            });

            card.querySelector('#safCancel').addEventListener('click', closeModal);
            card.querySelector('#safDiscover').addEventListener('click', showDiscoverModal);

            const doAdd = async () => {
                const label = card.querySelector('#safLabel').value.trim();
                const host = getIPFromInput('saf');
                const port = card.querySelector('#safPort').value.trim() || '8088';
                if (!host || host === '0.0.0.0') { document.getElementById('safIp0')?.focus(); return; }

                const inst = createInstance(label || host, host, port, selectedColor);
                if (!inst) return;

                STATE.activeId = inst.id;
                closeModal();
                renderSidebar();
                showToast('Conectando...');
                await fetchVMixData(inst);
                renderAll();
            };

            card.querySelector('#safConfirm').addEventListener('click', doAdd);
            wireIPInput('saf', doAdd);

            card.querySelector('#safLabel').focus();
        });
}

// =============================================
// NETWORK DISCOVERY
// =============================================

const DISCOVERY_DEFAULTS = { subnet: '192.168.90', port: '8088', prefix: 'PC-vMix', timeoutMs: 700 };

async function probeVMix(host, port, ms) {
    try {
        const res = await fetch(`http://${host}:${port}/api`, { signal: AbortSignal.timeout(ms) });
        if (!res.ok) return null;
        const text = await res.text();
        if (!text.includes('<vmix>')) return null;
        const doc = new DOMParser().parseFromString(text, 'text/xml');

        const inputs = Array.from(doc.getElementsByTagName('input'));

        // Categorise inputs
        const ndiInputs = inputs.filter(i => (i.getAttribute('type') || '').toLowerCase() === 'ndi');
        const srtInputs = inputs.filter(i => (i.getAttribute('type') || '').toLowerCase() === 'srt');
        const omtInputs = inputs.filter(i => (i.getAttribute('type') || '').toLowerCase() === 'omt'
            || (i.getAttribute('type') || '').toLowerCase() === 'mediafile');

        // SRT details: pull mode/port/latency/host from child <srt> element or attributes
        const srtDetails = srtInputs.map(el => {
            const srtEl = el.querySelector ? el.querySelector('srt') : null;
            const attrs = name => srtEl?.getAttribute(name) || el.getAttribute('srt' + name.charAt(0).toUpperCase() + name.slice(1)) || el.getAttribute(name) || '';
            return {
                title: el.getAttribute('title') || el.getAttribute('shortTitle') || '',
                mode: attrs('mode') || 'N/A',
                port: attrs('port') || '',
                latency: attrs('latency') || '',
                hostname: attrs('host') || attrs('hostname') || attrs('remoteAddress') || ''
            };
        });

        // NDI source names
        const ndiDetails = ndiInputs.map(el => ({
            title: el.getAttribute('title') || '',
            source: el.getAttribute('ndiSource') || el.getAttribute('source') || ''
        }));

        // All inputs summary
        const allInputs = inputs.map(el => ({
            number: el.getAttribute('number') || '',
            title: el.getAttribute('title') || el.getAttribute('shortTitle') || '',
            type: el.getAttribute('type') || ''
        }));

        return {
            host,
            version: doc.getElementsByTagName('version')[0]?.textContent || '',
            edition: doc.getElementsByTagName('edition')[0]?.textContent || '',
            external: doc.getElementsByTagName('external')[0]?.textContent === 'True',
            streaming: doc.getElementsByTagName('streaming')[0]?.textContent === 'True',
            recording: doc.getElementsByTagName('recording')[0]?.textContent === 'True',
            totalInputs: inputs.length,
            ndiCount: ndiInputs.length,
            srtCount: srtInputs.length,
            omtCount: omtInputs.length,
            srtDetails,
            ndiDetails,
            allInputs
        };
    } catch { return null; }
}

function showDiscoverModal() {
    showModal(`
        <div class="modal-header">
            <div class="modal-icon" style="background:#6366f1">${getIcon('wifi')}</div>
            <div>
                <div class="modal-title">Descobrir vMix na Rede</div>
                <div class="modal-sub">Scan paralelo na sub-rede local</div>
            </div>
        </div>
        <div class="modal-body">
            <div style="display:flex;gap:8px;flex-wrap:wrap;">
                <div class="modal-field" style="flex:2;min-width:120px;">
                    <label>Sub-rede (3 primeiros octetos)</label>
                    <input id="discSubnet" class="modal-input" value="${DISCOVERY_DEFAULTS.subnet}" style="font-family:monospace;">
                </div>
                <div class="modal-field" style="flex:1;min-width:70px;">
                    <label>Porta</label>
                    <input id="discPort" class="modal-input" value="${DISCOVERY_DEFAULTS.port}" style="width:80px;font-family:monospace;">
                </div>
                <div class="modal-field" style="flex:2;min-width:120px;">
                    <label>Prefixo do nome</label>
                    <input id="discPrefix" class="modal-input" value="${DISCOVERY_DEFAULTS.prefix}" placeholder="PC-vMix">
                </div>
            </div>
            <div id="discProgress" style="display:none;margin-top:12px;">
                <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
                    <div style="flex:1;height:4px;background:#e5e7eb;border-radius:2px;overflow:hidden;">
                        <div id="discBarFill" style="height:100%;background:#6366f1;width:0%;transition:width 0.2s;"></div>
                    </div>
                    <span id="discCount" style="font-size:11px;color:#888;white-space:nowrap;">0 / 254</span>
                </div>
                <div id="discResults" style="max-height:340px;overflow-y:auto;display:flex;flex-direction:column;gap:6px;"></div>
                <div id="discEmpty" style="display:none;font-size:12px;color:#aaa;text-align:center;padding:16px 0;">Nenhum vMix encontrado nessa sub-rede.</div>
            </div>
        </div>
        <div class="modal-footer">
            <button id="discCancel" class="modal-btn-cancel">${getIcon('x')} Fechar</button>
            <button id="discAddAll" class="modal-btn-ok" style="display:none;">${getIcon('plus')} Adicionar Todos</button>
            <button id="discStart" class="modal-btn-ok" style="background:#6366f1;">${getIcon('wifi')} Iniciar Scan</button>
        </div>`,
        card => {
            card.querySelector('#discCancel').addEventListener('click', closeModal);

            let found = [];
            let scanning = false;

            const badge = (label, color, bg) =>
                `<span style="font-size:9px;font-weight:700;padding:2px 5px;border-radius:3px;background:${bg};color:${color};white-space:nowrap;">${label}</span>`;

            const makeRow = (result, autoLabel, port) => {
                const wrap = document.createElement('div');
                wrap.style.cssText = 'background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;overflow:hidden;';

                // Build badge strip
                const badges = [
                    badge(`vMix ${result.version}`, '#6366f1', '#eef2ff'),
                    badge(result.edition, '#7c3aed', '#f5f3ff'),
                    badge(`${result.totalInputs} inputs`, '#374151', '#f3f4f6'),
                    result.external ? badge('EXT ●', '#15803d', '#dcfce7') : badge('EXT ○', '#9ca3af', '#f3f4f6'),
                    result.streaming ? badge('STR ●', '#b45309', '#fef3c7') : '',
                    result.recording ? badge('REC ●', '#dc2626', '#fee2e2') : '',
                    result.ndiCount ? badge(`NDI ${result.ndiCount}`, '#0369a1', '#e0f2fe') : '',
                    result.srtCount ? badge(`SRT ${result.srtCount}`, '#7c3aed', '#f5f3ff') : '',
                    result.omtCount ? badge(`OMT ${result.omtCount}`, '#b45309', '#fef3c7') : ''
                ].filter(Boolean).join(' ');

                // Build SRT detail HTML
                const srtHTML = result.srtDetails.length ? result.srtDetails.map(s => `
                    <div style="display:flex;gap:6px;align-items:baseline;padding:3px 0;border-bottom:1px solid #f0f0f0;">
                        <span style="font-size:10px;font-weight:600;color:#7c3aed;min-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="${s.title}">${s.title || '—'}</span>
                        ${badge(s.mode || 'N/A', '#7c3aed', '#f5f3ff')}
                        ${s.port ? badge(`Port ${s.port}`, '#374151', '#f3f4f6') : ''}
                        ${s.latency ? badge(`${s.latency}ms`, '#374151', '#f3f4f6') : ''}
                        ${s.hostname ? `<span style="font-size:9px;color:#888;font-family:monospace;">${s.hostname}</span>` : ''}
                    </div>`).join('') : '<span style="font-size:11px;color:#aaa;">—</span>';

                // Build NDI detail HTML
                const ndiHTML = result.ndiDetails.length ? result.ndiDetails.map(n => `
                    <div style="display:flex;gap:6px;align-items:center;padding:3px 0;border-bottom:1px solid #f0f0f0;">
                        <span style="font-size:10px;font-weight:600;color:#0369a1;min-width:100px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${n.title || '—'}</span>
                        ${n.source ? `<span style="font-size:9px;color:#888;font-family:monospace;">${n.source}</span>` : ''}
                    </div>`).join('') : '<span style="font-size:11px;color:#aaa;">—</span>';

                wrap.innerHTML = `
                    <div style="display:flex;align-items:center;gap:8px;padding:8px 10px;">
                        <span class="cfg-dot" style="background:#22c55e;flex-shrink:0;"></span>
                        <div style="flex:1;min-width:0;">
                            <input class="disc-name-input" value="${autoLabel}" style="font-size:12px;font-weight:600;color:#1a1a1a;background:none;border:none;border-bottom:1px dashed #d1d5db;outline:none;width:100%;padding:0 0 2px;margin-bottom:3px;">
                            <div style="font-size:10px;color:#888;font-family:monospace;margin-bottom:4px;">${result.host}</div>
                            <div style="display:flex;flex-wrap:wrap;gap:3px;">${badges}</div>
                        </div>
                        <div style="display:flex;gap:4px;flex-shrink:0;">
                            <button class="cfg-del-btn disc-info-btn" title="Detalhes" style="color:#6366f1;">${getIcon('list')}</button>
                            <button class="cfg-del-btn disc-add-one" title="Adicionar instância" style="color:#22c55e;">${getIcon('plus')}</button>
                        </div>
                    </div>
                    <div class="disc-detail-panel" style="display:none;border-top:1px solid #d1fae5;background:#f8fff8;padding:10px 14px;">
                        ${result.srtCount ? `<div style="margin-bottom:8px;"><div style="font-size:10px;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">SRT (${result.srtCount})</div>${srtHTML}</div>` : ''}
                        ${result.ndiCount ? `<div><div style="font-size:10px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:.5px;margin-bottom:4px;">NDI (${result.ndiCount})</div>${ndiHTML}</div>` : ''}
                        ${!result.srtCount && !result.ndiCount ? '<span style="font-size:11px;color:#aaa;">Sem entradas NDI ou SRT nesta máquina.</span>' : ''}
                    </div>`;

                const detailPanel = wrap.querySelector('.disc-detail-panel');
                wrap.querySelector('.disc-info-btn').addEventListener('click', () => {
                    const machineName = wrap.querySelector('.disc-name-input').value.trim() || autoLabel;
                    const detailContent = [
                        result.srtCount ? `
                            <div style="margin-bottom:16px;">
                                <div style="font-size:10px;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:.6px;margin-bottom:8px;
                                    padding-bottom:4px;border-bottom:2px solid #ede9fe;">SRT — ${result.srtCount} entrada(s)</div>
                                ${result.srtDetails.map((s, i) => `
                                    <div style="background:#faf5ff;border:1px solid #e9d5ff;border-radius:8px;padding:10px 12px;margin-bottom:6px;">
                                        <div style="font-size:12px;font-weight:600;color:#6d28d9;margin-bottom:6px;">${i + 1}. ${s.title || 'SRT Input'}</div>
                                        <div style="display:flex;flex-wrap:wrap;gap:6px;">
                                            <span style="font-size:10px;font-weight:700;padding:3px 7px;border-radius:4px;background:#7c3aed;color:#fff;">${s.mode}</span>
                                            ${s.port ? `<span style="font-size:10px;padding:3px 7px;border-radius:4px;background:#f3f4f6;color:#374151;">Porta: <b>${s.port}</b></span>` : ''}
                                            ${s.latency ? `<span style="font-size:10px;padding:3px 7px;border-radius:4px;background:#f3f4f6;color:#374151;">Latência: <b>${s.latency}ms</b></span>` : ''}
                                            ${s.hostname ? `<span style="font-size:10px;padding:3px 7px;border-radius:4px;background:#f3f4f6;color:#374151;font-family:monospace;">${s.hostname}</span>` : ''}
                                        </div>
                                    </div>`).join('')}
                            </div>` : '',
                        result.ndiCount ? `
                            <div>
                                <div style="font-size:10px;font-weight:700;color:#0369a1;text-transform:uppercase;letter-spacing:.6px;margin-bottom:8px;
                                    padding-bottom:4px;border-bottom:2px solid #bae6fd;">NDI — ${result.ndiCount} fonte(s)</div>
                                ${result.ndiDetails.map((n, i) => `
                                    <div style="background:#f0f9ff;border:1px solid #bae6fd;border-radius:8px;padding:10px 12px;margin-bottom:6px;">
                                        <div style="font-size:12px;font-weight:600;color:#0369a1;margin-bottom:4px;">${i + 1}. ${n.title || 'NDI Input'}</div>
                                        ${n.source ? `<div style="font-size:11px;color:#666;font-family:monospace;">${n.source}</div>` : ''}
                                    </div>`).join('')}
                            </div>` : '',
                        !result.srtCount && !result.ndiCount ? '' : '',
                        result.allInputs?.length ? `
                            <div style="margin-top:${result.srtCount || result.ndiCount ? 16 : 0}px;">
                                <div style="font-size:10px;font-weight:700;color:#374151;text-transform:uppercase;letter-spacing:.6px;margin-bottom:8px;
                                    padding-bottom:4px;border-bottom:2px solid #e5e7eb;">Todos os Inputs &mdash; ${result.allInputs.length}</div>
                                <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">
                                    ${result.allInputs.map(inp => {
                            const typeColors = {
                                srt: ['#7c3aed', '#faf5ff', '#e9d5ff'],
                                ndi: ['#0369a1', '#f0f9ff', '#bae6fd'],
                                virtual: ['#059669', '#ecfdf5', '#a7f3d0'],
                                capture: ['#d97706', '#fffbeb', '#fde68a'],
                                browser: ['#6366f1', '#eef2ff', '#c7d2fe'],
                                audio: ['#db2777', '#fdf2f8', '#fbcfe8'],
                            };
                            const tc = typeColors[(inp.type || '').toLowerCase()] || ['#374151', '#f9fafb', '#e5e7eb'];
                            return `<div style="display:flex;align-items:center;gap:5px;padding:4px 6px;background:#f9fafb;border:1px solid #e5e7eb;border-radius:6px;min-width:0;">
                                            <span style="font-size:8px;font-weight:700;padding:1px 4px;border-radius:3px;background:${tc[1]};color:${tc[0]};border:1px solid ${tc[2]};white-space:nowrap;flex-shrink:0;">${inp.type || '?'}</span>
                                            <span style="font-size:11px;color:#1a1a1a;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${inp.title}">${inp.number ? inp.number + '. ' : ' '}${inp.title || '—'}</span>
                                        </div>`;
                        }).join('')}
                                </div>
                            </div>` : ''
                    ].filter(Boolean).join('');
                    showDetailDrawer(machineName, `${result.host} · vMix ${result.version} (${result.edition}) · ${result.totalInputs} inputs`, '#6366f1', detailContent);
                });

                wrap.querySelector('.disc-add-one').addEventListener('click', async () => {
                    const name = wrap.querySelector('.disc-name-input').value.trim() || autoLabel;
                    const colorIdx = STATE.instances.length % INSTANCE_COLORS.length;
                    const inst = createInstance(name, result.host, port, INSTANCE_COLORS[colorIdx]);
                    if (inst) {
                        STATE.activeId = inst.id;
                        closeModal();
                        renderSidebar();
                        showToast(`${name} adicionado!`);
                        await fetchVMixData(inst);
                        renderAll();
                    }
                });

                return wrap;
            };

            card.querySelector('#discStart').addEventListener('click', async () => {
                if (scanning) return;
                scanning = true;
                found = [];

                const subnet = card.querySelector('#discSubnet').value.trim() || DISCOVERY_DEFAULTS.subnet;
                const port = card.querySelector('#discPort').value.trim() || DISCOVERY_DEFAULTS.port;
                const prefix = card.querySelector('#discPrefix').value.trim() || DISCOVERY_DEFAULTS.prefix;

                const barFill = card.querySelector('#discBarFill');
                const counter = card.querySelector('#discCount');
                const results = card.querySelector('#discResults');
                const empty = card.querySelector('#discEmpty');
                const addAll = card.querySelector('#discAddAll');
                const startBtn = card.querySelector('#discStart');

                card.querySelector('#discProgress').style.display = 'block';
                results.innerHTML = '';
                empty.style.display = 'none';
                addAll.style.display = 'none';
                startBtn.disabled = true;
                startBtn.innerHTML = `${getIcon('wifi')} Scaneando…`;

                let done = 0;
                const total = 254;

                await Promise.all(Array.from({ length: total }, (_, i) => i + 1).map(async last => {
                    const host = `${subnet}.${last}`;
                    const result = await probeVMix(host, port, DISCOVERY_DEFAULTS.timeoutMs);
                    done++;
                    barFill.style.width = Math.round((done / total) * 100) + '%';
                    counter.textContent = `${done} / ${total}`;
                    if (result) {
                        const label = `${prefix}.${String(last)}`;
                        found.push({ ...result, label, port });
                        results.appendChild(makeRow(result, label, port));
                    }
                }));

                scanning = false;
                startBtn.disabled = false;
                startBtn.innerHTML = `${getIcon('wifi')} Re-scan`;
                if (found.length === 0) { empty.style.display = 'block'; }
                if (found.length > 1) { addAll.style.display = 'flex'; }
            });

            card.querySelector('#discAddAll').addEventListener('click', async () => {
                const port = card.querySelector('#discPort').value.trim() || DISCOVERY_DEFAULTS.port;
                // Read current name fields (user may have renamed)
                const nameInputs = card.querySelectorAll('.disc-name-input');
                let added = 0;
                found.forEach((r, idx) => {
                    const name = nameInputs[idx]?.value.trim() || r.label;
                    const colorIdx = (STATE.instances.length + added) % INSTANCE_COLORS.length;
                    if (createInstance(name, r.host, port, INSTANCE_COLORS[colorIdx])) {
                        STATE.activeId = makeInstanceId(r.host, port);
                        added++;
                    }
                });
                if (added > 0) {
                    closeModal();
                    renderSidebar();
                    showToast(`${added} instância(s) adicionada(s)!`);
                    await Promise.all(STATE.instances.slice(-added).map(i => fetchVMixData(i)));
                    renderAll();
                }
            });
        });
}

// =============================================
// CONFIG / STORAGE PANEL
// =============================================

function showConfigPanel() {
    // Gather and categorise all vmix_* keys from localStorage
    const allKeys = Object.keys(localStorage).filter(k => k.startsWith('vmix_'));

    const instances = (() => {
        try { return JSON.parse(localStorage.getItem('vmix_instances') || '[]'); } catch { return []; }
    })();

    const instanceIds = instances.map(i => ({ id: i.id, label: i.label, host: i.host, port: i.port, color: i.color }));

    const deckKeys = allKeys.filter(k => k.startsWith('vmix_deck_'));
    const settingKeys = allKeys.filter(k => k === 'vmix_auto_refresh' || k === 'vmix_grid_size');
    const otherKeys = allKeys.filter(k => !k.startsWith('vmix_deck_') && k !== 'vmix_instances' && !settingKeys.includes(k));

    const bytesFor = key => {
        const v = localStorage.getItem(key);
        return v ? new Blob([v]).size : 0;
    };
    const totalBytes = allKeys.reduce((acc, k) => acc + bytesFor(k), 0);

    const sectionHTML = (title, color, icon, rows) => `
        <div class="cfg-section">
            <div class="cfg-section-header" style="border-left:3px solid ${color}">
                <span class="cfg-section-icon" style="background:${color}20;color:${color}">${getIcon(icon)}</span>
                <strong>${title}</strong>
                <span class="cfg-section-count">${rows.length} entr${rows.length === 1 ? 'ada' : 'adas'}</span>
            </div>
            ${rows.length === 0 ? '<div class="cfg-empty">Nenhum dado</div>' : rows.join('')}
        </div>`;

    // Instances rows
    const instanceRows = instanceIds.map(inst => `
        <div class="cfg-row" id="cfg-inst-${inst.id}">
            <span class="cfg-dot" style="background:${inst.color}"></span>
            <div class="cfg-info">
                <span class="cfg-key">${inst.label}</span>
                <span class="cfg-val">${inst.host}:${inst.port}</span>
            </div>
            <span class="cfg-badge">${bytesFor('vmix_instances')}B</span>
        </div>`);

    // Deck layout rows
    const deckRows = deckKeys.map(key => {
        const raw = localStorage.getItem(key);
        let filled = 0;
        try { const arr = JSON.parse(raw); filled = arr.filter(Boolean).length; } catch { }
        const match = instances.find(i => key === `vmix_deck_${i.host.replace(/\./g, '_')}_${i.port}`);
        const label = match ? match.label : key.replace('vmix_deck_', '');
        return `
        <div class="cfg-row" id="cfg-row-${key}">
            <span class="cfg-dot" style="background:${match?.color || '#6366f1'}"></span>
            <div class="cfg-info">
                <span class="cfg-key">${label}</span>
                <span class="cfg-val">${filled} botões configurados</span>
            </div>
            <span class="cfg-badge">${bytesFor(key)}B</span>
            <button class="cfg-del-btn" data-key="${key}" title="Apagar layout">${getIcon('trash')}</button>
        </div>`;
    });

    // Settings rows
    const settingRows = settingKeys.map(key => {
        const val = localStorage.getItem(key);
        const labels = { vmix_auto_refresh: 'Auto-refresh', vmix_grid_size: 'Tamanho do Grid' };
        return `
        <div class="cfg-row" id="cfg-row-${key}">
            <span class="cfg-dot" style="background:#06b6d4"></span>
            <div class="cfg-info">
                <span class="cfg-key">${labels[key] || key}</span>
                <span class="cfg-val">${val}</span>
            </div>
            <span class="cfg-badge">${bytesFor(key)}B</span>
            <button class="cfg-del-btn" data-key="${key}" title="Apagar">${getIcon('trash')}</button>
        </div>`;
    });

    // Other rows
    const otherRows = otherKeys.map(key => {
        const val = localStorage.getItem(key) || '';
        const preview = val.length > 60 ? val.slice(0, 60) + '…' : val;
        return `
        <div class="cfg-row" id="cfg-row-${key}">
            <span class="cfg-dot" style="background:#888"></span>
            <div class="cfg-info">
                <span class="cfg-key">${key}</span>
                <span class="cfg-val">${preview}</span>
            </div>
            <span class="cfg-badge">${bytesFor(key)}B</span>
            <button class="cfg-del-btn" data-key="${key}" title="Apagar">${getIcon('trash')}</button>
        </div>`;
    });

    showModal(`
        <div class="modal-header">
            <div class="modal-icon" style="background:#6366f1">${getIcon('settings')}</div>
            <div>
                <div class="modal-title">Configurações & Storage</div>
                <div class="modal-sub">Total armazenado: <strong>${totalBytes}B</strong> · ${allKeys.length} chaves</div>
            </div>
        </div>
        <div class="modal-body cfg-panel-body">
            ${sectionHTML('Instâncias Salvas', '#f97316', 'wifi', instanceRows)}
            ${sectionHTML('Layouts de Deck', '#6366f1', 'grid', deckRows)}
            ${sectionHTML('Preferências', '#06b6d4', 'settings', settingRows)}
            ${otherKeys.length > 0 ? sectionHTML('Outros', '#888', 'box', otherRows) : ''}
        </div>
        <div class="modal-footer">
            <button id="cfgClearAll" class="modal-btn-delete">${getIcon('trash')} Apagar TUDO</button>
            <button id="cfgClose" class="modal-btn-cancel">${getIcon('x')} Fechar</button>
        </div>`,
        card => {
            card.querySelector('#cfgClose').addEventListener('click', closeModal);

            // Individual delete
            card.querySelectorAll('.cfg-del-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const key = btn.dataset.key;
                    if (!key) return;
                    // arm / confirm
                    if (!btn.dataset.armed) {
                        btn.dataset.armed = '1';
                        btn.style.color = '#dc2626';
                        btn.title = 'Clique novamente para confirmar';
                        setTimeout(() => { delete btn.dataset.armed; btn.style.color = ''; btn.title = 'Apagar'; }, 3000);
                    } else {
                        localStorage.removeItem(key);
                        card.querySelector(`#cfg-row-${CSS.escape(key)}`)?.remove();
                        showToast('Entrada removida!');
                        // if deck or instances removed, re-render
                        if (key === 'vmix_instances') { STATE.instances = []; STATE.activeId = null; }
                    }
                });
            });

            // Clear all
            const clearAllBtn = card.querySelector('#cfgClearAll');
            clearAllBtn.addEventListener('click', () => {
                if (!clearAllBtn.dataset.armed) {
                    clearAllBtn.dataset.armed = '1';
                    clearAllBtn.innerHTML = `${getIcon('trash')} Confirmar?`;
                    clearAllBtn.classList.add('armed');
                    setTimeout(() => {
                        delete clearAllBtn.dataset.armed;
                        clearAllBtn.innerHTML = `${getIcon('trash')} Apagar TUDO`;
                        clearAllBtn.classList.remove('armed');
                    }, 3000);
                } else {
                    allKeys.forEach(k => localStorage.removeItem(k));
                    STATE.instances = [];
                    STATE.activeId = null;
                    closeModal();
                    showToast('Todos os dados removidos!');
                    renderSetupScreen();
                }
            });
        });
}

// =============================================
// UTILITIES
// =============================================

function getInputStyle(type, isFile = false) {
    const map = {
        'Video': { c: 'bg-Video', i: 'film' }, 'Capture': { c: 'bg-Video', i: 'camera' },
        'Image': { c: 'bg-Image', i: 'image' }, 'Photos': { c: 'bg-Image', i: 'list' },
        'Title': { c: 'bg-Title', i: 'type' }, 'GT': { c: 'bg-Title', i: 'type' },
        'Audio': { c: 'bg-Audio', i: isFile ? 'music' : 'mic' },
        'Virtual': { c: 'bg-Special', i: 'monitor' }, 'vMixCall': { c: 'bg-Special', i: 'phone' },
        'Browser': { c: 'bg-Special', i: 'globe' }, 'Colour': { c: 'bg-Special', i: 'layers' },
        'Placeholder': { c: 'bg-Special', i: 'offline' }, 'SRT': { c: 'bg-Video', i: 'globe' }
    };
    const def = map[type] || { c: 'bg-Special', i: 'box' };
    return { bgClass: def.c, icon: def.i };
}

function handleDrop(e, destIndex) {
    e.preventDefault();
    const inst = getActiveInstance();
    if (!inst) return;
    try {
        const data = JSON.parse(e.dataTransfer.getData('text/plain'));
        const srcIndex = e.dataTransfer.getData('grid-src');
        if (srcIndex !== '') {
            const si = parseInt(srcIndex);
            [inst.deckLayout[si], inst.deckLayout[destIndex]] = [inst.deckLayout[destIndex], inst.deckLayout[si]];
        } else {
            inst.deckLayout[destIndex] = { ...data, customLabel: inst.deckLayout[destIndex]?.customLabel || null };
        }
        saveInstanceDB(inst);
        renderDeck();
    } catch { }
    document.querySelectorAll('.hover-drag').forEach(el => el.classList.remove('hover-drag'));
}

function copyData(data, btn, modeOverride = null) {
    const mode = modeOverride || STATE.copyMode;
    const text = mode === 'GUID' ? data.key : `$(vmix:input_${data.key}_title)`;
    const feedback = () => {
        showToast(`${mode === 'GUID' ? 'GUID' : 'Variável'} copiada!`);
        btn.style.transition = 'background 0.2s';
        btn.style.background = mode === 'GUID' ? '#d97706' : '#2563eb';
        setTimeout(() => btn.style.background = '', 300);
    };
    if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(feedback).catch(() => fallbackCopy(text, feedback));
    else fallbackCopy(text, feedback);
}

function fallbackCopy(text, callback) {
    try {
        const el = document.createElement('textarea');
        el.value = text; el.style.position = 'fixed'; el.style.left = '-9999px';
        document.body.appendChild(el); el.focus(); el.select();
        document.execCommand('copy'); document.body.removeChild(el);
        if (callback) callback();
    } catch { showToast('Erro ao copiar'); }
}

function showToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.innerHTML = msg; t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 2000);
}

function restoreSettings() {
    const gridSel = document.getElementById('gridSizeSel');
    if (gridSel) gridSel.value = String(STATE.gridSize);
    setupAutoRefresh();
}

// =============================================
// LAYER CONTROL MODULE — see lc-engine.js
// =============================================

function switchPanelTab(tab) {
    STATE.activeTab = tab;
    const tabDeck = document.getElementById('tabDeck');
    const tabLayers = document.getElementById('tabLayers');
    const deckContent = document.getElementById('deckContent');
    const layerContent = document.getElementById('layerContent');
    if (!tabDeck) return;
    tabDeck.classList.toggle('active', tab === 'deck');
    tabLayers.classList.toggle('active', tab === 'layers');
    deckContent.classList.toggle('hidden', tab !== 'deck');
    layerContent.classList.toggle('hidden', tab !== 'layers');

    // Theme switching
    const root = document.getElementById('app-root');
    if (root) root.className = tab === 'deck' ? 'theme-deck' : 'theme-layers';

    // Re-render inputs to update click behavior
    renderInputs();

    if (tab === 'layers') {
        if (!STATE.layerControl.targetInputKey) {
            lcShowInputSelector();
        } else {
            lcFetchInputLayers().then(() => lcRender());
        }
        lcStartSync();
    } else {
        lcStopSync();
    }
}

// All LC functions are defined in lc-engine.js

// =============================================
// =============================================
// INIT
// =============================================

async function init() {
    STATE.gridSize = parseInt(localStorage.getItem('vmix_grid_size') || '32');
    STATE.autoRefreshSecs = parseInt(localStorage.getItem('vmix_auto_refresh') || '0');

    // Load saved instances
    const saved = loadInstances();
    for (const s of saved) {
        STATE.instances.push({
            ...s, status: 'connecting', inputs: [],
            vmixInfo: { version: '', edition: '', status: {} },
            deckLayout: loadInstanceDB(s.host, s.port)
        });
    }

    // Handle ?api= from loader.js content script injection
    const urlParam = new URLSearchParams(window.location.search).get('api');
    if (urlParam) {
        try {
            const u = new URL(urlParam);
            const host = u.hostname;
            const port = u.port || '8088';
            const id = makeInstanceId(host, port);
            if (!STATE.instances.find(i => i.id === id)) {
                createInstance(host, host, port);
            }
            STATE.activeId = id;
        } catch { }
    }

    if (!STATE.activeId && STATE.instances.length > 0) STATE.activeId = STATE.instances[0].id;

    // First launch: show setup screen
    if (STATE.instances.length === 0) {
        renderSetupScreen();
        return;
    }

    // Main interface
    renderMainInterface();
    setupGlobalEvents();
    restoreSettings();

    // Set default theme (Deck = purple)
    const root = document.getElementById('app-root');
    if (root) root.className = 'theme-deck';

    // Initialize layer control with 10 empty layers
    if (STATE.layerControl.layers.length === 0) {
        for (let i = 0; i < 10; i++) {
            const l = lcMakeLayer(i);
            l.hidden = true;
            STATE.layerControl.layers.push(l);
        }
    }

    await Promise.all(STATE.instances.map(i => fetchVMixData(i)));
    renderAll();

    // Clock
    setInterval(() => {
        const el = document.getElementById('clock');
        if (el) el.innerText = new Date().toLocaleTimeString('pt-BR');
    }, 1000);
}

init();
