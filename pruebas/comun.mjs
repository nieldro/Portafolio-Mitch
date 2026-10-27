// Piezas compartidas por las pruebas: abrir el navegador, un contexto con el
// tamaño de pantalla pedido, cargar la página y dar el veredicto.
import { chromium } from 'playwright-core';
import fs from 'node:fs';
import path from 'node:path';

export const BASE = process.env.BASE_URL || 'http://127.0.0.1:8765/';

/* Tamaños que importan: celulares chicos, iPhone con y sin barras de Safari,
   tableta, portátil bajo y monitor grande. */
export const TAMANOS = [[320, 640], [390, 664], [390, 844], [768, 1024], [1366, 650], [1920, 1080]];

function buscaChrome() {
  if (process.env.CHROME) return process.env.CHROME;
  const raiz = path.join(process.env.LOCALAPPDATA || '', 'ms-playwright');
  try {
    const carpeta = fs.readdirSync(raiz).filter(n => n.startsWith('chromium-')).sort().pop();
    const exe = path.join(raiz, carpeta, 'chrome-win64', 'chrome.exe');
    if (fs.existsSync(exe)) return exe;
  } catch { /* sin carpeta de Playwright: se usa el navegador que traiga */ }
  return undefined;
}

export const abrir = () => chromium.launch({ executablePath: buscaChrome() });

export function contexto(navegador, ancho, alto, extra = {}) {
  const tactil = ancho < 900;
  return navegador.newContext({
    viewport: { width: ancho, height: alto }, hasTouch: tactil, isMobile: tactil, ...extra
  });
}

/* Carga la página, espera al telón de entrada y devuelve los errores de consola */
export async function cargar(ctx, url = BASE) {
  const p = await ctx.newPage();
  const errores = [];
  p.on('pageerror', e => errores.push(e.message));
  p.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  await p.goto(url);
  await p.waitForTimeout(3500);
  return { p, errores };
}

/* Recorre toda la página para disparar los ScrollTrigger y las imágenes perezosas */
export async function recorrer(p, paso = 500) {
  const total = await p.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < total; y += paso) {
    await p.evaluate(v => window.scrollTo(0, v), y);
    await p.waitForTimeout(90);
  }
  await p.waitForTimeout(1200);
  await p.evaluate(() => window.scrollTo(0, 0));
}

export function veredicto(nombre, ok, detalle = '') {
  console.log(`${ok ? 'OK    ' : 'FALLA '} ${nombre}${detalle ? '  ' + detalle : ''}`);
  if (!ok) process.exitCode = 1;
}
