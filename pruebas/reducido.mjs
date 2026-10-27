// Movimiento reducido y celular de lado: la rueda no se monta, las piezas
// quedan en tira horizontal y nada se desborda ni lanza errores.
import { abrir, contexto, cargar, veredicto } from './comun.mjs';

export async function reducido(nav) {
  const casos = [
    ['movimiento reducido', 390, 844, { reducedMotion: 'reduce' }],
    ['celular de lado', 844, 390, {}]
  ];
  for (const [nombre, w, h, extra] of casos) {
    const ctx = await contexto(nav, w, h, extra);
    const { p, errores } = await cargar(ctx);
    const r = await p.evaluate(() => ({
      rueda: document.getElementById('ruleta').classList.contains('es-ruleta'),
      ancho: document.documentElement.scrollWidth, vw: document.documentElement.clientWidth,
      fichas: document.querySelectorAll('.vitrina').length,
      numerosCoinciden: [...document.querySelectorAll('.vitrina')]
        .every(v => v.querySelector('.vitrina__num').textContent === v.dataset.num)
    }));
    veredicto(`${nombre} ${w}x${h}`, !r.rueda && r.ancho <= r.vw && r.fichas === 7 && r.numerosCoinciden && !errores.length,
      `rueda=${r.rueda} fichas=${r.fichas} numeros=${r.numerosCoinciden} errores=${errores.length}`);
    await ctx.close();
  }
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const nav = await abrir(); await reducido(nav); await nav.close();
}
