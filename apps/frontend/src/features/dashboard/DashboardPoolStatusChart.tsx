import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import type { DashboardSummary } from "./dashboard.types";

interface Props {
  readonly dashboard: DashboardSummary;
}

export function DashboardPoolStatusChart({ dashboard }: Props) {
  const chartData = {
    labels: ["Correctas", "Aviso", "Críticas"],
    datasets: [
      {
        data: [
          dashboard.poolStatus.ok,
          dashboard.poolStatus.warning,
          dashboard.poolStatus.critical,
        ],
        backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
        borderColor: "#1f2937",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#1f2937",
        },
      },
    },
  };

  return (
    <Card title="Estado global de piscinas">
      <Chart type="doughnut" data={chartData} options={options} />
    </Card>
  );
}
