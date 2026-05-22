import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import type { DashboardSummary } from "./dashboard.types";

interface Props {
  readonly dashboard: DashboardSummary;
}

export function DashboardWorksByDayChart({ dashboard }: Props) {
  const chartData = {
    labels: dashboard.worksByDay.map((item) =>
      new Date(item.date).toLocaleDateString(),
    ),
    datasets: [
      {
        label: "Mantenimientos",
        data: dashboard.worksByDay.map((item) => Number(item.total)),
        tension: 0.3,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        labels: {
          color: "#ffffff",
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#ffffff",
        },
      },
      y: {
        ticks: {
          color: "#ffffff",
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <Card title="Mantenimientos últimos 7 días">
      <Chart type="line" data={chartData} options={options} />
    </Card>
  );
}
