import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import type {
  DataTablePageEvent,
  DataTableSortEvent,
} from "primereact/datatable";
import type { WorkListItem } from "./works.types";
import {
  formatWorkDate,
  formatWorkDurationMinutes,
  formatWorkLevel,
  formatYesNo,
} from "./works.utils";

interface Props {
  readonly works: WorkListItem[];
  readonly totalRecords: number;
  readonly loading: boolean;
  readonly first: number;
  readonly rows: number;
  readonly sort: {
    field: string;
    order: 1 | -1 | 0 | null | undefined;
  };
  readonly onPageChange: (event: DataTablePageEvent) => void;
  readonly onSortChange: (event: DataTableSortEvent) => void;
}

export default function WorksTableView({
  works,
  totalRecords,
  loading,
  first,
  rows,
  sort,
  onPageChange,
  onSortChange,
}: Props) {
  return (
    <DataTable
      value={works}
      lazy
      paginator
      first={first}
      rows={rows}
      totalRecords={totalRecords}
      onPage={onPageChange}
      loading={loading}
      emptyMessage="No hay trabajos disponibles"
      sortField={sort.field}
      sortOrder={sort.order === 0 ? null : sort.order}
      onSort={onSortChange}
      className="p-datatable-sm"
    >
      <Column
        field="pool.name"
        sortable
        header="Piscina"
        body={(rowData) => rowData.pool?.name ?? "-"}
      />

      <Column
        field="user.name"
        header="Empleado"
        sortable
        body={(rowData) => rowData.user?.name ?? "-"}
      />

      <Column
        field="startedAt"
        header="Inicio"
        sortable
        body={(rowData) => formatWorkDate(rowData.startedAt)}
      />

      <Column
        field="finishedAt"
        header="Fin"
        sortable
        body={(rowData) => formatWorkDate(rowData.finishedAt)}
      />

      <Column
        header="Duración"
        field="duration"
        sortable
        body={(rowData) =>
          formatWorkDurationMinutes(rowData.startedAt, rowData.finishedAt)
        }
      />

      <Column
        sortable
        field="ph"
        header="pH"
        body={(rowData) => formatWorkLevel(rowData.ph)}
      />

      <Column
        sortable
        field="freeChlorine"
        header="Cloro libre"
        body={(rowData) => formatWorkLevel(rowData.freeChlorine)}
      />

      <Column
        sortable
        field="totalChlorine"
        header="Cloro total"
        body={(rowData) => formatWorkLevel(rowData.totalChlorine)}
      />

      <Column
        sortable
        field="alkalinity"
        header="Alcalinidad"
        body={(rowData) => formatWorkLevel(rowData.alkalinity)}
      />

      <Column field="waterAppearance" header="Estado agua" sortable />
      <Column field="waterLevel" header="Nivel agua" sortable />

      <Column
        sortable
        field="waterOpen"
        header="Agua abierta"
        body={(rowData) => formatYesNo(rowData.waterOpen)}
      />

      <Column
        sortable
        field="manualPumpOn"
        header="Bomba manual"
        body={(rowData) => formatYesNo(rowData.manualPumpOn)}
      />

      <Column
        field="comment"
        header="Comentario"
        body={(rowData) => rowData.comment ?? "-"}
      />
    </DataTable>
  );
}
