// La portada: el marco ornamental encierra el contenido sin tocarlo.
// El filete interior cae al 3,7 % del alto del marco y al 2,2 % del ancho.
import { abrir, contexto, cargar, veredicto, TAMANOS } from './comun.mjs';

const MIN_ARRIBA = 24, MIN_ABAJO = 24;

export async function portada(nav) {
  for (const [w, h] of [...TAMANOS, [375, 667], [360, 640], [430, 932]]) {
    const ctx = await contexto(nav, w, h);
    const { p } = await cargar(ctx);
    const r = await p.evaluate(() => {
      const R = e => e.getBoundingClientRect();
      const marco = R(document.querySelector('.cartela'));
      const hero = R(document.querySelector('.frontis'));
      const cejilla = R(document.querySelector('.frontis .cejilla'));
      const baja = [...document.querySelectorAll('.frontis *')]
        .find(e => /descender/i.test(e.textContent) && !e.children.length);
      const esq = [...document.querySelectorAll('.cartela-esq')].map(R);
      return {
        arriba: cejilla.top - (marco.top + .037 * marco.height),
        abajo: (marco.bottom - .037 * marco.height) - R(baja).bottom,
        // el rectángulo debe llegar donde llegan sus esquinas (antes quedaba corto)
        encuadra: Math.abs(marco.bottom - esq[2].bottom) < 2 && Math.abs(marco.top - esq[0].top) < 2,
        marcoDentro: marco.bottom <= hero.bottom + 1
      };
    });
    veredicto(`portada ${w}x${h}`, r.arriba >= MIN_ARRIBA && r.abajo >= MIN_ABAJO && r.encuadra && r.marcoDentro,
      `arriba=${Math.round(r.arriba)} abajo=${Math.round(r.abajo)} marco=esquinas:${r.encuadra}`);
    await ctx.close();
  }
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const nav = await abrir(); await portada(nav); await nav.close();
}
