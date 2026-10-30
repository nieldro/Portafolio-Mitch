/* ═══════════════════════════════════════════════════════════
   Michelle Herrera · Catálogo de láminas
   El grabado se entinta solo; el damasco solo se ve
   donde cae la luz de la vela.
   ═══════════════════════════════════════════════════════════ */

document.documentElement.classList.add('tiene-js');

const quieto = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const fino   = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const ancho  = () => window.innerWidth;

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: 'power3.out' });

/* En celular, esconder o mostrar la barra del navegador dispara un
   `resize`. Sin esto, ScrollTrigger recalcula a mitad de scroll y la
   sección fijada pega un salto. */
ScrollTrigger.config({ ignoreMobileResize: true });

/* ───────── Partir texto en palabras enmascaradas ───────── */

function partir(el) {
  if (el.dataset.partido) return [...el.querySelectorAll('.linea-int')];
  const palabras = el.textContent.trim().split(/\s+/);
  el.textContent = '';
  const internos = [];
  palabras.forEach((palabra, i) => {
    const mask = document.createElement('span');
    mask.className = 'linea-mask';
    mask.style.display = 'inline-block';
    mask.style.verticalAlign = 'top';
    const int = document.createElement('span');
    int.className = 'linea-int';
    int.textContent = palabra;
    mask.appendChild(int);
    el.appendChild(mask);
    if (i < palabras.length - 1) el.appendChild(document.createTextNode(' '));
    internos.push(int);
  });
  el.dataset.partido = '1';
  return internos;
}

/* ───────── Telón de entrada ───────── */

const telon = document.getElementById('telon');

function alzarTelon() {
  const t = gsap.timeline();
  t.to(telon, { opacity: 0, duration: .8, ease: 'power2.inOut' })
   .set(telon, { display: 'none' })
   .add(entrarFrontispicio, '-=.3');
  return t;
}

function correrTelon() {
  if (telon.dataset.corrido) return;
  telon.dataset.corrido = '1';
  if (quieto) { telon.style.display = 'none'; entrarFrontispicio(); return; }

  const cuenta = { v: 0 };
  const salida = telon.querySelector('.telon__cuenta');

  gsap.timeline()
    .to('.telon__marca', { opacity: 1, duration: .9 }, 0)
    .to('.telon__linea', { scaleX: 1, duration: 1.5, ease: 'power2.inOut' }, 0)
    .to(cuenta, {
      v: 100, duration: 1.5, ease: 'power1.inOut',
      onUpdate: () => { salida.textContent = Math.round(cuenta.v); }
    }, 0)
    .to('.telon__centro', { scale: .94, opacity: 0, duration: .6, ease: 'power2.in' }, '+=.15')
    .add(alzarTelon);
}

/* ───────── Frontispicio ───────── */

function entrarFrontispicio() {
  const t = gsap.timeline({ defaults: { ease: 'power3.out' } });

  t.to('.cartela__caja', { strokeDashoffset: 0, duration: 2.4, stagger: .2, ease: 'power2.inOut' })
   .to('.cartela-esq', { strokeDashoffset: 0, duration: 1.4, stagger: .12, ease: 'power2.inOut' }, .3)
   .from('.frontis .cejilla', { yPercent: 110, opacity: 0, duration: .9 }, .35)
   .from(partir(document.querySelector('.masthead__linea')),
         { yPercent: 118, duration: 1.15, stagger: .06 }, .45)
   .from(partir(document.querySelector('.masthead__linea--dos')),
         { yPercent: 118, duration: 1.15, stagger: .06 }, .58)
   .from('.frontis__regla svg', { scaleX: 0, opacity: 0, duration: 1, transformOrigin: 'center' }, .95)
   .from('.frontis__tesis', { y: 26, opacity: 0, duration: 1 }, 1.05)
   .from('.frontis__sub', { y: 20, opacity: 0, duration: .9 }, 1.2)
   .from('.frontis__acciones > *', { y: 20, opacity: 0, duration: .8, stagger: .1 }, 1.3)
   .from('.frontis__baja', { opacity: 0, duration: .8 }, 1.55);
}

/* ───────── La vela: el damasco solo aparece bajo el cursor ───────── */

const cursor = document.querySelector('.cursor');
const calavera = { x: innerWidth / 2, y: innerHeight / 2 };
let raton      = { x: innerWidth / 2, y: innerHeight / 2 };

/* El cursor es la calavera de la marca y nada más: sin anillo ni punto.
   Sigue al mouse con un pequeño retraso, crece sobre lo que se puede
   pulsar y se hunde al hacer clic. La clase `cursor-marca` esconde el
   cursor del sistema solo después del primer movimiento, para que nunca
   se quede el usuario sin puntero. */
