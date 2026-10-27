// El visor de piezas: el pie (título y categoría) cabe siempre en pantalla.
// Una pantalla baja o la barra de tareas dejaban «Publicidad · 2025» cortado.
import { abrir, contexto, cargar, veredicto } from './comun.mjs';

const TAMANOS = [[1366, 650], [1280, 600], [1024, 600], [1920, 1080], [390, 664], [390, 844], [360, 640]];

export async function visor(nav) {
  for (const [w, h] of TAMANOS) {
    const ctx = await contexto(nav, w, h);
    const { p } = await cargar(ctx);
    await p.evaluate(() => document.querySelector('.lamina__marco[data-src*="ferrari-icons"]').scrollIntoView({ block: 'center' }));
    await p.waitForTimeout(1500);
    await p.evaluate(() => document.querySelector('.lamina__marco[data-src*="ferrari-icons"]').click());
    await p.waitForTimeout(1300);
    const r = await p.evaluate(() => {
      const R = e => e.getBoundingClientRect();
      return {
        abierto: !document.getElementById('visor').hidden,
        imagenArriba: R(document.getElementById('visor-img')).top,
        pieAbajo: R(document.querySelector('.visor__marco p')).bottom,
        alto: innerHeight
      };
    });
    veredicto(`visor ${w}x${h}`, r.abierto && r.imagenArriba >= 0 && r.pieAbajo <= r.alto - 16,
      `pie-abajo=${Math.round(r.pieAbajo)}/${r.alto}`);
    await ctx.close();
  }
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const nav = await abrir(); await visor(nav); await nav.close();
}
