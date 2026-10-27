// El carrusel de piezas: la activa queda centrada entre el título y los
// puntos, sin chocar con ninguno, y sin texto sobre las imágenes.
import { abrir, contexto, cargar, veredicto } from './comun.mjs';

const TAMANOS = [[360, 640], [375, 667], [390, 664], [390, 844], [430, 932], [768, 1024],
                 [1280, 720], [1366, 650], [1440, 900], [1920, 950]];

export async function carrusel(nav) {
  for (const [w, h] of TAMANOS) {
    const ctx = await contexto(nav, w, h);
    const { p } = await cargar(ctx);
    // justo al arrancar el anclaje la rueda está sin girar: ahí el cuadro de la
    // pieza es exacto (con la pieza girada, su caja se infla y engaña)
    const arriba = await p.evaluate(() => document.getElementById('gabinete').getBoundingClientRect().top + scrollY);
    await p.evaluate(v => window.scrollTo(0, v + 2), arriba);
    await p.waitForTimeout(1800);
    const r = await p.evaluate(() => {
      const R = e => e.getBoundingClientRect();
      const enc = R(document.querySelector('.gabinete__enc'));
      const caja = R(document.querySelector('.vitrina.es-activa .vitrina__caja'));
      const puntos = R(document.getElementById('rl-puntos'));
      const sobre = [...document.querySelectorAll('.vitrina__caja')].filter(c => c.querySelector('figcaption,h3,p')).length;
      return { hueco1: caja.top - enc.bottom, hueco2: puntos.top - caja.bottom, sobre };
    });
    const ok = r.hueco1 >= 12 && r.hueco2 >= 12 && Math.abs(r.hueco1 - r.hueco2) <= 40 && !r.sobre;
    veredicto(`carrusel ${w}x${h}`, ok, `bajo-titulo=${Math.round(r.hueco1)} sobre-puntos=${Math.round(r.hueco2)} texto-encima=${r.sobre}`);
    await ctx.close();
  }
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const nav = await abrir(); await carrusel(nav); await nav.close();
}