if (fino) {
  const sigEl = cursor.querySelector('.cursor__sig');
  gsap.set(sigEl, { xPercent: -50, yPercent: -50, scale: .6, opacity: 0 });

  window.addEventListener('mousemove', e => {
    raton.x = e.clientX;
    raton.y = e.clientY;
    if (!cursor.classList.contains('esta-vivo')) {
      cursor.classList.add('esta-vivo');
      document.documentElement.classList.add('cursor-marca');
      calavera.x = raton.x; calavera.y = raton.y;
      gsap.to(sigEl, { opacity: 1, scale: 1, duration: .4, ease: 'back.out(2)' });
    }
    document.documentElement.style.setProperty('--mx', e.clientX + 'px');
    document.documentElement.style.setProperty('--my', e.clientY + 'px');
  }, { passive: true });
  document.addEventListener('mouseleave', () => gsap.to(sigEl, { opacity: 0, duration: .25 }));
  document.addEventListener('mouseenter', () => {
    if (cursor.classList.contains('esta-vivo')) gsap.to(sigEl, { opacity: 1, duration: .25 });
  });

  gsap.ticker.add(() => {
    calavera.x += (raton.x - calavera.x) * .32;
    calavera.y += (raton.y - calavera.y) * .32;
    gsap.set(sigEl, { x: calavera.x, y: calavera.y });
  });

  const crece = () => gsap.to(sigEl, { scale: 1.55, duration: .35, ease: 'back.out(2)', overwrite: 'auto' });
  const normal = () => gsap.to(sigEl, { scale: 1, duration: .3, ease: 'power2.out', overwrite: 'auto' });
  document.querySelectorAll('a, button, [data-visor]').forEach(el => {
    el.addEventListener('mouseenter', crece);
    el.addEventListener('mouseleave', normal);
  });
  window.addEventListener('mousedown', () => gsap.to(sigEl, { scale: .8, duration: .12, overwrite: 'auto' }));
  window.addEventListener('mouseup', () => gsap.to(sigEl, { scale: 1, duration: .25, overwrite: 'auto' }));
}
/* ───────── Barra ───────── */

const barra = document.getElementById('barra');
const hamb  = document.getElementById('hamb');

ScrollTrigger.create({
  start: 'top -80',
  onUpdate: self => barra.classList.toggle('esta-posada', self.scroll() > 80)
});

/* La barra se retira al bajar leyendo y vuelve al subir. Nunca se esconde
   con el menú abierto ni mientras el teclado está dentro de ella. */
let yPrevio = window.scrollY;
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (Math.abs(y - yPrevio) < 6) return;
  const baja = y > yPrevio;
  yPrevio = y;
  const quedaEnFoco = barra.contains(document.activeElement);
  barra.classList.toggle('esta-escondida',
    baja && y > 480 && !quedaEnFoco && !barra.classList.contains('esta-abierta'));
}, { passive: true });
barra.addEventListener('focusin', () => barra.classList.remove('esta-escondida'));

function menu(abierta) {
  barra.classList.toggle('esta-abierta', abierta);
  hamb.setAttribute('aria-expanded', String(abierta));
  hamb.setAttribute('aria-label', abierta ? 'Cerrar menú' : 'Abrir menú');
  document.body.classList.toggle('esta-quieto', abierta);
}
hamb.addEventListener('click', () => menu(!barra.classList.contains('esta-abierta')));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && barra.classList.contains('esta-abierta')) { menu(false); hamb.focus(); }
});

/* Si la ventana se ensancha (el celular gira) el menú abierto se cierra:
   en escritorio no hay hoja y el cuerpo se quedaba sin scroll */
window.addEventListener('resize', () => {
  if (window.innerWidth > 860 && barra.classList.contains('esta-abierta')) menu(false);
});

/* Un toque fuera de la barra cierra el menú del celular */
document.addEventListener('click', e => {
  if (barra.classList.contains('esta-abierta') && !barra.contains(e.target)) menu(false);
});

barra.querySelectorAll('.barra__nav a, .barra__cta').forEach(a => {
  a.addEventListener('click', () => menu(false));
});

/* ───────── Revelados generales ───────── */

document.querySelectorAll('[data-revelar]').forEach(el => {
  if (el.closest('.frontis')) return;          // el hero lo mueve su propia línea
  gsap.from(el, {
    y: 34, opacity: 0, duration: 1,
    scrollTrigger: { trigger: el, start: 'top 88%' }
  });
});

