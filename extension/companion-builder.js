// =============================================
// Companion Button Generator v2 — Card Builder
// Painel esquerdo: lista de cards reusáveis (Cut/Audio/Output/Mix/Layer/Slide).
// Painel direito: grid 4×8 + page pills. Cells apontam pra cardId (clone/linked).
// Reuse globals from app.js: STATE, getActiveInstance, showToast, showModal, closeModal, getIcon.
// =============================================

const COMP_CONNECTION_ID = '2e-JDhjjo8EG2rBi1ykoQ'; // vMix_D4
const COMP_BUILD = '4.2.6+8823-stable-4ecdfe70ba';
const COMP_STORAGE_KEY = 'vmix_companion_state_v2';

const COMP_TYPES = ['cut', 'audio', 'output', 'mix', 'layer', 'slide'];
const COMP_LABEL = { cut: 'Cut', audio: 'Audio', output: 'Output', mix: 'Mix', layer: 'Layer', slide: 'Slide' };
const COMP_HEX = { cut: '#16a34a', audio: '#dc2626', output: '#1d4ed8', mix: '#991b1b', layer: '#d97706', slide: '#7c3aed' };
const COMP_BG_INT = { cut: 1710618, audio: 1710618, output: 13158, mix: 5246978, layer: 9456194, slide: 5046591 };

