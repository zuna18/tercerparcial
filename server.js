/* =========================================================
   SERVIDOR CON BASE DE DATOS SQLite
   - Muestra la página (index, login, cursos, css, js, img)
   - Guarda usuario y contraseña en la base de datos usuarios.db
   Antes de correrlo, una sola vez:  npm install better-sqlite3
   Para correrlo:  node server.js   ->  http://localhost:5500
   ========================================================= */
const http = require('http');
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const PUERTO = Number(process.env.PORT) || 5500;
//const PUERTO = 5500;
const RAIZ = __dirname;

// ---- 1. Abrir (o crear) la base de datos ----
const db = new Database(path.join(RAIZ, 'usuarios.db'));

// ---- 2. Crear la tabla si no existe ----
db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id      INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT NOT NULL,
    clave   TEXT NOT NULL,
    fecha   TEXT NOT NULL
  )
`);

// consultas preparadas
const guardarUsuario = db.prepare('INSERT INTO usuarios (usuario, clave, fecha) VALUES (?, ?, ?)');
const listarUsuarios = db.prepare('SELECT id, usuario, clave, fecha FROM usuarios ORDER BY id DESC');

// tipos de archivo
const TIPOS = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon'
};

const servidor = http.createServer((req, res) => {

  // ---- GUARDAR en la base de datos ----
  if (req.method === 'POST' && req.url === '/guardar') {
    let cuerpo = '';
    req.on('data', t => cuerpo += t);
    req.on('end', () => {
      try {
        const { usuario, clave } = JSON.parse(cuerpo);
        const fecha = new Date().toLocaleString('es-BO',{
          timeZone: 'America/La_Paz'});
        guardarUsuario.run(usuario, clave, fecha);
        console.log('Guardado en BD ->', usuario, '|', fecha);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));
      } catch (e) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: e.message }));
      }
    });
    return;
  }

  // ---- VER los usuarios guardados (solo para probar) ----
  //  abre en el navegador:  http://localhost:5500/usuarios
  if (req.method === 'GET' && req.url === '/usuarios') {
    const filas = listarUsuarios.all();
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(filas, null, 2));
    return;
  }

  // ---- SERVIR ARCHIVOS ----
  let ruta = req.url === '/' ? '/index.html' : decodeURIComponent(req.url.split('?')[0]);
  let archivo = path.join(RAIZ, ruta);
  if (!archivo.startsWith(RAIZ)) { res.writeHead(403); res.end('Prohibido'); return; }

  fs.readFile(archivo, (err, datos) => {
    if (err) { res.writeHead(404, {'Content-Type':'text/html; charset=utf-8'}); res.end('<h1>404 - No encontrado</h1>'); return; }
    const ext = path.extname(archivo).toLowerCase();
    res.writeHead(200, { 'Content-Type': TIPOS[ext] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    res.end(datos);
  });
});

servidor.listen(PUERTO, '0.0.0.0', () => {
  console.log('Servidor corriendo en  http://localhost:' + PUERTO);
  console.log('Base de datos: usuarios.db');
  console.log('Ver usuarios guardados:  http://localhost:' + PUERTO + '/usuarios');
});
