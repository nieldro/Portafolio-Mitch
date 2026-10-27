// Navegación con teclado: hay enlace de salto, cada elemento enfocable muestra
// su contorno, y el menú del celular cerrado no recibe foco.
import { abrir, contexto, cargar, veredicto } from './comun.mjs';

export async function teclado(nav) {
  // escritorio: los primeros Tab con contorno visible
  {
    const ctx = await contexto(nav, 1280, 800);
    const { p } = await cargar(ctx);
    const pasos = [];
    for (let i = 0; i < 8; i++) {
      await p.keyboard.press('Tab');
      pasos.push(await p.evaluate(() => {
        const e = document.activeElement, c = getComputedStyle(e);
        return { clase: e.className || e.tagName, contorno: c.outlineStyle !== 'none' && parseFloat(c.outlineWidth) > 0 };
      }));
    }
    veredicto('teclado: enlace de salto primero', /salto/.test(pasos[0].clase), pasos[0].clase);
    veredicto('teclado: todos muestran contorno', pasos.every(x => x.contorno));
    await ctx.close();
  }
  // celular: el panel cerrado no se puede enfocar
  {
    const ctx = await contexto(nav, 390, 844);
    const { p } = await cargar(ctx);
    const visitados = [];
    for (let i = 0; i < 5; i++) {
      await p.keyboard.press('Tab');
      visitados.push(await p.evaluate(() => document.activeElement.className || document.activeElement.id));
    }
    const enPanel = await p.evaluate(() => !!document.activeElement.closest('.barra__panel'));
    veredicto('teclado: panel del menú cerrado sin foco', !enPanel && !visitados.some(c => /solo-movil/.test(c)), visitados.join(' > '));
    await ctx.close();
  }
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const nav = await abrir(); await teclado(nav); await nav.close();
}
