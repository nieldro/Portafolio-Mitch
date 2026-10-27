// Las piezas se ven completas: el marco de cada lámina mide lo mismo que su
// imagen (nada de bandas ni recorte) y ninguna imagen sale deformada.
import { abrir, contexto, cargar, recorrer, veredicto } from './comun.mjs';

export async function laminas(nav) {
  for (const [w, h] of [[390, 844], [1280, 800]]) {
    const ctx = await contexto(nav, w, h);
    const { p } = await cargar(ctx);
    await recorrer(p);
    await p.waitForTimeout(800);
    const r = await p.evaluate(() => {
      const marcos = [...document.querySelectorAll('.lamina__marco')].map(m => {
        const b = m.getBoundingClientRect(), i = m.querySelector('img').getBoundingClientRect();
        return Math.abs(b.width - i.width) + Math.abs(b.height - i.height);
      });
      // el zoom de entrada (scale 1.12) llegó a quedarse pegado y recortaba cada lámina
      const deformadas = [...document.querySelectorAll('img')].filter(i => {
        if (!i.complete || !i.naturalWidth || getComputedStyle(i).objectFit !== 'fill') return false;
        const b = i.getBoundingClientRect();
        return Math.abs(b.width / b.height - i.naturalWidth / i.naturalHeight) > .08 * (i.naturalWidth / i.naturalHeight);
      }).length;
      const ocultas = [...document.querySelectorAll('.oficio,.paso,.taller__grupo,.linea li,.mas__pieza')]
        .filter(e => parseFloat(getComputedStyle(e).opacity) < .99).length;
      return { peor: Math.max(...marcos), deformadas, ocultas };
    });
    veredicto(`laminas ${w}x${h}`, r.peor < 2 && !r.deformadas && !r.ocultas,
      `marco-vs-imagen=${r.peor.toFixed(1)}px deformadas=${r.deformadas} sin-aparecer=${r.ocultas}`);
    await ctx.close();
  }
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const nav = await abrir(); await laminas(nav); await nav.close();
}
