import { useEffect, useState } from "react";
import axios from "axios";

type HealthResponse = {
  ok: boolean;
  message: string;
};

export default function HomePage() {
  const [status, setStatus] = useState<string>("Cargando...");

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await axios.get<HealthResponse>(
          "http://localhost:8080/api/health",
        );
        setStatus(response.data.message);
      } catch {
        setStatus("No se pudo conectar con el backend");
      }
    };

    void fetchHealth();
  }, []);

  return (
    <main style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1>PoolManager</h1>
      <p>{status}</p>
    </main>
  );
}
