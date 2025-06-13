import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const submit = e => {
    e.preventDefault();
    fetch('http://localhost:3001/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario, password })
    })
      .then(r => (r.ok ? r.json() : Promise.reject()))
      .then(data => {
        localStorage.setItem('userId', data.id);
        onLogin(data.id);
        navigate('/');
      });
  };

  return (
    <form onSubmit={submit} className="p-4 space-y-2">
      <h1 className="text-xl font-bold">Login</h1>
      <input className="border px-2 w-full" placeholder="Usuario" value={usuario} onChange={e => setUsuario(e.target.value)} />
      <input className="border px-2 w-full" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="bg-blue-600 text-white px-2 py-1" type="submit">Entrar</button>
    </form>
  );
}

function Catalogo({ productos, cantidades, setCantidades }) {
  const navigate = useNavigate();

  const setCantidad = (id, val) => {
    setCantidades(prev => ({ ...prev, [id]: val }));
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Catálogo</h1>
      {productos.map(p => (
        <div key={p.id} className="border rounded p-2 flex items-center">
          <img src={p.imagen} alt={p.nombre} className="w-16 h-16 object-cover mr-2" />
          <div className="flex-1">
            <p className="font-semibold">{p.nombre}</p>
            <p className="text-sm text-gray-600">Stock: {p.stockActual} / {p.stockObjetivo}</p>
          </div>
          <input
            type="number"
            min="0"
            className="border w-16 px-1"
            value={cantidades[p.id] || ''}
            onChange={e => setCantidad(p.id, e.target.value)}
          />
        </div>
      ))}
      <button className="bg-green-600 text-white px-2 py-1" onClick={() => navigate('/orden')}>Ver Orden</button>
    </div>
  );
}

function Orden({ productos, cantidades }) {
  const navigate = useNavigate();
  let resumen = '';
  const grupos = {};
  productos.forEach(p => {
    const qty = parseInt(cantidades[p.id]);
    if (qty > 0) {
      if (!grupos[p.proveedorId]) grupos[p.proveedorId] = [];
      grupos[p.proveedorId].push({ nombre: p.nombre, qty });
    }
  });
  for (const id in grupos) {
    const lines = grupos[id].map(it => `- ${it.qty}x ${it.nombre}`).join('\n');
    resumen += `\n**ORDEN PARA PROVEEDOR ${id}**\n${lines}\n`;
  }
  resumen = resumen.trim();

  return (
    <div className="p-4 space-y-2">
      <h1 className="text-xl font-bold">Mi Orden</h1>
      <textarea className="w-full border h-40" readOnly value={resumen} />
      <button className="bg-blue-600 text-white px-2 py-1" onClick={() => navigate('/')}>Regresar</button>
    </div>
  );
}

export default function App() {
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const [userId, setUserId] = useState(localStorage.getItem('userId'));

  useEffect(() => {
    if (userId) {
      fetch(`http://localhost:3001/api/usuarios/${userId}/productos`)
        .then(res => res.json())
        .then(setProductos);
    }
  }, [userId]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login onLogin={setUserId} />} />
        <Route path="/orden" element={<Orden productos={productos} cantidades={cantidades} />} />
        <Route path="/" element={<Catalogo productos={productos} cantidades={cantidades} setCantidades={setCantidades} />} />
      </Routes>
    </BrowserRouter>
  );
}
