import React, { useEffect, useState } from 'react';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ usuario: '', password: '' });

  const load = () =>
    fetch('http://localhost:3001/api/usuarios')
      .then(r => r.json())
      .then(setUsers);

  useEffect(() => { load(); }, []);

  const save = e => {
    e.preventDefault();
    fetch('http://localhost:3001/api/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: form.usuario, password: form.password, esAdmin: false })
    }).then(load);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">Usuarios</h2>
      <form onSubmit={save} className="mb-4 flex gap-2">
        <input className="border px-2" placeholder="Usuario" value={form.usuario} onChange={e => setForm({ ...form, usuario: e.target.value })}/>
        <input className="border px-2" type="password" placeholder="Password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}/>
        <button className="bg-blue-600 text-white px-2" type="submit">Agregar</button>
      </form>
      <ul className="space-y-1">
        {users.map(u => (
          <li key={u.id} className="bg-white border px-2 py-1">{u.usuario}</li>
        ))}
      </ul>
    </div>
  );
}
