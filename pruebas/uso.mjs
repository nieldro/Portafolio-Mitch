// Los botones hacen lo que dicen: contador y teclas del visor, enlace propio por
// lámina, copiar el correo y el carrusel con el teclado.
import { abrir, contexto, cargar, veredicto, BASE } from './comun.mjs';

const CORREO = 'lauraherrera0819@gmail.com';

export async function uso(nav) {
  const ctx = await contexto(nav, 1366, 800, { permissions: ['clipboard-read', 'clipboard-write'] });
  const { p, errores } = await cargar(ctx);
  const titulo = await p.title();

  await p.evaluate(() => document.querySelector('.lamina__marco[data-src*="ferrari-icons"]').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(1500);
  await p.evaluate(() => document.querySelector('.lamina__marco[data-src*="ferrari-icons"]').click());
  await p.waitForTimeout(1000);

  const cuenta = () => p.textContent('#visor-cuenta');
  const abierto = await cuenta();
  const total = Number(abierto.split('/')[1]);
  veredicto('visor: contador «n / total»', /^\d+ \/ \d+$/.test(abierto) && total > 1, abierto);

  const hash = await p.evaluate(() => location.hash);
  veredicto('visor: la lámina abierta tiene su enlace', /^#lamina-\d+$/.test(hash), hash);

  const pestana = await p.title();
  veredicto('visor: la pestaña nombra la lámina', pestana !== titulo && pestana.includes('Michelle Herrera'), pestana);

  await p.keyboard.press('End');
  await p.waitForTimeout(300);
  veredicto('visor: Fin va a la última', (await cuenta()).startsWith(total + ' /'), await cuenta());
  await p.keyboard.press('Home');
  await p.waitForTimeout(300);
  veredicto('visor: Inicio va a la primera', (await cuenta()).startsWith('1 /'), await cuenta());
  await p.keyboard.press('ArrowRight');
  await p.waitForTimeout(300);
  veredicto('visor: la flecha derecha avanza', (await cuenta()).startsWith('2 /'), await cuenta());

  await p.keyboard.press('Escape');
  await p.waitForTimeout(700);
  const cerrado = await p.evaluate(() => ({ oculto: document.getElementById('visor').hidden, hash: location.hash, titulo: document.title }));
  veredicto('visor: al cerrar se limpia el enlace y vuelve el título', cerrado.oculto && cerrado.hash === '' && cerrado.titulo === titulo,
    `hash="${cerrado.hash}" titulo="${cerrado.titulo}"`);

  await p.evaluate(() => document.getElementById('correspondencia').scrollIntoView({ block: 'center' }));
  await p.waitForTimeout(1500);
  await p.click('#copiar-correo');
  await p.waitForTimeout(400);
  const aviso = await p.textContent('#copiado');
  const portapapeles = await p.evaluate(() => navigator.clipboard.readText());
  veredicto('correo: «Copiar» copia y avisa', aviso === 'Correo copiado' && portapapeles === CORREO, `aviso="${aviso}"`);

  veredicto('sin errores de consola', errores.length === 0, errores.join(' | '));
  await ctx.close();

  const directo = await contexto(nav, 1366, 800);
  const { p: q } = await cargar(directo, BASE + '#lamina-3');
  await q.waitForTimeout(800);
  const llegada = await q.evaluate(() => ({ oculto: document.getElementById('visor').hidden, cuenta: document.getElementById('visor-cuenta').textContent }));
  veredicto('visor: llegar con #lamina-3 la abre', !llegada.oculto && llegada.cuenta.startsWith('3 /'), llegada.cuenta);
  await directo.close();
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const nav = await abrir(); await uso(nav); await nav.close();
}
