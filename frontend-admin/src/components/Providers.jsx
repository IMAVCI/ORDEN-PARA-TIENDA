import React, { useEffect, useState } from 'react';

export default function Providers() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ nombre: '', contacto: '' });

  const load = () =>
    fetch('http://localhost:3001/api/proveedores')
      .then(r => r.json())
      .then(setItems);

  useEffect(() => { load(); }, []);

  const save = e => {
    e.preventDefault();
    fetch('http://localhost:3001/api/proveedores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    }).then(load);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Proveedores</h2>
      <form onSubmit={save} className="mb-4 flex gap-2">
        <input className="border px-2" placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })}/>
        <input className="border px-2" placeholder="Contacto" value={form.contacto} onChange={e => setForm({ ...form, contacto: e.target.value })}/>
        <button className="bg-blue-600 text-white px-2" type="submit">Agregar</button>
      </form>
      <ul className="space-y-1">
        {items.map(p => (
          <li key={p.id} className="bg-white border px-2 py-1">{p.nombre} ({p.contacto})</li>
        ))}
      </ul>
    </div>
  );
}
