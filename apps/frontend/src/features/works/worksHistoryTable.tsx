import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import type { Work } from "./works.types";
import { formatWorkDuration } from "./works.utils";

interface WorksHistoryTableProps {
  readonly works: Work[];
  readonly showPool?: boolean;
  readonly showUser?: boolean;
  readonly loading?: boolean;
}

export function WorksHistoryTable({
  works,
  showPool = false,
  showUser = false,
  loading = false,
}: WorksHistoryTableProps) {
  return (
    <DataTable
      value={works}
      loading={loading}
      dataKey="id"
      emptyMessage="No hay mantenimientos registrados"
      paginator
      rows={5}
      rowsPerPageOptions={[5, 10, 20]}
    >
      {showPool && (
        <Column
          header="Piscina"
          body={(rowData: Work) => rowData.pool?.name || "-"}
        />
      )}

      {showUser && (
        <Column
          header="Empleado"
          body={(rowData: Work) => rowData.user?.name || "-"}
        />
      )}

      <Column
        header="Inicio"
        body={(rowData: Work) => new Date(rowData.startedAt).toLocaleString()}
      />

      <Column
        header="Fin"
        body={(rowData: Work) =>
          rowData.finishedAt
            ? new Date(rowData.finishedAt).toLocaleString()
            : "-"
        }
      />

      <Column
        header="Duración"
        body={(rowData: Work) =>
          formatWorkDuration(rowData.startedAt, rowData.finishedAt)
        }
      />

      <Column field="ph" header="pH" />
      <Column field="freeChlorine" header="Cloro libre" />
      <Column field="totalChlorine" header="Cloro total" />
      <Column field="alkalinity" header="Alcalinidad" />
      <Column field="waterAppearance" header="Estado agua" />
      <Column field="waterLevel" header="Nivel agua" />

      <Column
        header="Agua abierta"
        body={(rowData: Work) => (rowData.waterOpen === "1" ? "Sí" : "No")}
      />

      <Column
        header="Bomba manual"
        body={(rowData: Work) => (rowData.manualPumpOn === "1" ? "Sí" : "No")}
      />

      <Column
        field="comment"
        header="Comentario"
        body={(rowData: Work) => rowData.comment || "-"}
      />
    </DataTable>
  );
}
