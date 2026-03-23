// =============================================
// vMix Live MultiLayer Editor — SplitView Engine
// =============================================
// State model: each layer uses normalized 0-1 coords (x, y, w, h)
// Math validated against vMix 29 4K API via terminal tests:
//   Z = max(w, h)
//   panX = (x + w/2) * 2 - 1
//   panY = 1 - (y + h/2) * 2
//   cropX = (Z - w) / 2 / Z   (symmetric: CropX1 = CropX2 = cropX)
//   cropY = (Z - h) / 2 / Z   (symmetric: CropY1 = CropY2 = cropY)
// vMix API: SetLayer{N}PanX, SetLayer{N}Zoom, SetLayer{N}CropX1, etc.

// =============================================
// LAYER MODEL
// =============================================

function lcMakeLayer(index) {
    return {
        index,
        inputKey: null,
        inputTitle: '',
        color: LC_COLORS[index % LC_COLORS.length],
        x: 0, y: 0, w: 1, h: 1,
        hidden: true,
        _posSet: false
    };
}

// =============================================
// CORE MATH (SplitView Engine)
// =============================================

// Normalized (0-1) → vMix API values
function lcToVMix(l) {
    const Z = Math.max(l.w, l.h);
    const panX = (l.x + l.w / 2) * 2 - 1;
    const panY = 1 - (l.y + l.h / 2) * 2;
    const cropX = (Z - l.w) / 2 / Z;
    const cropY = (Z - l.h) / 2 / Z;
    return {
        panX: +panX.toFixed(6),
        panY: +panY.toFixed(6),
        zoom: +Z.toFixed(6),
        cropX1: +cropX.toFixed(6),
        cropX2: +(1 - cropX).toFixed(6),
        cropY1: +cropY.toFixed(6),
        cropY2: +(1 - cropY).toFixed(6)
    };
}

// vMix XML values → normalized (0-1)
function lcFromVMix(panX, panY, zoom, cropX1, cropY1) {
    const Z = zoom || 1;
    const w = Z * (1 - 2 * cropX1);
    const h = Z * (1 - 2 * cropY1);
    const cx = (panX + 1) / 2;
    const cy = (1 - panY) / 2;
    return {
        x: +(cx - w / 2).toFixed(6),
        y: +(cy - h / 2).toFixed(6),
        w: +Math.max(0.01, w).toFixed(6),
        h: +Math.max(0.01, h).toFixed(6)
    };
}

// Normalized → canvas pixels
function lcToCanvas(l, cW, cH) {
    return { left: l.x * cW, top: l.y * cH, width: l.w * cW, height: l.h * cH };
}

// =============================================
// PRESETS
// =============================================

// Split presets (with center crop)
const LC_PRESETS = {
    '5050':  [{x:0, y:0, w:0.5, h:1}, {x:0.5, y:0, w:0.5, h:1}],
    '6733':  [{x:0, y:0, w:0.667, h:1}, {x:0.667, y:0, w:0.333, h:1}],
    '3367':  [{x:0, y:0, w:0.333, h:1}, {x:0.333, y:0, w:0.667, h:1}],
    '333':   [{x:0, y:0, w:0.333, h:1}, {x:0.333, y:0, w:0.334, h:1}, {x:0.667, y:0, w:0.333, h:1}]
};

// Zero-Crop Multiview layouts (Simétrico — all cells equal, 16:9 preserved)
const LC_SIM = [
    [{x:0,y:0,w:1,h:1}],
    [{x:0,y:.25,w:.5,h:.5},{x:.5,y:.25,w:.5,h:.5}],
    [{x:0,y:0,w:.5,h:.5},{x:.5,y:0,w:.5,h:.5},{x:.25,y:.5,w:.5,h:.5}],
    [{x:0,y:0,w:.5,h:.5},{x:.5,y:0,w:.5,h:.5},{x:0,y:.5,w:.5,h:.5},{x:.5,y:.5,w:.5,h:.5}],
    [{x:0,y:1/6,w:1/3,h:1/3},{x:1/3,y:1/6,w:1/3,h:1/3},{x:2/3,y:1/6,w:1/3,h:1/3},{x:1/6,y:1/2,w:1/3,h:1/3},{x:1/2,y:1/2,w:1/3,h:1/3}],
    [{x:0,y:1/6,w:1/3,h:1/3},{x:1/3,y:1/6,w:1/3,h:1/3},{x:2/3,y:1/6,w:1/3,h:1/3},{x:0,y:1/2,w:1/3,h:1/3},{x:1/3,y:1/2,w:1/3,h:1/3},{x:2/3,y:1/2,w:1/3,h:1/3}],
    [{x:0,y:0,w:1/3,h:1/3},{x:1/3,y:0,w:1/3,h:1/3},{x:2/3,y:0,w:1/3,h:1/3},{x:0,y:1/3,w:1/3,h:1/3},{x:1/3,y:1/3,w:1/3,h:1/3},{x:2/3,y:1/3,w:1/3,h:1/3},{x:1/3,y:2/3,w:1/3,h:1/3}],
    [{x:0,y:0,w:1/3,h:1/3},{x:1/3,y:0,w:1/3,h:1/3},{x:2/3,y:0,w:1/3,h:1/3},{x:0,y:1/3,w:1/3,h:1/3},{x:1/3,y:1/3,w:1/3,h:1/3},{x:2/3,y:1/3,w:1/3,h:1/3},{x:1/6,y:2/3,w:1/3,h:1/3},{x:1/2,y:2/3,w:1/3,h:1/3}],
    [0,1,2].flatMap(y=>[0,1,2].map(x=>({x:x/3,y:y/3,w:1/3,h:1/3}))),
    [{x:0,y:.125,w:.25,h:.25},{x:.25,y:.125,w:.25,h:.25},{x:.5,y:.125,w:.25,h:.25},{x:.75,y:.125,w:.25,h:.25},{x:0,y:.375,w:.25,h:.25},{x:.25,y:.375,w:.25,h:.25},{x:.5,y:.375,w:.25,h:.25},{x:.75,y:.375,w:.25,h:.25},{x:.25,y:.625,w:.25,h:.25},{x:.5,y:.625,w:.25,h:.25}]
];

