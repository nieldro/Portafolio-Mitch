// Corre todas las pruebas. Si no hay un servidor en BASE_URL, levanta uno propio.
//   node todo.mjs                      (sirve el sitio en local y prueba)
//   BASE_URL=https://... node todo.mjs (prueba el sitio publicado)
import { abrir, BASE } from './comun.mjs';
import { servir } from './servir.mjs';
import { desborde } from './desborde.mjs';
import { portada } from './portada.mjs';
import { carrusel } from './carrusel.mjs';
import { visor } from './visor.mjs';
import { laminas } from './laminas.mjs';
import { teclado } from './teclado.mjs';
import { reducido } from './reducido.mjs';
import { paginas } from './paginas.mjs';

const propio = !process.env.BASE_URL ? await servir(new URL(BASE).port) : null;
const nav = await abrir();
try {
  for (const prueba of [desborde, portada, carrusel, visor, laminas, teclado, reducido, paginas]) {
    await prueba(nav);
  }
} finally {
  await nav.close();
  if (propio) propio.close();
}
console.log(process.exitCode ? '\nHay pruebas que fallan.' : '\nTodo en orden.');
