# Portafolio · Laura Michelle Herrera

Rediseño completo del portafolio. Sitio estático: HTML, CSS y JavaScript, sin
framework ni paso de compilación. Única dependencia externa: GSAP + ScrollTrigger
por CDN, y las tipografías de Google Fonts.

## Cómo verlo

Las rutas son relativas, así que abrir `index.html` con doble clic funciona.
Para que todo se comporte como en producción conviene servirlo:

```powershell
cd C:\Users\dapaez\Documents\portafolio-michelle
python -m http.server 8123
# http://localhost:8123
```

## Dónde está publicado

**https://michelle.35.196.253.146.sslip.io** — servidor de VISE, nginx sirviendo
`/var/www/michelle` directo, sin proceso detrás. Público, sin contraseña. El
repo también puede salir por Vercel (carpeta estática, sin build, raíz como
salida); `.vercelignore` deja fuera lo que no es del sitio.

Empaquetado para el servidor (lo que **no** se sube: originales de trabajo,
generadores, JPG de respaldo, notas internas):

```powershell
tar --exclude='assets/_originales' --exclude='assets/marca/*.py' `
    --exclude='assets/img/*.jpg' --exclude='assets/img/*/*.jpg' `
    --exclude='assets/img/a_webp.py' --exclude='encargo*' --exclude='README.md' `
    --exclude='PRODUCT.md' --exclude='.git' -czf michelle.tgz .
```

Detalles del montaje que no se adivinan:

- El vhost es `vise-michelle`. **No lleva `auth_basic`**: tiene que poder verlo
  cualquiera.
- Escucha en **8443** (IPv4) y en **[::]:443** (IPv6). El 443 lo reparte el
  bloque `stream` de `nginx.conf` por SNI hacia el 8443.
- El certificado se emite con `lego` por TLS-ALPN-01 (el 80 es de otro
  servicio) y se renueva con un timer diario.
- **Desde la red de la oficina el 443 no abre.** Que no cargue desde el PC no
  significa que esté caído: vale un `curl` desde el propio servidor, o abrirlo
  desde el celular con datos.

## Estructura

```
index.html            El portafolio
hoja-de-vida.html     Hoja de vida imprimible (Ctrl+P → PDF, A4)
Laura-Michelle-Herrera-hoja-de-vida.pdf   La misma, ya en PDF de una hoja
marca.html            Hoja del sistema de marca «Mitch»
encargo.html          Cuestionario para Michelle, con miniaturas
encargo-michelle.txt  El mismo cuestionario para pegar en un correo

css/style.css         Tokens de color/tipografía y toda la maqueta
js/main.js            Telón, cursor, revelados, gabinete fijado y visor

assets/img/           Piezas a 1800 px (las que abre el visor)
assets/img/thumb/     Piezas a 900 px (las que se ven en la página)
assets/img/detalle/   Ampliaciones de las cuatro láminas mayores
assets/marca/         SVG de la marca + los generadores
assets/_originales/   Los archivos tal como se descargaron, sin tocar
```

Dos generadores en Python, que son la fuente de verdad — no editar sus
salidas a mano:

```powershell
python assets\marca\generar.py    # los SVG de la marca
python assets\marca\detalles.py   # los recortes de detalle + hoja de contactos
```

## Dirección de arte

La paleta y la materia salen de su propia pieza **Kaomi Arcana**: azabache,
sangre de buey, oro viejo y hueso sobre terciopelo. No se impuso una estética
gótica genérica — se extendió la que ella ya había diseñado.

| Token | Valor | Uso |
|---|---|---|
| `--azabache` | `#0A0809` | Fondo general |
| `--terciopelo` | `#1A0E12` | Fondos de sección y passe-partout |
| `--sangre` | `#6E1220` | Rojo de cuerpo, botones |
| `--carmin` | `#B3121F` | Único acento vivo, muy medido |
| `--oro` | `#B08D57` | Filetes, versalitas, ornamento |
| `--hueso` | `#E6DCC8` | Todo el texto |

Tipografías: **Bodoni Moda** (didona, display), **EB Garamond** (texto y
versalitas), **UnifrakturMaguntia** (solo el monograma «M» y el sello — nunca
en titulares, donde la gótica se vuelve ilegible).

## La firma del sitio

Tres mecánicas, la misma idea: *papel grabado bajo luz de vela*.

1. **El grabado se entinta solo.** Los ornamentos son SVG cuyo trazo se dibuja
   con `stroke-dashoffset` al entrar en pantalla, como una plancha de calcografía.
2. **El damasco solo se ve donde cae la luz.** El papel pintado de fondo está
   enmascarado con un degradado radial que sigue al cursor.
3. **La ruleta.** Las 13 piezas van montadas en una rueda enorme
   (`--radio` ≈ 950 px) cuyo centro cae por debajo de la pantalla: solo se ve
   el arco de arriba. El scroll la gira, y la ficha que llega a las doce manda.

