// src/BuscarFoto.tsx
import { useState } from "react";

export default function BuscarFoto() {
  const [numero, setNumero] = useState("");
  const [foto, setFoto] = useState("");
  const [carregando, setCarregando] = useState(false);

  const buscarFoto = async () => {
    if (!numero || numero.length < 10) return;
    setCarregando(true);

    try {
      const resposta = await fetch(`https://whatsapp-data1.p.rapidapi.com/number/55${numero}?base64=false`, {
        method: "GET",
        headers: {
          "x-rapidapi-host": "whatsapp-data1.p.rapidapi.com",
          "x-rapidapi-key": "4d2acc4f43mshca2138069a4a42dp13ea23jsn8988939e2a08",
        },
      });

      const data = await resposta.json();
      setFoto(data?.profile_picture_url || "");
    } catch (error) {
      console.error("Erro:", error);
      setFoto("");
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <label style={{ display: "block", marginBottom: 10 }}>Digite o número com DDD:</label>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span>+55</span>
        <input
          type="text"
          placeholder="11999999999"
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          onBlur={buscarFoto}
          style={{ padding: 8, border: "1px solid #ccc", borderRadius: 6 }}
        />
      </div>

      <div style={{ marginTop: 30, textAlign: "center" }}>
        {carregando ? (
          <p>Buscando foto do perfil...</p>
        ) : (
          <img
            src={foto || "/foto-padrao.png"}
            alt="Foto do WhatsApp"
            width={120}
            height={120}
            style={{ borderRadius: "50%", border: "2px solid #e91e63" }}
          />
        )}
      </div>
    </div>
  );
}
