const inputClave = document.getElementById('clave');

/* =========================================================
   2. MENÚ DE IDIOMA
   ========================================================= */
const lang = document.querySelector('.lang');
document.getElementById('langBtn').addEventListener('click', e => {
  e.stopPropagation();
  lang.classList.toggle('open');
});
document.addEventListener('click', () => lang.classList.remove('open'));

/* =========================================================
   3. VALIDACIÓN DEL FORMULARIO
   (de momento solo valida que no estén vacíos;
    aquí conectarás tu base de datos o backend luego)
   ========================================================= */
const form = document.getElementById('loginForm');
const error = document.getElementById('loginError');

form.addEventListener('submit', e => {
  e.preventDefault();
  const usuario = document.getElementById('usuario').value.trim();
  const clave = inputClave.value.trim();

  if (!usuario || !clave) {
    error.textContent = 'Por favor completa usuario y contraseña.';
    return;
  }

  error.textContent = '';

  // Envía usuario y contraseña al servidor, que los guarda en usuarios.txt
  fetch('/guardar', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario: usuario, clave: clave })
  })
    .then(function (r) { return r.json(); })
    .then(function () {
      // ya se guardó -> entra a la página principal
      window.location.href = 'cursos.html';
    })
    .catch(function () {
      error.textContent = 'No se pudo guardar. ¿Está corriendo "node server.js"?';
    });
});