// Zero-Crop PGM layouts (Program + PIPs — last layer is the big one)
const LC_PGM = [
    [{x:0,y:0,w:1,h:1}],
    [{x:2/3,y:1/6,w:1/3,h:1/3},{x:0,y:1/6,w:2/3,h:2/3}],
    [{x:2/3,y:1/6,w:1/3,h:1/3},{x:2/3,y:1/2,w:1/3,h:1/3},{x:0,y:1/6,w:2/3,h:2/3}],
    [{x:3/4,y:1/8,w:1/4,h:1/4},{x:3/4,y:3/8,w:1/4,h:1/4},{x:3/4,y:5/8,w:1/4,h:1/4},{x:0,y:1/8,w:3/4,h:3/4}],
    [{x:3/4,y:0,w:1/4,h:1/4},{x:3/4,y:1/4,w:1/4,h:1/4},{x:3/4,y:1/2,w:1/4,h:1/4},{x:3/4,y:3/4,w:1/4,h:1/4},{x:0,y:1/8,w:3/4,h:3/4}],
    [{x:2/3,y:0,w:1/3,h:1/3},{x:2/3,y:1/3,w:1/3,h:1/3},{x:2/3,y:2/3,w:1/3,h:1/3},{x:0,y:2/3,w:1/3,h:1/3},{x:1/3,y:2/3,w:1/3,h:1/3},{x:0,y:0,w:2/3,h:2/3}],
    [{x:3/4,y:0,w:1/4,h:1/4},{x:3/4,y:1/4,w:1/4,h:1/4},{x:3/4,y:1/2,w:1/4,h:1/4},{x:3/4,y:3/4,w:1/4,h:1/4},{x:1/8,y:3/4,w:1/4,h:1/4},{x:3/8,y:3/4,w:1/4,h:1/4},{x:0,y:0,w:3/4,h:3/4}],
    [{x:3/4,y:0,w:1/4,h:1/4},{x:3/4,y:1/4,w:1/4,h:1/4},{x:3/4,y:1/2,w:1/4,h:1/4},{x:3/4,y:3/4,w:1/4,h:1/4},{x:0,y:3/4,w:1/4,h:1/4},{x:1/4,y:3/4,w:1/4,h:1/4},{x:1/2,y:3/4,w:1/4,h:1/4},{x:0,y:0,w:3/4,h:3/4}],
    [{x:4/5,y:0,w:1/5,h:1/5},{x:4/5,y:1/5,w:1/5,h:1/5},{x:4/5,y:2/5,w:1/5,h:1/5},{x:4/5,y:3/5,w:1/5,h:1/5},{x:4/5,y:4/5,w:1/5,h:1/5},{x:.1,y:4/5,w:1/5,h:1/5},{x:.3,y:4/5,w:1/5,h:1/5},{x:.5,y:4/5,w:1/5,h:1/5},{x:0,y:0,w:4/5,h:4/5}],
    [{x:4/5,y:0,w:1/5,h:1/5},{x:4/5,y:1/5,w:1/5,h:1/5},{x:4/5,y:2/5,w:1/5,h:1/5},{x:4/5,y:3/5,w:1/5,h:1/5},{x:4/5,y:4/5,w:1/5,h:1/5},{x:0,y:4/5,w:1/5,h:1/5},{x:1/5,y:4/5,w:1/5,h:1/5},{x:2/5,y:4/5,w:1/5,h:1/5},{x:3/5,y:4/5,w:1/5,h:1/5},{x:0,y:0,w:4/5,h:4/5}]
];

