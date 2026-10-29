// Cada página pública lleva lo que buscadores y vistas previas necesitan:
// título, descripción, URL canónica absoluta y color de la barra; la portada
// además trae la imagen social. La 404 se queda fuera del índice.
import { abrir, contexto, veredicto, BASE } from './comun.mjs';

const PUBLICAS = ['', 'hoja-de-vida.html', 'marca.html'];

export async function meta(nav) {
  const ctx = await contexto(nav, 1366, 650);
  const p = await ctx.newPage();
  for (const ruta of PUBLICAS) {
    await p.goto(new URL(ruta, BASE).href);
    const m = await p.evaluate(() => {
      const c = s => document.querySelector(s)?.getAttribute('content') || '';
      return {
        lang: document.documentElement.lang, titulo: document.title,
        descripcion: c('meta[name=description]'), color: c('meta[name=theme-color]'),
        canonica: document.querySelector('link[rel=canonical]')?.href || '',
        og: c('meta[property="og:image"]'), h1: document.querySelectorAll('h1').length
      };
    });
    const nombre = ruta || 'index.html';
    const fallas = [];
    if (m.lang !== 'es') fallas.push('lang');
    if (!m.titulo || m.titulo.length > 70) fallas.push('titulo');
    if (m.descripcion.length < 50 || m.descripcion.length > 200) fallas.push('descripcion');
    if (!/^https:\/\//.test(m.canonica)) fallas.push('canonica');
    if (!/^#[0-9a-f]{6}$/i.test(m.color)) fallas.push('theme-color');
    if (ruta === '' && !/^https:\/\/.+\.png$/.test(m.og)) fallas.push('og:image');
    if (m.h1 !== 1) fallas.push(`h1=${m.h1}`);
    veredicto(`meta ${nombre}`, !fallas.length, fallas.length ? 'falta: ' + fallas.join(', ') : `«${m.titulo}»`);
  }
  await p.goto(new URL('no-existe-esta-lamina', BASE).href);
  const robots = await p.evaluate(() => document.querySelector('meta[name=robots]')?.content || '');
  veredicto('meta 404 fuera del indice', /noindex/.test(robots), `robots=«${robots}»`);
  await ctx.close();
}

if (import.meta.url === `file:///${process.argv[1].replace(/\\/g, '/')}`) {
  const nav = await abrir(); await meta(nav); await nav.close();
}
