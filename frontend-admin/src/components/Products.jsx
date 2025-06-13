import React, { useEffect, useState } from 'react';

export default function Products() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ nombre: '', precio: '', proveedorId: '' });

  const load = () =>
    fetch('http://localhost:3001/api/productos')
      .then(r => r.json())
      .then(setItems);

  useEffect(() => {
    load();
  }, []);

  const save = e => {
    e.preventDefault();
    fetch('http://localhost:3001/api/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: form.nombre,
        precio: parseFloat(form.precio),
        stockActual: 0,
        stockObjetivo: 0,
        proveedorId: parseInt(form.proveedorId)
      })
    }).then(load);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Productos</h2>
      <form onSubmit={save} className="mb-4 flex gap-2">
        <input className="border px-2" placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}/>
        <input className="border px-2" placeholder="Precio" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })}/>
        <input className="border px-2" placeholder="ProveedorId" value={form.proveedorId} onChange={e => setForm({ ...form, proveedorId: e.target.value })}/>
        <button className="bg-blue-600 text-white px-2" type="submit">Agregar</button>
      </form>
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-2">ID</th>
            <th className="px-2">Nombre</th>
            <th className="px-2">Precio</th>
          </tr>
        </thead>
        <tbody>
          {items.map(p => (
            <tr key={p.id} className="border-t">
              <td className="px-2 py-1">{p.id}</td>
              <td className="px-2 py-1">{p.nombre}</td>
              <td className="px-2 py-1">${p.precio}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