function lcGetAutoBoxes(N) {
    const idx = Math.max(0, Math.min(N - 1, 9));
    return STATE.layerControl.layoutMode === 'pgm' ? LC_PGM[idx] : LC_SIM[idx];
}

function lcApplyPreset(presetId) {
    const lc = STATE.layerControl;

    let boxes;
    if (presetId === 'auto') {
        // AUTO uses only layers with input
        const withInput = lc.layers.filter(l => l.inputKey);
        if (!withInput.length) { showToast('Nenhuma layer com input'); return; }
        boxes = lcGetAutoBoxes(withInput.length);
        withInput.forEach((l, i) => {
            l.x = boxes[i].x; l.y = boxes[i].y;
            l.w = boxes[i].w; l.h = boxes[i].h;
            l.hidden = false; l._posSet = true;        });
        // Hide layers beyond count — remove from vMix
        lc.layers.forEach(l => {
            if (!withInput.includes(l)) {
                l.hidden = true;
                if (l.inputKey) { l._savedKey = l.inputKey; lcRemoveLayerInput(l.index); }
            }
        });
    } else {
        boxes = LC_PRESETS[presetId];
        if (!boxes) return;
        for (let i = 0; i < 10; i++) {
            const l = lc.layers[i];
            if (i < boxes.length) {
                l.x = boxes[i].x; l.y = boxes[i].y;
                l.w = boxes[i].w; l.h = boxes[i].h;
                l.hidden = false; l._posSet = true;
            } else {
                l.hidden = true;
                if (l.inputKey) { l._savedKey = l.inputKey; lcRemoveLayerInput(l.index); }
            }
        }
    }

    lc.selectedLayer = 0;
    lcRender();
    // Assign + send positions for active layers
    lc.layers.forEach(l => {
        if (!l.hidden && l.inputKey) {
            lcAssignLayerInput(l.index, l.inputKey);
            setTimeout(() => lcSendToVMix(l), 100);
        }
    });
}

// =============================================
// INPUT SELECTOR MODAL
// =============================================

function lcShowInputSelector() {
    const inst = getActiveInstance();
    if (!inst || inst.status !== 'online') { showToast('Conecte a uma instância primeiro'); return; }
    if (!inst.inputs.length) { showToast('Nenhum input encontrado'); return; }

    const rows = inst.inputs.map(inp => `
        <div class="lc-input-row" data-key="${inp.key}" data-title="${inp.shortTitle || inp.title}" data-number="${inp.number}">
            <span class="lc-input-num">${inp.number}</span>
            <span class="lc-input-title">${inp.title}</span>
            <span class="lc-input-type">${inp.displayType}</span>
        </div>`).join('');

    showModal(`
        <div class="modal-header">
            <div class="modal-icon" style="background:#3b82f6">${getIcon('layers')}</div>
            <div><div class="modal-title">Selecionar Input</div>
            <div class="modal-sub">Escolha o input para controlar as layers</div></div>
        </div>
        <div class="modal-body"><div class="lc-input-list" id="lcInputList">${rows}</div></div>
    `, card => {
        card.querySelectorAll('.lc-input-row').forEach(row => {
            row.addEventListener('click', async () => {
                STATE.layerControl.targetInputKey = row.dataset.key;
                STATE.layerControl.targetInputTitle = row.dataset.title;
                document.getElementById('lcTargetLabel').textContent = `#${row.dataset.number} ${row.dataset.title}`;
                closeModal();
                await lcFetchInputLayers();
                lcRender();
                lcStartSync();
            });
        });
    });
}

// =============================================
// FETCH LAYERS FROM VMIX
// =============================================

function _parseOverlays(doc, inputEl) {
    const map = {};
    Array.from(inputEl.getElementsByTagName('overlay')).forEach(ov => {
        const idx = parseInt(ov.getAttribute('index'));
        const key = ov.getAttribute('key');
        if (!key) return;
        const posEl = ov.getElementsByTagName('position')[0];
        const cropEl = ov.getElementsByTagName('crop')[0];
        const panX = posEl ? parseFloat(posEl.getAttribute('panX') || '0') : 0;
        const panY = posEl ? parseFloat(posEl.getAttribute('panY') || '0') : 0;
        const zoom = posEl ? parseFloat(posEl.getAttribute('zoomX') || '1') : 1;
        const cX1 = cropEl ? parseFloat(cropEl.getAttribute('X1') || '0') : 0;
        const cY1 = cropEl ? parseFloat(cropEl.getAttribute('Y1') || '0') : 0;
        const pos = lcFromVMix(panX, panY, zoom, cX1, cY1);
        const inp = Array.from(doc.getElementsByTagName('input')).find(el => el.getAttribute('key') === key);
        const title = inp ? (inp.getAttribute('shortTitle') || inp.getAttribute('title') || '') : '';
        map[idx] = { key, title, ...pos };
    });
    return map;
}