document.querySelectorAll('[data-partir]').forEach(el => {
  if (el.closest('.frontis')) return;          // el hero lo mueve su propia línea
  gsap.from(partir(el), {
    yPercent: 118, duration: 1.05, stagger: .05,
    scrollTrigger: { trigger: el, start: 'top 88%' }
  });
  /* El desenfoque va en el título entero, no por palabra: una sola capa
     que el navegador compone barato. */
  if (!quieto) {
    gsap.from(el, {
      filter: 'blur(9px)', duration: 1.2, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  }
});

/* ───────── Listas: entran en escalera ───────── */

if (!quieto) {
  const listas = '.oficio, .paso, .taller__grupo, .linea li';
  gsap.set(listas, { opacity: 0, y: 26 });
  ScrollTrigger.batch(listas, {
    start: 'top 92%',
    once: true,
    onEnter: lote => gsap.to(lote, {
      opacity: 1, y: 0, duration: .9, stagger: .08, ease: 'power3.out',
      overwrite: true, clearProps: 'transform'
    })
  });
}
/* ───────── Sección actual en la barra + volver arriba ─────────
   La posición se mide en vivo, no con un ScrollTrigger por sección: el
   anclaje del gabinete mete dos pantallas de espaciado y dejaba todas las
   medidas de más abajo corridas, marcando la sección equivocada. Las
   secciones sin enlace propio cuentan para la anterior que sí lo tiene. */

const enlacesBarra = [...barra.querySelectorAll('.barra__nav a:not(.solo-movil)')];
const dueno = {
  laminas: 'laminas', mas: 'laminas', pantalla: 'laminas', gabinete: 'gabinete', retrato: 'retrato',
  oficios: 'oficios', metodo: 'oficios', trayectoria: 'oficios'
};
const tramos = Object.keys(dueno)
  .map(id => ({ id, el: document.getElementById(id) }))
  .filter(t => t.el);
const subir = document.getElementById('subir');

let pintandoNav = false;
function actualizarNav() {
  pintandoNav = false;
  {
    const linea = window.scrollY + window.innerHeight * .45;
    let aqui = null;
    for (const t of tramos) {
      if (t.el.getBoundingClientRect().top + window.scrollY <= linea) aqui = t.id;
    }
    const objetivo = aqui ? dueno[aqui] : null;
    enlacesBarra.forEach(a => {
      const aqui = a.getAttribute('href') === '#' + objetivo;
      a.classList.toggle('esta-aqui', aqui);
      if (aqui) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
    });
    if (subir) subir.classList.toggle('es-visible', window.scrollY > window.innerHeight * 1.1);
  }
}
window.addEventListener('scroll', () => {
  if (!pintandoNav) { pintandoNav = true; requestAnimationFrame(actualizarNav); }
}, { passive: true });
actualizarNav();

/* «Volver arriba» lleva también el foco al inicio del contenido: el botón
   se esconde al llegar y el teclado no debe quedarse en el aire */
if (subir) {
  subir.addEventListener('click', () => {
    document.getElementById('contenido').focus({ preventScroll: true });
  });
}
/* ───────── Las piezas web se descubren de abajo hacia arriba ───────── */

if (!quieto) {
  gsap.utils.toArray('.pieza-web').forEach(p => {
    gsap.from(p.querySelector('.pieza-web__ventana'), {
      clipPath: 'inset(0 0 100% 0)', y: 44, duration: 1.25, ease: 'power4.out',
      scrollTrigger: { trigger: p, start: 'top 86%' }
    });
    gsap.from(p.querySelector('.pieza-web__pie').children, {
      y: 26, opacity: 0, duration: .8, stagger: .08,
      scrollTrigger: { trigger: p, start: 'top 82%' }
    });
  });

  /* El camafeo sube más despacio que su texto */
  const cam = document.querySelector('[data-camafeo]');
  if (cam) {
    gsap.fromTo(cam, { yPercent: -5 }, {
      yPercent: 7, ease: 'none',
      scrollTrigger: { trigger: '#retrato', start: 'top bottom', end: 'bottom top', scrub: 1.1 }
    });
  }
}

/* ───────── El damasco se desplaza más lento que la página ─────────
   Se mueve el fondo, no el elemento: la máscara de la vela está anclada
   a su caja y trasladarlo la despegaría del cursor. */

if (!quieto) {
  gsap.to('.damasco', {
    backgroundPositionY: '900px',
    ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: 1.2 }
  });
}

/* ───────── Aguja de avance ───────── */

const aguja = document.getElementById('aguja');
ScrollTrigger.create({
  start: 0,
  end: () => document.documentElement.scrollHeight - window.innerHeight,
  onUpdate: self => gsap.set(aguja, { scaleX: self.progress })
});

/* ───────── Cesuras: el corte entre secciones se dibuja ───────── */

gsap.utils.toArray('[data-cesura]').forEach(c => {
  const lineas = c.querySelectorAll('.cesura__linea');
  const sig = c.querySelector('.cesura__sig');
  if (quieto) {
    gsap.set(lineas, { scaleX: 1 });
    gsap.set(sig, { opacity: 1 });
    return;
  }
  gsap.timeline({ scrollTrigger: { trigger: c, start: 'top 92%' } })
    .to(lineas, { scaleX: 1, duration: 1.1, ease: 'power3.inOut' })
    .fromTo(sig, { opacity: 0, scale: .35, rotate: -30 },
                 { opacity: 1, scale: 1, rotate: 0, duration: .8, ease: 'back.out(2.2)' }, '-=.55');
});

if (fino && !quieto) {
  /* ───────── Las láminas se inclinan hacia el cursor ───────── */
  document.querySelectorAll('.lamina__marco').forEach(m => {
    m.addEventListener('mousemove', e => {
      const r = m.getBoundingClientRect();
      gsap.to(m, {
        rotateY: ((e.clientX - r.left) / r.width - .5) * 6,
        rotateX: -((e.clientY - r.top) / r.height - .5) * 6,
        transformPerspective: 1000,
        duration: .6, ease: 'power2.out'
      });
    });
    m.addEventListener('mouseleave', () =>
      gsap.to(m, { rotateX: 0, rotateY: 0, duration: 1, ease: 'power3.out' }));
  });
}

/* ───────── Marquesina, con inercia según el scroll ───────── */

function cinta(el, duracion, sentido) {
  if (quieto) return null;
  return gsap.to(el, {
    xPercent: -50 * sentido,
    duration: duracion,
    ease: 'none',
    repeat: -1,
    modifiers: { xPercent: gsap.utils.unitize(x => parseFloat(x) % 50) }
  });
}

const pista = cinta(document.getElementById('pista'), 34, 1);
const cintaInstr = cinta(document.getElementById('cinta'), 28, 1);

/* La cinta se acelera con el scroll, cambia de sentido según se suba o
   se baje, y vuelve sola a su paso. */
let empuje = 0;
let sentido = 1;
let sentidoSuave = 1;
ScrollTrigger.create({
  onUpdate: self => {
    empuje = gsap.utils.clamp(0, 4, Math.abs(self.getVelocity()) / 320);
    if (self.direction) sentido = self.direction;
  }
});
gsap.ticker.add(() => {
  empuje += (0 - empuje) * .06;
  sentidoSuave += (sentido - sentidoSuave) * .05;   // el volantazo se nota feo
  [pista, cintaInstr].forEach(t => {
    if (t) t.timeScale(sentidoSuave * (1 + empuje));
  });
});

/* ───────── Láminas mayores: el velo se levanta ───────── */

document.querySelectorAll('[data-lamina]').forEach(lam => {
  const marco  = lam.querySelector('.lamina__marco');
  const velo   = lam.querySelector('.lamina__velo');
  const img    = lam.querySelector('img');
  const margen = lam.querySelector('.lamina__margen');

  if (!quieto) {
    gsap.timeline({ scrollTrigger: { trigger: marco, start: 'top 82%' } })
      .set(velo, { scaleY: 1 })
      .to(velo, { scaleY: 0, duration: 1.25, ease: 'power4.inOut' })
      .fromTo(img, { scale: 1.12 }, { scale: 1, duration: 1.5, ease: 'power3.out', clearProps: 'transform' }, 0)
      .from(margen.querySelector('.lamina__num'),
            { yPercent: 60, opacity: 0, duration: .9 }, .35)
      .from([margen.querySelector('.lamina__cat'),
             margen.querySelector('.lamina__tit'),
             margen.querySelector('.lamina__txt'),
             margen.querySelector('.enlace')],
            { y: 26, opacity: 0, duration: .85, stagger: .09 }, .45);
  } else {
    gsap.set(velo, { display: 'none' });
  }
});

/* ───────── Papelería y editorial: entran de a una ───────── */

if (!quieto) {
  gsap.from('.mas__pieza', {
    y: 40, opacity: 0, duration: 1, stagger: .14, ease: 'power3.out',
    scrollTrigger: { trigger: '.mas__fila', start: 'top 86%' },
    clearProps: 'transform,opacity'
  });
}

/* ───────── Tiras de detalle ───────── */

gsap.utils.toArray('.detalles').forEach(tira => {
  gsap.from(tira.querySelectorAll('figure'), {
    y: 28, opacity: 0, duration: .85, stagger: .1,
    scrollTrigger: { trigger: tira, start: 'top 92%' }
  });
});

/* ───────── La ruleta ─────────
   Una rueda de siete fichas cuyo centro queda por debajo de la
   pantalla. El scroll la gira; la ficha que llega arriba manda.  */

const gab    = document.getElementById('gabinete');
const ruleta = document.getElementById('ruleta');
const disco  = document.getElementById('disco');
const guia   = document.getElementById('gab-actual');
const fichas = [...disco.querySelectorAll('.vitrina')];
const PASO   = 360 / fichas.length;

const fNum  = document.getElementById('ficha-num');
const fTit  = document.getElementById('ficha-tit');
const fMeta = document.getElementById('ficha-meta');

fichas.forEach((f, i) => f.style.setProperty('--ang', (i * PASO).toFixed(4) + 'deg'));

let activo = -1;

/* Puntos: un toque lleva a esa pieza por el camino más corto */
const contPuntos = document.getElementById('rl-puntos');
const puntos = fichas.map((f, i) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.className = 'ruleta__punto';
  b.setAttribute('aria-label', 'Ir a la pieza ' + f.dataset.num + ': ' + f.dataset.titulo);
  b.addEventListener('click', () => {
    let d = i - Math.max(activo, 0);
    const n = fichas.length;
    if (d > n / 2) d -= n;
    if (d < -n / 2) d += n;
    inercia = 0;
    rotArrastre -= d * PASO;
  });
  contPuntos.appendChild(b);
  return b;
});

