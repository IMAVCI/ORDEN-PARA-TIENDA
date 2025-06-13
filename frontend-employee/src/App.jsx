import React, { useState, useEffect } from 'react';

export default function App() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) {
      fetch(`http://localhost:3001/api/usuarios/${userId}/productos`)
        .then(res => res.json())
        .then(setProductos);
    }
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">App Empleados</h1>
      <div className="grid gap-4">
        {productos.map(p => (
          <div key={p.id} className="border rounded p-2 flex items-center">
            <img src={p.imagen} alt={p.nombre} className="w-16 h-16 object-cover mr-2" />
            <div>
              <p className="font-semibold">{p.nombre}</p>
              <p className="text-sm text-gray-600">Stock: {p.stockActual} / {p.stockObjetivo}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