async function lcFetchInputLayers() {
    const inst = getActiveInstance();
    const lc = STATE.layerControl;
    if (!inst || inst.status !== 'online' || !lc.targetInputKey) return;

    try {
        const res = await fetch(`http://${inst.host}:${inst.port}/api`, { signal: AbortSignal.timeout(5000) });
        const doc = new DOMParser().parseFromString(await res.text(), 'text/xml');
        const inputEl = Array.from(doc.getElementsByTagName('input')).find(el => el.getAttribute('key') === lc.targetInputKey);
        if (!inputEl) return;

        const ovMap = _parseOverlays(doc, inputEl);

        // Build/update 10 layers
        while (lc.layers.length < 10) lc.layers.push(lcMakeLayer(lc.layers.length));

        for (let i = 0; i < 10; i++) {
            const l = lc.layers[i];
            const ov = ovMap[i];
            if (ov) {
                l.inputKey = ov.key; l.inputTitle = ov.title;
                if (!l._posSet) { l.x = ov.x; l.y = ov.y; l.w = ov.w; l.h = ov.h; l._posSet = true; }
                l.hidden = false;
            } else {
                l.inputKey = null; l.inputTitle = ''; l.hidden = true;
            }
        }

        lc.layers.sort((a, b) => a.index - b.index);
        if (lc.selectedLayer >= 10) lc.selectedLayer = 0;
    } catch (err) {
        console.warn('lcFetchInputLayers error:', err);
    }
}

// =============================================
// SNAP HELPERS
// =============================================

const LC_SNAP_DEADZONE = 0.02;

function lcSnap(v) {
    const targets = [0, 0.25, 1/3, 0.5, 2/3, 0.75, 1];
    for (const t of targets) { if (Math.abs(v - t) < LC_SNAP_DEADZONE) return t; }
    return v;
}

function lcClamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

// =============================================
// CANVAS RENDER
// =============================================

let _lcDrag = null;

// Render only the canvas (layers + sliders), not the layer list
function lcRenderCanvas() {
    const canvas = document.getElementById('layerCanvas');
    if (!canvas) return;
    const cW = canvas.clientWidth, cH = canvas.clientHeight;
    if (!cW || !cH) return;
    canvas.innerHTML = '';
    _lcRenderBoxes(canvas, STATE.layerControl, cW, cH);
}

// Update visual state of layer list rows without rebuilding DOM
function lcUpdateRowVisuals() {
    const container = document.getElementById('layerList');
    if (!container) return;
    const lc = STATE.layerControl;
    const rows = container.querySelectorAll('.lc-layer-row');
    rows.forEach((row, i) => {
        const l = lc.layers[i];
        if (!l) return;
        const has = !!l.inputKey;
        const sel = i === lc.selectedLayer && has;
        row.className = 'lc-layer-row' + (sel ? ' selected' : '') + (has ? '' : ' empty');
        const num = row.querySelector('.lc-layer-num');
        if (num) num.style.background = has && !l.hidden ? l.color : '#333';
        const check = row.querySelector('.lc-layer-check');
        if (check) { check.checked = !l.hidden || !has; check.disabled = false; }
    });
}

// Full render (canvas + rebuild layer list)
function lcRender() {
    lcRenderCanvas();
    lcRenderLayerList();
}

