import { useEffect, useState } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import {
  getPoolLevelsDashboardApi,
  type PoolLevelDashboardItem,
} from "./dashboard.api";
import { PoolLevelPieChart } from "./PoolLevelPieChart";
import { IconDashboard } from "@tabler/icons-react";

export default function DashboardPage() {
  const [data, setData] = useState<PoolLevelDashboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const response = await getPoolLevelsDashboardApi();
        setData(response);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <section className="flex justify-content-center">
        <ProgressSpinner />
      </section>
    );
  }

  return (
    <section>
      <div className="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-3 mb-4">
        <div>
          <h2 className="m-0 tituloSeccion">
            <IconDashboard className="iconTabler" size={30} /> Dashboard
          </h2>
        </div>
      </div>
      <div className="grid mt-3">
        <div className="col-12 md:col-3">
          <PoolLevelPieChart title="PH por piscina" metric="ph" data={data} />
        </div>

        <div className="col-12 md:col-3">
          <PoolLevelPieChart
            title="Cloro libre por piscina"
            metric="freeChlorine"
            data={data}
          />
        </div>

        <div className="col-12 md:col-3">
          <PoolLevelPieChart
            title="Cloro total por piscina"
            metric="totalChlorine"
            data={data}
          />
        </div>

        <div className="col-12 md:col-3">
          <PoolLevelPieChart
            title="Alcalinidad por piscina"
            metric="alkalinity"
            data={data}
          />
        </div>
      </div>
    </section>
  );
}
