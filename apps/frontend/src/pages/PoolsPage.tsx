import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { ProgressSpinner } from "primereact/progressspinner";
import { api } from "../services/api";

type PoolItem = {
  id: string;
  name: string;
  zoneCode: number;
  dimensionsText?: string | null;
  cubicMeters?: string | null;
  waterOpen: boolean;
  waterOpenAt?: string | null;
  manualPumpOn: boolean;
  manualPumpOnAt?: string | null;
  imageUrl?: string | null;
  createdAt: string;
};

export default function PoolsPage() {
  const [pools, setPools] = useState<PoolItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPools = async () => {
      try {
        setError("");
        const response = await api.get("/pools");
        setPools(response.data.pools);
      } catch {
        setError("No se pudieron cargar las piscinas");
      } finally {
        setLoading(false);
      }
    };

    void loadPools();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-content-center align-items-center py-6">
        <ProgressSpinner />
      </div>
    );
  }

  return (
    <section>
      <div className="mb-4">
        <h1 className="m-0">Piscinas</h1>
        <p className="text-color-secondary">Gestión de piscinas del sistema.</p>
      </div>

      {error ? <small className="p-error">{error}</small> : null}

      <div className="grid">
        {pools.map((pool) => (
          <div key={pool.id} className="col-12 md:col-6 xl:col-4">
            <Card title={pool.name} subTitle={`Zona: ${pool.zoneCode}`}>
              <p className="m-0">
                <strong>m³:</strong> {pool.cubicMeters || "-"}
              </p>
              <p className="m-0">
                <strong>Agua abierta:</strong> {pool.waterOpen ? "Sí" : "No"}
              </p>
              <p className="m-0">
                <strong>Bomba manual:</strong> {pool.manualPumpOn ? "Sí" : "No"}
              </p>
            </Card>
          </div>
        ))}
      </div>
    </section>
  );
}
