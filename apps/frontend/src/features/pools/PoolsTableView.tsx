import { Button } from "primereact/button";
import { Column } from "primereact/column";
import {
  DataTable,
  type DataTablePageEvent,
  type DataTableSortEvent,
} from "primereact/datatable";
import { InputSwitch } from "primereact/inputswitch";
import type { PoolItem, PoolsSort } from "./pools.types";
import { getZoneNameByCode } from "./pools.constants";
import defaultPoolImage from "../../assets/default-pool.jpg";
import { formatElapsedTime } from "./pools.utils";

type Props = Readonly<{
  pools: PoolItem[];
  totalRecords: number;
  loading: boolean;
  first: number;
  rows: number;
  sort: PoolsSort;
  onPageChange: (event: DataTablePageEvent) => void;
  onSortChange: (event: DataTableSortEvent) => void;
  onEdit: (pool: PoolItem) => void;
  onDelete: (pool: PoolItem) => void;
}>;

export default function PoolsTableView({
  pools,
  totalRecords,
  loading,
  first,
  rows,
  sort,
  onPageChange,
  onSortChange,
  onEdit,
  onDelete,
}: Props) {
  const actionsBodyTemplate = (rowData: PoolItem) => {
    return (
      <div className="flex gap-2 celdaBotonesAccion">
        <Button
          icon="pi pi-pencil"
          rounded
          text
          severity="info"
          onClick={() => onEdit(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          text
          severity="danger"
          onClick={() => onDelete(rowData)}
        />
      </div>
    );
  };

  return (
    <DataTable
      value={pools}
      lazy
      paginator
      first={first}
      rows={rows}
      totalRecords={totalRecords}
      onPage={onPageChange}
      loading={loading}
      emptyMessage="No hay piscinas disponibles"
      sortField={sort.field}
      sortOrder={sort.order === 0 ? null : sort.order}
      onSort={onSortChange}
      className="p-datatable-sm"
    >
      <Column
        field="image"
        header=""
        className="columnaCentrada"
        body={(rowData: PoolItem) => (
          <div className="flex gap-2 celdaBotonesAccion">
            <img
              src={
                rowData.imageUrl
                  ? `http://localhost:8080${rowData.imageUrl}`
                  : defaultPoolImage
              }
              alt=""
              style={{
                width: "60px",
                height: "40px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
        )}
      />

      <Column field="name" header="Nombre" sortable />

      <Column
        field="zoneCode"
        header="Zona"
        sortable
        body={(rowData: PoolItem) => getZoneNameByCode(rowData.zoneCode)}
      />

      <Column
        field="waterOpen"
        header="Agua abierta"
        className="columnaCentrada"
        body={(rowData: PoolItem) => (
          <InputSwitch checked={rowData.waterOpen} disabled />
        )}
      />

      {/* <Column
        field="waterOpenAt"
        header="Agua abierta desde"
        body={(rowData: PoolItem) =>
          rowData.waterOpen ? formatDateTime(rowData.waterOpenAt) : "-"
        }
      /> */}

      <Column
        header="Tiempo agua abierta"
        body={(rowData: PoolItem) =>
          rowData.waterOpen ? formatElapsedTime(rowData.waterOpenAt) : "-"
        }
      />

      <Column
        field="manualPumpOn"
        header="Bomba manual"
        className="columnaCentrada"
        body={(rowData: PoolItem) => (
          <InputSwitch checked={rowData.manualPumpOn} disabled />
        )}
      />

      {/* <Column
        field="manualPumpOnAt"
        header="Bomba manual desde"
        body={(rowData: PoolItem) =>
          rowData.manualPumpOn ? formatDateTime(rowData.manualPumpOnAt) : "-"
        }
      /> */}

      <Column
        header="Tiempo bomba manual"
        body={(rowData: PoolItem) =>
          rowData.manualPumpOn ? formatElapsedTime(rowData.manualPumpOnAt) : "-"
        }
      />

      <Column
        header=""
        className="columnaCentrada"
        body={actionsBodyTemplate}
        style={{ width: "10rem" }}
      />
    </DataTable>
  );
}
