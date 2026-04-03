import { useRef } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import type {
  DataTablePageEvent,
  DataTableSortEvent,
} from "primereact/datatable";
import { IconSearch } from "@tabler/icons-react";

import { useUsers } from "./useUsers";
import type { UserItem } from "./users.types";
import { useIsMobile } from "../../hooks/useIsMobile";
import UsersTableView from "./UsersTableView";
import UsersCardsView from "./UsersCardsView";

const roleOptions = [
  { label: "Empleado", value: "employee" },
  { label: "Jefe", value: "boss" },
];

export default function UsersPage() {
  const toast = useRef<Toast>(null);
  const isMobile = useIsMobile();

  const {
    users,
    totalRecords,
    loading,
    saving,
    dialogVisible,
    editingUser,
    pagination,
    search,
    sort,
    setPage,
    setSearch,
    setSort,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    updateEditingUser,
    saveUser,
    deleteUser,
  } = useUsers();

  const onPageChange = (event: DataTablePageEvent) => {
    setPage(event.first, event.rows);
  };

  const onSortChange = (event: DataTableSortEvent) => {
    setSort(event.sortField, event.sortOrder);
  };

  const handleSave = async () => {
    try {
      if (!editingUser.name || !editingUser.email || !editingUser.role) {
        toast.current?.show({
          severity: "warn",
          summary: "Validación",
          detail: "Completa los campos obligatorios",
        });
        return;
      }

      if (!editingUser.id && !editingUser.password) {
        toast.current?.show({
          severity: "warn",
          summary: "Validación",
          detail: "La contraseña es obligatoria al crear",
        });
        return;
      }

      await saveUser();

      toast.current?.show({
        severity: "success",
        summary: "Guardado",
        detail: editingUser.id
          ? "Usuario actualizado correctamente"
          : "Usuario creado correctamente",
      });
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar el usuario",
      });
    }
  };

  const handleDelete = (user: UserItem) => {
    confirmDialog({
      message: `¿Seguro que quieres eliminar a ${user.name}?`,
      header: "Confirmar eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Eliminar",
      rejectLabel: "Cancelar",
      accept: async () => {
        try {
          await deleteUser(user.id);

          toast.current?.show({
            severity: "success",
            summary: "Eliminado",
            detail: "Usuario eliminado correctamente",
          });
        } catch {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "No se pudo eliminar el usuario",
          });
        }
      },
    });
  };

  return (
    <section>
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-3 mb-4">
        <div>
          <h2 className="m-0 tituloSeccion">
            <i className="pi pi-users iconoSeccion"></i> Usuarios
          </h2>
        </div>

        <div
          className="flex gap-2 flex-column sm:flex-row"
          style={{ alignItems: "center" }}
        >
          <span className="p-input-icon-left">
            <IconSearch style={{ marginLeft: "15px" }} size={16} />
            <InputText
              style={{ paddingLeft: "35px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar..."
            />
          </span>

          <Button
            icon="pi pi-plus"
            rounded
            raised
            text
            className="botonAccion"
            onClick={openCreateDialog}
          />
        </div>
      </div>

      <Card>
        {isMobile ? (
          <UsersCardsView
            users={users}
            loading={loading}
            totalRecords={totalRecords}
            first={pagination.first}
            rows={pagination.rows}
            onPageChange={onPageChange}
            onEdit={openEditDialog}
            onDelete={handleDelete}
          />
        ) : (
          <UsersTableView
            users={users}
            totalRecords={totalRecords}
            loading={loading}
            first={pagination.first}
            rows={pagination.rows}
            sort={sort}
            onPageChange={onPageChange}
            onSortChange={onSortChange}
            onEdit={openEditDialog}
            onDelete={handleDelete}
          />
        )}
      </Card>

      <Dialog
        visible={dialogVisible}
        onHide={closeDialog}
        header={editingUser.id ? "Editar usuario" : "Nuevo usuario"}
        style={{ width: "100%", maxWidth: "32rem" }}
        modal
      >
        <div
          className="flex flex-column gap-3 contenedorInputNuevoUsuario"
          style={{ paddingTop: "20px" }}
        >
          <span className="p-float-label mt-2">
            <InputText
              id="name"
              className="w-full"
              value={editingUser.name}
              onChange={(e) => updateEditingUser({ name: e.target.value })}
            />
            <label htmlFor="name">Nombre</label>
          </span>

          <span className="p-float-label mt-4">
            <InputText
              id="email"
              className="w-full"
              value={editingUser.email}
              onChange={(e) => updateEditingUser({ email: e.target.value })}
            />
            <label htmlFor="email">Email</label>
          </span>

          <span className="p-float-label mt-4">
            <Password
              inputId="password"
              value={editingUser.password}
              onChange={(e) => updateEditingUser({ password: e.target.value })}
              toggleMask
              feedback={false}
              className="w-full"
              inputClassName="w-full"
            />
            <label htmlFor="password">
              {editingUser.id ? "Nueva contraseña (opcional)" : "Contraseña"}
            </label>
          </span>

          <span className="p-float-label mt-4">
            <Dropdown
              inputId="role"
              className="w-full"
              value={editingUser.role}
              options={roleOptions}
              onChange={(e) => updateEditingUser({ role: e.value })}
            />
            <label htmlFor="role">Rol</label>
          </span>

          <div className="flex justify-content-end gap-2 pt-2">
            <Button
              label="Cancelar"
              outlined
              onClick={closeDialog}
              disabled={saving}
            />
            <Button label="Guardar" onClick={handleSave} loading={saving} />
          </div>
        </div>
      </Dialog>
    </section>
  );
}
