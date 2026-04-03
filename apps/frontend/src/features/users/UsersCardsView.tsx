import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { DataView } from "primereact/dataview";
import { Paginator, type PaginatorPageChangeEvent } from "primereact/paginator";
import type { UserItem } from "./users.types";

type Props = {
  users: UserItem[];
  loading: boolean;
  totalRecords: number;
  first: number;
  rows: number;
  onPageChange: (event: PaginatorPageChangeEvent) => void;
  onEdit: (user: UserItem) => void;
  onDelete: (user: UserItem) => void;
};

export default function UsersCardsView({
  users,
  loading,
  totalRecords,
  first,
  rows,
  onPageChange,
  onEdit,
  onDelete,
}: Props) {
  const itemTemplate = (user: UserItem) => {
    return (
      <div className="col-12">
        <Card className="mb-4">
          <div className="flex flex-column gap-2">
            <div>
              <strong>{user.name}</strong>
            </div>

            <div className="text-color-secondary">{user.email}</div>

            <div>
              <span className="font-medium">Rol:</span> {user.role}
            </div>

            <div>
              <span className="font-medium">Fecha alta:</span>{" "}
              {new Date(user.createdAt).toLocaleDateString()}
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                icon="pi pi-pencil"
                label="Editar"
                outlined
                size="small"
                onClick={() => onEdit(user)}
              />
              <Button
                icon="pi pi-trash"
                label="Eliminar"
                severity="danger"
                outlined
                size="small"
                onClick={() => onDelete(user)}
              />
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="flex flex-column gap-3">
      <DataView
        value={users}
        layout="list"
        itemTemplate={itemTemplate}
        loading={loading}
        emptyMessage="No hay usuarios disponibles"
      />

      <Paginator
        first={first}
        rows={rows}
        totalRecords={totalRecords}
        onPageChange={onPageChange}
        template="PrevPageLink CurrentPageReport NextPageLink"
        currentPageReportTemplate="{first} - {last} de {totalRecords}"
      />
    </div>
  );
}
