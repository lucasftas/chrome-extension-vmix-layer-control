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
// COMMAND QUEUE (concurrency-controlled fetch)
// =============================================

const VMixCommandQueue = {
    _queue: [],
    _running: 0,
    _maxConcurrent: 3,
    _delayMs: 50,
    _consecutiveErrors: 0,
    _maxConsecutiveErrors: 5,

    enqueue(url, options) {
        return new Promise(resolve => {
            this._queue.push({ url, options, resolve });
            this._process();
        });
    },

    _process() {
        if (this._running >= this._maxConcurrent || this._queue.length === 0) return;
        this._running++;
        const { url, options, resolve } = this._queue.shift();
        const run = () => {
            fetch(url, options)
                .then(res => {
                    this._consecutiveErrors = 0;
                    resolve(res);
                })
                .catch(err => {
                    this._onError(err);
                    resolve(null);
                })
                .finally(() => {
                    this._running--;
                    if (this._queue.length > 0) {
                        setTimeout(() => this._process(), this._delayMs);
                    }
                });
        };
        if (this._running > 1) {
            setTimeout(run, this._delayMs);
        } else {
            run();
        }
    },

    isBusy() {
        return this._running > 0 || this._queue.length > 0;
    },

    clear() {
        const pending = this._queue.splice(0);
        pending.forEach(item => item.resolve(null));
    },

    _onError(err) {
        this._consecutiveErrors++;
        if (this._consecutiveErrors >= this._maxConsecutiveErrors) {
            showToast('vMix offline — verifique a conexão');
            this._consecutiveErrors = 0;
        }
    }
};

// =============================================
// HELPERS
// =============================================

function lcVMixBase() {
    const inst = getActiveInstance();
    if (!inst || inst.status !== 'online') return null;
    return `http://${inst.host}:${inst.port}/api`;
}

function lcSetDefaultPos(l) {
    l.x = 0; l.y = 0; l.w = 1; l.h = 1; l._posSet = false;
}

function lcActivateAndSend(l, delay = 100) {
    setTimeout(() => lcSendToVMix(l), delay);
}

function lcSetupDropTarget(el, onDrop) {
    el.addEventListener('dragover', e => { e.preventDefault(); el.classList.add('lc-drop-target'); });
    el.addEventListener('dragleave', () => el.classList.remove('lc-drop-target'));
    el.addEventListener('drop', e => { e.preventDefault(); el.classList.remove('lc-drop-target'); onDrop(e); });
}

// =============================================
// LAYER MODEL
// =============================================

function lcMakeOverrides() {
    return {
        panX:   { locked: true, value: null },
        panY:   { locked: true, value: null },
        zoom:   { locked: true, value: null },
        cropX1: { locked: true, value: null },
        cropX2: { locked: true, value: null },
        cropY1: { locked: true, value: null },
        cropY2: { locked: true, value: null }
    };
}

function lcResetOverrides(layer) {
    layer._overrides = lcMakeOverrides();
}

function lcMakeTrim() {
    return { left: 0, right: 0, top: 0, bottom: 0 };
}

function lcMakeLayer(index) {
    return {
        index,
        inputKey: null,
        inputTitle: '',
        color: LC_COLORS[index % LC_COLORS.length],
        trim: lcMakeTrim(),
        x: 0, y: 0, w: 1, h: 1,
        hidden: true,
        _posSet: false,
        _knownState: false,
        _overrides: lcMakeOverrides()
    };
}

// =============================================
// UNDO HISTORY (max 30 steps, in-memory)
// =============================================

const LC_UNDO_MAX = 30;
const _lcHistory = [];
let _lcHistoryIdx = -1;

function lcSnapshotState() {
    return STATE.layerControl.layers.map(l => ({
        index: l.index, inputKey: l.inputKey, inputTitle: l.inputTitle,
        x: l.x, y: l.y, w: l.w, h: l.h,
        trim: { ...l.trim },
        hidden: l.hidden, _knownState: l._knownState, _checkOff: l._checkOff,
        _overrides: JSON.parse(JSON.stringify(l._overrides))
    }));
}

function lcPushUndo(action) {
    if (_lcHistoryIdx < _lcHistory.length - 1) _lcHistory.splice(_lcHistoryIdx + 1);
    _lcHistory.push({
        action,
        time: new Date().toLocaleTimeString('pt-BR'),
        snapshot: lcSnapshotState()
    });
    if (_lcHistory.length > LC_UNDO_MAX) _lcHistory.shift();
    _lcHistoryIdx = _lcHistory.length - 1;
}

function lcUndo() {
    if (_lcHistoryIdx <= 0) { showToast('Nada para desfazer'); return; }
    _lcHistoryIdx--;
    lcRestoreSnapshot(_lcHistory[_lcHistoryIdx]);
    showToast(`Desfeito: ${_lcHistory[_lcHistoryIdx + 1].action}`);
}

function lcRedo() {
    if (_lcHistoryIdx >= _lcHistory.length - 1) { showToast('Nada para refazer'); return; }
    _lcHistoryIdx++;
    lcRestoreSnapshot(_lcHistory[_lcHistoryIdx]);
    showToast(`Refeito: ${_lcHistory[_lcHistoryIdx].action}`);
}

function lcRestoreSnapshot(entry) {
    const lc = STATE.layerControl;
    entry.snapshot.forEach((s, i) => {
        const l = lc.layers[i];
        if (!l) return;
        l.inputKey = s.inputKey; l.inputTitle = s.inputTitle;
        l.x = s.x; l.y = s.y; l.w = s.w; l.h = s.h;
        l.trim = s.trim ? { ...s.trim } : lcMakeTrim();
        l.hidden = s.hidden; l._knownState = s._knownState; l._checkOff = s._checkOff;
        l._overrides = s._overrides ? JSON.parse(JSON.stringify(s._overrides)) : lcMakeOverrides();
        l._posSet = true;
    });
    lcRender();
    // Send to vMix
    const base = lcVMixBase();
    if (!base) return;
    lc.layers.forEach(l => {
        if (l.inputKey) {
            const fn = l.hidden ? 'MultiViewOverlayOff' : 'MultiViewOverlayOn';
            VMixCommandQueue.enqueue(`${base}?Function=${fn}&Input=${lc.targetInputKey}&Value=${l.index + 1}`);
            if (!l.hidden) lcSendToVMix(l);
        }
    });
}

function lcGetHistory() { return _lcHistory; }
function lcGetHistoryIdx() { return _lcHistoryIdx; }

// =============================================
// CORE MATH (SplitView Engine)
// =============================================

// vMix renderer offset compensation (~31px overlap at 1920x1080)
const LC_CROP_OFFSET_X = 0.016; // 31/1920
const LC_CROP_OFFSET_Y = 0.029; // 31/1080

