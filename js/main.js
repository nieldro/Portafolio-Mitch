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
    .to('.telon__aro', { strokeDashoffset: 0, duration: 1.5, stagger: .18, ease: 'power2.inOut' })
    .to('.telon__marca', { opacity: 1, duration: .9 }, '-=1.0')
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
const anillo = { x: innerWidth / 2, y: innerHeight / 2 };
const punto  = { x: innerWidth / 2, y: innerHeight / 2 };
let raton    = { x: innerWidth / 2, y: innerHeight / 2 };

if (fino) {
  window.addEventListener('mousemove', e => {
    raton.x = e.clientX;
    raton.y = e.clientY;
    cursor.classList.add('esta-vivo');
    document.documentElement.style.setProperty('--mx', e.clientX + 'px');
    document.documentElement.style.setProperty('--my', e.clientY + 'px');
  }, { passive: true });

  const anilloEl = cursor.querySelector('.cursor__anillo');
  const puntoEl  = cursor.querySelector('.cursor__punto');
  const sigEl    = cursor.querySelector('.cursor__sig');

  gsap.set(sigEl, { xPercent: -50, yPercent: -50, scale: .2, opacity: 0 });

  gsap.ticker.add(() => {
    anillo.x += (raton.x - anillo.x) * .14;
    anillo.y += (raton.y - anillo.y) * .14;
    punto.x  += (raton.x - punto.x)  * .42;
    punto.y  += (raton.y - punto.y)  * .42;
    gsap.set(anilloEl, { x: anillo.x, y: anillo.y });
    gsap.set(puntoEl,  { x: punto.x,  y: punto.y  });
    gsap.set(sigEl,    { x: anillo.x, y: anillo.y });
  });

  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('esta-sobre'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('esta-sobre'));
  });

  /* Sobre una pieza el cursor se vuelve la marca */
  document.querySelectorAll('[data-visor]').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('esta-sobre', 'esta-sobre-pieza');
      gsap.to(sigEl, { opacity: 1, scale: 1, duration: .45, ease: 'back.out(2.2)' });
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('esta-sobre', 'esta-sobre-pieza');
      gsap.to(sigEl, { opacity: 0, scale: .2, duration: .3, ease: 'power2.in' });
    });
  });
}

/* ───────── Barra ───────── */

const barra = document.getElementById('barra');
const hamb  = document.getElementById('hamb');

ScrollTrigger.create({
  start: 'top -80',
  onUpdate: self => barra.classList.toggle('esta-posada', self.scroll() > 80)
});

hamb.addEventListener('click', () => {
  const abierta = barra.classList.toggle('esta-abierta');
  hamb.setAttribute('aria-expanded', String(abierta));
  document.body.classList.toggle('esta-quieto', abierta);
});

barra.querySelectorAll('.barra__nav a, .barra__cta').forEach(a => {
  a.addEventListener('click', () => {
    barra.classList.remove('esta-abierta');
    hamb.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('esta-quieto');
  });
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

/* ───────── Índice lateral ───────── */

const rielIndice = document.getElementById('indice');
if (rielIndice) {
  /* La posición se mide en vivo, no con un ScrollTrigger por sección:
     el anclaje del gabinete mete dos pantallas de espaciado y dejaba
     todas las medidas de más abajo corridas, marcando la sección
     equivocada. */
  const tramos = [...rielIndice.querySelectorAll('a')]
    .map(a => ({ a, el: document.getElementById(a.dataset.indice) }))
    .filter(t => t.el);

  ScrollTrigger.create({
    onUpdate: () => {
      const linea = window.scrollY + window.innerHeight * .45;
      let aqui = null;
      for (const t of tramos) {
        if (t.el.getBoundingClientRect().top + window.scrollY <= linea) aqui = t;
      }
      tramos.forEach(t => t.a.classList.toggle('esta-aqui', t === aqui));
    }
  });

  /* Aparece pasado el frontispicio: en la portada estorbaría */
  gsap.set(rielIndice, { opacity: 0, x: 14 });
  ScrollTrigger.create({
    trigger: '#laminas', start: 'top 85%',
    onEnter:     () => gsap.to(rielIndice, { opacity: 1, x: 0,  duration: .7 }),
    onLeaveBack: () => gsap.to(rielIndice, { opacity: 0, x: 14, duration: .5 })
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

/* ───────── Imán: los botones se acercan al cursor ───────── */

if (fino && !quieto) {
  /* Las flechas del visor no: ya llevan un translate propio que
     las centra, y darles x/y lo pisaría. */
  document.querySelectorAll('.boton, .barra__cta, .ruleta__flecha, .ruleta__aguja')
    .forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        gsap.to(el, {
          x: (e.clientX - r.left - r.width / 2) * .26,
          y: (e.clientY - r.top - r.height / 2) * .3,
          duration: .5, ease: 'power3.out'
        });
      });
      el.addEventListener('mouseleave', () =>
        gsap.to(el, { x: 0, y: 0, duration: .8, ease: 'elastic.out(1,.45)' }));
    });

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
      .from(img, { scale: 1.12, duration: 1.5, ease: 'power3.out' }, 0)
      .from(margen.querySelector('.lamina__num'),
            { yPercent: 60, opacity: 0, duration: .9 }, .35)
      .from([margen.querySelector('.lamina__cat'),
             margen.querySelector('.lamina__tit'),
             margen.querySelector('.lamina__txt'),
             margen.querySelector('.enlace')],
            { y: 26, opacity: 0, duration: .85, stagger: .09 }, .45);

    /* Paralaje suave dentro del passe-partout */
    gsap.fromTo(img, { yPercent: -3.5 }, {
      yPercent: 3.5, ease: 'none',
      scrollTrigger: { trigger: marco, start: 'top bottom', end: 'bottom top', scrub: 1 }
    });
  } else {
    gsap.set(velo, { display: 'none' });
  }
});

