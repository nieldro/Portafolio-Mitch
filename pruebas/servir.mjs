// Servidor estático mínimo para probar el sitio en local, sin Python ni nada extra.
// Uso:  node servir.mjs [puerto]      (por defecto 8765)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.json': 'application/json',
  '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp',
  '.pdf': 'application/pdf', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8'
};

export function servir(puerto = 8765) {
  const servidor = http.createServer((req, res) => {
    let ruta = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if (ruta.endsWith('/')) ruta += 'index.html';
    const archivo = path.join(RAIZ, ruta);
    // nunca salir de la carpeta del sitio
    if (!archivo.startsWith(RAIZ)) { res.writeHead(403).end('no'); return; }
    fs.readFile(archivo, (err, datos) => {
      if (err) {
        const f404 = path.join(RAIZ, '404.html');
        res.writeHead(404, { 'Content-Type': TIPOS['.html'] });
        res.end(fs.existsSync(f404) ? fs.readFileSync(f404) : 'No existe');
        return;
      }
      res.writeHead(200, { 'Content-Type': TIPOS[path.extname(archivo)] || 'application/octet-stream' });
      res.end(datos);
    });
  });
  return new Promise(ok => servidor.listen(puerto, '127.0.0.1', () => ok(servidor)));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const puerto = Number(process.argv[2]) || 8765;
  await servir(puerto);
  console.log(`Sirviendo ${RAIZ} en http://127.0.0.1:${puerto}/`);
}
