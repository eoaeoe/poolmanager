import { Card } from "primereact/card";
import { IconClipboardList } from "@tabler/icons-react";
import type { DashboardSummary } from "./dashboard.types";

interface Props {
  readonly dashboard: DashboardSummary;
}

export function DashboardRecentActivity({ dashboard }: Props) {
  return (
    <Card title="Actividad reciente">
      <div className="flex flex-column gap-3">
        {dashboard.recentActivity.map((work) => (
          <div key={work.id} className="flex align-items-center gap-2">
            <IconClipboardList size={20} color="aqua" />

            <div>
              <strong>{work.pool?.name ?? "Piscina"}</strong>
              <div style={{ fontSize: "0.85rem" }}>
                {work.user?.name ?? "Empleado"} ·{" "}
                {new Date(work.finishedAt).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