function marcarActiva(i) {
  if (i === activo || !fichas[i]) return;
  activo = i;
  const f = fichas[i];
  fichas.forEach((x, j) => x.classList.toggle('es-activa', j === i));
  puntos.forEach((p, j) => {
    p.classList.toggle('es-activo', j === i);
    p.setAttribute('aria-current', j === i ? 'true' : 'false');
  });
  /* Solo se ven la activa y sus vecinas: las demás de la rueda se apagan,
     para que no se amontonen detrás de los botones */
  const alcance = window.innerWidth <= 860 ? 1 : 2;
  fichas.forEach((x, j) => {
    const d = Math.abs(j - i);
    x.classList.toggle('es-lejos', Math.min(d, fichas.length - d) > alcance);
  });
  guia.textContent = f.dataset.num;

  if (quieto) {
    fNum.textContent = f.dataset.num;
    fTit.textContent = f.dataset.titulo;
    fMeta.textContent = f.dataset.pie;
    return;
  }
  gsap.timeline()
    .to('#ficha', { opacity: 0, y: -10, duration: .18, ease: 'power2.in' })
    .add(() => {
      fNum.textContent  = f.dataset.num;
      fTit.textContent  = f.dataset.titulo;
      fMeta.textContent = f.dataset.pie;
    })
    .to('#ficha', { opacity: 1, y: 0, duration: .4 });
}

