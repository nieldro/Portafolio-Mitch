// Las páginas internas (hoja de vida, hoja de marca y 404) cargan, no se
// desbordan en celular y la 404 responde 404 con su propio texto.
import { abrir, contexto, veredicto, BASE } from './comun.mjs';

const PAGINAS = ['hoja-de-vida.html', 'marca.html', 'no-existe-esta-lamina'];

export async function paginas(nav) {
  for (const pagina of PAGINAS) {
    const ctx = await contexto(nav, 390, 844);
    const p = await ctx.newPage();
    const errores = [];
    p.on('pageerror', e => errores.push(e.message));
    const respuesta = await p.goto(new URL(pagina, BASE).href);
    await p.waitForTimeout(1200);
    const r = await p.evaluate(() => ({
      ancho: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth,
      titulo: document.title
    }));
    const esperado = pagina.startsWith('no-existe') ? 404 : 200;
    veredicto(`pagina ${pagina}`, respuesta.status() === esperado && r.ancho <= r.vw && !errores.length,
      `estado=${respuesta.status()} (esperado ${esperado}) scroll=${r.ancho}/${r.vw} «${r.titulo.slice(0, 30)}»`);
    await ctx.close();
  }
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const nav = await abrir(); await paginas(nav); await nav.close();
}
