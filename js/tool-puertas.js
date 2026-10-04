/* ─── Cachas House · Tool: Calculadora de puertas (despiece) ──────────
   Fórmulas tomadas de Costos.xlsx → hoja "Calulador de puertas" (bloque
   principal, basadas en experiencia de instalación). Todo en milímetros.

     Baño (hueco):  alto H · ancho W · muro M
     Cabezal        largo W − 9          ancho M
     Puerta (36 mm) alto  H − 35         ancho (W − 9) − 37  = W − 46
     Marco          largo H − 23         ancho M            (2 por puerta)
     Contramarco    largo H − 23         ancho M − 40       (2 por puerta)
     Contracabezal  largo (W − 9) − 60   ancho M − 40

   Exporta un .xlsx con hoja "Hoja1" fiel al formato original:
   COLOR | CANTIDAD | LARGO | ANCHO  | DESCRIPCION | BETA | LARGO | LARGO | ANCHO | ANCHO | SERVICIOS ESPECIALES
   (no agregar ni quitar columnas). */
(function () {
  const HEADERS = ['COLOR', 'CANTIDAD', 'LARGO', 'ANCHO ', 'DESCRIPCION', 'BETA', 'LARGO', 'LARGO', 'ANCHO', 'ANCHO', 'SERVICIOS ESPECIALES'];
  const XLSX_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js';

  /* Despiece de un baño (mm) */
  function calcDoor(H, W, M) {
    const cab = W - 9;
    return {
      puerta:        { largo: H - 35, ancho: cab - 37 },
      marco:         { largo: H - 23, ancho: M },
      contramarco:   { largo: H - 23, ancho: M - 40 },
      cabezal:       { largo: cab,    ancho: M },
      contracabezal: { largo: cab - 60, ancho: M - 40 },
    };
  }

  /* Filas de Hoja1 (mismo orden que el original):
     1) una fila por puerta (36 mm), 2) fila vacía,
     3) marcos y contramarcos agrupados por medida (15 mm),
     4) cabezal y contracabezal de cada puerta. */
  function buildRows(doors, color) {
    const c36 = (color || 'Cartagena') + ' 36mm';
    const c15 = (color || 'Cartagena') + ' de 15 mm';
    const rows = [];
    const parts = doors.map(d => ({ d, p: calcDoor(d.alto, d.ancho, d.muro) }));
    parts.forEach(({ d, p }) => rows.push([c36, d.cantidad, p.puerta.largo, p.puerta.ancho, d.nombre, '', 2, 2, 2, 2, '']));
    rows.push(Array(HEADERS.length).fill(''));
    const group = (key, label) => {
      const m = new Map();
      parts.forEach(({ d, p }) => {
        const k = p[key].largo + 'x' + p[key].ancho;
        const g = m.get(k) || { largo: p[key].largo, ancho: p[key].ancho, cant: 0 };
        g.cant += 2 * d.cantidad; m.set(k, g);
      });
      m.forEach(g => rows.push([c15, g.cant, g.largo, g.ancho, label, '', 1, 1, 1, 1, '']));
    };
    group('marco', 'Marcos');
    group('contramarco', 'contra marcos');
    parts.forEach(({ d, p }) => {
      rows.push([c15, d.cantidad, p.cabezal.largo, p.cabezal.ancho, 'Cabezal ' + d.nombre, '', '', '', '', '', '']);
      rows.push([c15, d.cantidad, p.contracabezal.largo, p.contracabezal.ancho, 'CONTRAcabezal ' + d.nombre, '', '', '', '', '', '']);
    });
    return rows;
  }

  function loadXlsx() {
    if (window.XLSX) return Promise.resolve(window.XLSX);
    return new Promise((res, rej) => {
      const s = document.createElement('script');
      s.src = XLSX_CDN; s.onload = () => res(window.XLSX); s.onerror = () => rej(new Error('No se pudo cargar el generador de Excel. Revisa tu conexión.'));
      document.head.appendChild(s);
    });
  }

  async function exportXlsx(rows, filename) {
    const XLSX = await loadXlsx();
    const ws = XLSX.utils.aoa_to_sheet([HEADERS, ...rows.map(r => r.map(v => (v === '' ? null : v)))]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');
    XLSX.writeFile(wb, filename);
  }

  /* ─── Interfaz ─── */
  const css = `
    .tp-card { background: white; border: 2px solid var(--border); border-radius: 16px; padding: 1rem; margin-bottom: .9rem; }
    .tp-row { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: .5rem; }
    .tp-row .field { margin-bottom: .5rem; }
    .tp-row .field input { font-size: 1.05rem; padding: .7rem .6rem; }
    .tp-head { display: flex; justify-content: space-between; align-items: center; gap: .5rem; margin-bottom: .5rem; }
    .tp-head input { flex: 1; min-width: 0; font-weight: 700; font-size: 1rem; border: none; border-bottom: 2px dashed var(--border); padding: .3rem 0; background: none; color: var(--dark); outline: none; }
    .tp-qty { width: 4.2rem !important; flex: 0 0 auto !important; text-align: center; border: 2px solid var(--border) !important; border-radius: 10px; }
    .tp-x { color: var(--warn); font-size: .85rem; padding: .3rem .2rem; flex: 0 0 auto; }
    .tp-units { display: inline-flex; border: 2px solid var(--border); border-radius: 12px; overflow: hidden; }
    .tp-units button { padding: .45rem .9rem; font-weight: 600; font-size: .9rem; }
    .tp-units button.on { background: var(--dark); color: var(--cream); }
    .tp-table { width: 100%; border-collapse: collapse; font-size: .88rem; margin-top: .4rem; }
    .tp-table th { text-align: left; font-size: .7rem; text-transform: uppercase; letter-spacing: .06em; color: var(--muted); padding: .3rem .2rem; border-bottom: 1px solid var(--border); }
    .tp-table td { padding: .35rem .2rem; border-bottom: 1px solid var(--surf2); color: var(--dark); }
    .tp-table td.n { text-align: right; font-variant-numeric: tabular-nums; white-space: nowrap; }
    .tp-warn { color: var(--warn); font-size: .85rem; margin-top: .4rem; }
    .tp-inline { display: flex; gap: .5rem; align-items: center; flex-wrap: wrap; }
    .tp-check { display: flex; align-items: center; gap: .5rem; font-weight: 600; color: var(--dark); margin: .25rem 0 .75rem; }
    .tp-check input { width: 22px; height: 22px; accent-color: var(--accentdk); }
  `;

  function mount(root, opts) {
    opts = opts || {};
    if (!document.getElementById('tp-css')) { const st = document.createElement('style'); st.id = 'tp-css'; st.textContent = css; document.head.appendChild(st); }
    const state = { unit: 'mm', same: false, color: 'Cartagena', obra: '', doors: [] };
    const k = () => (state.unit === 'cm' ? 10 : 1);           // factor a mm
    const fmt = mm => (state.unit === 'cm' ? (mm / 10).toLocaleString('es-CO', { maximumFractionDigits: 1 }) : String(mm));
    const toMm = v => Math.round(parseFloat(String(v).replace(',', '.')) * k());
    const newDoor = i => ({ nombre: 'Puerta ' + i, cantidad: 1, alto: '', ancho: '', muro: '' });

    root.innerHTML = `
      <div class="tp-card">
        <div class="field"><label>¿Cuántas puertas vas a hacer?</label>
          <div class="tp-inline"><input id="tp-n" type="number" inputmode="numeric" min="1" max="30" value="1" style="width:6rem">
          <button class="btn btn-dark" id="tp-make" type="button" style="width:auto;margin:0;min-height:50px">Crear</button></div></div>
        <label class="tp-check"><input type="checkbox" id="tp-same"> Todos los baños tienen la misma medida</label>
        <div class="tp-inline" style="justify-content:space-between">
          <span style="font-weight:600;color:var(--dark)">Unidades</span>
          <span class="tp-units"><button type="button" data-u="mm" class="on">mm</button><button type="button" data-u="cm">cm</button></span>
        </div>
      </div>
      <div id="tp-doors"></div>
      <button class="btn btn-ghost" id="tp-add" type="button">＋ Agregar otra puerta</button>
      <h2>Despiece</h2>
      <div id="tp-result"><p class="sub">Escribe las medidas del baño para ver el despiece.</p></div>
      <div class="tp-card">
        <div class="field"><label for="tp-color">Color de la lámina</label><input id="tp-color" type="text" value="Cartagena"></div>
        <div class="field"><label for="tp-obra">Obra / cliente (para el nombre del archivo)</label><input id="tp-obra" type="text" placeholder="Opcional"></div>
        <button class="btn" id="tp-export" type="button">⬇️ Exportar Excel (Hoja1)</button>
        <div class="err" id="tp-err"></div>
      </div>`;
    const $ = s => root.querySelector(s);

    function setCount(n) {
      n = Math.max(1, Math.min(30, parseInt(n, 10) || 1));
      while (state.doors.length < n) state.doors.push(newDoor(state.doors.length + 1));
      state.doors.length = n;
      renderDoors(); renderResult();
    }

    function renderDoors() {
      const box = $('#tp-doors'); box.innerHTML = '';
      state.doors.forEach((d, i) => {
        const showDims = !state.same || i === 0;
        const c = document.createElement('div'); c.className = 'tp-card';
        c.innerHTML = `
          <div class="tp-head">
            <input data-f="nombre" value="" aria-label="nombre de la puerta">
            <input class="tp-qty" data-f="cantidad" type="number" inputmode="numeric" min="1" title="cantidad">
            ${state.doors.length > 1 ? '<button class="tp-x" type="button">quitar</button>' : ''}
          </div>
          ${showDims ? `<div class="tp-row">
            <div class="field"><label>Alto baño</label><input data-f="alto" type="number" inputmode="decimal" placeholder="${state.unit}"></div>
            <div class="field"><label>Ancho baño</label><input data-f="ancho" type="number" inputmode="decimal" placeholder="${state.unit}"></div>
            <div class="field"><label>Muro</label><input data-f="muro" type="number" inputmode="decimal" placeholder="${state.unit}"></div>
          </div>` : '<p class="upd-meta">Mismas medidas de la primera puerta.</p>'}`;
        c.querySelector('[data-f=nombre]').value = d.nombre;
        c.querySelector('[data-f=cantidad]').value = d.cantidad;
        ['alto', 'ancho', 'muro'].forEach(f => { const el = c.querySelector(`[data-f=${f}]`); if (el && d[f] !== '') el.value = state.unit === 'cm' ? d[f] / 10 : d[f]; });
        c.addEventListener('input', e => {
          const f = e.target.dataset.f; if (!f) return;
          if (f === 'nombre') d.nombre = e.target.value;
          else if (f === 'cantidad') d.cantidad = Math.max(1, parseInt(e.target.value, 10) || 1);
          else d[f] = e.target.value === '' ? '' : toMm(e.target.value);
          renderResult();
        });
        const x = c.querySelector('.tp-x');
        if (x) x.addEventListener('click', () => { state.doors.splice(i, 1); $('#tp-n').value = state.doors.length; renderDoors(); renderResult(); });
        box.appendChild(c);
      });
    }

    function validDoors() {
      const base = state.doors[0] || {};
      return state.doors.map(d => state.same ? { ...d, alto: base.alto, ancho: base.ancho, muro: base.muro } : d)
        .map(d => ({ ...d, nombre: (d.nombre || '').trim() || 'Puerta' }));
    }
    function problems(d) {
      if ([d.alto, d.ancho, d.muro].some(v => v === '' || !(v > 0))) return 'faltan medidas';
      const p = calcDoor(d.alto, d.ancho, d.muro);
      if (p.puerta.ancho <= 0 || p.puerta.largo <= 0 || p.contramarco.ancho <= 0 || p.contracabezal.largo <= 0) return 'las medidas son muy pequeñas: revisa que estén en ' + state.unit;
      return '';
    }

    function renderResult() {
      const box = $('#tp-result'); box.innerHTML = '';
      validDoors().forEach(d => {
        const c = document.createElement('div'); c.className = 'tp-card';
        const prob = problems(d);
        const title = document.createElement('div'); title.className = 'card-title';
        title.textContent = d.nombre + (d.cantidad > 1 ? ' × ' + d.cantidad : '');
        c.appendChild(title);
        if (prob) { const w = document.createElement('p'); w.className = 'tp-warn'; w.textContent = '⚠️ ' + prob; c.appendChild(w); box.appendChild(c); return; }
        const p = calcDoor(d.alto, d.ancho, d.muro), q = d.cantidad;
        const lines = [
          ['Puerta (36 mm)', q, p.puerta], ['Marcos (15 mm)', 2 * q, p.marco], ['Contramarcos', 2 * q, p.contramarco],
          ['Cabezal', q, p.cabezal], ['Contracabezal', q, p.contracabezal]];
        const t = document.createElement('table'); t.className = 'tp-table';
        t.innerHTML = `<tr><th>Pieza</th><th>Cant.</th><th style="text-align:right">Largo</th><th style="text-align:right">Ancho</th></tr>` +
          lines.map(([n, cnt, m]) => `<tr><td>${n}</td><td>${cnt}</td><td class="n">${fmt(m.largo)}</td><td class="n">${fmt(m.ancho)}</td></tr>`).join('');
        c.appendChild(t);
        box.appendChild(c);
      });
      const u = document.createElement('p'); u.className = 'upd-meta'; u.textContent = 'Medidas en ' + state.unit + '. El Excel siempre sale en milímetros, como la Hoja1.';
      box.appendChild(u);
    }

    $('#tp-make').addEventListener('click', () => setCount($('#tp-n').value));
    $('#tp-n').addEventListener('keydown', e => { if (e.key === 'Enter') setCount(e.target.value); });
    $('#tp-add').addEventListener('click', () => { state.doors.push(newDoor(state.doors.length + 1)); $('#tp-n').value = state.doors.length; renderDoors(); renderResult(); });
    $('#tp-same').addEventListener('change', e => { state.same = e.target.checked; renderDoors(); renderResult(); });
    root.querySelectorAll('.tp-units button').forEach(b => b.addEventListener('click', () => {
      state.unit = b.dataset.u;
      root.querySelectorAll('.tp-units button').forEach(x => x.classList.toggle('on', x === b));
      renderDoors(); renderResult();
    }));
    $('#tp-export').addEventListener('click', async () => {
      const err = $('#tp-err'); err.textContent = '';
      const doors = validDoors();
      const bad = doors.find(problems);
      if (bad) { err.textContent = bad.nombre + ': ' + problems(bad) + '.'; return; }
      const color = $('#tp-color').value.trim() || 'Cartagena';
      const obra = $('#tp-obra').value.trim();
      const fecha = new Date().toISOString().slice(0, 10);
      const name = 'Despiece puertas' + (obra ? ' - ' + obra : '') + ' - ' + fecha + '.xlsx';
      try { err.textContent = 'generando…'; await exportXlsx(buildRows(doors, color), name.replace(/[\\/:*?"<>|]/g, '')); err.textContent = '✓ Excel descargado.'; }
      catch (e) { err.textContent = e.message || 'No se pudo generar el Excel.'; }
    });
    setCount(1);
  }

  window.ToolPuertas = { calcDoor, buildRows, exportXlsx, mount, HEADERS };
})();
