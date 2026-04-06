import { Button } from "primereact/button";
import { Column } from "primereact/column";
import {
  DataTable,
  type DataTablePageEvent,
  type DataTableSortEvent,
} from "primereact/datatable";
import type { UserItem, UsersSort } from "./users.types";
import defaultUserImage from "../../assets/default-user.jpg";

type Props = Readonly<{
  users: UserItem[];
  totalRecords: number;
  loading: boolean;
  first: number;
  rows: number;
  sort: UsersSort;
  onPageChange: (event: DataTablePageEvent) => void;
  onSortChange: (event: DataTableSortEvent) => void;
  onEdit: (user: UserItem) => void;
  onDelete: (user: UserItem) => void;
}>;

export default function UsersTableView({
  users,
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
  const actionsBodyTemplate = (rowData: UserItem) => {
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
      value={users}
      lazy
      paginator
      first={first}
      rows={rows}
      totalRecords={totalRecords}
      onPage={onPageChange}
      loading={loading}
      emptyMessage="No hay usuarios disponibles"
      sortField={sort.field}
      sortOrder={sort.order === 0 ? null : sort.order}
      onSort={onSortChange}
      className="p-datatable-sm"
    >
      <Column
        field="image"
        header=""
        className="columnaCentrada"
        body={(rowData: UserItem) => (
          <div className="flex gap-2 celdaBotonesAccion">
            <img
              src={
                rowData.imageUrl
                  ? `http://localhost:8080${rowData.imageUrl}`
                  : defaultUserImage
              }
              alt=""
              style={{
                width: "40px",
                height: "40px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>
        )}
      />
      <Column field="name" header="Nombre" sortable />
      <Column field="email" header="Email" sortable />
      <Column field="role" header="Rol" sortable />
      <Column
        field="createdAt"
        header="Fecha alta"
        sortable
        body={(rowData: UserItem) =>
          new Date(rowData.createdAt).toLocaleDateString()
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
