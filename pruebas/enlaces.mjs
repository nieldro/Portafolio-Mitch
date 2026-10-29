// Ningún enlace interno queda roto: las anclas (#algo) apuntan a un id que
// existe, los archivos relativos responden 200 y los enlaces que abren
// pestaña nueva llevan rel="noopener".
import { abrir, contexto, veredicto, BASE } from './comun.mjs';

const PAGINAS = ['', 'hoja-de-vida.html', 'marca.html'];

export async function enlaces(nav) {
  const ctx = await contexto(nav, 1366, 650);
  const p = await ctx.newPage();
  for (const pagina of PAGINAS) {
    const url = new URL(pagina, BASE).href;
    await p.goto(url);
    const lista = await p.evaluate(() => [...document.querySelectorAll('a[href]')].map(a => ({
      href: a.getAttribute('href'), abs: a.href, blank: a.target === '_blank',
      noopener: /noopener/.test(a.rel)
    })));
    const rotos = [];
    for (const a of lista) {
      if (a.href.startsWith('#')) {
        const id = decodeURIComponent(a.href.slice(1));
        if (id && !(await p.evaluate(i => !!document.getElementById(i), id))) rotos.push(a.href);
      } else if (a.abs.startsWith(new URL(BASE).origin)) {
        const r = await ctx.request.get(a.abs.split('#')[0]);
        if (r.status() !== 200) rotos.push(`${a.href} (${r.status()})`);
      } else if (a.blank && !a.noopener) {
        rotos.push(`${a.href} sin noopener`);
      }
    }
    veredicto(`enlaces ${pagina || 'index.html'}`, !rotos.length,
      rotos.length ? rotos.join(' · ') : `${lista.length} enlaces`);
  }
  await ctx.close();
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const nav = await abrir(); await enlaces(nav); await nav.close();
}