/* Sin rueda (móvil), el numeral lo lleva el arrastre de la tira */
let escuchaTira = null;
function seguirTira(activar) {
  if (escuchaTira) { disco.removeEventListener('scroll', escuchaTira); escuchaTira = null; }
  if (!activar) return;
  escuchaTira = () => {
    const tope = disco.scrollWidth - disco.clientWidth;
    const p = tope > 0 ? disco.scrollLeft / tope : 0;
    const f = fichas[Math.round(p * (fichas.length - 1))];
    if (f && guia.textContent !== f.dataset.num) guia.textContent = f.dataset.num;
  };
  disco.addEventListener('scroll', escuchaTira, { passive: true });
}

/* ── El giro es estado propio, no una animación atada al scroll ──
   Así lo pueden mover dos cosas a la vez: el scroll (mientras la sección
   está fijada) y el arrastre (en cualquier momento y sin tope). La ficha
   activa se deduce de la rotación real, venga de donde venga.          */

let giro = null;        // el ScrollTrigger que fija la sección
let rotScroll = 0;      // grados que pone el scroll
let rotArrastre = 0;    // grados que suma el arrastre
let inercia = 0;        // velocidad que queda al soltar
let rotAplicada = 0;    // lo que se pinta, suavizado
let ruedaViva = false;

function fichaEnLoAlto() {
  let i = Math.round(-rotAplicada / PASO) % fichas.length;
  if (i < 0) i += fichas.length;
  return i;
}

gsap.ticker.add(() => {
  if (!ruedaViva) return;
  if (Math.abs(inercia) > .02) { rotArrastre += inercia; inercia *= .93; }
  else inercia = 0;

  const objetivo = rotScroll + rotArrastre;
  rotAplicada += (objetivo - rotAplicada) * .14;
  gsap.set(disco, { rotation: rotAplicada });
  marcarActiva(fichaEnLoAlto());
});

/* La pieza activa se centra en el hueco entre el titulo y los puntos, y
   ocupa lo que ese hueco permita: ni choca con el titulo ni deja vacio abajo.
   Se mide en vivo porque el alto del encabezado depende de la tipografia y
   del ancho, y el de la pantalla, de la barra del navegador. */
function medirRueda() {
  if (!ruleta.classList.contains('es-ruleta')) return;
  const pin = gab.querySelector('.gabinete__pin');
  const enc = gab.querySelector('.gabinete__enc');
  const puntosEl = document.getElementById('rl-puntos');
  const pr = pin.getBoundingClientRect();
  const arriba = enc.getBoundingClientRect().bottom - pr.top + 22;      // bajo el titulo
  const abajo = puntosEl.getBoundingClientRect().top - pr.top - 14;     // sobre los puntos
  const hueco = abajo - arriba;
  const tope = window.innerWidth <= 860 ? window.innerWidth * 1.1 : Math.min(520, window.innerWidth * .4);
  const alto = Math.max(180, Math.min(hueco, tope));
  ruleta.style.setProperty('--alto-f', Math.round(alto) + 'px');
  ruleta.style.setProperty('--centro', Math.round(arriba + hueco / 2) + 'px');
}