function _lcRenderBoxes(canvas, lc, cW, cH) {

    lc.layers.forEach((l, i) => {
        if (l.hidden) return;
        const b = lcToCanvas(l, cW, cH);
        const isSel = i === lc.selectedLayer;
        const hasInput = !!l.inputKey;
        const box = document.createElement('div');
        box.className = 'lc-box' + (isSel ? ' selected' : '') + (hasInput ? '' : ' lc-box-empty');
        box.style.cssText = `left:${b.left}px;top:${b.top}px;width:${b.width}px;height:${b.height}px;border-color:${l.color};`;
        box.innerHTML = `<div class="lc-box-bg" style="background:${l.color};"></div>
            <div class="lc-box-inner">
                <div class="lc-box-label">Layer ${l.index + 1}</div>
                <div class="lc-box-sublabel">${l.inputTitle || (hasInput ? '' : 'None')}</div>
            </div>`;

        // Free Mode: drag body → move x,y (w,h frozen)
        box.addEventListener('mousedown', e => {
            if (e.target.classList.contains('lc-handle')) return;
            e.preventDefault(); e.stopPropagation();
            lc.selectedLayer = i;
            const rect = canvas.getBoundingClientRect();
            const mx = (e.clientX - rect.left) / cW;
            const my = (e.clientY - rect.top) / cH;
            _lcDrag = { type: 'free', i, tx: mx - l.x, ty: my - l.y, cW, cH, rect };
        });

        // Drop input from inputs panel
        box.addEventListener('dragover', e => { e.preventDefault(); box.classList.add('lc-drop-target'); });
        box.addEventListener('dragleave', () => box.classList.remove('lc-drop-target'));
        box.addEventListener('drop', e => {
            e.preventDefault(); box.classList.remove('lc-drop-target');
            try {
                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                if (data && data.key) {
                    l.inputKey = data.key;
                    l.inputTitle = data.shortTitle || data.title || '';
                    l.hidden = false;                    lc.selectedLayer = i;
                    lcAssignLayerInput(l.index, data.key);
                    lcRender(); lcSendToVMix(l);
                }
            } catch {}
        });

        // Snap Mode: edge handles → resize neighbors
        if (isSel) {
            ['e', 'w', 'n', 's'].forEach(h => {
                const handle = document.createElement('div');
                handle.className = `lc-handle ${h}`;
                handle.addEventListener('mousedown', e => {
                    e.preventDefault(); e.stopPropagation();
                    let borderVal;
                    if (h === 'e') borderVal = l.x + l.w;
                    else if (h === 'w') borderVal = l.x;
                    else if (h === 's') borderVal = l.y + l.h;
                    else if (h === 'n') borderVal = l.y;
                    _lcDrag = {
                        type: 'snap', h, i,
                        rect: canvas.getBoundingClientRect(), cW, cH,
                        borderVal,
                        orig: lc.layers.map(ll => ({ x: ll.x, y: ll.y, w: ll.w, h: ll.h }))
                    };
                });
                box.appendChild(handle);
            });
        }
        canvas.appendChild(box);
    });

    // Render snap sliders on shared borders (like LayoutDinamico.html)
    canvas.querySelectorAll('.lc-slider').forEach(s => s.remove());
    if (lc.snapEnabled) {
        const visibleLayers = lc.layers.filter(l => !l.hidden && l.inputKey);
        // Find unique vertical borders (x + w) that are shared
        const xEdges = [...new Set(
            visibleLayers.map(l => +((l.x + l.w).toFixed(3)))
                .filter(x => x > 0.01 && x < 0.99)
        )];
        xEdges.forEach(x => {
            const hasLeft = visibleLayers.some(l => Math.abs((l.x + l.w) - x) < 0.005);
            const hasRight = visibleLayers.some(l => Math.abs(l.x - x) < 0.005);
            if (hasLeft && hasRight) {
                const px = Math.round(x * 1920);
                const slider = document.createElement('div');
                slider.className = 'lc-slider';
                slider.style.left = (x * cW - 4) + 'px';
                slider.title = `${px}px`;
                slider.dataset.px = px;
                slider.addEventListener('mousedown', e => {
                    e.preventDefault(); e.stopPropagation();
                    _lcDrag = {
                        type: 'snap', h: 'e', i: lc.selectedLayer,
                        rect: canvas.getBoundingClientRect(), cW, cH,
                        borderVal: x,
                        orig: lc.layers.map(ll => ({ x: ll.x, y: ll.y, w: ll.w, h: ll.h })),
                        sliderEl: slider
                    };
                });
                canvas.appendChild(slider);
            }
        });
        // Find unique horizontal borders
        const yEdges = [...new Set(
            visibleLayers.map(l => +((l.y + l.h).toFixed(3)))
                .filter(y => y > 0.01 && y < 0.99)
        )];
        yEdges.forEach(y => {
            const hasTop = visibleLayers.some(l => Math.abs((l.y + l.h) - y) < 0.005);
            const hasBottom = visibleLayers.some(l => Math.abs(l.y - y) < 0.005);
            if (hasTop && hasBottom) {
                const px = Math.round(y * 1080);
                const slider = document.createElement('div');
                slider.className = 'lc-slider lc-slider-h';
                slider.style.top = (y * cH - 4) + 'px';
                slider.title = `${px}px`;
                slider.dataset.px = px;
                slider.addEventListener('mousedown', e => {
                    e.preventDefault(); e.stopPropagation();
                    _lcDrag = {
                        type: 'snap', h: 's', i: lc.selectedLayer,
                        rect: canvas.getBoundingClientRect(), cW, cH,
                        borderVal: y,
                        orig: lc.layers.map(ll => ({ x: ll.x, y: ll.y, w: ll.w, h: ll.h })),
                        sliderEl: slider
                    };
                });
                canvas.appendChild(slider);
            }
        });
    }

}

// =============================================
// LAYER LIST (10-row panel with dropdowns)
// =============================================

