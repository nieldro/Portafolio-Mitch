// Lo básico que un lector de pantalla necesita: toda imagen declara su alt
// (vacío si es decorativa), todo botón y enlace tiene nombre, los id no se
// repiten y la página tiene un solo <main>.
import { abrir, contexto, veredicto, BASE } from './comun.mjs';

const PAGINAS = ['', 'hoja-de-vida.html', 'marca.html', 'no-existe-esta-lamina'];

export async function accesibilidad(nav) {
  const ctx = await contexto(nav, 390, 844);
  const p = await ctx.newPage();
  for (const pagina of PAGINAS) {
    await p.goto(new URL(pagina, BASE).href);
    const r = await p.evaluate(() => {
      const nombre = el => (el.getAttribute('aria-label') || el.getAttribute('aria-labelledby')
        || el.textContent || el.querySelector('img[alt]:not([alt=""])')?.alt || el.title || '').trim();
      const ids = [...document.querySelectorAll('[id]')].map(e => e.id);
      return {
        sinAlt: [...document.querySelectorAll('img:not([alt])')].map(i => (i.getAttribute('src') || '').slice(-30)),
        sinNombre: [...document.querySelectorAll('button, a[href]')].filter(e => !nombre(e))
          .map(e => e.outerHTML.slice(0, 60)),
        repetidos: [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))],
        mains: document.querySelectorAll('main').length
      };
    });
    const fallas = [];
    if (r.sinAlt.length) fallas.push(`img sin alt: ${r.sinAlt.join(', ')}`);
    if (r.sinNombre.length) fallas.push(`sin nombre: ${r.sinNombre.join(' | ')}`);
    if (r.repetidos.length) fallas.push(`id repetidos: ${r.repetidos.join(', ')}`);
    if (r.mains > 1) fallas.push(`${r.mains} <main>`);
    veredicto(`accesibilidad ${pagina || 'index.html'}`, !fallas.length, fallas.join(' · '));
  }
  await ctx.close();
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const nav = await abrir(); await accesibilidad(nav); await nav.close();
}