function montarRuleta() {
  /* La rueda va también en celular: es donde más se nota, y degradarla a
     una tira dejaba la mitad del sitio sin fuerza. Solo se cae con
     movimiento reducido. */
  /* En un celular de lado no hay altura para encabezado, ficha y rueda:
     ahí vuelve la tira. */
  const cabe = !quieto && window.innerHeight >= 540;
  seguirTira(!cabe);
  gab.classList.toggle('esta-fijado', cabe);

  if (giro) {
    giro.kill(true);                      // true: devuelve el espaciado del pin
    giro = null;
    ruedaViva = false;
    gsap.set(disco, { clearProps: 'rotation,transform' });
  }
  ruleta.classList.toggle('es-ruleta', cabe);

  if (!cabe) {
    fichas.forEach(f => f.classList.remove('es-activa'));
    activo = -1;
    guia.textContent = fichas[0].dataset.num;
    return;
  }

  rotScroll = rotArrastre = rotAplicada = inercia = 0;
  medirRueda();

  /* Sin `scrub`: el progreso se lee a mano para poder sumarle el arrastre */
  giro = ScrollTrigger.create({
    trigger: gab,
    start: 'top top',
    /* En pantalla táctil el recorrido es más corto: a dos pantallas el
       dedo se cansaba y la página parecía atascada dentro del carrusel. */
    end: () => '+=' + Math.round(window.innerHeight * (fino ? 2 : 1.35)),
    pin: gab.querySelector('.gabinete__pin'),
    invalidateOnRefresh: true,
    onUpdate: self => {
      rotScroll = -PASO * (fichas.length - 1) * self.progress;
    }
  });

  ruedaViva = true;
  activo = -1;                   // fuerza repintar la vecindad tras un remontaje
  marcarActiva(0);
}

montarRuleta();

/* ───────── Arrastrar la ruleta ─────────
   Mueve el scroll, no la rotación: así el scroll sigue siendo la única
   fuente de verdad y no hay que pelear con ScrollTrigger.  */

/* Arrastre con mouse y con dedo: los eventos de puntero cubren los dos.
   No mueve el scroll — suma grados a la rueda, así que se puede girar
   sin tope y en cualquier dirección. El CSS pone `touch-action: pan-y`
   para que el desplazamiento vertical del celular siga siendo del
   navegador y solo el gesto horizontal llegue aquí. */
if (!quieto) {
  let agarrado = false, ultimoX = 0, ultimoY = 0, recorrido = 0, decidido = false;

  /* Nada de setPointerCapture: capturar el puntero en la ruleta hacía que
     el `click` se disparara sobre ella y no sobre la ficha, así que abrir
     una lámina con clic dejaba de funcionar. Se escucha en window. */
  ruleta.addEventListener('pointerdown', e => {
    if (!ruleta.classList.contains('es-ruleta')) return;
    agarrado = true; ultimoX = e.clientX; ultimoY = e.clientY;
    recorrido = 0; inercia = 0; decidido = false;
  });

  window.addEventListener('pointermove', e => {
    if (!agarrado) return;
    const dx = e.clientX - ultimoX;
    const dy = e.clientY - ultimoY;
    /* El primer gesto decide de quién es: si va más hacia arriba o abajo
       que hacia los lados, es para desplazar la página y la rueda lo
       suelta. Antes cualquier roce horizontal del dedo la giraba mientras
       se intentaba subir o bajar, y se sentía como pelear con ella. */
    if (!decidido && Math.hypot(dx, dy) > 8) {
      decidido = true;
      if (Math.abs(dy) > Math.abs(dx) * .8) { agarrado = false; return; }
    }
    ultimoX = e.clientX;
    recorrido += Math.abs(dx);
    if (recorrido > 6) {                 // recién entonces es un arrastre
      ruleta.classList.add('esta-agarrada');
      const grados = dx * .3;
      rotArrastre += grados;
      inercia = grados;
    }
  });

  const soltar = () => {
    if (!agarrado) return;
    agarrado = false;
    ruleta.classList.remove('esta-agarrada');
  };
  window.addEventListener('pointerup', soltar);
  window.addEventListener('pointercancel', soltar);

  /* Un arrastre no debe abrir la lámina que quedó bajo el cursor */
  ruleta.addEventListener('click', e => {
    if (recorrido > 8) { e.stopPropagation(); e.preventDefault(); }
    recorrido = 0;
  }, true);
}

/* Las flechas giran la rueda un paso, igual que el arrastre */
function girarUnPaso(sentido) {
  inercia = 0;
  rotArrastre -= sentido * PASO;
}
document.getElementById('rl-prev').addEventListener('click', () => girarUnPaso(-1));
document.getElementById('rl-next').addEventListener('click', () => girarUnPaso(1));
/* Un gesto lateral del trackpad (o la rueda inclinada) también la gira.
   Solo si es más horizontal que vertical: el scroll normal no se toca. */
