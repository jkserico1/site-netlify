// src/BuscarFoto.tsx
import { useState } from 'react';

export default function BuscarFoto() {
  const [numero, setNumero] = useState('');
  const [foto, setFoto] = useState('');

  const buscarFoto = async () => {
    try {
      const res = await fetch(`https://whatsapp-data1.p.rapidapi.com/number/${numero}?base64=false`, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'whatsapp-data1.p.rapidapi.com',
          'x-rapidapi-key': '4d2acc4f43mshca2138069a4a42dp13ea23jsn8988939e2a08'
        }
      });

      const data = await res.json();

      if (data?.profile_picture_url) {
        setFoto(data.profile_picture_url);
      } else {
        alert('Foto não encontrada.');
        setFoto('');
      }
    } catch (err) {
      alert('Erro ao buscar a foto.');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <input
        type="text"
        placeholder="Digite o número com DDD"
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
        style={{ padding: 10, fontSize: 16 }}
      />
      <button
        onClick={buscarFoto}
        style={{ marginLeft: 10, padding: 10, fontSize: 16 }}
      >
        Buscar Foto
      </button>
      {foto && (
        <div style={{ marginTop: 20 }}>
          <img src={foto} alt="Foto do WhatsApp" width="150" style={{ borderRadius: '50%' }} />
        </div>
      )}
    </div>
  );
}
