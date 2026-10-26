const css = `
:host{display:block;--sc-bg:#0b0b0a;--sc-fg:#f3f2f0;--sc-muted:#999a96;font-family:var(--font-sans,inherit);color:var(--sc-fg);contain:content}*{box-sizing:border-box}button,select{font:inherit}.response-picker{margin-left:auto;max-width:170px;min-height:30px;background:#171816;border:1px solid #333530;border-radius:5px;padding:4px 9px;color:#bfc1b7;font-size:11px}button:focus-visible,select:focus-visible,summary:focus-visible{outline:2px solid #c4c5bd;outline-offset:4px}.frame{position:relative;background:var(--sc-bg);border-radius:var(--radius-lg,14px);overflow:hidden;isolation:isolate}.plot{height:clamp(440px,45vw,660px);position:relative;overflow:hidden}.plot canvas{display:block;width:100%;height:100%;touch-action:pan-y!important;cursor:grab;outline:none}.plot canvas:active{cursor:grabbing}.head{position:absolute;top:28px;left:30px;right:30px;display:flex;justify-content:space-between;gap:20px;pointer-events:none;z-index:1}.heading{margin:0;font-size:16px;font-weight:500;letter-spacing:-.02em}.sub{margin:6px 0 0;color:var(--sc-muted);font-size:12px}.badge{font-size:11px;color:#c1c2ba;display:flex;gap:8px;align-items:flex-start;text-align:right;line-height:1.6}.dot{width:5px;height:5px;border-radius:50%;background:#979b8d;flex:none;margin-top:6px}.actions{flex-wrap:wrap;justify-content:flex-end;max-width:calc(100% - 34px);position:absolute;right:26px;bottom:25px;display:flex;gap:8px;z-index:2}.actions button{background:#171816dd;border:1px solid #333530;border-radius:5px;color:#c6c8bf;padding:8px 11px;font-size:11px;cursor:pointer}.actions button:hover{background:#262824;color:#fff}.tip{position:absolute;max-width:310px;padding:19px 20px;left:28px;bottom:28px;background:#141511f8;border:1px solid #35372f;border-radius:7px;box-shadow:0 8px 24px #0002;z-index:3;pointer-events:none}.tip[hidden]{display:none}.tip:not([hidden])~.hint{visibility:hidden}.formation-note{position:absolute;left:30px;top:84px;font-size:10px;color:#8f9488;pointer-events:none}.formation-note[hidden]{display:none}.tip small{font-size:10px;letter-spacing:.07em;text-transform:uppercase;color:#aeb0a4}.tip p{font-size:14px;line-height:1.6;margin:10px 0 0;color:#e2e3da}.tip .group{font-size:11px;margin-top:13px;color:#9a9e91}.hint{position:absolute;left:30px;bottom:27px;font-size:11px;color:#898c83;pointer-events:none;line-height:1.6}.legend{display:flex;gap:6px 22px;flex-wrap:wrap;align-items:center;padding:19px 30px 22px;border-top:1px solid #ffffff0d;background:#10110f}.legend button{background:none;border:0;padding:5px 0;display:flex;align-items:center;gap:9px;color:#bfc1b7;font-size:12px;cursor:pointer;min-height:30px}.legend button:hover{color:#fff}.legend button[aria-pressed=true]{color:#fff}.legend button[aria-pressed=false].dim{opacity:.42}.swatch{width:6px;height:6px;border-radius:50%;background:var(--dot);display:inline-block}.count{font-size:10px;color:#787c72;margin-left:1px;font-variant-numeric:tabular-nums}.all{margin-right:auto!important}.labels{position:absolute;inset:0;pointer-events:none}.label{position:absolute;white-space:nowrap;font-size:10px;letter-spacing:.025em;color:#bdc3b6;background:#0b0b0acc;padding:4px 8px;border-radius:4px;text-shadow:0 1px 10px #000;transform:translate(-50%,-50%);transition:opacity .18s}.fallback{padding:100px 30px 50px;max-width:560px;line-height:1.6;color:#b5b8ac}.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}@media(max-width:600px){.plot{height:510px}.head{top:22px;left:20px;right:20px}.head{display:block}.badge{margin-top:8px;text-align:left;font-size:10px}.heading{font-size:15px}.sub{font-size:11px}.legend{padding:14px 20px 18px;gap:3px 17px}.legend button{font-size:11px}.all{margin-right:0!important}.actions{right:17px;bottom:19px}.hint{left:20px;bottom:62px}.tip{left:18px;right:18px;bottom:66px;max-width:270px;padding:14px}.tip p{font-size:12px}.label{font-size:9px}}@media(prefers-reduced-motion:reduce){*{transition:none!important}}
`;
export class StrategyClusters extends HTMLElement {
    constructor() { super(); this.attachShadow({ mode: 'open' }); this._clean = []; this._active = null; this._selected = null; this._visible = false; this._disposed = false; this._frame = 0; this._dirty = true; this._last = 0; this._frames = 0; }
    connectedCallback() {
        if (this._started)
            return;
        this._started = true;
        this._disposed = false;
        this._initialised = false;
        this._active = null;
        this._selected = null;
        this._clean = [];
        this._generation = {};
        this._viewSize = null;
        this._transition = null;
        this._intro = null;
        this._renderer = null;
        delete this.dataset.ready;
        delete this.dataset.error;
        this.shadowRoot.innerHTML = `<style>${css}</style><section class="frame" aria-label="Interactive response similarity plot"><div class="plot"><div class="head"><div><h3 class="heading">Response landscape</h3><p class="sub">Related ideas, kept in context.</p></div><div class="badge"><span class="dot"></span><span class="provenance">Loading local demo…</span></div></div><div class="labels" aria-hidden="true"></div><div class="fallback">Preparing the response landscape…</div><div class="tip" hidden role="status"><small></small><p></p><div class="group"></div></div><div class="hint">Drag to explore · scroll or pinch to zoom</div><div class="actions"><button class="motion" aria-pressed="true">Pause orbit</button><button class="formation">Form clusters</button><button class="reset">Reset view</button></div></div><nav class="legend" aria-label="Response themes"></nav><p class="sr" aria-live="polite"></p></section>`;
        this._root = this.shadowRoot;
        this._plot = this._root.querySelector('.plot');
        this._tip = this._root.querySelector('.tip');
        const observer = new IntersectionObserver(entries => {
            this._visible = entries[0].isIntersecting;
            if (this._visible) {
                if (!this._initialised)
                    this._initialise();
                else
                    this._wake();
            }
            else {
                cancelAnimationFrame(this._frame);
                this._frame = 0;
            }
        }, { rootMargin: '100px' });
        observer.observe(this);
        this._clean.push(() => observer.disconnect());
    }
    async _initialise() {
        if (this._initialised)
            return;
        this._initialised = true;
        const generation = this._generation;
        try {
            const url = new URL(this.getAttribute('data-src') || './demo-data.json', import.meta.url);
            const [THREE, { OrbitControls }, data] = await Promise.all([import('./vendor/three.module.js'), import('./vendor/OrbitControls.js'), fetch(url, { signal: (this._abort = new AbortController()).signal }).then(r => {
                    if (!r.ok)
                        throw Error('Data request failed');
                    return r.json();
                })]);
            if (this._disposed || this._generation !== generation)
                return;
            this._validate(data);
            this._data = data;
            this._THREE = THREE;
            this._reduced = matchMedia('(prefers-reduced-motion: reduce)');
            this._motion = !this._reduced.matches;
            this._mode = 'auto';
            this._scene = new THREE.Scene();
            this._camera = new THREE.PerspectiveCamera(36, 1, .1, 100);
            this._renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
            this._renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
            this._renderer.outputColorSpace = THREE.SRGBColorSpace;
            this._renderer.setClearColor(0x0b0b0a, 1);
            this._canvas = this._renderer.domElement;
            this._canvas.setAttribute('aria-label', '3D response plot. Drag to orbit. Use theme buttons to inspect the same responses without a pointer.');
            this._canvas.setAttribute('role', 'img');
            this._plot.prepend(this._canvas);
            this._controls = new OrbitControls(this._camera, this._canvas);
            Object.assign(this._controls, { enableDamping: false, enablePan: false, enableZoom: true, zoomSpeed: .6, minDistance: 2.5, maxDistance: 48, rotateSpeed: .45, autoRotateSpeed: .16, minPolarAngle: .35, maxPolarAngle: Math.PI - .35 });
            this._camera.position.set(0, 8, 5.66);
            this._controls.target.set(0, 0, 0);
            this._controls.update();
            this._home = this._camera.position.clone();
            this._radius = Math.max(...data.points.map(p => Math.hypot(...p.position)));
            this._targetOpacity = new Float32Array(data.points.length);
            this._sizes = new Float32Array(data.points.map(p => p.kind === 'synthetic_outlier' ? .76 : p.kind === 'synthetic_overlap' ? .9 : 1));
            this._starts = new Float32Array(data.points.flatMap((p, i) => { const theta = i * 2.3999632297; const r = 1.3 * Math.sqrt((i + .5) / data.points.length); return [Math.cos(theta) * r, (i / data.points.length - .5) * 2.2, Math.sin(theta) * r]; }));
            this._delays = new Float32Array(data.points.map((_, i) => (i * .61803398875 % 1) * .30));
            this._positions = new Float32Array(data.points.flatMap(p => p.position));
            this._colors = new Float32Array(data.points.length * 3);
            this._alphas = new Float32Array(data.points.length).fill(.85);
            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(this._positions, 3));
            geometry.setAttribute('aColor', new THREE.BufferAttribute(this._colors, 3));
            geometry.setAttribute('aAlpha', new THREE.BufferAttribute(this._alphas, 1));
            geometry.setAttribute('aSize', new THREE.BufferAttribute(this._sizes, 1));
            geometry.setAttribute('aStart', new THREE.BufferAttribute(this._starts, 3));
            geometry.setAttribute('aDelay', new THREE.BufferAttribute(this._delays, 1));
            this._pointMaterial = new THREE.ShaderMaterial({ transparent: true, depthWrite: false, uniforms: { uSize: { value: 6.6 }, uDpr: { value: Math.min(devicePixelRatio, 1.5) }, uFormation: { value: 1 } }, vertexShader: `
attribute vec3 aColor;attribute float aAlpha;attribute float aSize;attribute vec3 aStart;attribute float aDelay;
varying vec3 vColor;varying float vAlpha;uniform float uSize;uniform float uDpr;uniform float uFormation;
void main(){float progress=smoothstep(0.,.70,clamp(uFormation-aDelay,0.,1.));vec3 point=mix(aStart,position,progress);vec4 p=modelViewMatrix*vec4(point,1.);gl_Position=projectionMatrix*p;vColor=aColor;vAlpha=aAlpha*smoothstep(0.,.18,progress)*clamp(1.35-(-p.z)*.018,.68,1.);gl_PointSize=uSize*uDpr*aSize*clamp(14./-p.z,.70,1.35);}`, fragmentShader: `
varying vec3 vColor;varying float vAlpha;void main(){float r=length(gl_PointCoord-.5)*2.;float edge=1.-smoothstep(.64,1.,r);if(edge<.01)discard;gl_FragColor=vec4(vColor,vAlpha*edge);
#include <colorspace_fragment>
}` });
            this._points = new THREE.Points(geometry, this._pointMaterial);
            this._scene.add(this._points);
            this._highlight = new THREE.Mesh(new THREE.RingGeometry(.065, .085, 40), new THREE.MeshBasicMaterial({ color: '#f3f2f0', transparent: true, opacity: .8, depthTest: false }));
            this._highlight.visible = false;
            this._scene.add(this._highlight);
            const gridPoints = [];
            const s = 4.4;
            for (let i = -4; i <= 4; i += 2) {
                gridPoints.push(-s, -3.45, i, s, -3.45, i, i, -3.45, -s, i, -3.45, s);
            }
            const grid = new THREE.BufferGeometry();
            grid.setAttribute('position', new THREE.Float32BufferAttribute(gridPoints, 3));
            this._scene.add(new THREE.LineSegments(grid, new THREE.LineBasicMaterial({ color: '#41443a', transparent: true, opacity: .19 })));
            this._raycaster = new THREE.Raycaster();
            this._raycaster.params.Points.threshold = .11;
            this._bounds = new Map();
            for (const id of [null, ...data.clusters.map(c => c.id), 'unassigned']) {
                const indices = data.points.flatMap((p, i) => !id || p.cluster === id || id === 'unassigned' && !p.cluster ? [i] : []);
                const box = new THREE.Box3();
                for (const i of indices)
                    box.expandByPoint(new THREE.Vector3(...data.points[i].position));
                this._bounds.set(id, { indices, box, center: box.getCenter(new THREE.Vector3()) });
            }
            this._buildLegend();
            this._paint(true);
            this._buildLabels();
            this._root.querySelector('.provenance').textContent = data.provenance.label + ' · ' + data.points.length + ' responses';
            this._root.querySelector('.fallback').remove();
            this._listen(this._root.querySelector('.motion'), 'click', () => {
                if (this._reduced.matches)
                    return;
                this._motion = !this._motion;
                this._mode = this._motion ? 'auto' : 'paused';
                this._syncMotion();
                this._wake();
            });
            this._listen(this._root.querySelector('.reset'), 'click', () => this.reset());
            const note = document.createElement('div');
            note.className = 'formation-note';
            note.hidden = true;
            note.textContent = 'Illustrative formation · not an analysis replay';
            this._plot.append(note);
            this._formationNote = note;
            this._listen(this._root.querySelector('.formation'), 'click', () => this.replayFormation());
            this._listen(this._canvas, 'pointermove', e => this._hover(e));
            this._listen(this._canvas, 'pointerleave', () => {
                if (this._selected === null)
                    this._showPoint(null);
            });
            this._listen(this._canvas, 'pointerdown', e => { this._down = [e.clientX, e.clientY]; this._transition = null; this._settleFormation(); this._dragging = true; this._motion = false; this._mode = 'paused'; this._syncMotion(); });
            this._listen(window, 'pointerup', () => { this._dragging = false; });
            this._listen(this._canvas, 'wheel', () => { this._transition = null; this._settleFormation(); this._motion = false; this._syncMotion(); }, { passive: true });
            this._listen(this._canvas, 'click', e => {
                if (this._down && Math.hypot(e.clientX - this._down[0], e.clientY - this._down[1]) > 6)
                    return;
                this._selected = this._pick(e);
                this._showPoint(this._selected);
            });
            this._listen(this._canvas, 'keydown', e => {
                if (e.key === 'Escape') {
                    this._selected = null;
                    this._showPoint(null);
                }
            });
            this._controls.addEventListener('change', () => this._wake());
            const resize = new ResizeObserver(() => this._resize());
            resize.observe(this._plot);
            this._clean.push(() => resize.disconnect());
            this._listen(this._reduced, 'change', () => { this._motion = !this._reduced.matches && this._mode === 'auto'; if (this._reduced.matches) {
                this._paint(true);
                this._settleFormation();
                if (this._transition) {
                    this._camera.position.copy(this._transition.toPosition);
                    this._controls.target.copy(this._transition.toTarget);
                    this._transition = null;
                    this._controls.update();
                }
            } this._syncMotion(); this._wake(); });
            this._listen(document, 'visibilitychange', () => {
                if (document.hidden) {
                    cancelAnimationFrame(this._frame);
                    this._frame = 0;
                }
                else
                    this._wake();
            });
            this._syncMotion();
            this._resize();
            if (this.hasAttribute('intro') && !this._reduced.matches)
                this.replayFormation();
            this.dataset.ready = 'true';
            this._wake();
            this.dispatchEvent(new CustomEvent('ready'));
        }
        catch (e) {
            if (this._disposed)
                return;
            this._root.querySelector('.fallback').textContent = 'The interactive plot is unavailable. The representative response themes remain accessible below.';
            this._root.querySelector('.provenance').textContent = 'Representative demo data';
            if (this._data)
                this._buildLegend();
            this.dataset.error = e.message;
            this._root.querySelector('.motion').disabled = true;
            this._root.querySelector('.reset').disabled = true;
            this._root.querySelector('.formation').disabled = true;
            console.error('StrategyClusters:', e);
        }
    }
    _validate(d) {
        if (d.schemaVersion !== 1 || !Array.isArray(d.points) || !d.points.length || d.points.length > 10000 || !d.provenance?.label)
            throw Error('Unsupported or unlabelled plot data');
        const ids = new Set(), groups = new Set(d.clusters.map(c => c.id));
        for (const p of d.points) {
            if (ids.has(p.id) || typeof p.text !== 'string' || p.position?.length !== 3 || !p.position.every(Number.isFinite) || p.cluster !== null && !groups.has(p.cluster))
                throw Error('Invalid point');
            ids.add(p.id);
        }
    }
    _listen(target, event, fn) { target.addEventListener(event, fn); this._clean.push(() => target.removeEventListener(event, fn)); }
    _buildLegend() {
        const nav = this._root.querySelector('.legend');
        nav.replaceChildren();
        const add = (id, name, color, count) => {
            const button = document.createElement('button');
            button.dataset.cluster = id || '';
            button.type = 'button';
            button.setAttribute('aria-pressed', String(id === this._active));
            if (!id)
                button.className = 'all';
            if (color) {
                const swatch = document.createElement('i');
                swatch.className = 'swatch';
                swatch.style.setProperty('--dot', color);
                button.append(swatch);
            }
            button.append(document.createTextNode(name));
            if (count !== undefined) {
                const c = document.createElement('span');
                c.className = 'count';
                c.textContent = count;
                button.append(c);
            }
            button.onclick = () => {
                this._active = this._active === id ? null : id;
                this._selected = null;
                if (this._points) {
                    this._settleFormation();
                    this._motion = false;
                    this._syncMotion();
                    this._paint();
                    this._frameGroup(this._active);
                    this._showPoint(null);
                    this._wake();
                }
                for (const b of nav.querySelectorAll('button')) {
                    const active = (b.dataset.cluster || null) === this._active;
                    b.setAttribute('aria-pressed', String(active));
                    b.classList.toggle('dim', !!this._active && !active);
                }
                const group = this._data.clusters.find(c => c.id === this._active);
                if (group) {
                    this._root.querySelector('.sr').textContent = group.name + '. ' + group.count + ' representative responses. ' + this._data.points.find(p => p.cluster === group.id)?.text;
                    this._tip.hidden = false;
                    this._tip.querySelector('small').textContent = group.name;
                    this._tip.querySelector('p').textContent = group.count + ' related demo responses. Select an individual point to read its full text.';
                    this._tip.querySelector('.group').textContent = 'Synthetic topic grouping · individual responses remain inspectable.';
                }
                else
                    this._tip.hidden = true;
            };
            nav.append(button);
        };
        add(null, 'All responses');
        for (const c of this._data.clusters)
            add(c.id, c.name, c.color, c.count);
        const n = this._data.points.filter(p => !p.cluster).length;
        if (n)
            add('unassigned', 'Other perspectives', '#787e74', n);
        const picker = document.createElement('select');
        picker.className = 'response-picker';
        picker.setAttribute('aria-label', 'Read a demo response');
        const placeholder = document.createElement('option');
        placeholder.value = '';
        placeholder.textContent = 'Read a response…';
        picker.append(placeholder);
        for (const [i, p] of this._data.points.entries()) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = p.id + ' · ' + (this._data.clusters.find(c => c.id === p.cluster)?.name || 'Other perspective');
            picker.append(option);
        }
        picker.onchange = () => {
            this._motion = false;
            if (this._controls)
                this._syncMotion();
            this._selected = picker.value === '' ? null : Number(picker.value);
            if (this._selected !== null && this._points) {
                const group = this._data.points[this._selected].cluster;
                if (this._active && group !== this._active) {
                    this._active = group;
                    this._paint();
                    this._frameGroup(group);
                    this._buildLegend();
                }
            }
            this._settleFormation();
            this._showPoint(this._selected);
        };
        picker.value = this._selected === null ? '' : String(this._selected);
        nav.append(picker);
    }
    _paint(immediate = false) { const T = this._THREE; for (let i = 0; i < this._data.points.length; i++) {
        const p = this._data.points[i], c = this._data.clusters.find(c => c.id === p.cluster);
        new T.Color(c?.color || '#899385').toArray(this._colors, i * 3);
        this._targetOpacity[i] = !this._active || p.cluster === this._active || this._active === 'unassigned' && !p.cluster ? .91 : .055;
        if (immediate || this._reduced.matches)
            this._alphas[i] = this._targetOpacity[i];
    } this._fading = !immediate && !this._reduced.matches; this._points.geometry.attributes.aColor.needsUpdate = true; this._points.geometry.attributes.aAlpha.needsUpdate = true; this._wake(); }
    _buildLabels() {
        this._labels = this._data.clusters.map(c => {
            const ps = this._data.points.filter(p => p.cluster === c.id);
            const center = new this._THREE.Vector3();
            for (const p of ps)
                center.add(new this._THREE.Vector3(...p.position));
            center.divideScalar(ps.length);
            const label = document.createElement('div');
            label.className = 'label';
            label.textContent = c.name;
            this._root.querySelector('.labels').append(label);
            return { id: c.id, center, label };
        });
    }
    _pick(e) { const r = this._canvas.getBoundingClientRect(), mouse = new this._THREE.Vector2((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1); this._raycaster.setFromCamera(mouse, this._camera); const hit = this._raycaster.intersectObject(this._points).find(h => !this._active || this._data.points[h.index].cluster === this._active || this._active === 'unassigned' && !this._data.points[h.index].cluster); return hit?.index ?? null; }
    _hover(e) {
        if (this._dragging || this._intro || this._transition || e.pointerType === 'touch')
            return;
        this._hovered = this._pick(e);
        if (this._selected === null)
            this._showPoint(this._hovered);
        if (this._hovered !== null && this._motion) {
            this._motion = false;
            this._syncMotion();
        }
    }
    _showPoint(index) {
        const picker = this._root.querySelector('.response-picker');
        if (picker)
            picker.value = index === null ? '' : String(index);
        if (index === null) {
            this._tip.hidden = true;
            if (this._highlight)
                this._highlight.visible = false;
        }
        else {
            const p = this._data.points[index];
            this._tip.hidden = false;
            this._tip.querySelector('small').textContent = 'Demo response ' + p.id;
            this._tip.querySelector('p').textContent = '“' + p.text + '”';
            this._tip.querySelector('.group').textContent = this._data.clusters.find(c => c.id === p.cluster)?.name || 'Other perspective · kept visible';
            if (this._highlight) {
                this._highlight.position.set(...p.position);
                this._highlight.visible = true;
            }
        }
        this._wake();
    }
    _syncMotion() { const b = this._root.querySelector('.motion'); b.textContent = this._reduced.matches ? 'Reduced motion' : this._motion ? 'Pause orbit' : 'Resume orbit'; b.disabled = this._reduced.matches; b.setAttribute('aria-pressed', String(this._motion)); this._controls.autoRotate = this._motion && !this._reduced.matches && !this._transition && !this._intro; if (this._root.querySelector('.formation')) {
        this._root.querySelector('.formation').disabled = this._reduced.matches;
        this._root.querySelector('.formation').textContent = this._intro ? 'Forming…' : 'Form clusters';
    } }
    _viewFor(id) { const T = this._THREE, b = this._bounds.get(id) || this._bounds.get(null), target = b.center.clone(); let direction = this._camera.position.clone().sub(this._controls.target).normalize(); if (!direction.lengthSq())
        direction.set(0, 8, 5.66).normalize(); const right = new T.Vector3().crossVectors(new T.Vector3(0, 1, 0), direction).normalize(); const up = new T.Vector3().crossVectors(direction, right).normalize(); const width = this._plot.clientWidth, height = this._plot.clientHeight; const tanY = Math.tan(this._camera.fov * Math.PI / 360), tanX = tanY * width / height; let distance = 0; for (const i of b.indices) {
        const peripheral = !id && this._data.points[i].kind === 'synthetic_outlier';
        const usableY = width < 600 ? (peripheral ? .80 : .62) : (peripheral ? .94 : .82), usableX = peripheral ? .94 : (width < 600 ? .86 : .90);
        const delta = new T.Vector3(...this._data.points[i].position).sub(target);
        distance = Math.max(distance, Math.abs(delta.dot(right)) / (tanX * usableX) + delta.dot(direction), Math.abs(delta.dot(up)) / (tanY * usableY) + delta.dot(direction));
    } distance = Math.max(id ? 4.5 : 6, distance + .35); return { target, position: target.clone().addScaledVector(direction, distance) }; }
    _frameGroup(id, immediate = false) { this._settleFormation(); const view = this._viewFor(id); this._transition = null; if (immediate || this._reduced.matches) {
        this._camera.position.copy(view.position);
        this._controls.target.copy(view.target);
        this._controls.update();
    }
    else
        this._transition = { fromPosition: this._camera.position.clone(), fromTarget: this._controls.target.clone(), toPosition: view.position, toTarget: view.target, start: performance.now(), duration: 1050 }; this._syncMotion(); this._wake(); }
    _resize() { if (!this._renderer)
        return; const { width, height } = this._plot.getBoundingClientRect(); if (!width || !height)
        return; if (this._viewSize?.[0] === width && this._viewSize?.[1] === height)
        return; this._viewSize = [width, height]; this._renderer.setSize(width, height); this._camera.aspect = width / height; this._camera.updateProjectionMatrix(); this._frameGroup(this._active, true); }
    reset() { if (!this._renderer)
        return; this._active = null; this._selected = null; this._motion = false; this._mode = 'paused'; this._settleFormation(); const from = this._camera.position.clone(), fromTarget = this._controls.target.clone(); this._camera.position.copy(fromTarget).add(new this._THREE.Vector3(0, 8, 5.66)); const view = this._viewFor(null); this._camera.position.copy(from); this._controls.target.copy(fromTarget); this._buildLegend(); this._paint(); this._showPoint(null); if (this._reduced.matches) {
        this._camera.position.copy(view.position);
        this._controls.target.copy(view.target);
        this._controls.update();
        this._transition = null;
    }
    else
        this._transition = { fromPosition: from, fromTarget, toPosition: view.position, toTarget: view.target, start: performance.now(), duration: 1050 }; this._syncMotion(); this._wake(); }
    replayFormation() { if (!this._renderer || this._reduced.matches)
        return; this._active = null; this._selected = null; this._motion = false; this._mode = 'paused'; this._transition = null; this._buildLegend(); this._paint(true); this._showPoint(null); this._frameGroup(null, true); this._intro = { start: performance.now(), duration: 5200 }; this._pointMaterial.uniforms.uFormation.value = 0; this._formationNote.hidden = false; this._syncMotion(); this._wake(); }
    _settleFormation() { if (this._intro) {
        this._intro = null;
        this._pointMaterial.uniforms.uFormation.value = 1;
        if (this._formationNote)
            this._formationNote.hidden = true;
        this._syncMotion();
    } }
    _wake() {
        this._dirty = true;
        if (this._drawing)
            return;
        if (!this._frame && this._visible && !document.hidden && !this._disposed)
            this._frame = requestAnimationFrame(t => this._draw(t));
    }
    _draw(t) {
        this._frame = 0;
        if (!this._renderer || !this._visible || this._disposed || document.hidden)
            return;
        const running = this._motion || this._intro || this._transition || this._fading;
        const dt = Math.min((t - this._last) / 1000 || 0, .05);
        if (t - this._last < 32 && running) {
            this._frame = requestAnimationFrame(t => this._draw(t));
            return;
        }
        this._last = t;
        this._drawing = true;
        if (this._transition) {
            const q = this._transition;
            let u = Math.min(1, (t - q.start) / q.duration);
            u = u * u * (3 - 2 * u);
            this._camera.position.copy(q.fromPosition).lerp(q.toPosition, u);
            this._controls.target.copy(q.fromTarget).lerp(q.toTarget, u);
            if (t - q.start >= q.duration)
                this._transition = null;
        }
        if (this._intro) {
            const u = Math.min(1, (t - this._intro.start) / this._intro.duration);
            this._pointMaterial.uniforms.uFormation.value = u;
            if (u >= 1)
                this._settleFormation();
        }
        if (this._fading) {
            let remaining = 0;
            for (let i = 0; i < this._alphas.length; i++) {
                this._alphas[i] += (this._targetOpacity[i] - this._alphas[i]) * .15;
                remaining = Math.max(remaining, Math.abs(this._alphas[i] - this._targetOpacity[i]));
            }
            this._points.geometry.attributes.aAlpha.needsUpdate = true;
            if (remaining < .005)
                this._fading = false;
        }
        this._controls.autoRotate = this._motion && !this._transition && !this._intro && !this._reduced.matches;
        this._controls.update(dt);
        this._highlight.quaternion.copy(this._camera.quaternion);
        this._renderer.render(this._scene, this._camera);
        this._frames++;
        for (const { id, center, label } of this._labels) {
            if (this._active !== id || this._intro) {
                label.style.opacity = 0;
                continue;
            }
            const v = center.clone().project(this._camera);
            label.style.left = Math.max(90, Math.min(this._plot.clientWidth - 90, (v.x * .5 + .5) * this._plot.clientWidth)) + 'px';
            const top = Math.min(...this._bounds.get(id).indices.map(i => { const p = new this._THREE.Vector3(...this._data.points[i].position).project(this._camera); return (-p.y * .5 + .5) * this._plot.clientHeight; }));
            label.style.top = Math.max(112, top - 26) + 'px';
            label.style.opacity = this._active === id && !this._intro ? .9 : 0;
        }
        this._dirty = false;
        this._drawing = false;
        if (this._motion || this._intro || this._transition || this._fading)
            this._frame = requestAnimationFrame(t => this._draw(t));
    }
    get state() { return { ready: this.dataset.ready === 'true', reducedMotion: this._reduced?.matches, rotating: this._motion, frames: this._frames, activeCluster: this._active, selectedPoint: this._selected, drawCalls: this._renderer?.info.render.calls, pixelRatio: this._renderer?.getPixelRatio(), camera: this._camera?.position.toArray(), target: this._controls?.target.toArray(), formation: !!this._intro, transitioning: !!this._transition, pointCount: this._data?.points.length }; }
    disconnectedCallback() {
        this._started = false;
        this._disposed = true;
        cancelAnimationFrame(this._frame);
        this._frame = 0;
        this._abort?.abort();
        for (const fn of this._clean)
            fn();
        this._controls?.dispose();
        this._scene?.traverse(o => {
            o.geometry?.dispose();
            if (o.material) {
                for (const m of Array.isArray(o.material) ? o.material : [o.material])
                    m.dispose();
            }
        });
        this._renderer?.dispose();
    }
}
if (!customElements.get('strategy-clusters'))
    customElements.define('strategy-clusters', StrategyClusters);