ruleta.addEventListener('wheel', e => {
  if (!ruleta.classList.contains('es-ruleta') || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
  e.preventDefault();
  inercia = 0;
  rotArrastre -= e.deltaX * .12;
}, { passive: false });

/* Con el teclado dentro del carrusel, ← y → giran la rueda un paso */
gab.addEventListener('keydown', e => {
  if (!ruleta.classList.contains('es-ruleta')) return;
  if (e.key === 'ArrowLeft')  { e.preventDefault(); girarUnPaso(-1); }
  if (e.key === 'ArrowRight') { e.preventDefault(); girarUnPaso(1); }
});
document.getElementById('rl-abrir').addEventListener('click', () => {
  const f = fichas[Math.max(0, activo)];
  if (f) abrirVisor(indiceDe(f), f);
});

/* ───────── Oficios, hitos y camafeo ───────── */

gsap.utils.toArray('[data-oficio]').forEach(of => {
  gsap.from(of, {
    y: 40, opacity: 0, duration: .9,
    scrollTrigger: { trigger: of, start: 'top 90%' }
  });
});

gsap.utils.toArray('[data-hito]').forEach(h => {
  gsap.from(h, {
    x: -22, opacity: 0, duration: .85,
    scrollTrigger: { trigger: h, start: 'top 90%' }
  });
});

const camafeo = document.querySelector('[data-camafeo]');
if (camafeo) {
  gsap.from(camafeo.querySelectorAll('.camafeo__aro ellipse'), {
    strokeDashoffset: 1500, duration: 2.2, stagger: .2, ease: 'power2.inOut',
    scrollTrigger: { trigger: camafeo, start: 'top 82%' }
  });
  gsap.from(camafeo.querySelector('.camafeo__oval'), {
    clipPath: 'inset(0 0 100% 0)', duration: 1.4, ease: 'power4.inOut',
    scrollTrigger: { trigger: camafeo, start: 'top 82%' }
  });
}

const tarjeta = document.querySelector('[data-tarjeta]');
if (tarjeta) {
  gsap.from(tarjeta.querySelectorAll('.tarjeta__esq'), {
    strokeDashoffset: 1200, duration: 1.6, stagger: .15, ease: 'power2.inOut',
    scrollTrigger: { trigger: tarjeta, start: 'top 78%' }
  });
  gsap.from('.sello', {
    scale: 0, rotate: -35, duration: 1, ease: 'back.out(2)',
    scrollTrigger: { trigger: tarjeta, start: 'top 55%' }
  });
}

/* ───────── Copiar el correo ───────── */

const botonCopiar  = document.getElementById('copiar-correo');
const avisoCopiado = document.getElementById('copiado');
let olvidarAviso;

function avisar(texto) {
  avisoCopiado.textContent = texto;
  clearTimeout(olvidarAviso);
  olvidarAviso = setTimeout(() => { avisoCopiado.textContent = ''; }, 2600);
}

/* El portapapeles moderno exige https o localhost; si falla, el camino viejo */
async function copiarTexto(texto) {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    const t = document.createElement('textarea');
    t.value = texto;
    t.setAttribute('readonly', '');
    t.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(t);
    t.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { /* sin portapapeles */ }
    t.remove();
    return ok;
  }
}

if (botonCopiar) {
  botonCopiar.addEventListener('click', async () => {
    const correo = botonCopiar.dataset.copiar;
    avisar(await copiarTexto(correo) ? 'Correo copiado' : 'Cópielo a mano: ' + correo);
  });
}

/* ───────── Visor de láminas ───────── */

const visor  = document.getElementById('visor');
const vImg   = document.getElementById('visor-img');
const vTit   = document.getElementById('visor-tit');
const vPie   = document.getElementById('visor-pie');
const vCuenta = document.getElementById('visor-cuenta');
/* Las cuatro láminas mayores salen dos veces en la página (como lámina
   y como ficha de la ruleta). El visor las lista una sola vez, en
   orden de catálogo, para que las flechas no repitan. */
const todosVisor = [...document.querySelectorAll('[data-visor]')];
const piezas = [];
const porFuente = new Map();
todosVisor.forEach(el => {
  if (!porFuente.has(el.dataset.src)) {
    porFuente.set(el.dataset.src, piezas.length);
    piezas.push(el);
  }
});
const indiceDe = el => porFuente.get(el.dataset.src) || 0;

let indice = 0;
let volverA = null;

function pintar(i) {
  indice = (i + piezas.length) % piezas.length;
  /* Cada lámina tiene su enlace (#lamina-3): se puede copiar y mandar */
  history.replaceState(null, '', '#lamina-' + (indice + 1));
  const p = piezas[indice];
  vImg.src = p.dataset.src;
  vImg.alt = p.querySelector('img') ? p.querySelector('img').alt : p.dataset.titulo;
  vTit.textContent = p.dataset.titulo;
  vPie.textContent = p.dataset.pie;
  vCuenta.textContent = (indice + 1) + ' / ' + piezas.length;
  gsap.fromTo(vImg, { opacity: 0, scale: .97 }, { opacity: 1, scale: 1, duration: .55 });

  /* Las vecinas de cada lado se bajan de antemano: las flechas no esperan */
  [indice - 1, indice + 1].forEach(j => {
    const vecina = piezas[(j + piezas.length) % piezas.length];
    if (vecina) new Image().src = vecina.dataset.src;
  });
}

