# Historial de cambios

Portafolio de Laura Michelle Herrera. Los más recientes arriba.

## 2026-10-30

- **Visor:** contador «3 / 13»; Inicio y Fin saltan a la primera y a la
  última; deslizar el dedo pasa de lámina; cada lámina tiene su enlace
  (`#lamina-3`) y se abre al llegar con él; la pestaña y el diálogo nombran la
  lámina abierta; las vecinas se precargan.
- **Correspondencia:** botón «Copiar el correo» con aviso y plan B si el
  navegador no da portapapeles.
- **Barra:** se retira al bajar y vuelve al subir o al enfocarla con el
  teclado; «Correspondencia» se rellena al llegar a esa sección.
- **Menú del celular:** un toque fuera lo cierra y se cierra solo al pasar a
  ancho de escritorio.
- **Carrusel:** flechas del teclado y gesto lateral del trackpad giran la rueda;
  cada punto muestra el nombre de su pieza; «Ver la lámina» dice cuál abre.
- **Marquesinas:** frenan bajo el cursor y se pausan fuera de pantalla.
- **Pie, 404 y telón:** enlaces en el pie; la 404 ofrece la hoja de vida y
  «volver a la página anterior»; el telón es más corto al volver en la misma
  pestaña; la hoja de vida se precarga al acercarse a su enlace.
- **Pruebas:** `uso.mjs` comprueba lo anterior en un navegador real.

## 2026-10-29

- **Metadatos:** la hoja de vida y la hoja de marca ya llevan URL canónica y
  color de barra; la hoja de marca tiene descripción; ambas tienen favicon e
  icono de pantalla de inicio. La portada permite vista previa grande.
- **Manifiesto:** identificador estable, categorías y accesos directos a la
  hoja de vida y a la hoja de marca.
- **Contraste:** quien pide más contraste en el sistema recibe ceniza y textos
  tenues más claros; la barra de desplazamiento sigue la paleta.
- **Repo:** `PRODUCT.md`, `humans.txt`, `.gitattributes` y cabeceras de
  seguridad en `vercel.json`.
- **Pruebas nuevas:** metadatos, enlaces y accesibilidad.

## 2026-10-27

- **Portada:** el marco ornamental ya encierra el contenido. El rectángulo del
  marco medía 209 px de alto en celular mientras sus esquinas estaban 700 px
  más abajo, y sus líneas cruzaban el texto y «Descender».
- **Carrusel:** la pieza activa se centra entre el título y los puntos y usa el
  espacio disponible; ya no choca con el título en pantallas bajas ni deja
  vacío abajo en celulares altos.
- **Visor:** la imagen deja sitio al pie; «Publicidad · 2025» ya no se corta.
- **Bruma House:** se recorta una franja blanca de 6 px que traía la imagen.
- **Pruebas en navegador** (`pruebas/`): desborde, portada, carrusel, visor,
  láminas, teclado, movimiento reducido y páginas internas.

## 2026-10-26

- Piezas verticales completas en el carrusel, sin texto encima; cursor solo con
  la calavera; botones con una sola receta de hover; sin riel lateral.
- Celular: menú con todas las secciones, volver arriba, puntos en el carrusel.
- Imágenes en WebP (de 5 MB a unos 3 MB); sección «Papelería y editorial» con
  las tres piezas horizontales enteras.
- Manifiesto web e iconos (instalable en la pantalla de inicio), SRI en los
  scripts de GSAP, `aria-current` en la barra, README al día.

## 2026-10-23

- Logo nuevo (calavera de gato) vectorizado; ajustes de celular; correo real.
- Tamaño óptico fijo para que la H y la M del nombre no pierdan sus líneas finas.

## 2026-10-13

- Primera versión en GitHub: sitio estático completo, desplegable en Vercel.
