/* =========================================================
   1. IMÁGENES FALTANTES
   Si una imagen todavía no está en la carpeta img/, se muestra
   un recuadro con el nombre del archivo que tienes que poner.
   ========================================================= */
function placeholderSVG(nombre, w, h) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
      <rect width="100%" height="100%" fill="#e3e8ee"/>
      <text x="50%" y="45%" font-family="Arial" font-size="${Math.max(12, Math.min(w, h) / 10)}"
            fill="#3a4a5c" text-anchor="middle">🖼 IMAGEN AQUÍ</text>
      <text x="50%" y="60%" font-family="Arial" font-size="${Math.max(10, Math.min(w, h) / 13)}"
            fill="#d0021b" text-anchor="middle">img/${nombre}</text>
    </svg>`;
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

function marcarFaltante(img) {
  if (img.dataset.done) return;
  img.dataset.done = '1';
  const w = img.clientWidth || 400;
  const h = img.clientHeight || 250;
  img.src = placeholderSVG(img.dataset.placeholder, w, h);
  img.classList.add('img-missing');
}

document.querySelectorAll('img[data-placeholder]').forEach(img => {
  if (img.complete && img.naturalWidth === 0) {
    marcarFaltante(img);          // ya falló antes de cargar el script
  } else {
    img.addEventListener('error', () => marcarFaltante(img));
  }
});

/* =========================================================
   2. CARRUSEL
   ========================================================= */
const slides = document.querySelectorAll('.hero__slide');
console.log('Carrusel: ' + slides.length + ' slides');
const dotsBox = document.getElementById('heroDots');
let actual = 0;
let intervalo;

slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.setAttribute('aria-label', 'Ir al slide ' + (i + 1));
  if (i === 0) dot.classList.add('active');
  dot.addEventListener('click', () => { irA(i); reiniciar(); });
  dotsBox.appendChild(dot);
});
const dots = dotsBox.querySelectorAll('button');

function irA(i) {
  slides[actual].classList.remove('active');
  dots[actual].classList.remove('active');
  actual = (i + slides.length) % slides.length;
  slides[actual].classList.add('active');
  dots[actual].classList.add('active');
}

function reiniciar() {
  clearInterval(intervalo);
  intervalo = setInterval(() => irA(actual + 1), 5000); // cambia cada 5 s
}

document.getElementById('prevBtn').addEventListener('click', () => { irA(actual - 1); reiniciar(); });
document.getElementById('nextBtn').addEventListener('click', () => { irA(actual + 1); reiniciar(); });
reiniciar();

/* =========================================================
   3. MENÚ DE IDIOMA
   ========================================================= */
const lang = document.querySelector('.lang');
document.getElementById('langBtn').addEventListener('click', e => {
  e.stopPropagation();
  lang.classList.toggle('open');
});
document.addEventListener('click', () => lang.classList.remove('open'));

/* =========================================================
   4. BOTÓN "VOLVER ARRIBA" + sombra en la cabecera
   ========================================================= */
const btnArriba = document.getElementById('backToTop');
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  btnArriba.classList.toggle('show', window.scrollY > 150); // aparece al bajar un poco
  header.classList.toggle('scrolled', window.scrollY > 10);
});

btnArriba.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* =========================================================
   5. FRASE DEL DÍA (cambia según el día)
   ========================================================= */
const frases = [
  'La educación es el pasaporte hacia el futuro, el mañana pertenece a aquellos que se preparan hoy.',
  'El éxito es la suma de pequeños esfuerzos repetidos día tras día.',
  'Aprender es un tesoro que te seguirá a todas partes.',
  'La disciplina es el puente entre las metas y los logros.',
  'Nunca es tarde para aprender algo nuevo.',
  'El conocimiento es poder, compártelo.',
  'Cada día es una nueva oportunidad para mejorar.'
];
document.getElementById('fraseDia').textContent = frases[new Date().getDay()];

/* =========================================================
   6. AÑO AUTOMÁTICO EN EL FOOTER
   ========================================================= */
document.getElementById('year').textContent = new Date().getFullYear();