function lcRenderLayerList() {
    const container = document.getElementById('layerList');
    if (!container) return;
    const lc = STATE.layerControl;
    const inst = getActiveInstance();
    const inputs = inst ? inst.inputs || [] : [];
    container.innerHTML = '';

    while (lc.layers.length < 10) lc.layers.push(lcMakeLayer(lc.layers.length));

    for (let i = 0; i < 10; i++) {
        const l = lc.layers[i];
        const has = !!l.inputKey;
        const sel = i === lc.selectedLayer && has;

        const row = document.createElement('div');
        row.className = 'lc-layer-row' + (sel ? ' selected' : '') + (has ? '' : ' empty');

        const num = document.createElement('div');
        num.className = 'lc-layer-num';
        num.style.background = has && !l.hidden ? l.color : '#333';
        num.textContent = i + 1;

        const check = document.createElement('input');
        check.type = 'checkbox';
        check.className = 'lc-layer-check';
        check.id = `lc-check-${i}`;
        check.name = `layer-vis-${i}`;
        check.checked = !l.hidden || !has;
        check.disabled = false;
        check.addEventListener('click', e => e.stopPropagation());
        check.addEventListener('change', () => {
            l.hidden = !check.checked;
            if (l.inputKey) {
                const base = `http://${getActiveInstance()?.host}:${getActiveInstance()?.port}/api`;
                const N = l.index + 1;
                const tk = STATE.layerControl.targetInputKey;
                if (l.hidden) {
                    // Off: turn off checkbox in vMix, flag to prevent sync reactivation
                    l._checkOff = true;
                    fetch(`${base}?Function=MultiViewOverlayOff&Input=${tk}&Value=${N}`).catch(() => {});
                } else {
                    // On: turn on checkbox in vMix
                    l._checkOff = false;
                    fetch(`${base}?Function=MultiViewOverlayOn&Input=${tk}&Value=${N}`).catch(() => {});
                    setTimeout(() => lcSendToVMix(l), 100);
                }
            }
            lcRender();
        });

        const select = document.createElement('select');
        select.className = 'lc-layer-select';
        select.name = `layer-${i}`;
        select.id = `lc-select-${i}`;
        select.innerHTML = '<option value="">None</option>' +
            inputs.filter(inp => inp.key !== lc.targetInputKey)
            .map(inp => `<option value="${inp.key}" ${inp.key === l.inputKey ? 'selected' : ''}>${inp.number} ${inp.shortTitle || inp.title}</option>`).join('');
        select.addEventListener('mousedown', e => e.stopPropagation());
        select.addEventListener('click', e => e.stopPropagation());
        select.addEventListener('wheel', e => {
            e.preventDefault(); e.stopPropagation();
            const dir = e.deltaY > 0 ? 1 : -1;
            const newIdx = Math.max(0, Math.min(select.options.length - 1, select.selectedIndex + dir));
            if (newIdx !== select.selectedIndex) {
                select.selectedIndex = newIdx;
                select.dispatchEvent(new Event('change'));
            }
        }, { passive: false });
        select.addEventListener('change', () => {
            if (!select.value) {
                lcRemoveLayerInput(l.index);
                l.inputKey = null; l.inputTitle = ''; l.hidden = true;            } else {
                const inp = inputs.find(x => x.key === select.value);
                l.inputKey = select.value;
                l.inputTitle = inp ? (inp.shortTitle || inp.title) : '';
                l.hidden = false;
                if (!l._posSet) { l.x = 0; l.y = 0; l.w = 1; l.h = 1; }
                l._posSet = true;
                lcAssignLayerInput(l.index, select.value);
                setTimeout(() => lcSendToVMix(l), 100);
            }
            // Only re-render canvas, don't rebuild layer list (preserves scroll/focus)
            lcRenderCanvas();
            lcUpdateRowVisuals();
        });


        // Drop input onto layer row = assign + select
        row.addEventListener('dragover', e => { e.preventDefault(); row.classList.add('lc-drop-target'); });
        row.addEventListener('dragleave', () => row.classList.remove('lc-drop-target'));
        row.addEventListener('drop', e => {
            e.preventDefault(); row.classList.remove('lc-drop-target');
            try {
                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                if (data && data.key) {
                    l.inputKey = data.key;
                    l.inputTitle = data.shortTitle || data.title || '';
                    l.hidden = false;
                    if (!l._posSet) { l.x = 0; l.y = 0; l.w = 1; l.h = 1; }
                    l._posSet = true;
                    lc.selectedLayer = i;
                    lcAssignLayerInput(l.index, data.key);
                    setTimeout(() => lcSendToVMix(l), 100);
                    lcRender();
                }
            } catch {}
        });

        row.addEventListener('click', () => { if (l.inputKey && !l.hidden) { lc.selectedLayer = i; lcRender(); } });
        row.appendChild(num); row.appendChild(check); row.appendChild(select);
        container.appendChild(row);
    }

    // "Limpar layers" button — only visible when there are hidden layers with input assigned
    const hiddenWithInput = lc.layers.filter(l => l.inputKey && l.hidden);
    if (hiddenWithInput.length > 0) {
        const clearBtn = document.createElement('button');
        clearBtn.className = 'lc-clear-btn';
        clearBtn.textContent = `Limpar layers (${hiddenWithInput.length})`;
        clearBtn.title = `Remove o input atribuído de ${hiddenWithInput.length} layer(s) que estão com o checkbox desligado, liberando o slot para reutilização. As layers ativas não são afetadas.`;
        clearBtn.addEventListener('click', e => {
            e.stopPropagation();
            hiddenWithInput.forEach(l => {
                lcRemoveLayerInput(l.index);
                l.inputKey = null; l.inputTitle = '';
                l.hidden = true;            });
            lcRender();
        });
        container.appendChild(clearBtn);
    }
}