// Normalized (0-1) → vMix API values (pure math, no side effects)
// Pan/Zoom computed from x,y,w,h (geometry stays intact).
// Trim (l.trim) produces ASYMMETRIC crop — hides specific edges without moving content.
function lcToVMix(l) {
    const Z = Math.max(l.w, l.h);
    const panX = (l.x + l.w / 2) * 2 - 1;
    const panY = 1 - (l.y + l.h / 2) * 2;
    const baseCropX = Math.max(0, (Z - l.w) / 2 / Z);
    const baseCropY = Math.max(0, (Z - l.h) / 2 / Z);
    const finalCropX1 = baseCropX + ((l.trim?.left || 0) / Z);
    const finalCropX2 = (1 - baseCropX) - ((l.trim?.right || 0) / Z);
    const finalCropY1 = baseCropY + ((l.trim?.top || 0) / Z);
    const finalCropY2 = (1 - baseCropY) - ((l.trim?.bottom || 0) / Z);
    return {
        panX: +panX.toFixed(6),
        panY: +panY.toFixed(6),
        zoom: +Z.toFixed(6),
        cropX1: +finalCropX1.toFixed(6),
        cropX2: +finalCropX2.toFixed(6),
        cropY1: +finalCropY1.toFixed(6),
        cropY2: +finalCropY2.toFixed(6)
    };
}

// Apply vMix renderer offset (~31px overlap) — only for API dispatch
function lcApplyRendererOffset(vm) {
    return {
        ...vm,
        cropX2: +(vm.cropX2 - (vm.cropX1 > 0.001 ? LC_CROP_OFFSET_X : 0)).toFixed(6),
        cropY2: +(vm.cropY2 - (vm.cropY1 > 0.001 ? LC_CROP_OFFSET_Y : 0)).toFixed(6)
    };
}

// Enforce gapLockY constraint at the model level (call before lcToVMix)
function lcEnforceGapLockY(layer) {
    if (STATE.layerControl.gapLockY && layer.w > layer.h) {
        layer.w = layer.h;
    }
}

// vMix XML values → normalized (0-1)
// Decomposes vMix crop into symmetric base (geometry) + asymmetric trim overlay.
function lcFromVMix(panX, panY, zoom, cropX1, cropY1, cropX2, cropY2) {
    const Z = zoom || 1;
    // Reverse renderer offset if cropX2/cropY2 available
    const cx2 = (cropX2 != null) ? cropX2 + (cropX1 > 0.001 ? LC_CROP_OFFSET_X : 0) : 1 - cropX1;
    const cy2 = (cropY2 != null) ? cropY2 + (cropY1 > 0.001 ? LC_CROP_OFFSET_Y : 0) : 1 - cropY1;
    // Isolate symmetric base crop (the smaller of left/right, top/bottom)
    const baseCropX = Math.min(cropX1, 1 - cx2);
    const baseCropY = Math.min(cropY1, 1 - cy2);
    // Base geometry ignoring trim
    const w = Z * (1 - 2 * baseCropX);
    const h = Z * (1 - 2 * baseCropY);
    // Deduce asymmetric trim extras
    const trimLeft = (cropX1 - baseCropX) * Z;
    const trimRight = ((1 - cx2) - baseCropX) * Z;
    const trimTop = (cropY1 - baseCropY) * Z;
    const trimBottom = ((1 - cy2) - baseCropY) * Z;
    const cx = (panX + 1) / 2;
    const cy = (1 - panY) / 2;
    return {
        x: +(cx - w / 2).toFixed(6),
        y: +(cy - h / 2).toFixed(6),
        w: +Math.max(0.01, w).toFixed(6),
        h: +Math.max(0.01, h).toFixed(6),
        trim: { left: +trimLeft.toFixed(6), right: +trimRight.toFixed(6), top: +trimTop.toFixed(6), bottom: +trimBottom.toFixed(6) }
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
    '333':   [{x:0, y:0, w:0.333, h:1}, {x:0.333, y:0, w:0.334, h:1}, {x:0.667, y:0, w:0.333, h:1}],
    '4grid': [{x:0,y:0,w:0.5,h:0.5}, {x:0.5,y:0,w:0.5,h:0.5}, {x:0,y:0.5,w:0.5,h:0.5}, {x:0.5,y:0.5,w:0.5,h:0.5}]
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
    lcPushUndo(`Preset ${presetId}`);

    // Re-lock all manual overrides and clear trim when applying presets
    lc.layers.forEach(l => { lcResetOverrides(l); l.trim = lcMakeTrim(); });

    let boxes;
    if (presetId === 'auto') {
        // AUTO uses only layers with input
        const withInput = lc.layers.filter(l => l.inputKey);
        if (!withInput.length) { showToast('Nenhuma layer com input'); return; }
        boxes = lcGetAutoBoxes(withInput.length);
        withInput.forEach((l, i) => {
            l.x = boxes[i].x; l.y = boxes[i].y;
            l.w = boxes[i].w; l.h = boxes[i].h;
            lcEnforceGapLockY(l);
            l.hidden = false; l._posSet = true; l._knownState = true; l._checkOff = false;
        });
        // Hide extra layers — turn off checkbox but keep input assigned
        lc.layers.forEach(l => {
            if (!withInput.includes(l)) {
                l.hidden = true; l._knownState = true; l._checkOff = true;
                if (l.inputKey) {
                    const b = lcVMixBase();
                    if (b) VMixCommandQueue.enqueue(`${b}?Function=MultiViewOverlayOff&Input=${lc.targetInputKey}&Value=${l.index + 1}`);
                }
            }
        });
    } else {
        boxes = LC_PRESETS[presetId];
        if (!boxes) return;
        // Apply boxes only to layers that have input (same logic as AUTO)
        const withInput = lc.layers.filter(l => l.inputKey);
        withInput.forEach((l, i) => {
            if (i < boxes.length) {
                l.x = boxes[i].x; l.y = boxes[i].y;
                l.w = boxes[i].w; l.h = boxes[i].h;
                lcEnforceGapLockY(l);
                l.hidden = false; l._posSet = true; l._knownState = true; l._checkOff = false;
            } else {
                l.hidden = true; l._knownState = true; l._checkOff = true;
                const b = lcVMixBase();
                if (b) VMixCommandQueue.enqueue(`${b}?Function=MultiViewOverlayOff&Input=${lc.targetInputKey}&Value=${l.index + 1}`);
            }
        });
        // Also hide layers without input
        lc.layers.forEach(l => {
            if (!l.inputKey) {
                l.hidden = true; l._knownState = true; l._checkOff = true;
            }
        });
    }

    lc.selectedLayer = 0;

    lcRender();
    // Debounce: last-click-wins, then fire all at once
    if (lcApplyPreset._timer) { clearTimeout(lcApplyPreset._timer); }
    lcApplyPreset._busy = true;
    lcApplyPreset._timer = setTimeout(() => {
        const base = lcVMixBase();
        if (!base) return;
        const active = lc.layers.filter(l => !l.hidden && l.inputKey);

        active.forEach(l => {
            VMixCommandQueue.enqueue(`${base}?Function=MultiViewOverlayOn&Input=${lc.targetInputKey}&Value=${l.index + 1}`);
            lcSendToVMix(l);
        });

        setTimeout(() => lcVerifyAndResend(active), 1000);
    }, 300);
}

// Verify sent values against vMix XML, resend mismatches
async function lcVerifyAndResend(expectedLayers, attempt) {
    attempt = attempt || 1;

    const lc = STATE.layerControl;
    const base = lcVMixBase();
    if (!base || !lc.targetInputKey) return;
    try {
        const res = await fetch(base, { signal: AbortSignal.timeout(3000) });
        const doc = new DOMParser().parseFromString(await res.text(), 'text/xml');
        const inputEl = Array.from(doc.getElementsByTagName('input')).find(el => el.getAttribute('key') === lc.targetInputKey);
        if (!inputEl) return;
        const tk = lc.targetInputKey;
        const overlays = Array.from(inputEl.getElementsByTagName('overlay'));
        const T = 0.01;
        let hadMismatch = false;

        for (const l of expectedLayers) {
            const vm = lcApplyRendererOffset(lcToVMix(l));
            const N = l.index + 1;
            const ov = overlays.find(o => parseInt(o.getAttribute('index')) === l.index);
            if (!ov) { lcSendToVMix(l); hadMismatch = true; continue; }

            const posEl = ov.getElementsByTagName('position')[0];
            const cropEl = ov.getElementsByTagName('crop')[0];
            const cur = {
                panX: posEl ? parseFloat(posEl.getAttribute('panX') || '0') : 0,
                panY: posEl ? parseFloat(posEl.getAttribute('panY') || '0') : 0,
                zoom: posEl ? parseFloat(posEl.getAttribute('zoomX') || '1') : 1,
                cropX1: cropEl ? parseFloat(cropEl.getAttribute('X1') || '0') : 0,
                cropX2: cropEl ? parseFloat(cropEl.getAttribute('X2') || '1') : 1,
                cropY1: cropEl ? parseFloat(cropEl.getAttribute('Y1') || '0') : 0,
                cropY2: cropEl ? parseFloat(cropEl.getAttribute('Y2') || '1') : 1
            };

            const mismatches = {};
            if (Math.abs(cur.panX - vm.panX) > T) mismatches.PanX = vm.panX;
            if (Math.abs(cur.panY - vm.panY) > T) mismatches.PanY = vm.panY;
            if (Math.abs(cur.zoom - vm.zoom) > T) mismatches.Zoom = vm.zoom;
            if (Math.abs(cur.cropX1 - vm.cropX1) > T) mismatches.CropX1 = vm.cropX1;
            if (Math.abs(cur.cropX2 - vm.cropX2) > T) mismatches.CropX2 = vm.cropX2;
            if (Math.abs(cur.cropY1 - vm.cropY1) > T) mismatches.CropY1 = vm.cropY1;
            if (Math.abs(cur.cropY2 - vm.cropY2) > T) mismatches.CropY2 = vm.cropY2;

            if (Object.keys(mismatches).length > 0) {
                hadMismatch = true;
                for (const [k, v] of Object.entries(mismatches)) {
                    VMixCommandQueue.enqueue(`${base}?Function=SetLayer${N}${k}&Input=${tk}&Value=${v}`);
                }
            }
        }

        if (hadMismatch && attempt < 2) {
            setTimeout(() => lcVerifyAndResend(expectedLayers, attempt + 1), 800);
        } else {
            lcApplyPreset._busy = false;
            await lcFetchInputLayers();
            lcRenderCanvas();
        }
    } catch {
        lcApplyPreset._busy = false;
    }
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
                lcInitHistory();
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
        const cX2 = cropEl && cropEl.getAttribute('X2') ? parseFloat(cropEl.getAttribute('X2')) : null;
        const cY2 = cropEl && cropEl.getAttribute('Y2') ? parseFloat(cropEl.getAttribute('Y2')) : null;
        const pos = lcFromVMix(panX, panY, zoom, cX1, cY1, cX2, cY2);
        const inp = Array.from(doc.getElementsByTagName('input')).find(el => el.getAttribute('key') === key);
        const title = inp ? (inp.getAttribute('shortTitle') || inp.getAttribute('title') || '') : '';
        map[idx] = { key, title, ...pos };
    });
    return map;
}

