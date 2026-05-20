import { Chart } from "primereact/chart";
import { Card } from "primereact/card";
import type { PoolLevelDashboardItem } from "./dashboard.types";
import { LEVEL_COLOR_PRESETS } from "../works/works.constants";

type MetricKey = "ph" | "freeChlorine" | "totalChlorine" | "alkalinity";

interface Props {
  readonly title: string;
  readonly metric: MetricKey;
  readonly data: readonly PoolLevelDashboardItem[];
}

export function PoolLevelPieChart({ title, metric, data }: Props) {
  const presets = LEVEL_COLOR_PRESETS[metric];

  const groupedValues = presets.map((preset) => {
    const pools = data.filter((item) => Number(item[metric]) === preset.value);

    return {
      value: preset.value,
      color: preset.color,
      count: pools.length,
      pools: pools.map((pool) => pool.poolName),
    };
  });

  const visibleGroups = groupedValues.filter((group) => group.count > 0);

  const chartData = {
    labels: visibleGroups.map(
      (group) => `${group.value} · ${group.count} piscina/s`,
    ),
    datasets: [
      {
        data: visibleGroups.map((group) => group.count),
        backgroundColor: visibleGroups.map((group) => group.color),
        borderColor: "aqua",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "white",
        },
      },
      tooltip: {
        callbacks: {
          label: (context: { dataIndex: number }) => {
            const group = visibleGroups[context.dataIndex];

            return [
              `${group.count} piscina/s con valor ${group.value}`,
              ...group.pools,
            ];
          },
        },
      },
    },
  };

  return (
    <Card
      className="cardTartas"
      title={title}
      style={{ backgroundColor: "#4786a3" }}
    >
      {visibleGroups.length === 0 ? (
        <p style={{ color: "white" }}>No hay datos disponibles</p>
      ) : (
        <Chart type="pie" data={chartData} options={options} />
      )}
    </Card>
  );
}
