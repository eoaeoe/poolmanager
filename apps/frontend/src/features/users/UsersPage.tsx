import { useRef } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import defaultUserImage from "../../assets/default-user.jpg";
import type {
  DataTablePageEvent,
  DataTableSortEvent,
} from "primereact/datatable";
import { IconSearch, IconUsers } from "@tabler/icons-react";
import { getImageUrl } from "../../utils/imageUrl";
import { useUsers } from "./useUsers";
import type { UserItem } from "./users.types";
import { useIsMobile } from "../../hooks/useIsMobile";
import UsersTableView from "./UsersTableView";
import UsersCardsView from "./UsersCardsView";
import { FileUpload } from "primereact/fileupload";
import { WorksHistoryTable } from "../works/worksHistoryTable";

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
    removeUserImage,
    userWorks,
    loadingUserWorks,
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
      className: "confirmDialogEliminarUsuario",
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

  const customDialogFooter = () => {
    return (
      <div className="flex justify-content-center gap-2 pt-2">
        <Button
          label="Cancelar"
          outlined
          onClick={closeDialog}
          disabled={saving}
        />
        <Button label="Guardar" onClick={handleSave} loading={saving} />
      </div>
    );
  };

  const chooseOptions = {
    icon: "pi pi-fw pi-images",
    iconOnly: true,
    className:
      "custom-choose-btn p-button-rounded  p-button-text p-button-raised",
  };

  return (
    <section>
      <Toast ref={toast} />
      <ConfirmDialog />
      <div className="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-3 mb-4">
        <div>
          <h2 className="m-0 tituloSeccion">
            <IconUsers className="iconTabler" size={30} /> Usuarios
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

      {isMobile ? (
        <Card className="contenedorInfoUsuarioTarjetas">
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
        </Card>
      ) : (
        <Card>
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
        </Card>
      )}

      <Dialog
        blockScroll
        visible={dialogVisible}
        className="DialogUser"
        onHide={closeDialog}
        header={editingUser.id ? "Editar usuario" : "Nuevo usuario"}
        footer={customDialogFooter}
        style={{
          width: "100%",
          maxWidth: editingUser.id ? "75rem" : "32rem",
        }}
        modal
      >
        <div className="flex flex-column gap-3 contenedorInputNuevoUsuario">
          <div style={{ textAlign: "center" }}>
            <img
              src={
                editingUser?.imageUrl
                  ? (getImageUrl(editingUser.imageUrl) ?? defaultUserImage)
                  : defaultUserImage
              }
              alt="Usuario"
              style={{
                width: "80px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "50%",
              }}
            />
          </div>
          <div className="flex  gap-2 contenedorFileUpload">
            <FileUpload
              mode="basic"
              accept="image/png,image/jpeg,image/webp"
              maxFileSize={2000000}
              chooseOptions={chooseOptions}
              auto
              customUpload
              onSelect={(e) => {
                const file = e.files?.[0] ?? null;
                updateEditingUser({ image: file });
              }}
            />
            {editingUser.imageUrl && (
              <div style={{ textAlign: "center" }}>
                <Button
                  icon="pi pi-times"
                  rounded
                  raised
                  text
                  severity="danger"
                  className="buttonImageAddDelete"
                  onClick={() => removeUserImage(editingUser.id || "")}
                />
              </div>
            )}
          </div>
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <i className="pi pi-user"></i>
            </span>
            <InputText
              id="name"
              placeholder="Nombre"
              className="w-full"
              value={editingUser.name}
              onChange={(e) => updateEditingUser({ name: e.target.value })}
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
              value={editingUser.email}
              onChange={(e) => updateEditingUser({ email: e.target.value })}
            />
          </div>
          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <i className="pi pi-lock"></i>
            </span>
            <Password
              inputId="password"
              placeholder="Password"
              value={editingUser.password}
              onChange={(e) => updateEditingUser({ password: e.target.value })}
              toggleMask
              feedback={false}
              className="w-full"
              inputClassName="w-full"
            />
          </div>

          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <i className="pi pi-id-card"></i>
            </span>
            <Dropdown
              inputId="role"
              className="w-full"
              value={editingUser.role}
              options={roleOptions}
              onChange={(e) => updateEditingUser({ role: e.value })}
            />
          </div>

          {/* <div className="flex justify-content-center gap-2 pt-2">
            <Button
              label="Cancelar"
              outlined
              onClick={closeDialog}
              disabled={saving}
            />
            <Button label="Guardar" onClick={handleSave} loading={saving} />
          </div> */}
        </div>
        {editingUser.id && (
          <div className="mt-4">
            <h3 className="mb-3" style={{ color: "aqua" }}>
              Histórico de mantenimientos
            </h3>

            <WorksHistoryTable
              works={userWorks}
              showPool
              loading={loadingUserWorks}
            />
          </div>
        )}
      </Dialog>
    </section>
  );
}
