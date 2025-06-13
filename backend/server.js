import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';

const app = express();
app.use(cors());
app.use(express.json());

let db;
connectDB().then(database => {
  db = database;
  console.log('Database connected');
});

// Proveedores CRUD
app.get('/api/proveedores', async (req, res) => {
  const proveedores = await db.all('SELECT * FROM proveedores');
  res.json(proveedores);
});

app.post('/api/proveedores', async (req, res) => {
  const { nombre, logo, contacto } = req.body;
  const result = await db.run(
    'INSERT INTO proveedores(nombre, logo, contacto) VALUES(?,?,?)',
    [nombre, logo, contacto]
  );
  res.json({ id: result.lastID });
});

app.put('/api/proveedores/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, logo, contacto } = req.body;
  await db.run(
    'UPDATE proveedores SET nombre=?, logo=?, contacto=? WHERE id=?',
    [nombre, logo, contacto, id]
  );
  res.json({ ok: true });
});

app.delete('/api/proveedores/:id', async (req, res) => {
  const { id } = req.params;
  await db.run('DELETE FROM proveedores WHERE id=?', [id]);
  res.json({ ok: true });
});

// Productos CRUD
app.get('/api/productos', async (req, res) => {
  const { proveedorId } = req.query;
  let productos;
  if (proveedorId) {
    productos = await db.all('SELECT * FROM productos WHERE proveedorId=?', [proveedorId]);
  } else {
    productos = await db.all('SELECT * FROM productos');
  }
  res.json(productos);
});

app.post('/api/productos', async (req, res) => {
  const { nombre, imagen, precio, stockActual, stockObjetivo, proveedorId } = req.body;
  const result = await db.run(
    `INSERT INTO productos(nombre, imagen, precio, stockActual, stockObjetivo, proveedorId)
     VALUES(?,?,?,?,?,?)`,
    [nombre, imagen, precio, stockActual, stockObjetivo, proveedorId]
  );
  res.json({ id: result.lastID });
});

app.put('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, imagen, precio, stockActual, stockObjetivo, proveedorId } = req.body;
  await db.run(
    `UPDATE productos SET nombre=?, imagen=?, precio=?, stockActual=?, stockObjetivo=?, proveedorId=?
     WHERE id=?`,
    [nombre, imagen, precio, stockActual, stockObjetivo, proveedorId, id]
  );
  res.json({ ok: true });
});

app.delete('/api/productos/:id', async (req, res) => {
  const { id } = req.params;
  await db.run('DELETE FROM productos WHERE id=?', [id]);
  res.json({ ok: true });
});

// Usuarios CRUD
app.get('/api/usuarios', async (req, res) => {
  const usuarios = await db.all('SELECT id, usuario, esAdmin FROM usuarios');
  res.json(usuarios);
});

app.post('/api/usuarios', async (req, res) => {
  const { usuario, password, esAdmin } = req.body;
  const result = await db.run(
    'INSERT INTO usuarios(usuario, password, esAdmin) VALUES(?,?,?)',
    [usuario, password, esAdmin ? 1 : 0]
  );
  res.json({ id: result.lastID });
});

app.put('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  const { usuario, password, esAdmin } = req.body;
  await db.run(
    'UPDATE usuarios SET usuario=?, password=?, esAdmin=? WHERE id=?',
    [usuario, password, esAdmin ? 1 : 0, id]
  );
  res.json({ ok: true });
});

app.delete('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;
  await db.run('DELETE FROM usuarios WHERE id=?', [id]);
  res.json({ ok: true });
});

// Asignaciones proveedores a usuarios
app.post('/api/usuarios/:id/proveedores', async (req, res) => {
  const { id } = req.params;
  const { proveedores } = req.body; // array of proveedorId
  await db.run('DELETE FROM asignaciones WHERE usuarioId=?', [id]);
  for (const proveedorId of proveedores) {
    await db.run('INSERT INTO asignaciones(usuarioId, proveedorId) VALUES(?, ?)', [id, proveedorId]);
  }
  res.json({ ok: true });
});

app.get('/api/usuarios/:id/proveedores', async (req, res) => {
  const { id } = req.params;
  const rows = await db.all(
    `SELECT p.* FROM proveedores p
     JOIN asignaciones a ON a.proveedorId = p.id
     WHERE a.usuarioId = ?`,
    [id]
  );
  res.json(rows);
});

// Login simple
app.post('/api/login', async (req, res) => {
  const { usuario, password } = req.body;
  const row = await db.get('SELECT id, usuario, esAdmin FROM usuarios WHERE usuario=? AND password=?', [usuario, password]);
  if (row) {
    res.json(row);
  } else {
    res.status(401).json({ message: 'Credenciales inválidas' });
  }
});

// Productos por usuario
app.get('/api/usuarios/:id/productos', async (req, res) => {
  const { id } = req.params;
  const rows = await db.all(
    `SELECT pr.* FROM productos pr
     JOIN proveedores p ON pr.proveedorId = p.id
     JOIN asignaciones a ON a.proveedorId = p.id
     WHERE a.usuarioId = ?`,
    [id]
  );
  res.json(rows);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log('Server running on port', PORT));