/* ───────── Tiras de detalle ───────── */

gsap.utils.toArray('.detalles').forEach(tira => {
  gsap.from(tira.querySelectorAll('figure'), {
    y: 28, opacity: 0, duration: .85, stagger: .1,
    scrollTrigger: { trigger: tira, start: 'top 92%' }
  });
});

/* ───────── La ruleta ─────────
   Una rueda de trece fichas cuyo centro queda por debajo de la
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

function marcarActiva(i) {
  if (i === activo || !fichas[i]) return;
  activo = i;
  const f = fichas[i];
  fichas.forEach((x, j) => x.classList.toggle('es-activa', j === i));
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

function montarRuleta() {
  /* La rueda va también en celular: es donde más se nota, y degradarla a
     una tira dejaba la mitad del sitio sin fuerza. Solo se cae con
     movimiento reducido. */
  const cabe = !quieto;
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

  /* Sin `scrub`: el progreso se lee a mano para poder sumarle el arrastre */
  giro = ScrollTrigger.create({
    trigger: gab,
    start: 'top top',
    end: () => '+=' + Math.round(window.innerHeight * 2),
    pin: gab.querySelector('.gabinete__pin'),
    invalidateOnRefresh: true,
    onUpdate: self => {
      rotScroll = -PASO * (fichas.length - 1) * self.progress;
    }
  });

  ruedaViva = true;
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
  let agarrado = false, ultimoX = 0, recorrido = 0;

  /* Nada de setPointerCapture: capturar el puntero en la ruleta hacía que
     el `click` se disparara sobre ella y no sobre la ficha, así que abrir
     una lámina con clic dejaba de funcionar. Se escucha en window. */
  ruleta.addEventListener('pointerdown', e => {
    if (!ruleta.classList.contains('es-ruleta')) return;
    agarrado = true; ultimoX = e.clientX; recorrido = 0; inercia = 0;
  });

  window.addEventListener('pointermove', e => {
    if (!agarrado) return;
    const dx = e.clientX - ultimoX;
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

/* ───────── Visor de láminas ───────── */

const visor  = document.getElementById('visor');
const vImg   = document.getElementById('visor-img');
const vTit   = document.getElementById('visor-tit');
const vPie   = document.getElementById('visor-pie');
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
  const p = piezas[indice];
  vImg.src = p.dataset.src;
  vImg.alt = p.querySelector('img') ? p.querySelector('img').alt : p.dataset.titulo;
  vTit.textContent = p.dataset.titulo;
  vPie.textContent = p.dataset.pie;
  gsap.fromTo(vImg, { opacity: 0, scale: .97 }, { opacity: 1, scale: 1, duration: .55 });
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

document.addEventListener('keydown', e => {
  if (visor.hidden) return;
  if (e.key === 'Escape')     cerrarVisor();
  if (e.key === 'ArrowLeft')  pintar(indice - 1);
  if (e.key === 'ArrowRight') pintar(indice + 1);

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

/* ───────── Arranque y remontaje ───────── */

/* Solo se remonta si cambió el ANCHO. En celular, esconder o mostrar la
   barra del navegador dispara `resize` por la altura, y remontar ahí
   rehacía el pin a mitad de scroll: eso era el salto de la ruleta. */
let remontar;
let anchoPrevio = window.innerWidth;
window.addEventListener('resize', () => {
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
document.fonts.ready.then(() => ScrollTrigger.refresh());
