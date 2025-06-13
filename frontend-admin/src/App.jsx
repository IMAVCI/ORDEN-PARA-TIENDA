import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Products from './components/Products.jsx';
import Providers from './components/Providers.jsx';
import Users from './components/Users.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow px-4 py-2 flex gap-4">
          <Link className="text-blue-600" to="/productos">Productos</Link>
          <Link className="text-blue-600" to="/proveedores">Proveedores</Link>
          <Link className="text-blue-600" to="/usuarios">Usuarios</Link>
        </nav>
        <div className="p-4">
          <Routes>
            <Route path="/productos" element={<Products />} />
            <Route path="/proveedores" element={<Providers />} />
            <Route path="/usuarios" element={<Users />} />
            <Route path="/" element={<p>Bienvenido al panel de administración</p>} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
