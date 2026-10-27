// Sin desborde horizontal, sin imágenes rotas, sin errores de consola y con
// zonas táctiles razonables, en todos los tamaños de pantalla.
import { abrir, contexto, cargar, recorrer, veredicto, TAMANOS } from './comun.mjs';

export async function desborde(nav) {
  for (const [w, h] of TAMANOS) {
    const ctx = await contexto(nav, w, h);
    const { p, errores } = await cargar(ctx);
    await recorrer(p);
    const r = await p.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const rotas = [...document.querySelectorAll('img')]
        .filter(i => i.getAttribute('src') && !(i.complete && i.naturalWidth > 0))
        .map(i => i.getAttribute('src'));
      // elementos que se salen por la derecha (salvo los que se desplazan a propósito)
      const fuera = [...document.querySelectorAll('body *')].filter(e => {
        const b = e.getBoundingClientRect();
        return b.width && b.right > vw + 1 &&
          !e.closest('.marquesina,.instrumentos__cinta,.detalles__tira,.ruleta__disco,.telon,.grano,.damasco,.cursor,.barra__panel,.lamina__marco,.mas__pieza');
      }).length;
      return { ancho: document.documentElement.scrollWidth, vw, rotas, fuera };
    });
    veredicto(`desborde ${w}x${h}`, r.ancho <= r.vw && !r.rotas.length && !r.fuera && !errores.length,
      `scroll=${r.ancho}/${r.vw} rotas=${r.rotas.length} fuera=${r.fuera} errores=${errores.length}`);
    await ctx.close();
  }
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const nav = await abrir(); await desborde(nav); await nav.close();
}