function abrirVisor(i, disparador) {
  volverA = disparador || null;
  visor.hidden = false;
  document.body.classList.add('esta-quieto');
  pintar(i);
  gsap.to(visor, { opacity: 1, duration: .45 });
  document.getElementById('visor-cerrar').focus();
}

function cerrarVisor() {
  gsap.to(visor, {
    opacity: 0, duration: .35,
    onComplete: () => {
      history.replaceState(null, '', location.pathname + location.search);
      visor.hidden = true;
      document.body.classList.remove('esta-quieto');
      if (volverA) volverA.focus();
    }
  });
}

todosVisor.forEach(el => {
  el.addEventListener('click', () => abrirVisor(indiceDe(el), el));
  el.setAttribute('tabindex', '0');
  el.setAttribute('role', 'button');
  el.addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirVisor(indiceDe(el), el); }
  });
});

document.querySelectorAll('[data-visor-btn]').forEach(btn => {
  btn.addEventListener('click', e => {
    e.stopPropagation();
    const marco = btn.closest('[data-lamina]').querySelector('[data-visor]');
    abrirVisor(indiceDe(marco), btn);
  });
});

document.getElementById('visor-cerrar').addEventListener('click', cerrarVisor);
document.getElementById('visor-prev').addEventListener('click', () => pintar(indice - 1));
document.getElementById('visor-next').addEventListener('click', () => pintar(indice + 1));
visor.addEventListener('click', e => { if (e.target === visor) cerrarVisor(); });

/* En el celular las láminas pasan deslizando el dedo hacia un lado */
let toqueX = null;
visor.addEventListener('touchstart', e => {
  toqueX = e.touches.length === 1 ? e.touches[0].clientX : null;
}, { passive: true });
visor.addEventListener('touchend', e => {
  if (toqueX === null) return;
  const dx = e.changedTouches[0].clientX - toqueX;
  toqueX = null;
  if (Math.abs(dx) > 60) pintar(indice + (dx < 0 ? 1 : -1));
}, { passive: true });

document.addEventListener('keydown', e => {
  if (visor.hidden) return;
  if (e.key === 'Escape')     cerrarVisor();
  if (e.key === 'ArrowLeft')  pintar(indice - 1);
  if (e.key === 'ArrowRight') pintar(indice + 1);
  if (e.key === 'Home')       { e.preventDefault(); pintar(0); }
  if (e.key === 'End')        { e.preventDefault(); pintar(piezas.length - 1); }

  /* El foco no se sale del visor mientras está abierto */
  if (e.key === 'Tab') {
    const focos = [...visor.querySelectorAll('button')];
    if (!focos.length) return;
    const primero = focos[0], ultimo = focos[focos.length - 1];
    if (e.shiftKey && document.activeElement === primero) {
      e.preventDefault(); ultimo.focus();
    } else if (!e.shiftKey && document.activeElement === ultimo) {
      e.preventDefault(); primero.focus();
    }
  }
});

/* Quien llega con un enlace #lamina-N ve esa lámina abierta */
const enlaceLamina = location.hash.match(/^#lamina-(\d+)$/);
if (enlaceLamina && piezas[enlaceLamina[1] - 1]) abrirVisor(enlaceLamina[1] - 1, null);

/* ───────── Arranque y remontaje ───────── */

/* Solo se remonta si cambió el ANCHO. En celular, esconder o mostrar la
   barra del navegador dispara `resize` por la altura, y remontar ahí
   rehacía el pin a mitad de scroll: eso era el salto de la ruleta. */
let remontar;
let anchoPrevio = window.innerWidth;
let alturaPrevia = window.innerHeight;
window.addEventListener('resize', () => {
  /* solo cambio el alto (barra del navegador, giro): se recoloca la pieza, sin remontar */
  if (Math.abs(window.innerHeight - alturaPrevia) >= 40) { alturaPrevia = window.innerHeight; medirRueda(); }
  if (Math.abs(window.innerWidth - anchoPrevio) < 40) return;
  anchoPrevio = window.innerWidth;
  clearTimeout(remontar);
  remontar = setTimeout(() => { montarRuleta(); ScrollTrigger.refresh(); }, 220);
});

/* El telón corre en cuanto hay DOM. Colgarlo de «load» lo dejaba
   esperando a que bajara la última imagen: el visitante se quedaba
   mirando un sello quieto. */
correrTelon();

window.addEventListener('load', () => ScrollTrigger.refresh());
document.fonts.ready.then(() => { medirRueda(); ScrollTrigger.refresh(); });

/* Firma para quien abra la consola */
console.info('%cMitch%c · portafolio de Laura Michelle Herrera · Bogotá',
  'font:500 15px Didot,"Bodoni Moda",serif;color:#B3121F', 'color:inherit');
