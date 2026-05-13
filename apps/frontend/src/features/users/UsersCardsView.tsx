import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { DataView } from "primereact/dataview";
import { Paginator, type PaginatorPageChangeEvent } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import type { UserItem } from "./users.types";
import defaultUserImage from "../../assets/default-user.jpg";
import { getImageUrl } from "../../utils/imageUrl";

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
}: Readonly<Props>) {
  const roleOptions = [
    { label: "Empleado", value: "employee" },
    { label: "Jefe", value: "boss" },
  ];

  const itemTemplate = (user: UserItem) => {
    return (
      <div className="col-12">
        <Card className="mb-4">
          <div className="flex flex-column gap-2">
            <div style={{ textAlign: "center" }}>
              <img
                src={
                  user.imageUrl
                    ? getImageUrl(user.imageUrl) ?? defaultUserImage
                    : defaultUserImage
                }
                alt={user.name}
                style={{
                  width: "80px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            </div>
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-user"></i>
              </span>
              <InputText
                id="name"
                placeholder="Nombre"
                className="w-full"
                value={user.name}
                disabled
              />
            </div>

            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-envelope"></i>
              </span>
              <InputText
                id="email"
                placeholder="Email"
                className="w-full"
                value={user.email}
                disabled
              />
            </div>

            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-id-card"></i>
              </span>
              <Dropdown
                inputId="role"
                className="w-full"
                value={user.role}
                options={roleOptions}
                disabled
              />
            </div>
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-calendar"></i>
              </span>
              <InputText
                id="fechaAlta"
                placeholder="Fecha de alta"
                className="w-full"
                value={new Date(user.createdAt).toLocaleDateString()}
                disabled
              />
            </div>
            <div className="flex gap-2 pt-2 justify-content-center">
              <Button
                icon="pi pi-pencil"
                raised
                rounded
                text
                size="small"
                onClick={() => onEdit(user)}
              />
              <Button
                icon="pi pi-trash"
                raised
                rounded
                text
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
