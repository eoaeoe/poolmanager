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
        backgroundColor: ["#00ff5e", "#ffa200", "#ff0000"],
        borderColor: "white",
        borderWidth: 3,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#ffffff",
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