async function lcFetchInputLayers() {
    const base = lcVMixBase();
    const lc = STATE.layerControl;
    if (!base || !lc.targetInputKey) return;

    try {
        const res = await fetch(base, { signal: AbortSignal.timeout(5000) });
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
                if (!l._posSet) { l.x = ov.x; l.y = ov.y; l.w = ov.w; l.h = ov.h; l.trim = ov.trim || lcMakeTrim(); l._posSet = true; }
                // Respect _checkOff: don't show layers the user/preset turned off
                if (!l._checkOff) l.hidden = false;
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

// Snap with layer edges: snaps to grid + edges/centers of other visible layers
function lcSnapToLayers(v, excludeIdx, axis) {
    const lc = STATE.layerControl;
    // Start with grid targets
    const targets = [0, 0.25, 1/3, 0.5, 2/3, 0.75, 1];
    // Add edges and centers of other visible layers
    lc.layers.forEach((l, i) => {
        if (i === excludeIdx || l.hidden || !l.inputKey) return;
        if (axis === 'x') {
            targets.push(l.x, l.x + l.w, l.x + l.w / 2); // left, right, centerX
        } else {
            targets.push(l.y, l.y + l.h, l.y + l.h / 2); // top, bottom, centerY
        }
    });
    let best = v;
    let bestDist = LC_SNAP_DEADZONE;
    for (const t of targets) {
        const d = Math.abs(v - t);
        if (d < bestDist) { bestDist = d; best = t; }
    }
    return best;
}

function lcClamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

// =============================================
// CANVAS RENDER
// =============================================

let _lcDrag = null;

// Fit canvas 16:9 inside wrapper with minimum margin
const LC_CANVAS_MARGIN = 20;

function lcFitCanvas() {
    const wrapper = document.querySelector('.layer-canvas-wrapper');
    const canvas = document.getElementById('layerCanvas');
    if (!wrapper || !canvas) return;
    const wW = wrapper.clientWidth;
    const wH = wrapper.clientHeight;
    if (!wW || !wH) return;
    const availW = wW - LC_CANVAS_MARGIN * 2;
    const availH = wH - LC_CANVAS_MARGIN * 2;
    let cW, cH;
    if (availW / availH > 16 / 9) {
        // Height limited
        cH = availH;
        cW = cH * 16 / 9;
    } else {
        // Width limited
        cW = availW;
        cH = cW * 9 / 16;
    }
    cW = Math.max(1, Math.round(cW));
    cH = Math.max(1, Math.round(cH));
    canvas.style.width = cW + 'px';
    canvas.style.height = cH + 'px';
    canvas.style.left = Math.round((wW - cW) / 2) + 'px';
    canvas.style.top = Math.round((wH - cH) / 2) + 'px';
    return { cW, cH };
}

// Re-fit canvas on resize
let _lcResizeObserver = null;
function lcStartResizeObserver() {
    if (_lcResizeObserver) return;
    const wrapper = document.querySelector('.layer-canvas-wrapper');
    if (!wrapper) return;
    _lcResizeObserver = new ResizeObserver(() => {
        if (STATE.activeTab === 'layers') lcRenderCanvas();
    });
    _lcResizeObserver.observe(wrapper);
}

// Keyboard shortcuts for undo/redo
document.addEventListener('keydown', e => {
    if (STATE.activeTab !== 'layers') return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;
    if (e.ctrlKey && !e.shiftKey && e.key === 'z') { e.preventDefault(); lcUndo(); }
    if (e.ctrlKey && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) { e.preventDefault(); lcRedo(); }
});

// Welcome message when no target selected
function lcShowWelcome() {
    const canvas = document.getElementById('layerCanvas');
    if (!canvas) return;
    lcFitCanvas();
    canvas.innerHTML = `<div class="lc-welcome">
        <div class="lc-welcome-icon">${getIcon('layers')}</div>
        <div class="lc-welcome-title">Live MultiLayer Editor</div>
        <div class="lc-welcome-sub">Selecione um input abaixo para começar</div>
    </div>`;
}

// Save initial state when target is selected
function lcInitHistory() {
    if (_lcHistory.length === 0) lcPushUndo('Estado inicial');
}

// Render only the canvas (layers + sliders), not the layer list
function lcRenderCanvas() {
    const canvas = document.getElementById('layerCanvas');
    if (!canvas) return;
    const fit = lcFitCanvas();
    if (!fit) return;
    canvas.innerHTML = '';
    _lcRenderBoxes(canvas, STATE.layerControl, fit.cW, fit.cH);
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
        if (check) {
            check.indeterminate = !l._knownState;
            check.checked = l._knownState ? !l.hidden : false;
            check.disabled = false;
        }
    });
}