// =============================================
// MOUSE DRAG (SplitView: Free + Snap modes)
// =============================================

document.addEventListener('mousemove', e => {
    if (!_lcDrag) return;
    const lc = STATE.layerControl;
    const { rect, cW, cH } = _lcDrag;
    const mx = lcClamp((e.clientX - rect.left) / cW, 0, 1);
    const my = lcClamp((e.clientY - rect.top) / cH, 0, 1);

    if (_lcDrag.type === 'free') {
        const l = lc.layers[_lcDrag.i];
        let nx = mx - _lcDrag.tx, ny = my - _lcDrag.ty;
        if (lc.snapEnabled) {
            nx = lcSnap(nx); ny = lcSnap(ny);
            const rx = lcSnap(nx + l.w); if (rx !== nx + l.w) nx = rx - l.w;
            const by = lcSnap(ny + l.h); if (by !== ny + l.h) ny = by - l.h;
        }
        l.x = +lcClamp(nx, 0, Math.max(0, 1 - l.w)).toFixed(6);
        l.y = +lcClamp(ny, 0, Math.max(0, 1 - l.h)).toFixed(6);
        lcRender(); lcThrottleSend(l);
        return;
    }

    if (_lcDrag.type === 'snap') {
        const { h, borderVal, orig, sliderEl } = _lcDrag;
        const isH = h === 'e' || h === 'w';
        let nb = lcClamp(isH ? mx : my, 0.01, 0.99);
        if (Math.abs(nb - 0.5) < LC_SNAP_DEADZONE) nb = 0.5;
        if (lc.snapEnabled) nb = lcSnap(nb);
        const EPS = 0.005;

        lc.layers.forEach((l, idx) => {
            if (l.hidden || !l.inputKey) return;
            const o = orig[idx];
            if (isH) {
                if (Math.abs((o.x + o.w) - borderVal) < EPS) l.w = +Math.max(0.01, nb - o.x).toFixed(6);
                if (Math.abs(o.x - borderVal) < EPS) { l.x = +nb.toFixed(6); l.w = +Math.max(0.01, (o.x + o.w) - nb).toFixed(6); }
            } else {
                if (Math.abs((o.y + o.h) - borderVal) < EPS) l.h = +Math.max(0.01, nb - o.y).toFixed(6);
                if (Math.abs(o.y - borderVal) < EPS) { l.y = +nb.toFixed(6); l.h = +Math.max(0.01, (o.y + o.h) - nb).toFixed(6); }
            }
        });

        // Update slider tooltip with pixel position
        if (sliderEl) {
            const px = Math.round(nb * (isH ? 1920 : 1080));
            sliderEl.title = `${px}px`;
            sliderEl.dataset.px = px;
        }
        lcRender();
        lc.layers.forEach(l => { if (!l.hidden && l.inputKey) lcThrottleSend(l); });
        return;
    }
});

document.addEventListener('mouseup', () => {
    if (!_lcDrag) return;
    const lc = STATE.layerControl;
    const type = _lcDrag.type, idx = _lcDrag.i;
    _lcDrag = null;
    lcRender();
    if (type === 'snap') lc.layers.forEach(l => { if (!l.hidden && l.inputKey) lcSendToVMix(l); });
    else { const l = lc.layers[idx]; if (l) lcSendToVMix(l); }
});

// =============================================
// VMIX API DISPATCH
// =============================================

let _lcPendingLayers = new Set(), _lcSyncActive = false;

