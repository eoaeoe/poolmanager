import { Card } from "primereact/card";
import {
  IconPool,
  IconClipboardList,
  IconDroplet,
  IconEngine,
  IconStopwatch,
  IconAlertTriangle,
} from "@tabler/icons-react";
import type { DashboardSummary } from "./dashboard.types";

interface Props {
  readonly dashboard: DashboardSummary;
}

export function DashboardKpiCards({ dashboard }: Props) {
  const { kpis } = dashboard;

  const items = [
    {
      label: "Piscinas",
      value: kpis.totalPools,
      icon: <IconPool size={28} />,
    },
    {
      label: "Trabajos hoy",
      value: kpis.worksToday,
      icon: <IconClipboardList size={28} />,
    },
    {
      label: "Agua abierta",
      value: kpis.waterOpenPools,
      icon: <IconDroplet size={28} />,
    },
    {
      label: "Bomba manual",
      value: kpis.manualPumpOnPools,
      icon: <IconEngine size={28} />,
    },
    {
      label: "Media trabajo",
      value: `${kpis.avgDurationMinutes} min`,
      icon: <IconStopwatch size={28} />,
    },
    {
      label: "Críticas",
      value: kpis.criticalPools,
      icon: <IconAlertTriangle size={28} />,
    },
  ];

  return (
    <div className="grid">
      {items.map((item) => (
        <div key={item.label} className="col-12 sm:col-6 lg:col-2">
          <Card>
            <div className="flex align-items-center gap-3">
              <div style={{ color: "aqua" }}>{item.icon}</div>

              <div>
                <div style={{ fontSize: "1.5rem", fontWeight: 700 }}>
                  {item.value}
                </div>
                <div>{item.label}</div>
              </div>
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
}
