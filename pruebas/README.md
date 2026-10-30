# Pruebas en navegador

Un navegador sin interfaz (Playwright) abre el sitio en varios tamaños de
pantalla y comprueba lo que ya falló alguna vez. Ninguna prueba es teórica:
cada una nació de un problema real visto en el sitio.

```powershell
cd pruebas
npm install          # solo la primera vez (playwright-core)
node todo.mjs        # sirve el sitio en local y corre todo
```

Para probar el sitio ya publicado:

```powershell
$env:BASE_URL = "https://michelle.35.196.253.146.sslip.io/"; node todo.mjs
```

Cada archivo se puede correr solo (`node portada.mjs`, etc.) con el sitio
servido en `http://127.0.0.1:8765/` (`node servir.mjs`).

| Prueba | Qué vigila | Por qué existe |
|---|---|---|
| `desborde.mjs` | Sin scroll horizontal, sin imágenes rotas ni errores, de 320 a 1920 px | Revisar el responsive a ojo se escapaba |
| `portada.mjs` | El marco ornamental encierra el contenido con holgura | El rectángulo medía 209 px y cruzaba el contenido |
| `carrusel.mjs` | La pieza activa queda centrada entre el título y los puntos | El carrusel chocaba con el título y dejaba vacío abajo |
| `visor.mjs` | El pie «Publicidad · 2025» cabe en pantalla | En un portátil bajo se cortaba |
| `laminas.mjs` | El marco mide lo mismo que la imagen; nada deformado | Un zoom de entrada pegado recortaba cada lámina |
| `teclado.mjs` | Enlace de salto, contornos de foco, menú cerrado sin foco | Accesibilidad con teclado |
| `reducido.mjs` | Movimiento reducido y celular de lado: tira en vez de rueda | Modos que casi nadie prueba |
| `paginas.mjs` | Hoja de vida, hoja de marca y 404 cargan; la 404 responde 404 | Las páginas internas nunca se probaban |
| `meta.mjs` | Título, descripción, URL canónica, color de barra y `noindex` en la 404 | Hojas internas salieron sin descripción ni canónica |
| `enlaces.mjs` | Anclas con destino, archivos internos que responden 200, `noopener` | Un enlace roto no se ve hasta que alguien lo toca |
| `accesibilidad.mjs` | `alt` en imágenes, nombre en botones y enlaces, `id` únicos, un solo `<main>` | Lo que un lector de pantalla necesita para no perderse |
| `uso.mjs` | Contador y teclas del visor, enlace `#lamina-N`, título de la pestaña, «Copiar el correo» | Que un botón se vea no prueba que haga algo |

## Trampas conocidas

- Con la pieza del carrusel **girada**, su caja medida se infla y la prueba
  engaña: por eso mide justo al arrancar el anclaje (`scrollTo(inicio + 2)`).
- Chromium instalado por Playwright: la ruta se busca en
  `%LOCALAPPDATA%\ms-playwright`; con otra instalación, `CHROME=<ruta al exe>`.
- Las capturas de pantalla no se guardan en el repo (`/*.png` está ignorado en
  la raíz): mirar el render sigue siendo parte de la revisión.