async function _flushVMix() {
    if (_lcSyncActive || _lcPendingLayers.size === 0) return;
    _lcSyncActive = true;
    const inst = getActiveInstance();
    if (!inst || inst.status !== 'online' || !STATE.layerControl.targetInputKey) {
        _lcSyncActive = false; return;
    }
    const base = `http://${inst.host}:${inst.port}/api`;
    const tk = STATE.layerControl.targetInputKey;
    const layers = Array.from(_lcPendingLayers);
    _lcPendingLayers.clear();

    for (const l of layers) {
        const N = l.index + 1;
        const vm = lcToVMix(l);
        const props = {
            PanX: vm.panX, PanY: vm.panY, Zoom: vm.zoom,
            CropX1: vm.cropX1, CropX2: vm.cropX2,
            CropY1: vm.cropY1, CropY2: vm.cropY2
        };
        for (const [k, v] of Object.entries(props)) {
            try { await fetch(`${base}?Function=SetLayer${N}${k}&Input=${tk}&Value=${v}`); }
            catch {}
        }
    }
    _lcSyncActive = false;
    if (_lcPendingLayers.size > 0) setTimeout(_flushVMix, 10);
}

function lcSendToVMix(layer) {
    if (!layer.inputKey) return;
    _lcPendingLayers.add(layer);
    _flushVMix();
}

function lcThrottleSend(layer) { lcSendToVMix(layer); }

function lcSendAllToVMix() {
    STATE.layerControl.layers.forEach(l => { if (!l.hidden && l.inputKey) lcSendToVMix(l); });
}

function lcAssignLayerInput(layerIndex, sourceKey) {
    const lc = STATE.layerControl;
    const inst = getActiveInstance();
    if (!inst || inst.status !== 'online' || !lc.targetInputKey) return;
    const base = `http://${inst.host}:${inst.port}/api`;
    const N = layerIndex + 1;
    // 1. Assign input to layer slot, 2. Turn on checkbox
    fetch(`${base}?Function=SetMultiViewOverlay&Input=${lc.targetInputKey}&Value=${N},${sourceKey}`)
        .then(() => fetch(`${base}?Function=MultiViewOverlayOn&Input=${lc.targetInputKey}&Value=${N}`))
        .catch(err => console.warn('[vMix] assign error:', err));
}

function lcRemoveLayerInput(layerIndex) {
    const lc = STATE.layerControl;
    const inst = getActiveInstance();
    if (!inst || inst.status !== 'online' || !lc.targetInputKey) return;
    const base = `http://${inst.host}:${inst.port}/api`;
    const N = layerIndex + 1;
    // First turn off visibility, then remove the overlay from the slot
    // SetMultiViewOverlay with Value=N, (comma, no key) removes the overlay entirely
    fetch(`${base}?Function=MultiViewOverlayOff&Input=${lc.targetInputKey}&Value=${N}`)
        .then(() => fetch(`${base}?Function=SetMultiViewOverlay&Input=${lc.targetInputKey}&Value=${N},`))
        .catch(err => console.warn('[vMix] remove error:', err));
}


// =============================================
// BIDIRECTIONAL SYNC (poll vMix every 1s)
// =============================================

const LC_SYNC_MS = 1000;

function lcStartSync() { lcStopSync(); STATE.layerControl._syncTimer = setInterval(lcSyncFromVMix, LC_SYNC_MS); }
function lcStopSync() { if (STATE.layerControl._syncTimer) { clearInterval(STATE.layerControl._syncTimer); STATE.layerControl._syncTimer = null; } }

async function lcSyncFromVMix() {
    if (_lcDrag) return;
    const lc = STATE.layerControl;
    const inst = getActiveInstance();
    if (!inst || inst.status !== 'online' || !lc.targetInputKey || STATE.activeTab !== 'layers') return;

    try {
        const res = await fetch(`http://${inst.host}:${inst.port}/api`, { signal: AbortSignal.timeout(3000) });
        const doc = new DOMParser().parseFromString(await res.text(), 'text/xml');
        const inputEl = Array.from(doc.getElementsByTagName('input')).find(el => el.getAttribute('key') === lc.targetInputKey);
        if (!inputEl) return;

        const ovMap = _parseOverlays(doc, inputEl);
        let changed = false;

        for (let i = 0; i < 10; i++) {
            const l = lc.layers[i];
            if (!l) continue;
            const ov = ovMap[i];

            if (ov) {
                // Overlay exists in vMix
                if (l.inputKey !== ov.key) {
                    l.inputKey = ov.key; l.inputTitle = ov.title;
                    l._posSet = true; l._checkOff = false; changed = true;
                }
                // Only show if user hasn't explicitly turned off checkbox
                if (l.hidden && !l._checkOff) {
                    l.hidden = false; changed = true;
                }
                // Sync position (skip layer being edited)
                if (i !== lc.selectedLayer && !l.hidden) {
                    l.x = ov.x; l.y = ov.y; l.w = ov.w; l.h = ov.h;
                }
            } else {
                // Overlay gone from vMix → hide layer, keep _savedKey
                if (l.inputKey || !l.hidden) {
                    if (l.inputKey) l._savedKey = l.inputKey;
                    l.inputKey = null; l.inputTitle = ''; l.hidden = true;
                    changed = true;
                }
            }
        }

        if (changed) lcRender();
    } catch {}
}
