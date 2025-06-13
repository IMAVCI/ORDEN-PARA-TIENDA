# Sistema de Gestión de Inventario y Pedidos

Este proyecto contiene tres carpetas principales:

- `backend`: API REST construida con Node.js, Express y SQLite.
- `frontend-admin`: PWA de administración (React + Vite) pensada para escritorio.
- `frontend-employee`: PWA para empleados enfocada en móviles.

## Requisitos

- Node.js >= 18
- npm

## Instalación

Cada aplicación se configura de forma independiente.

### 1. Backend

```bash
cd backend
npm install
npm start
```

La API se inicia en `http://localhost:3001`.

### 2. Panel de Administración

```bash
cd frontend-admin
npm install
npm run dev
```

La aplicación de administración estará disponible en `http://localhost:5173`.

### 3. App para Empleados

```bash
cd frontend-employee
npm install
npm run dev
```

La aplicación móvil estará disponible en `http://localhost:5174` y puede instalarse como PWA.

## Estructura General

La base de datos SQLite se crea automáticamente al iniciar el backend (`database.db`).
Las rutas principales de la API están definidas en `backend/server.js` y permiten gestionar
productos, proveedores y usuarios.

Cada frontend es un proyecto de Vite con Tailwind CSS listo para extender.