// Full render (canvas + rebuild layer list + properties panel)
function lcRender() {
    lcRenderCanvas();
    lcRenderLayerList();
    lcRenderPropsPanel();
}

function _lcRenderBoxes(canvas, lc, cW, cH) {

    // Gap visual: half-gap inset per edge (full gap between two adjacent layers)
    const halfGapX = (lcGetGapH() / 2 / 1920) * cW;
    const halfGapY = STATE.layerControl.gapLockY ? 0 : (lcGetGapV() / 2 / 1080) * cH;

    lc.layers.forEach((l, i) => {
        if (l.hidden) return;
        const b = lcToCanvas(l, cW, cH);
        // Apply gap inset: shrink each edge by half-gap, but not at canvas borders (0 or 1)
        const insetL = l.x > 0.001 ? halfGapX : 0;
        const insetR = (l.x + l.w) < 0.999 ? halfGapX : 0;
        const insetT = l.y > 0.001 ? halfGapY : 0;
        const insetB = (l.y + l.h) < 0.999 ? halfGapY : 0;
        const isSel = i === lc.selectedLayer;
        const hasInput = !!l.inputKey;
        const box = document.createElement('div');
        box.className = 'lc-box' + (isSel ? ' selected' : '') + (hasInput ? '' : ' lc-box-empty');
        box.style.cssText = `left:${b.left + insetL}px;top:${b.top + insetT}px;width:${b.width - insetL - insetR}px;height:${b.height - insetT - insetB}px;border-color:${l.color};`;
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
        lcSetupDropTarget(box, e => {
            try {
                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                if (data && data.key) {
                    l.inputKey = data.key;
                    l.inputTitle = data.shortTitle || data.title || '';
                    l.hidden = false; l._knownState = true; l._checkOff = false;
                    lc.selectedLayer = i;
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
        // Indeterminate (—): state unknown from vMix until first interaction
        check.indeterminate = !l._knownState;
        check.checked = l._knownState ? !l.hidden : false;
        check.disabled = false;
        check.addEventListener('click', e => e.stopPropagation());
        check.addEventListener('change', () => {
            const base = lcVMixBase();
            if (!base) return;
            lcPushUndo(`Checkbox L${l.index + 1}`);
            const N = l.index + 1;
            const tk = STATE.layerControl.targetInputKey;

            if (!l._knownState) {
                // First click on indeterminate → turn ON
                l._knownState = true;
                l._checkOff = false;
                l.hidden = false;
                VMixCommandQueue.enqueue(`${base}?Function=MultiViewOverlayOn&Input=${tk}&Value=${N}`);
                if (l.inputKey) lcActivateAndSend(l);
            } else {
                l.hidden = !check.checked;
                if (l.hidden) {
                    l._checkOff = true;
                    VMixCommandQueue.enqueue(`${base}?Function=MultiViewOverlayOff&Input=${tk}&Value=${N}`);
                } else {
                    l._checkOff = false;
                    VMixCommandQueue.enqueue(`${base}?Function=MultiViewOverlayOn&Input=${tk}&Value=${N}`);
                    lcActivateAndSend(l);
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
            lcPushUndo(`Input L${l.index + 1}`);
            if (!select.value) {
                lcRemoveLayerInput(l.index);
                l.inputKey = null; l.inputTitle = ''; l.hidden = true;
            } else {
                const inp = inputs.find(x => x.key === select.value);
                l.inputKey = select.value;
                l.inputTitle = inp ? (inp.shortTitle || inp.title) : '';
                l.hidden = false; l._knownState = true; l._checkOff = false;
                if (!l._posSet) lcSetDefaultPos(l);
                l._posSet = true;
                lcAssignLayerInput(l.index, select.value);
                lcActivateAndSend(l);
            }
            // Only re-render canvas, don't rebuild layer list (preserves scroll/focus)
            lcRenderCanvas();
            lcUpdateRowVisuals();
        });
        // Drop input onto layer row = assign + select
        lcSetupDropTarget(row, e => {
            try {
                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                if (data && data.key) {
                    l.inputKey = data.key;
                    l.inputTitle = data.shortTitle || data.title || '';
                    l.hidden = false; l._knownState = true; l._checkOff = false;
                    if (!l._posSet) lcSetDefaultPos(l);
                    l._posSet = true;
                    lc.selectedLayer = i;
                    lcAssignLayerInput(l.index, data.key);
                    lcActivateAndSend(l);
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
            lcPushUndo('Limpar layers');
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
// PROPERTIES PANEL (manual vMix-style adjustments)
// =============================================

const LC_PROPS_FIELDS = [
    { key: 'zoom',   label: 'Zoom' },
    { key: 'panX',   label: 'Pan X' },
    { key: 'panY',   label: 'Pan Y' },
    { key: 'cropX1', label: 'Crop X1' },
    { key: 'cropX2', label: 'Crop X2' },
    { key: 'cropY1', label: 'Crop Y1' },
    { key: 'cropY2', label: 'Crop Y2' }
];

function lcRenderPropsPanel() {
    const panel = document.getElementById('lcPropsPanel');
    if (!panel) return;

    const lc = STATE.layerControl;
    const selIdx = lc.selectedLayer;
    const layer = lc.layers[selIdx];
    if (!layer) { panel.innerHTML = ''; return; }

    const vm = lcToVMix(layer);

    // Build dropdown
    let html = '<div class="lc-props-header">';
    html += '<select id="lcPropsLayerSelect" class="lc-props-select">';
    for (let i = 0; i < 10; i++) {
        const l = lc.layers[i];
        const label = `${i + 1}${l.inputTitle ? ' — ' + l.inputTitle : ''}`;
        html += `<option value="${i}"${i === selIdx ? ' selected' : ''}>${label}</option>`;
    }
    html += '</select></div>';

    // Build field rows
    html += '<div class="lc-props-fields">';
    LC_PROPS_FIELDS.forEach(f => {
        const ov = layer._overrides[f.key];
        const locked = ov.locked;
        const displayVal = locked ? (vm[f.key] ?? 0) : (ov.value ?? 0);
        const roundedVal = typeof displayVal === 'number' ? +displayVal.toFixed(4) : displayVal;

        html += `<div class="lc-props-row">`;
        html += `<span class="lc-props-label">${f.label}</span>`;
        html += `<input type="number" class="lc-props-input" data-field="${f.key}" value="${roundedVal}" step="0.001" ${locked ? 'readonly' : ''}>`;
        html += `<button class="lc-props-lock${locked ? '' : ' unlocked'}" data-field="${f.key}" title="${locked ? 'Destrancar para edição manual' : 'Trancar (usar valor automático)'}">${locked ? '🔒' : '🔓'}</button>`;
        html += `<button class="lc-props-reset${locked ? ' hidden' : ''}" data-field="${f.key}" title="Resetar para valor automático">↺</button>`;
        html += `</div>`;
    });
    html += '</div>';

    panel.innerHTML = html;

    // Wire events — dropdown
    document.getElementById('lcPropsLayerSelect')?.addEventListener('change', e => {
        lc.selectedLayer = parseInt(e.target.value);
        lcRender();
    });

    // Wire events — lock toggles
    panel.querySelectorAll('.lc-props-lock').forEach(btn => {
        btn.addEventListener('click', () => {
            const field = btn.dataset.field;
            const ov = layer._overrides[field];
            if (ov.locked) {
                // Unlock: copy computed value as starting point
                ov.locked = false;
                ov.value = vm[field] ?? 0;
            } else {
                // Re-lock: clear manual value
                ov.locked = true;
                ov.value = null;
                lcSendToVMix(layer);
            }
            lcRenderPropsPanel();
        });
    });

    // Wire events — number inputs
    panel.querySelectorAll('.lc-props-input').forEach(input => {
        input.addEventListener('change', () => {
            const field = input.dataset.field;
            const ov = layer._overrides[field];
            if (ov.locked) return;
            ov.value = parseFloat(input.value) || 0;
            lcSendToVMix(layer);
        });
    });

    // Wire events — reset buttons
    panel.querySelectorAll('.lc-props-reset').forEach(btn => {
        btn.addEventListener('click', () => {
            const field = btn.dataset.field;
            const ov = layer._overrides[field];
            ov.locked = true;
            ov.value = null;
            lcSendToVMix(layer);
            lcRenderPropsPanel();
        });
    });
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
            // Snap all 3 reference points per axis (left/center/right, top/center/bottom)
            const idx = _lcDrag.i;
            const snapL = lcSnapToLayers(nx, idx, 'x');
            const snapCX = lcSnapToLayers(nx + l.w / 2, idx, 'x');
            const snapR = lcSnapToLayers(nx + l.w, idx, 'x');
            // Pick the closest snap
            const dL = Math.abs(snapL - nx), dCX = Math.abs(snapCX - (nx + l.w / 2)), dR = Math.abs(snapR - (nx + l.w));
            if (dL <= dCX && dL <= dR) nx = snapL;
            else if (dCX <= dR) nx = snapCX - l.w / 2;
            else nx = snapR - l.w;

            const snapT = lcSnapToLayers(ny, idx, 'y');
            const snapCY = lcSnapToLayers(ny + l.h / 2, idx, 'y');
            const snapB = lcSnapToLayers(ny + l.h, idx, 'y');
            const dT = Math.abs(snapT - ny), dCY = Math.abs(snapCY - (ny + l.h / 2)), dB = Math.abs(snapB - (ny + l.h));
            if (dT <= dCY && dT <= dB) ny = snapT;
            else if (dCY <= dB) ny = snapCY - l.h / 2;
            else ny = snapB - l.h;
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
                // Lock Y: cap w to h so canvas matches vMix (Z = h when w > h)
                lcEnforceGapLockY(l);
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
    lcPushUndo(type === 'snap' ? 'Resize layer' : 'Mover layer');
    lcRender();
    if (type === 'snap') lc.layers.forEach(l => { if (!l.hidden && l.inputKey) lcSendToVMix(l); });
    else { const l = lc.layers[idx]; if (l) lcSendToVMix(l); }
});

// =============================================
// VMIX API DISPATCH
// =============================================

function lcSendToVMix(layer) {
    if (!layer.inputKey) return;
    const lc = STATE.layerControl;
    const base = lcVMixBase();
    if (!base || !lc.targetInputKey) return;
    const N = layer.index + 1;
    const tk = lc.targetInputKey;
    let vm = lcToVMix(layer);
    // Apply manual overrides (unlocked fields)
    const ov = layer._overrides;
    if (ov) {
        for (const f of ['panX','panY','zoom','cropX1','cropX2','cropY1','cropY2']) {
            if (!ov[f].locked && ov[f].value !== null) vm[f] = ov[f].value;
        }
    }
    // Apply renderer offset LAST (only for API dispatch, not for model)
    vm = lcApplyRendererOffset(vm);
    // Fire-and-forget: all 7 commands in parallel (Companion style)
    VMixCommandQueue.enqueue(`${base}?Function=SetLayer${N}PanX&Input=${tk}&Value=${vm.panX}`);
    VMixCommandQueue.enqueue(`${base}?Function=SetLayer${N}PanY&Input=${tk}&Value=${vm.panY}`);
    VMixCommandQueue.enqueue(`${base}?Function=SetLayer${N}Zoom&Input=${tk}&Value=${vm.zoom}`);
    VMixCommandQueue.enqueue(`${base}?Function=SetLayer${N}CropX1&Input=${tk}&Value=${vm.cropX1}`);
    VMixCommandQueue.enqueue(`${base}?Function=SetLayer${N}CropX2&Input=${tk}&Value=${vm.cropX2}`);
    VMixCommandQueue.enqueue(`${base}?Function=SetLayer${N}CropY1&Input=${tk}&Value=${vm.cropY1}`);
    VMixCommandQueue.enqueue(`${base}?Function=SetLayer${N}CropY2&Input=${tk}&Value=${vm.cropY2}`);
}

let _lcThrottleTimer = null;
function lcThrottleSend(layer) {
    if (_lcThrottleTimer) return;
    _lcThrottleTimer = setTimeout(() => { _lcThrottleTimer = null; }, 33);
    lcSendToVMix(layer);
}

function lcSendAllToVMix() {
    STATE.layerControl.layers.forEach(l => { if (!l.hidden && l.inputKey) lcSendToVMix(l); });
}

// Sync bidirecional (estilo X-Air)
async function lcPullFromVMix() {
    STATE.layerControl.layers.forEach(l => { l._posSet = false; });
    await lcFetchInputLayers();
    lcRender();
    showToast('Canvas atualizado do vMix');
}

function lcPushToVMix() {
    lcSendAllToVMix();
    showToast('Canvas enviado ao vMix');
}

// Reset Crop Y — restaura todas as layers ativas para altura total
function lcResetCropY() {
    const lc = STATE.layerControl;
    const active = lc.layers.filter(l => !l.hidden && l.inputKey);
    if (!active.length) { showToast('Nenhuma layer ativa'); return; }
    lcPushUndo('Reset Y');
    active.forEach(l => {
        l.y = 0;
        l.h = 1;
        l._posSet = true;
    });
    lcRender();
    active.forEach(l => lcSendToVMix(l));
    showToast('Crop Y resetado');
}

// =============================================
// ALIGNMENT FUNCTIONS
// =============================================

function _lcGetActive() {
    return STATE.layerControl.layers.filter(l => !l.hidden && l.inputKey);
}

// Align to canvas (artboard): always uses canvas bounds (0-1) as reference
// Applies to the selected layer only

function _lcAlignApply(layer, action) {
    lcPushUndo(action);
    layer._posSet = true;
    lcRender();
    lcSendToVMix(layer);
    showToast(action);
}

function _lcGetSel() {
    const lc = STATE.layerControl;
    const l = lc.layers[lc.selectedLayer];
    return (l && !l.hidden && l.inputKey) ? l : null;
}

function lcAlignLeft() {
    const l = _lcGetSel(); if (!l) return;
    l.x = 0;
    _lcAlignApply(l, 'Alinhar esquerda');
}

function lcAlignRight() {
    const l = _lcGetSel(); if (!l) return;
    l.x = +(1 - l.w).toFixed(6);
    _lcAlignApply(l, 'Alinhar direita');
}

function lcAlignCenterH() {
    const l = _lcGetSel(); if (!l) return;
    l.x = +(0.5 - l.w / 2).toFixed(6);
    _lcAlignApply(l, 'Alinhar centro H');
}

function lcAlignTop() {
    const l = _lcGetSel(); if (!l) return;
    l.y = 0;
    _lcAlignApply(l, 'Alinhar topo');
}

function lcAlignBottom() {
    const l = _lcGetSel(); if (!l) return;
    l.y = +(1 - l.h).toFixed(6);
    _lcAlignApply(l, 'Alinhar base');
}

function lcAlignCenterV() {
    const l = _lcGetSel(); if (!l) return;
    l.y = +(0.5 - l.h / 2).toFixed(6);
    _lcAlignApply(l, 'Alinhar centro V');
}

// Trim layers: read vMix XML, crop what exceeds canvas, send crop-only updates
// PanX/PanY/Zoom don't change — only CropX1/X2/Y1/Y2 are adjusted
// vMix renderer expands each crop edge ~15.5px (31px total gap needed between layers)
function lcGetGapH() { return STATE.layerControl.rendererGapH ?? 31; }
function lcGetGapV() { return STATE.layerControl.rendererGapV ?? 31; }

// Apply gap between layers using normalized coordinates (0-1)
// Works within the SplitView model: adjusts x, y, w, h then sends via lcSendToVMix
function lcApplyGap() {
    const lc = STATE.layerControl;
    if (!lc.targetInputKey) { showToast('Sem input selecionado'); return; }

    const active = lc.layers.filter(l => !l.hidden && l.inputKey);
    if (active.length < 2) { showToast('Precisa de pelo menos 2 layers ativas'); return; }

    lcPushUndo('Aplicar gap');

    const gapH = lcGetGapH() / 1920; // normalize to 0-1
    const gapV = lcGetGapV() / 1080;
    let changedCount = 0;

    // For each pair, determine axis and enforce gap
    for (let i = 0; i < active.length; i++) {
        for (let j = i + 1; j < active.length; j++) {
            const a = active[i], b = active[j];
            const aCX = a.x + a.w / 2, aCY = a.y + a.h / 2;
            const bCX = b.x + b.w / 2, bCY = b.y + b.h / 2;

            // Determine primary axis (normalized for 16:9)
            const distH = Math.abs(aCX - bCX);
            const distV = Math.abs(aCY - bCY) * (1920 / 1080);

            if (distH >= distV) {
                // Horizontal pair — check Y overlap first
                const yOverlap = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
                if (yOverlap <= 0) continue;

                const left = aCX <= bCX ? a : b;
                const right = left === a ? b : a;
                const currentGap = right.x - (left.x + left.w);
                const diff = currentGap - gapH;

                if (Math.abs(diff) > 0.001) {
                    const half = diff / 2;
                    left.w = +(left.w + half).toFixed(6);
                    right.x = +(right.x - half).toFixed(6);
                    right.w = +(right.w + half).toFixed(6);
                    lcEnforceGapLockY(left);
                    lcEnforceGapLockY(right);
                    left._posSet = true; right._posSet = true;
                    changedCount++;
                }
            } else {
                // Vertical pair — skip if Y is locked
                if (lc.gapLockY) continue;
                const xOverlap = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
                if (xOverlap <= 0) continue;

                const top = aCY <= bCY ? a : b;
                const bot = top === a ? b : a;
                const currentGap = bot.y - (top.y + top.h);
                const diff = currentGap - gapV;

                if (Math.abs(diff) > 0.001) {
                    const half = diff / 2;
                    top.h = +(top.h + half).toFixed(6);
                    bot.y = +(bot.y - half).toFixed(6);
                    bot.h = +(bot.h + half).toFixed(6);
                    top._posSet = true; bot._posSet = true;
                    changedCount++;
                }
            }
        }
    }

    if (changedCount > 0) {
        lcRender();
        active.forEach(l => lcSendToVMix(l));
        showToast(`Gap aplicado em ${changedCount} par(es)`);
    } else {
        showToast('Gap já está no valor desejado');
    }
}

// =============================================
// TRIM HELPERS (normalized 0-1 space)
// =============================================

// Visible rect = base geometry minus current trim
function lcVisibleRect(l) {
    const t = l.trim || { left: 0, right: 0, top: 0, bottom: 0 };
    return {
        x: l.x + t.left,
        y: l.y + t.top,
        w: l.w - t.left - t.right,
        h: l.h - t.top - t.bottom
    };
}

function lcIntersect(a, b) {
    const va = lcVisibleRect(a), vb = lcVisibleRect(b);
    const intL = Math.max(va.x, vb.x);
    const intR = Math.min(va.x + va.w, vb.x + vb.w);
    const intT = Math.max(va.y, vb.y);
    const intB = Math.min(va.y + va.h, vb.y + vb.h);
    if (intL >= intR || intT >= intB) return null;
    return { x: intL, y: intT, w: intR - intL, h: intB - intT };
}

function lcClampToCanvas(l) {
    if (l.x < 0) l.trim.left = Math.max(l.trim.left || 0, -l.x);
    if (l.y < 0) l.trim.top = Math.max(l.trim.top || 0, -l.y);
    if (l.x + l.w > 1) l.trim.right = Math.max(l.trim.right || 0, (l.x + l.w) - 1);
    if (l.y + l.h > 1) l.trim.bottom = Math.max(l.trim.bottom || 0, (l.y + l.h) - 1);
}

function lcClassifyOverlap(top, bottom) {
    const inter = lcIntersect(top, bottom);
    if (!inter) return { type: 'none', inter: null };
    const vb = lcVisibleRect(bottom);
    const EPS = 0.005;
    const fullW = inter.w >= vb.w - EPS;
    const fullH = inter.h >= vb.h - EPS;
    if (fullW && fullH) return { type: 'total', inter };
    if (fullW) return { type: 'fullW', inter };
    if (fullH) return { type: 'fullH', inter };
    return { type: 'corner', inter };
}

function lcAutoTrimAxis(bottom, inter, axis) {
    const vb = lcVisibleRect(bottom);
    const EPS = 0.005;
    if (axis === 'x') {
        if (inter.x <= vb.x + EPS) {
            // Overlap on left of visible area → increase left trim
            bottom.trim.left = Math.max(bottom.trim.left || 0, (inter.x + inter.w) - bottom.x);
        } else {
            // Overlap on right of visible area → increase right trim
            bottom.trim.right = Math.max(bottom.trim.right || 0, (bottom.x + bottom.w) - inter.x);
        }
    } else {
        if (inter.y <= vb.y + EPS) {
            bottom.trim.top = Math.max(bottom.trim.top || 0, (inter.y + inter.h) - bottom.y);
        } else {
            bottom.trim.bottom = Math.max(bottom.trim.bottom || 0, (bottom.y + bottom.h) - inter.y);
        }
    }
}

function lcShowTrimConflict(topLayer, bottomLayer, inter, topIdx, botIdx) {
    return new Promise(resolve => {
        const S = 160, SH = 90;
        const topColor = topLayer.color || '#6366f1';
        const botColor = bottomLayer.color || '#f59e0b';

        const svgRect = (x, y, w, h, fill, op, stroke) =>
            `<rect x="${(x*S).toFixed(1)}" y="${(y*SH).toFixed(1)}" width="${(w*S).toFixed(1)}" height="${(h*SH).toFixed(1)}" fill="${fill}" opacity="${op}" stroke="${stroke || 'none'}" stroke-width="1"/>`;
        const svgLabel = (x, y, text, color) =>
            `<text x="${(x*S).toFixed(1)}" y="${(y*SH).toFixed(1)}" fill="${color}" font-size="9" font-weight="700" font-family="sans-serif">${text}</text>`;

        const svg = `<svg class="lc-trim-preview" viewBox="0 0 ${S} ${SH}" xmlns="http://www.w3.org/2000/svg">
            <rect x="0" y="0" width="${S}" height="${SH}" fill="#12121a" rx="4"/>
            ${svgRect(bottomLayer.x, bottomLayer.y, bottomLayer.w, bottomLayer.h, botColor, 0.35, botColor)}
            ${svgRect(topLayer.x, topLayer.y, topLayer.w, topLayer.h, topColor, 0.5, topColor)}
            ${svgRect(inter.x, inter.y, inter.w, inter.h, '#ef4444', 0.4, '#ef4444')}
            ${svgLabel(bottomLayer.x + 0.01, bottomLayer.y + 0.15, 'L' + (botIdx + 1), botColor)}
            ${svgLabel(topLayer.x + 0.01, topLayer.y + 0.15, 'L' + (topIdx + 1), topColor)}
        </svg>`;

        const html = `
            <div class="modal-header">
                <div class="modal-title">Conflito de Sobreposição</div>
                <div class="modal-sub">Layer ${topIdx + 1} (topo) sobrepõe Layer ${botIdx + 1} em quina</div>
            </div>
            <div class="modal-body" style="text-align:center;">
                <p style="margin:0 0 8px;font-size:12px;color:#666;">O vMix só aceita cortes retangulares. A sobreposição forma um "L".</p>
                ${svg}
                <p style="margin:8px 0 0;font-size:12px;color:#888;">Aparar a <strong style="color:${botColor}">Layer ${botIdx + 1}</strong> em qual eixo?</p>
            </div>
            <div class="modal-footer">
                <button id="trimSkip" class="modal-btn-cancel">Pular</button>
                <button id="trimAxisX" class="modal-btn-ok">Aparar em X ↔</button>
                <button id="trimAxisY" class="modal-btn-ok">Aparar em Y ↕</button>
            </div>`;

        showModal(html, card => {
            card.querySelector('#trimAxisX').addEventListener('click', () => { closeModal(); resolve('x'); });
            card.querySelector('#trimAxisY').addEventListener('click', () => { closeModal(); resolve('y'); });
            card.querySelector('#trimSkip').addEventListener('click', () => { closeModal(); resolve('skip'); });
        });
    });
}

// =============================================
// TRIM LAYERS (Assisted Trim with Z-Index)
// =============================================

async function lcTrimLayers() {
    const lc = STATE.layerControl;
    const base = lcVMixBase();
    if (!base || !lc.targetInputKey) {
        showToast('Sem instância conectada ou input selecionado');
        return;
    }
    lcPushUndo('Aparar');

    try {
        // Step 1: Fetch & parse into normalized space via lcFromVMix
        const res = await fetch(base, { signal: AbortSignal.timeout(5000) });
        const doc = new DOMParser().parseFromString(await res.text(), 'text/xml');
        const inputEl = Array.from(doc.getElementsByTagName('input')).find(el => el.getAttribute('key') === lc.targetInputKey);
        if (!inputEl) return;

        const ovMap = _parseOverlays(doc, inputEl);
        const layers = [];
        for (let i = 0; i < 10; i++) {
            const l = lc.layers[i];
            if (!l || !l.inputKey || l.hidden) continue;
            const ov = ovMap[i];
            const src = ov || l;
            // Keep trim from lcFromVMix as baseline (respects existing vMix crops)
            const baseTrim = src.trim ? { ...src.trim } : lcMakeTrim();
            layers.push({
                idx: i, x: src.x, y: src.y, w: src.w, h: src.h,
                color: l.color, changed: false, hidden: false,
                trim: baseTrim
            });
            // Reset model trim (avoid sticky state from previous runs)
            l.trim = lcMakeTrim();
        }

        if (layers.length === 0) { showToast('Nenhuma layer ativa'); return; }

        // Step 2: Sort by Z-index DESC (higher index = on top visually)
        layers.sort((a, b) => b.idx - a.idx);

        // Step 3: Auto-Trim Canvas — accumulate trim for overflows
        for (const l of layers) {
            const t0 = JSON.stringify(l.trim);
            lcClampToCanvas(l);
            if (JSON.stringify(l.trim) !== t0) l.changed = true;
        }

        // Step 4: Occlusion loop (top over bottom)
        const pendingConflicts = [];
        for (let t = 0; t < layers.length; t++) {
            const top = layers[t];
            if (top.hidden) continue;
            for (let b = t + 1; b < layers.length; b++) {
                const bottom = layers[b];
                if (bottom.hidden) continue;

                const { type, inter } = lcClassifyOverlap(top, bottom);
                if (type === 'none') continue;

                if (type === 'total') {
                    bottom.hidden = true;
                    bottom.changed = true;
                } else if (type === 'fullW') {
                    lcAutoTrimAxis(bottom, inter, 'y');
                    bottom.changed = true;
                } else if (type === 'fullH') {
                    lcAutoTrimAxis(bottom, inter, 'x');
                    bottom.changed = true;
                } else {
                    pendingConflicts.push({ topIdx: top.idx, botIdx: bottom.idx, top, bottom, inter });
                }
            }
        }

        // Step 5: Apply trim to model and send (x/y/w/h stay intact, only trim changes)
        let changedCount = 0;
        for (const l of layers) {
            if (!l.changed) continue;
            changedCount++;
            const ml = lc.layers[l.idx];
            if (l.hidden) {
                ml.hidden = true; ml._knownState = true; ml._checkOff = true;
                VMixCommandQueue.enqueue(`${base}?Function=MultiViewOverlayOff&Input=${lc.targetInputKey}&Value=${l.idx + 1}`);
            } else {
                ml.trim = { ...l.trim };
                lcSendToVMix(ml);
            }
        }

        lcRender();

        // Step 6: Sequential modal for corner/L conflicts
        for (const conflict of pendingConflicts) {
            const { top, bottom, inter, topIdx, botIdx } = conflict;
            const choice = await lcShowTrimConflict(top, bottom, inter, topIdx, botIdx);
            if (choice === 'skip') continue;

            lcAutoTrimAxis(bottom, inter, choice);
            const ml = lc.layers[bottom.idx];
            ml.trim = { ...bottom.trim };
            lcSendToVMix(ml);
            changedCount++;
            lcRender();
        }

        // Step 7: Refresh from vMix
        await lcFetchInputLayers();
        lcRender();
        showToast(changedCount > 0 ? `${changedCount} layer(s) aparada(s)` : 'Nenhuma layer precisou de ajuste');
    } catch (err) {
        console.error('lcTrimLayers error:', err);
        showToast('Erro ao aparar: ' + err.message);
    }
}

// Sync all 10 layers: turn ON all checkboxes in vMix and app
function lcSyncAllLayers() {
    const lc = STATE.layerControl;
    const base = lcVMixBase();
    if (!base || !lc.targetInputKey) return;
    const tk = lc.targetInputKey;
    for (let i = 0; i < 10; i++) {
        const l = lc.layers[i];
        l._knownState = true;
        l._checkOff = false;
        l.hidden = false;
        VMixCommandQueue.enqueue(`${base}?Function=MultiViewOverlayOn&Input=${tk}&Value=${i + 1}`);
    }
    lcRender();
}

function lcSwapInputs() {
    const lc = STATE.layerControl;
    if (!lcVMixBase() || !lc.targetInputKey) return;
    const active = lc.layers.filter(l => l.inputKey && !l.hidden);
    if (active.length < 2) { showToast('Mínimo 2 layers para inverter'); return; }
    lcPushUndo('Inverter');
    const positions = active.map(l => ({ x: l.x, y: l.y, w: l.w, h: l.h }));
    positions.reverse();
    active.forEach((l, i) => {
        l.x = positions[i].x; l.y = positions[i].y;
        l.w = positions[i].w; l.h = positions[i].h;
        l._posSet = true;
        lcSendToVMix(l);
    });
    lcRender();
    showToast('Layers invertidas');
}

function lcAssignLayerInput(layerIndex, sourceKey) {
    const lc = STATE.layerControl;
    const base = lcVMixBase();
    if (!base || !lc.targetInputKey) return;
    const N = layerIndex + 1;
    // 1. Assign input to layer slot, 2. Turn on checkbox
    VMixCommandQueue.enqueue(`${base}?Function=SetMultiViewOverlay&Input=${lc.targetInputKey}&Value=${N},${sourceKey}`)
        .then(() => VMixCommandQueue.enqueue(`${base}?Function=MultiViewOverlayOn&Input=${lc.targetInputKey}&Value=${N}`));
}

function lcRemoveLayerInput(layerIndex) {
    const lc = STATE.layerControl;
    const base = lcVMixBase();
    if (!base || !lc.targetInputKey) return;
    const N = layerIndex + 1;
    // Remove input from slot, then turn checkbox ON → result: None + ON
    VMixCommandQueue.enqueue(`${base}?Function=SetMultiViewOverlay&Input=${lc.targetInputKey}&Value=${N},`)
        .then(() => VMixCommandQueue.enqueue(`${base}?Function=MultiViewOverlayOn&Input=${lc.targetInputKey}&Value=${N}`));
}
// =============================================
// BIDIRECTIONAL SYNC (poll vMix every 1s)
// =============================================

const LC_SYNC_MS = 1000;

function lcStartSync() { lcStopSync(); STATE.layerControl._syncTimer = setInterval(lcSyncFromVMix, LC_SYNC_MS); }
function lcStopSync() { if (STATE.layerControl._syncTimer) { clearInterval(STATE.layerControl._syncTimer); STATE.layerControl._syncTimer = null; } }

async function lcSyncFromVMix() {
    if (_lcDrag) return;
    if (VMixCommandQueue.isBusy()) return;
    const lc = STATE.layerControl;
    const base = lcVMixBase();
    if (!base || !lc.targetInputKey || STATE.activeTab !== 'layers') return;

    try {
        const res = await fetch(base, { signal: AbortSignal.timeout(3000) });
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
                // Sync position + trim (skip layer being edited, skip during preset application)
                if (i !== lc.selectedLayer && !l.hidden && !lcApplyPreset._busy) {
                    l.x = ov.x; l.y = ov.y; l.w = ov.w; l.h = ov.h;
                    l.trim = ov.trim || lcMakeTrim();
                }
            } else {
                // Overlay gone from vMix
                // Only hide if layer had an input (real removal)
                // Don't touch layers that are None + ON (synced by user)
                if (l.inputKey) {

                    l.inputKey = null; l.inputTitle = ''; l.hidden = true;
                    changed = true;
                }
            }
        }

        if (changed) lcRender();
    } catch {}
}