// ===== Util =====
function companionNanoId(len = 21) {
    const a = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
    let s = '';
    for (let i = 0; i < len; i++) s += a[Math.floor(Math.random() * 64)];
    return s;
}
function compHexToInt(hex) {
    if (!hex || typeof hex !== 'string') return 0;
    const m = hex.match(/^#([0-9a-f]{6})$/i);
    return m ? parseInt(m[1], 16) : 0;
}
function compIntToHex(n) { return '#' + (n || 0).toString(16).padStart(6, '0'); }
function compEl(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
function compInputs() { return getActiveInstance()?.inputs || []; }
function compResolveInput(key) { return key ? compInputs().find(i => i.key === key) : null; }

// ===== Persist =====
function companionPersist() {
    try {
        const c = STATE.companion;
        if (!c) return;
        chrome.storage?.local?.set?.({
            [COMP_STORAGE_KEY]: {
                pageNum: c.pageNum,
                defaultTargetKey: c.defaultTargetKey,
                cards: c.cards,
                cells: c.cells
            }
        });
    } catch (e) { /* noop */ }
}
function companionRestore() {
    try {
        chrome.storage?.local?.get?.([COMP_STORAGE_KEY], (res) => {
            const s = res && res[COMP_STORAGE_KEY];
            if (!s || !STATE.companion) return;
            Object.assign(STATE.companion, s);
            if (document.getElementById('companionGrid')) companionRender();
        });
    } catch (e) { /* noop */ }
}

// ===== Mount =====
function companionEnsureMounted() {
    const root = document.getElementById('companionContent');
    if (!root) return;
    if (root.dataset.mounted === '1') { companionRender(); return; }
    root.dataset.mounted = '1';
    root.innerHTML = `
      <div class="comp-toolbar">
        <div class="comp-field"><label>Page number</label><input type="number" id="compPageNum" min="1" max="99" title="Número da página no Companion onde os botões serão importados"></div>
        <div class="comp-field"><label>Target Input default (Layer)</label><select id="compTargetDefault" title="Input vMix que será target dos novos cards Layer"></select></div>
        <div class="comp-toolbar-sep"></div>
        <button class="comp-btn-ghost" id="compBtnValidate" title="Validar todos cards">Validar</button>
        <button class="comp-btn-ghost" id="compBtnClear" title="Limpar grid (cards permanecem)">Limpar grid</button>
        <button class="comp-btn-primary" id="compBtnExport" title="Exporta .companionconfig"><span>⬇</span> Exportar</button>
      </div>
      <div class="comp-split">
        <div class="comp-builder-pane">
          <div class="comp-builder-head">
            <h3>Card Builder · novo card</h3>
            <div class="comp-new-row">
              <button type="button" class="comp-new-btn comp-t-cut"    data-type="cut"   ><span class="comp-plus">+</span> Cut</button>
              <button type="button" class="comp-new-btn comp-t-audio"  data-type="audio" ><span class="comp-plus">+</span> Audio</button>
              <button type="button" class="comp-new-btn comp-t-output" data-type="output"><span class="comp-plus">+</span> Output</button>
              <button type="button" class="comp-new-btn comp-t-mix"    data-type="mix"   ><span class="comp-plus">+</span> Mix</button>
              <button type="button" class="comp-new-btn comp-t-layer"  data-type="layer" ><span class="comp-plus">+</span> Layer</button>
              <button type="button" class="comp-new-btn comp-t-slide"  data-type="slide" ><span class="comp-plus">+</span> Slide</button>
            </div>
          </div>
          <div class="comp-builder-body" id="compCardList"></div>
        </div>
        <div class="comp-deck-pane">
          <div class="comp-deck-head">
            <span class="comp-deck-label">Grid 4×8 · Page <span id="compPageNumLabel">10</span></span>
            <span class="comp-stats" id="compStats">0 cards · 0 cells</span>
          </div>
          <div class="comp-deck-area">
            <div class="comp-grid" id="companionGrid"></div>
          </div>
        </div>
      </div>
      <div class="comp-conn">→ Companion D4 · <code>${COMP_CONNECTION_ID.slice(0,8)}…</code></div>
    `;

    const c = STATE.companion;
    document.getElementById('compPageNum').value = c.pageNum;
    document.getElementById('compPageNum').oninput = (e) => {
        c.pageNum = Math.max(1, Math.min(99, +e.target.value || 10));
        const lbl = document.getElementById('compPageNumLabel');
        if (lbl) lbl.textContent = c.pageNum;
        companionPersist();
    };
    document.getElementById('compTargetDefault').onchange = (e) => {
        c.defaultTargetKey = e.target.value || null;
        companionPersist();
    };
    document.getElementById('compBtnValidate').onclick = companionValidateAll;
    document.getElementById('compBtnClear').onclick = companionClearGrid;
    document.getElementById('compBtnExport').onclick = companionExport;
    root.querySelectorAll('.comp-new-btn').forEach(b => {
        b.addEventListener('click', () => companionNewCard(b.dataset.type));
    });

    companionRender();
}

// ===== Card creation =====
function companionNewCard(type) {
    const id = 'card_' + companionNanoId(12);
    const c = STATE.companion;
    const base = { id, type, mode: 'clone', _valid: false };
    if (type === 'cut') {
        base.actions = [{ def: 'programCut', input: null, mix: 0 }];
        base.feedbacks = [{ def: 'inputLive', input: null, mix: 0, bg: '#006600' }];
    } else if (type === 'audio') {
        base.actions = [
            { def: 'audio', input: null, functionID: 'Audio' },
            { def: 'audioBus', input: null, bus: 'Master' }
        ];
        base.feedbacks = [
            { def: 'inputAudio', input: null, bg: '#ff0000', isInverted: false },
            { def: 'inputVolumeMeter', input: null }
        ];
    } else if (type === 'output') {
        base.actions = [{ def: 'outputSet', input: null, functionID: 'SetOutputFullscreen', value: 'Input' }];
        base.feedbacks = [];
    } else if (type === 'mix') {
        base.actions = [{ def: 'programCut', input: null, mix: 1 }];
        base.feedbacks = [{ def: 'inputLive', input: null, mix: 1, bg: '#cc0000' }];
    } else if (type === 'layer') {
        base.layerMode = 'fast';
        base.targetMv = c.defaultTargetKey || null;
        base.actions = [{ def: 'setMultiViewOverlay', target: c.defaultTargetKey || null, layer: 1, source: null }];
        base.feedbacks = [];
        base.slots = [{ layer: 1, source: null }];
    } else if (type === 'slide') {
        base.actions = [
            { def: 'previousPicture', input: null, pairSide: 'left' },
            { def: 'nextPicture', input: null, pairSide: 'right' }
        ];
        base.feedbacks = [];
    }
    c.cards.push(base);
    companionValidateCard(base);
    companionRenderCardList();
    companionPersist();
    return base;
}

// ===== Validate =====
function companionValidateCard(card) {
    let ok = true;
    if (card.type === 'cut' || card.type === 'output' || card.type === 'mix' || card.type === 'audio') {
        ok = card.actions.every(a => a.input != null);
    } else if (card.type === 'slide') {
        const inp = card.actions[0]?.input;
        if (inp != null) {
            // pair shares same input
            card.actions.forEach(a => { a.input = inp; });
        }
        ok = inp != null;
    } else if (card.type === 'layer') {
        if (card.layerMode === 'fast') {
            const a = card.actions[0];
            ok = a.target != null && a.source != null;
        } else {
            ok = card.targetMv != null && card.slots.length > 0 && card.slots.every(s => s.source != null);
        }
    }
    card._valid = ok;
    return ok;
}

function companionGetPrimaryInput(card) {
    if (card.type === 'layer') {
        if (card.layerMode === 'fast') return compResolveInput(card.actions[0]?.source);
        return compResolveInput(card.slots[0]?.source);
    }
    return compResolveInput(card.actions[0]?.input);
}

// ===== Target Default dropdown =====
function companionRenderTargetDefault() {
    const sel = document.getElementById('compTargetDefault');
    if (!sel) return;
    const cur = STATE.companion.defaultTargetKey;
    const inputs = compInputs();
    sel.innerHTML = '<option value="">— nenhum —</option>';
    for (const i of inputs) {
        const opt = compEl('option');
        opt.value = i.key;
        opt.textContent = `[${i.number}] ${i.shortTitle || i.title}`;
        if (i.key === cur) opt.selected = true;
        sel.appendChild(opt);
    }
}

// ===== Render =====
function companionRender() {
    if (!document.getElementById('companionContent')) return;
    companionRenderTargetDefault();
    companionRenderCardList();
    companionRenderGrid();
    companionUpdateStats();
}

function companionUpdateStats() {
    const c = STATE.companion;
    const cells = Object.keys(c.cells).length;
    const el = document.getElementById('compStats');
    if (el) el.textContent = `${c.cards.length} cards · ${cells} cells`;
    const lbl = document.getElementById('compPageNumLabel');
    if (lbl) lbl.textContent = c.pageNum;
}

// ===== Card list render =====
function companionRenderCardList() {
    const list = document.getElementById('compCardList');
    if (!list) return;
    list.innerHTML = '';
    if (STATE.companion.cards.length === 0) {
        const empty = compEl('div', 'comp-builder-empty', 'Use os botões acima pra criar seu primeiro card.');
        list.appendChild(empty);
        return;
    }
    for (const card of STATE.companion.cards) {
        list.appendChild(companionBuildCardEl(card));
    }
    companionUpdateStats();
}

function companionBuildCardEl(card) {
    companionValidateCard(card);
    const c = compEl('div', 'comp-card' + (card._valid ? '' : ' invalid'));
    c.dataset.cardId = card.id;
    c.draggable = card._valid;
    const primary = companionGetPrimaryInput(card);
    const titleHtml = primary
        ? `${primary.shortTitle || primary.title} <span class="comp-card-num">[${primary.number}]</span>`
        : `<span class="comp-card-placeholder">preencha as zonas</span>`;
    const modeIcon = card.mode === 'linked' ? '🔗' : card.mode === 'oneshot' ? '🎯' : '📋';
    const modeLabel = card.mode === 'linked' ? 'Linked' : card.mode === 'oneshot' ? 'One-shot' : 'Clone';
    const modeClass = card.mode === 'linked' ? ' linked' : card.mode === 'oneshot' ? ' oneshot' : '';
    c.innerHTML = `
      <div class="comp-card-head">
        <div class="comp-card-chip comp-t-${card.type}">${COMP_LABEL[card.type]}</div>
        <div class="comp-card-title">${titleHtml}</div>
        <button type="button" class="comp-card-mode${modeClass}" title="Click pra alternar Clone → One-shot → Linked">
          <span class="comp-mode-icon">${modeIcon}</span>${modeLabel}
          <div class="comp-mode-tip">
            <div class="comp-mode-row"><b><span class="comp-mode-ico">📋</span>Clone (default)</b>Drop = cópia independente. Card fica no painel — multi-uso. Edits depois NÃO afetam cells.</div>
            <div class="comp-mode-row"><b><span class="comp-mode-ico">🎯</span>One-shot</b>Drop CONSOME o card: snapshot vira cell, card sai do painel. Uso único.</div>
            <div class="comp-mode-row"><b><span class="comp-mode-ico">🔗</span>Linked (sync)</b>Drop = vínculo. Card fica. Edits propagam pra todas cells linkadas em tempo real.</div>
          </div>
        </button>
        <div class="comp-card-actions">
          <button type="button" data-act="dup" title="Duplicar">⎘</button>
          <button type="button" data-act="del" class="comp-card-del" title="Deletar">✕</button>
        </div>
      </div>
      <div class="comp-card-body"></div>`;
    c.querySelector('.comp-card-mode').onclick = (e) => {
        e.stopPropagation();
        card.mode = card.mode === 'clone' ? 'oneshot' : card.mode === 'oneshot' ? 'linked' : 'clone';
        companionRenderCardList();
        companionPersist();
    };
    c.querySelector('[data-act="dup"]').onclick = (e) => { e.stopPropagation(); companionDuplicateCard(card.id); };
    c.querySelector('[data-act="del"]').onclick = (e) => { e.stopPropagation(); companionDeleteCard(card.id); };
    c.addEventListener('dragstart', (e) => {
        if (!card._valid) { e.preventDefault(); showToast('Card inválido — preencha todos campos'); return; }
        c.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'copy';
        e.dataTransfer.setData('text/plain', JSON.stringify({ cardId: card.id }));
        e.dataTransfer.setData('application/x-comp-source', 'card');
    });
    c.addEventListener('dragend', () => c.classList.remove('dragging'));
    companionRenderCardBody(c.querySelector('.comp-card-body'), card);
    return c;
}

function companionRenderCardBody(body, card) {
    body.innerHTML = '';
    if (card.type === 'layer') {
        const bar = compEl('div', 'comp-layer-mode-bar');
        const b1 = compEl('button', card.layerMode === 'fast' ? 'active' : '', '⚡ Rápido (1 ação)');
        const b2 = compEl('button', card.layerMode === 'layout' ? 'active' : '', '▦ Layout (multi-slot)');
        b1.type = 'button'; b2.type = 'button';
        b1.onclick = () => { card.layerMode = 'fast'; companionRenderCardList(); companionPersist(); };
        b2.onclick = () => { card.layerMode = 'layout'; companionRenderCardList(); companionPersist(); };
        bar.appendChild(b1); bar.appendChild(b2);
        body.appendChild(bar);
        if (card.layerMode === 'fast') {
            const a = card.actions[0];
            body.appendChild(companionSection('Step (down)', [
                companionActionRow('setMultiViewOverlay', [
                    companionField('Target Input', companionDropzone(a, 'target', () => companionRenderCardList())),
                    companionField('Layer N', companionNumField(a.layer, 1, 10, v => { a.layer = v; companionRenderCardList(); companionPersist(); })),
                    companionField('Source', companionDropzone(a, 'source', () => companionRenderCardList()))
                ])
            ]));
        } else {
            body.appendChild(companionField('Target Input (todos slots)', companionDropzone(card, 'targetMv', () => companionRenderCardList())));
            const slotsWrap = compEl('div');
            card.slots.forEach((slot, i) => {
                const row = compEl('div', 'comp-layer-slot');
                const layerSel = compEl('select', 'comp-val-sel');
                for (let n = 1; n <= 10; n++) {
                    const o = compEl('option');
                    o.value = n; o.textContent = 'L' + n;
                    if (n === slot.layer) o.selected = true;
                    layerSel.appendChild(o);
                }
                layerSel.onchange = () => { slot.layer = +layerSel.value; companionRenderCardList(); companionPersist(); };
                row.appendChild(layerSel);
                row.appendChild(companionDropzone(slot, 'source', () => companionRenderCardList()));
                const x = compEl('button', 'comp-slot-del', '✕');
                x.type = 'button';
                x.onclick = () => { card.slots.splice(i, 1); if (card.slots.length === 0) card.slots.push({ layer: 1, source: null }); companionRenderCardList(); companionPersist(); };
                row.appendChild(x);
                slotsWrap.appendChild(row);
            });
            body.appendChild(companionSection(`Slots (${card.slots.length})`, [slotsWrap]));
            const add = compEl('button', 'comp-add-slot', '+ adicionar slot');
            add.type = 'button';
            add.onclick = () => {
                const last = card.slots[card.slots.length - 1];
                const nextLayer = Math.min((last?.layer || 0) + 1, 10);
                card.slots.push({ layer: nextLayer, source: null });
                companionRenderCardList();
                companionPersist();
            };
            body.appendChild(add);
        }
        return;
    }
    // Actions section
    const actContent = [];
    card.actions.forEach((a) => {
        const fields = [];
        if (a.def === 'programCut') {
            fields.push(companionField('Input', companionDropzone(a, 'input', () => companionRenderCardList())));
            if (card.type === 'mix') {
                fields.push(companionField('Mix N', companionNumField(a.mix, 1, 15, v => {
                    a.mix = v;
                    if (card.feedbacks[0]) card.feedbacks[0].mix = v;
                    companionRenderCardList();
                    companionPersist();
                })));
            }
        } else if (a.def === 'audio') {
            fields.push(companionField('Input', companionDropzone(a, 'input', () => companionRenderCardList())));
        } else if (a.def === 'audioBus') {
            fields.push(companionField('Input', companionDropzone(a, 'input', () => companionRenderCardList())));
            fields.push(companionField('Bus', companionSelField(a.bus, ['Master', 'A', 'B', 'C', 'D', 'E', 'F', 'G'], v => { a.bus = v; companionPersist(); })));
        } else if (a.def === 'outputSet') {
            fields.push(companionField('Input', companionDropzone(a, 'input', () => companionRenderCardList())));
            fields.push(companionField('Output', companionSelField(a.functionID || 'SetOutputFullscreen', ['SetOutputFullscreen', 'SetOutput2', 'SetOutput3', 'SetOutput4'], v => { a.functionID = v; companionPersist(); })));
        } else if (a.def === 'previousPicture' || a.def === 'nextPicture') {
            fields.push(companionField('Input', companionDropzone(a, 'input', () => {
                // Pair sync
                const other = card.actions.find(x => x.def !== a.def);
                if (other) other.input = a.input;
                companionRenderCardList();
                companionPersist();
            })));
        }
        const label = a.def + (a.pairSide ? ` · ${a.pairSide === 'left' ? '◀ Prev' : '▶ Next'}` : '');
        actContent.push(companionActionRow(label, fields));
    });
    body.appendChild(companionSection('Step (down actions)', actContent));

    if (card.feedbacks.length > 0) {
        const fbContent = [];
        card.feedbacks.forEach(f => {
            const fields = [];
            if (f.def === 'inputLive') {
                fields.push(companionField('Input', companionDropzone(f, 'input', () => companionRenderCardList())));
                if (card.type === 'mix') {
                    fields.push(companionField('Mix N', companionNumField(f.mix, 1, 15, v => { f.mix = v; companionRenderCardList(); companionPersist(); })));
                }
                fields.push(companionField('BG', companionColorField(f.bg || '#006600', v => { f.bg = v; companionPersist(); })));
            } else if (f.def === 'inputAudio') {
                fields.push(companionField('Input', companionDropzone(f, 'input', () => companionRenderCardList())));
                fields.push(companionField('BG', companionColorField(f.bg || '#ff0000', v => { f.bg = v; companionPersist(); })));
            } else if (f.def === 'inputVolumeMeter') {
                fields.push(companionField('Input', companionDropzone(f, 'input', () => companionRenderCardList())));
            }
            fbContent.push(companionActionRow(f.def, fields));
        });
        body.appendChild(companionSection('Feedback', fbContent));
    }
}

function companionSection(title, els) {
    const sec = compEl('div', 'comp-card-section');
    sec.appendChild(compEl('div', 'comp-section-title', title));
    els.forEach(e => sec.appendChild(e));
    return sec;
}
function companionActionRow(name, fieldEls) {
    const r = compEl('div', 'comp-action-row');
    r.appendChild(compEl('div', 'comp-action-name', name));
    const wrap = compEl('div', 'comp-action-fields');
    fieldEls.forEach(f => wrap.appendChild(f));
    r.appendChild(wrap);
    return r;
}
function companionField(label, valueEl) {
    const f = compEl('div', 'comp-field-row');
    f.appendChild(compEl('label', '', label));
    f.appendChild(valueEl);
    return f;
}
function companionNumField(value, min, max, onChange) {
    const i = compEl('input', 'comp-val-num');
    i.type = 'number'; i.min = min; i.max = max; i.value = value;
    i.oninput = () => onChange(Math.max(min, Math.min(max, +i.value || min)));
    return i;
}
function companionSelField(value, opts, onChange) {
    const s = compEl('select', 'comp-val-sel');
    for (const o of opts) {
        const e = compEl('option');
        e.value = o; e.textContent = o;
        if (o === value) e.selected = true;
        s.appendChild(e);
    }
    s.onchange = () => onChange(s.value);
    return s;
}
function companionColorField(value, onChange) {
    const i = compEl('input', 'comp-val-color');
    i.type = 'color'; i.value = value;
    i.oninput = () => onChange(i.value);
    return i;
}

// ===== Dropzone =====
function companionDropzone(obj, key, onChange) {
    const dz = compEl('div', 'comp-dz' + (obj[key] ? ' filled' : ''));
    function paint() {
        dz.className = 'comp-dz' + (obj[key] ? ' filled' : '');
        if (obj[key]) {
            const inp = compResolveInput(obj[key]);
            if (!inp) {
                dz.innerHTML = `<span class="comp-dz-placeholder">GUID inválido</span>`;
                return;
            }
            dz.innerHTML = '';
            const pill = compEl('div', 'comp-dz-pill');
            pill.innerHTML = `
              <span class="comp-pill-num">${inp.number}</span>
              <span class="comp-pill-name">${inp.shortTitle || inp.title}</span>
              <span class="comp-pill-guid">${inp.key.slice(0, 8)}</span>
              <button type="button" class="comp-pill-x" title="Limpar">✕</button>`;
            pill.querySelector('.comp-pill-x').onclick = (e) => { e.stopPropagation(); obj[key] = null; paint(); onChange && onChange(); companionPersist(); };
            dz.appendChild(pill);
        } else {
            dz.innerHTML = `<span class="comp-dz-placeholder">Arraste input aqui</span>`;
        }
    }
    paint();
    dz.addEventListener('dragover', (e) => {
        const src = e.dataTransfer.types.includes('application/x-comp-source') ? 'card' : 'input';
        if (src === 'card') return;
        e.preventDefault();
        dz.classList.add('dragover');
    });
    dz.addEventListener('dragleave', () => dz.classList.remove('dragover'));
    dz.addEventListener('drop', (e) => {
        e.preventDefault();
        dz.classList.remove('dragover');
        const compSrc = e.dataTransfer.getData('application/x-comp-source');
        if (compSrc === 'card') return; // ignora cards
        const payload = e.dataTransfer.getData('text/plain');
        if (!payload) return;
        try {
            const inp = JSON.parse(payload);
            if (!inp || !inp.key) return;
            obj[key] = inp.key;
            paint();
            onChange && onChange();
            companionPersist();
        } catch { /* noop */ }
    });
    return dz;
}

// ===== Duplicate / Delete card =====
function companionDuplicateCard(id) {
    const c = STATE.companion.cards.find(x => x.id === id);
    if (!c) return;
    const copy = JSON.parse(JSON.stringify(c));
    copy.id = 'card_' + companionNanoId(12);
    STATE.companion.cards.push(copy);
    companionRenderCardList();
    companionPersist();
    showToast('Card duplicado');
}

function companionDeleteCard(id) {
    const card = STATE.companion.cards.find(c => c.id === id);
    if (!card) return;
    let linkedCount = 0;
    Object.values(STATE.companion.cells).forEach(cd => { if (cd.cardId === id && cd.linked) linkedCount++; });
    if (linkedCount > 0) {
        showModal(`
          <div class="modal-header">
            <div class="modal-icon" style="background:#3b82f6">${getIcon('trash')}</div>
            <div><div class="modal-title">Card linked a ${linkedCount} célula(s)</div>
            <div class="modal-sub">Esse card está em modo Linked.</div></div>
          </div>
          <div class="modal-body" style="padding:12px 16px 4px;font-size:13px;color:#555;line-height:1.5">
            Deletar também remove as cells, ou manter as cells como snapshot (clone independente)?
          </div>
          <div class="modal-footer">
            <button class="modal-btn-cancel" id="compDelCardCancel">Cancelar</button>
            <button class="modal-btn-cancel" id="compDelCardUnlink">Manter cells (vira clone)</button>
            <button class="modal-btn-delete" id="compDelCardCascade">Deletar tudo</button>
          </div>
        `);
        document.getElementById('compDelCardCancel').onclick = () => closeModal();
        document.getElementById('compDelCardUnlink').onclick = () => {
            Object.values(STATE.companion.cells).forEach(cd => {
                if (cd.cardId === id && cd.linked) { cd.linked = false; cd.snapshot = JSON.parse(JSON.stringify(card)); }
            });
            STATE.companion.cards = STATE.companion.cards.filter(c => c.id !== id);
            closeModal();
            companionRender();
            companionPersist();
            showToast('Card deletado · cells viraram clones');
        };
        document.getElementById('compDelCardCascade').onclick = () => {
            Object.keys(STATE.companion.cells).forEach(k => {
                if (STATE.companion.cells[k].cardId === id) delete STATE.companion.cells[k];
            });
            STATE.companion.cards = STATE.companion.cards.filter(c => c.id !== id);
            closeModal();
            companionRender();
            companionPersist();
            showToast('Card e cells deletados');
        };
    } else {
        STATE.companion.cards = STATE.companion.cards.filter(c => c.id !== id);
        companionRenderCardList();
        companionPersist();
        showToast('Card deletado');
    }
}

// ===== Validate all =====
function companionValidateAll() {
    let bad = 0;
    STATE.companion.cards.forEach(c => { if (!companionValidateCard(c)) bad++; });
    companionRenderCardList();
    if (bad === 0) showToast(`Todos ${STATE.companion.cards.length} cards válidos`);
    else showToast(`${bad} de ${STATE.companion.cards.length} cards com campos vazios`);
}

// ===== Clear grid =====
function companionClearGrid() {
    const c = STATE.companion;
    const total = Object.keys(c.cells).length;
    if (total === 0) { showToast('Grid já vazia'); return; }
    showModal(`
      <div class="modal-header">
        <div class="modal-icon" style="background:#dc2626">${getIcon('trash')}</div>
        <div><div class="modal-title">Limpar grid?</div>
        <div class="modal-sub">${total} botões — cards continuam no painel</div></div>
      </div>
      <div class="modal-body" style="padding:12px 16px 4px;font-size:13px;color:#555">Sem undo. Continuar?</div>
      <div class="modal-footer">
        <button class="modal-btn-cancel" id="compClearCancel">Cancelar</button>
        <button class="modal-btn-delete" id="compClearOk">Limpar grid</button>
      </div>
    `);
    document.getElementById('compClearCancel').onclick = () => closeModal();
    document.getElementById('compClearOk').onclick = () => {
        c.cells = {};
        closeModal();
        companionRender();
        companionPersist();
        showToast('Grid limpa');
    };
}

// ===== Grid render =====
function companionRenderGrid() {
    const grid = document.getElementById('companionGrid');
    if (!grid) return;
    grid.innerHTML = '';
    const c = STATE.companion;
    for (let r = 0; r < 4; r++) {
        for (let col = 0; col < 8; col++) {
            const cell = compEl('div', 'comp-cell empty');
            cell.dataset.r = r; cell.dataset.c = col;
            const k = `${r}:${col}`;
            const cellData = c.cells[k];
            if (cellData) {
                const card = companionResolveCellData(cellData);
                if (!card) {
                    cell.classList.remove('empty');
                    cell.innerHTML = `<div class="comp-cell-typetag">erro</div><div class="comp-cell-label">card sumiu</div>`;
                } else {
                    const primary = companionGetPrimaryInput(card);
                    cell.classList.remove('empty');
                    cell.classList.add('filled');
                    cell.style.background = COMP_HEX[card.type];
                    cell.style.borderColor = 'rgba(255,255,255,.25)';
                    const lbl = primary ? `${primary.shortTitle || primary.title}\n[${primary.number}]` : '(sem input)';
                    cell.innerHTML = `
                      <div class="comp-cell-typetag">${COMP_LABEL[card.type]}</div>
                      ${cellData.linked ? '<div class="comp-cell-linked">🔗</div>' : ''}
                      <div class="comp-cell-label">${lbl.replace(/</g, '&lt;')}</div>
                      <div class="comp-cell-edit" title="Voltar pra edição no painel">✎</div>
                      <div class="comp-cell-del" title="Deletar">✕</div>`;
                    cell.querySelector('.comp-cell-del').onclick = (e) => { e.stopPropagation(); companionDeleteCellOnly(r, col); };
                    cell.querySelector('.comp-cell-edit').onclick = (e) => { e.stopPropagation(); companionEditCell(r, col); };
                }
            }
            companionSetupCellDrop(cell, r, col);
            companionAddCoord(cell, r, col);
            grid.appendChild(cell);
        }
    }
    companionUpdateStats();
}

function companionAddCoord(cell, r, c) {
    const s = compEl('span', 'comp-cell-coord', `${r},${c}`);
    cell.appendChild(s);
}

function companionResolveCellData(cellData) {
    if (cellData.linked) {
        return STATE.companion.cards.find(x => x.id === cellData.cardId) || null;
    }
    return cellData.snapshot || null;
}

function companionDeleteCellOnly(r, col) {
    const cells = STATE.companion.cells;
    const k = `${r}:${col}`;
    const data = cells[k];
    if (!data) return;
    const card = companionResolveCellData(data);
    delete cells[k];
    // Pair P: deleta partner SE for do mesmo card
    if (card && card.type === 'slide') {
        const right = cells[`${r}:${col + 1}`];
        const left = cells[`${r}:${col - 1}`];
        if (right && right.cardId === data.cardId) delete cells[`${r}:${col + 1}`];
        if (left && left.cardId === data.cardId) delete cells[`${r}:${col - 1}`];
    }
    companionRenderGrid();
    companionPersist();
}

function companionEditCell(r, col) {
    const cells = STATE.companion.cells;
    const k = `${r}:${col}`;
    const cellData = cells[k];
    if (!cellData) return;
    if (cellData.linked) {
        const card = STATE.companion.cards.find(x => x.id === cellData.cardId);
        if (!card) { showToast('Card original não existe'); return; }
        companionScrollToCard(card.id);
        showToast('Editando card original (linked) — edits propagam pras cells');
        return;
    }
    const snap = cellData.snapshot;
    if (!snap) { showToast('Sem snapshot pra restaurar'); return; }
    const restored = JSON.parse(JSON.stringify(snap));
    restored.id = 'card_' + companionNanoId(12);
    restored.mode = 'clone';
    STATE.companion.cards.push(restored);
    delete cells[k];
    if (snap.type === 'slide') {
        const right = cells[`${r}:${col + 1}`];
        const left = cells[`${r}:${col - 1}`];
        if (right && right.cardId === cellData.cardId) delete cells[`${r}:${col + 1}`];
        if (left && left.cardId === cellData.cardId) delete cells[`${r}:${col - 1}`];
    }
    companionRender();
    companionScrollToCard(restored.id);
    companionPersist();
    showToast('Cell devolvida ao painel pra edição');
}

function companionScrollToCard(id) {
    setTimeout(() => {
        const el = document.querySelector(`.comp-card[data-card-id="${id}"]`);
        if (!el) return;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.remove('comp-highlight');
        void el.offsetWidth;
        el.classList.add('comp-highlight');
    }, 10);
}

// ===== Drop card → cell =====
function companionSetupCellDrop(cell, r, col) {
    cell.addEventListener('dragover', (e) => {
        if (cell.classList.contains('nav')) return;
        const src = e.dataTransfer.types.includes('application/x-comp-source') ? 'card' : null;
        if (src !== 'card') return;
        e.preventDefault();
        cell.classList.add('dragover');
    });
    cell.addEventListener('dragleave', () => cell.classList.remove('dragover'));
    cell.addEventListener('drop', (e) => {
        e.preventDefault();
        cell.classList.remove('dragover');
        if (cell.classList.contains('nav')) return;
        const compSrc = e.dataTransfer.getData('application/x-comp-source');
        if (compSrc !== 'card') return;
        try {
            const { cardId } = JSON.parse(e.dataTransfer.getData('text/plain'));
            const card = STATE.companion.cards.find(x => x.id === cardId);
            if (!card) { showToast('Card não existe mais'); return; }
            if (!companionValidateCard(card)) { showToast('Card inválido'); return; }
            companionPlaceCard(card, r, col);
        } catch { /* noop */ }
    });
}

function companionPlaceCard(card, r, col) {
    const cells = STATE.companion.cells;
    if (card.type === 'slide') {
        if (col === 7) { showToast('Par Slide precisa col+1'); return; }
        if (cells[`${r}:${col + 1}`]) { showToast(`Cell (${r},${col + 1}) ocupada`); return; }
    }
    const cellData = card.mode === 'linked'
        ? { cardId: card.id, linked: true }
        : { cardId: card.id, linked: false, snapshot: JSON.parse(JSON.stringify(card)) };
    cells[`${r}:${col}`] = cellData;
    if (card.type === 'slide') {
        cells[`${r}:${col + 1}`] = Object.assign({}, cellData);
    }
    if (card.mode === 'oneshot') {
        STATE.companion.cards = STATE.companion.cards.filter(x => x.id !== card.id);
        showToast(`Colocado em (${r},${col}) · card consumido (one-shot)`);
    } else {
        showToast(`Colocado em (${r},${col})`);
    }
    companionRender();
    companionPersist();
}

// ===== Export (build real .companionconfig) =====
function companionBuildActions(card) {
    const cid = COMP_CONNECTION_ID;
    if (card.type === 'cut') {
        const inp = card.actions[0].input;
        return [{ id: companionNanoId(), definitionId: 'programCut', connectionId: cid, options: { input: inp, mix: 0, mixVariable: '1' }, upgradeIndex: 14, type: 'action' }];
    }
    if (card.type === 'audio') {
        const a1 = card.actions[0], a2 = card.actions[1];
        return [
            { id: companionNanoId(), definitionId: 'audio', connectionId: cid, options: { input: a1.input, functionID: 'Audio' }, upgradeIndex: 14, type: 'action' },
            { id: companionNanoId(), definitionId: 'audioBus', connectionId: cid, options: { input: a2.input, value: a2.bus || 'Master', functionID: 'AudioBus' }, upgradeIndex: 14, type: 'action' }
        ];
    }
    if (card.type === 'output') {
        const a = card.actions[0];
        return [{ id: companionNanoId(), definitionId: 'outputSet', connectionId: cid, options: { functionID: a.functionID || 'SetOutputFullscreen', value: 'Input', input: a.input, mix: 0, mixVariable: '' }, upgradeIndex: 14, type: 'action' }];
    }
    if (card.type === 'mix') {
        const a = card.actions[0]; const m = a.mix || 1;
        return [{ id: companionNanoId(), definitionId: 'programCut', connectionId: cid, options: { input: a.input, mix: m, mixVariable: String(m) }, upgradeIndex: 14, type: 'action' }];
    }
    if (card.type === 'layer') {
        if (card.layerMode === 'fast') {
            const a = card.actions[0];
            return [{ id: companionNanoId(), definitionId: 'setMultiViewOverlay', connectionId: cid, options: { input: a.target, layer: a.layer || 1, layerInput: a.source }, upgradeIndex: 14, type: 'action' }];
        }
        return card.slots.map(s => ({
            id: companionNanoId(), definitionId: 'setMultiViewOverlay', connectionId: cid,
            options: { input: card.targetMv, layer: s.layer || 1, layerInput: s.source }, upgradeIndex: 14, type: 'action'
        }));
    }
    return [];
}

function companionBuildFeedbacks(card) {
    const cid = COMP_CONNECTION_ID;
    if (card.type === 'cut') {
        const fb = card.feedbacks[0];
        return [{ id: companionNanoId(), definitionId: 'inputLive', connectionId: cid, options: { input: fb.input, mix: 0, mixVariable: '1', fg: 16777215, bg: compHexToInt(fb.bg || '#006600'), tally: '' }, upgradeIndex: 14, type: 'feedback', isInverted: false }];
    }
    if (card.type === 'audio') {
        const fb1 = card.feedbacks[0], fb2 = card.feedbacks[1];
        return [
            { id: companionNanoId(), definitionId: 'inputAudio', connectionId: cid, options: { input: fb1.input }, isInverted: !!fb1.isInverted, style: { color: 0, bgcolor: compHexToInt(fb1.bg || '#ff0000') }, upgradeIndex: 14, type: 'feedback' },
            { id: companionNanoId(), definitionId: 'inputVolumeMeter', connectionId: cid, options: { input: fb2.input }, upgradeIndex: 14, type: 'feedback', isInverted: false }
        ];
    }
    if (card.type === 'mix') {
        const fb = card.feedbacks[0]; const m = fb.mix || 1;
        return [{ id: companionNanoId(), definitionId: 'inputLive', connectionId: cid, options: { input: fb.input, mix: m, mixVariable: String(m), fg: 16777215, bg: compHexToInt(fb.bg || '#cc0000'), tally: '' }, upgradeIndex: 14, type: 'feedback', isInverted: false }];
    }
    return [];
}

function companionBuildButton(card, cellMeta) {
    const primary = companionGetPrimaryInput(card);
    let label = primary ? `${primary.shortTitle || primary.title}\n[${primary.number}]` : `(${card.type})`;
    if (card.type === 'slide') {
        label = `${primary ? (primary.shortTitle || primary.title) : ''}\n${cellMeta?.pairSide === 'right' ? '▶ Next' : '◀ Prev'}`;
    }
    const shell = {
        type: 'button',
        style: { text: label, textExpression: false, size: 'auto', alignment: 'center:center', pngalignment: 'center:center', color: 16777215, bgcolor: COMP_BG_INT[card.type] || 1710618, show_topbar: 'default' },
        options: { stepProgression: 'auto', stepExpression: '', rotaryActions: false },
        feedbacks: [],
        steps: {},
        localVariables: []
    };
    let actions;
    if (card.type === 'slide') {
        const inp = card.actions[0].input;
        const defId = cellMeta?.pairSide === 'right' ? 'nextPicture' : 'previousPicture';
        actions = [{ id: companionNanoId(), definitionId: defId, connectionId: COMP_CONNECTION_ID, options: { input: inp }, upgradeIndex: 14, type: 'action' }];
    } else {
        actions = companionBuildActions(card) || [];
    }
    shell.feedbacks = companionBuildFeedbacks(card);
    shell.steps = { '0': { action_sets: { down: actions, up: [] }, options: { runWhileHeld: [] } } };
    return shell;
}

function companionBuildJSON() {
    const c = STATE.companion;
    const out = { version: 9, type: 'full', companionBuild: COMP_BUILD, pages: {}, instances: {}, connectionCollections: [] };
    const pageNum = c.pageNum;
    const controls = {};
    for (const [k, cellData] of Object.entries(c.cells)) {
        const [r, col] = k.split(':').map(Number);
        const card = companionResolveCellData(cellData);
        if (!card) continue;
        let pairSide = null;
        if (card.type === 'slide') {
            const left = c.cells[`${r}:${col - 1}`];
            pairSide = (left && left.cardId === cellData.cardId) ? 'right' : 'left';
        }
        if (!controls[r]) controls[r] = {};
        controls[r][col] = companionBuildButton(card, { pairSide });
    }
    out.pages[String(pageNum)] = {
        id: companionNanoId(),
        name: `vMix Buttons P${pageNum}`,
        controls,
        gridSize: { minColumn: 0, maxColumn: 7, minRow: 0, maxRow: 3 }
    };
    return out;
}

function companionTimestamp() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

function companionExport() {
    const c = STATE.companion;
    const total = Object.keys(c.cells).length;
    if (total === 0) { showToast('Nada pra exportar — arraste cards pra grid'); return; }
    let invalid = 0;
    Object.values(c.cells).forEach(cd => {
        const card = companionResolveCellData(cd);
        if (!card || !companionValidateCard(card)) invalid++;
    });
    if (invalid > 0) { showToast(`${invalid} cell(s) com card inválido — corrija primeiro`); return; }
    const obj = companionBuildJSON();
    const txt = JSON.stringify(obj, null, '\t');
    const blob = new Blob([txt], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vmix-buttons_${companionTimestamp()}.companionconfig`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    showToast(`Exportado: ${total} cells na page P${c.pageNum}`);
    console.log('[Companion] JSON gerado:', obj);
}