### Cómo está armada la ruleta

- El disco es un elemento de **0 × 0** posicionado en el centro de la rueda.
  Cada ficha se coloca con `rotate(var(--ang)) translateY(calc(var(--radio) * -1))`,
  así que gira **con** la rueda: la que llega arriba queda derecha y las demás
  ladeadas. Por eso el título vive fuera, en `.ruleta__ficha` — sobre una
  tarjeta girada no se podría leer.
- El aro fresado es un `<circle>` con `stroke-dasharray`: las rayas cortas
  hacen de moneda acuñada sin dibujar 120 dientes a mano.
- `--alza` fija a qué altura queda la ficha activa **independientemente del
  radio**: `100svh − alza`. Si cambias el radio, la composición no se mueve.
- En la rueda las imágenes van a sangre (`object-fit:cover`); el
  passe-partout dejaba la pieza diminuta dentro del marco. La obra completa
  se ve en el visor.
- Por debajo de 860 px, o con movimiento reducido, la rueda **no se monta**:
  las mismas fichas quedan como tira horizontal. Es el mismo marcado.
- Las cuatro láminas mayores salen dos veces en la página (como lámina y como
  ficha). El visor **deduplica por `data-src`** para que las flechas no repitan.

## Detalles que cuestan tiempo si no se saben

- El guion (`stroke-dasharray`) de un ornamento **debe ser más largo que el
  trazo**. Con un valor corto el dibujo sale a rayas en vez de entero.
- El telón de entrada arranca con el DOM, no con `window.load`. Colgado de
  `load` esperaba a la última imagen y el visitante veía un sello quieto.
- `.tiene-js` se marca con un script en línea en el `<head>`, antes de pintar.
  Si esperara a `main.js` (que a su vez espera a GSAP), el telón entraría de
  golpe encima de una página ya visible.
- Hay una animación CSS de seguridad que retira el telón a los 6 s: si GSAP no
  llega, el sitio no se queda tapado.
- Sin JavaScript el sitio se ve entero. Telón y velos están apagados por
  defecto y solo existen bajo `html.tiene-js`.
- **El fondo del gabinete va en `.gabinete__pin`, no solo en `.gabinete`.**
  Al fijarse queda en `position:fixed` y el resto de la página sigue
  corriendo por detrás: sin fondo propio se transparenta la sección vecina.
- **En la ruleta no se usa `setPointerCapture`.** Capturar el puntero para
  el arrastre hacía que el `click` se disparara sobre la ruleta y no sobre la
  ficha, así que abrir una lámina con clic dejaba de funcionar. El arrastre
  escucha en `window` y solo se considera arrastre a partir de 6 px.
- **El indicador «Descender» va en el flujo, no en absoluto.** Colgado del
  fondo del hero se montaba encima de los botones en pantallas bajas.
- **La rueda también se monta en celular.** Con `--radio` más cerrado caben
  tres fichas en un teléfono; degradarla a tira dejaba la mitad del sitio sin
  fuerza. Solo se cae con movimiento reducido.
- **Todo `[id]` lleva `scroll-margin-top`.** La barra es fija: sin eso, ir a
  una sección desde el menú deja el título escondido detrás de ella.
- **Cosas que en celular hay que cambiar, no solo encoger:** el damasco va a
  otra escala (a la de escritorio se ve como gotas enormes y le pelea al
  texto), el capitular **no flota** (a 390 px la letra queda despegada de su
  palabra y se lee «E mpaque»), y los instrumentos van en línea y no a
  renglón por herramienta (eran 1.200 px de scroll para una lista).
- **El marco del frontispicio arranca a 80 px en celular**, no a 16: si no,
  la voluta derecha choca con el botón del menú.
- **El `.ps1` necesita BOM.** PowerShell 5.1 lee un `.ps1` sin BOM como ANSI y
  destroza los acentos de los mensajes en pantalla.
- **En la hoja de vida, el quiebre responsive va con `@media screen`.**
  El papel mide 794 px al imprimir, así que un `@media (max-width:900px)` a
  secas se dispara también en la impresión, apila las dos columnas y duplica
  la hoja. Para medir si cabe en A4 hay que emular medio `print` **y** un
  ancho de 794 px; medir a 1280 px da un resultado falso y optimista.

## Contenido

Las 13 láminas del catálogo son las piezas reales que ella tenía subidas al
portafolio anterior. **No se incluyó ningún proyecto inventado**: el sitio
previo mostraba además 15 proyectos de relleno con fotos de banco
(Raíz Café, #SéTuVoz, Mila Chocolatería, Acclie, Wine & Co., Lóelido, Cooldey,
Sainte, Verde Hotel, Nexa, Pop Color, Miel Permaliue, Palenta, Whisper Wedding,
Cuentos del Bosque). Si alguno corresponde a trabajo real, hay que pedirle los
archivos y añadirlo con su imagen verdadera.
