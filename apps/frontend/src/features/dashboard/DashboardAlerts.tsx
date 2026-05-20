import { Card } from "primereact/card";
import { Tag } from "primereact/tag";
import { IconAlertTriangle } from "@tabler/icons-react";
import type { DashboardSummary } from "./dashboard.types";

interface Props {
  readonly dashboard: DashboardSummary;
}

export function DashboardAlerts({ dashboard }: Props) {
  if (dashboard.activeAlerts.length === 0) {
    return (
      <Card title="Alertas activas">
        <p>No hay alertas activas.</p>
      </Card>
    );
  }

  return (
    <Card title="Alertas activas">
      <div className="flex flex-column gap-3">
        {dashboard.activeAlerts.map((alert) => (
          <div
            key={alert.workId}
            className="flex align-items-center justify-content-between gap-3"
          >
            <div className="flex align-items-center gap-2">
              <IconAlertTriangle size={20} color="#f59e0b" />
              <div>
                <strong>{alert.poolName}</strong>
                <div style={{ fontSize: "0.85rem" }}>
                  pH {alert.ph} · CL {alert.freeChlorine} ·{" "}
                  {alert.waterAppearance}
                </div>
              </div>
            </div>

            <Tag
              severity={alert.status === "critical" ? "danger" : "warning"}
              value={alert.status === "critical" ? "Crítica" : "Aviso"}
            />
          </div>
        ))}
      </div>
    </Card>
  );
}
