import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function connectDB() {
  const db = await open({
    filename: './database.db',
    driver: sqlite3.Database
  });

  // initialize tables if they don't exist
  await db.exec(`CREATE TABLE IF NOT EXISTS proveedores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    logo TEXT,
    contacto TEXT
  )`);

  await db.exec(`CREATE TABLE IF NOT EXISTS productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    imagen TEXT,
    precio REAL,
    stockActual INTEGER,
    stockObjetivo INTEGER,
    proveedorId INTEGER,
    FOREIGN KEY (proveedorId) REFERENCES proveedores(id)
  )`);

  await db.exec(`CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario TEXT,
    password TEXT,
    esAdmin INTEGER DEFAULT 0
  )`);

  await db.exec(`CREATE TABLE IF NOT EXISTS asignaciones (
    usuarioId INTEGER,
    proveedorId INTEGER,
    PRIMARY KEY(usuarioId, proveedorId),
    FOREIGN KEY(usuarioId) REFERENCES usuarios(id),
    FOREIGN KEY(proveedorId) REFERENCES proveedores(id)
  )`);

  return db;
}
