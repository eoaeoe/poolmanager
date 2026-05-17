import { useRef } from "react";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";
import type {
  DataTablePageEvent,
  DataTableSortEvent,
} from "primereact/datatable";
import {
  IconSearch,
  IconPool,
  IconDroplet,
  IconEngine,
  IconArrowsVertical,
} from "@tabler/icons-react";
import { getImageUrl } from "../../utils/imageUrl";
import defaultPoolImage from "../../assets/default-pool.jpg";
import { useIsMobile } from "../../hooks/useIsMobile";
import { poolZoneOptions } from "./pools.constants";
import { usePools } from "./usePools";
import type { PoolItem } from "./pools.types";
import PoolsTableView from "./PoolsTableView";
import PoolsCardsView from "./PoolsCardsView";
import { WorksHistoryTable } from "../works/worksHistoryTable";
import {
  formatLastWorkDate,
  formatPoolLevel,
  formatWorkDurationMinutes,
} from "./pools.utils";

export default function PoolsPage() {
  const toast = useRef<Toast>(null);
  const isMobile = useIsMobile();

  const {
    pools,
    totalRecords,
    loading,
    saving,
    dialogVisible,
    editingPool,
    pagination,
    search,
    sort,
    setPage,
    setSearch,
    setSort,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    updateEditingPool,
    savePool,
    deletePool,
    removePoolImage,
    poolWorks,
    loadingPoolWorks,
  } = usePools();

  const onPageChange = (event: DataTablePageEvent) => {
    setPage(event.first, event.rows);
  };

  const onSortChange = (event: DataTableSortEvent) => {
    setSort(event.sortField, event.sortOrder);
  };

  const handleSave = async () => {
    try {
      if (!editingPool.name || !editingPool.zoneCode) {
        toast.current?.show({
          severity: "warn",
          summary: "Validación",
          detail: "Nombre y zona son obligatorios",
        });
        return;
      }

      await savePool();

      toast.current?.show({
        severity: "success",
        summary: "Guardado",
        detail: editingPool.id
          ? "Piscina actualizada correctamente"
          : "Piscina creada correctamente",
      });
    } catch {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: "No se pudo guardar la piscina",
      });
    }
  };

  const handleDelete = (pool: PoolItem) => {
    confirmDialog({
      className: "confirmDialogEliminarPiscina",
      message: `¿Seguro que quieres eliminar la piscina ${pool.name}?`,
      header: "Confirmar eliminación",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Eliminar",
      rejectLabel: "Cancelar",
      accept: async () => {
        try {
          await deletePool(pool.id);

          toast.current?.show({
            severity: "success",
            summary: "Eliminada",
            detail: "Piscina eliminada correctamente",
          });
        } catch {
          toast.current?.show({
            severity: "error",
            summary: "Error",
            detail: "No se pudo eliminar la piscina",
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
      "custom-choose-btn p-button-rounded p-button-text p-button-raised",
  };

  return (
    <section>
      <Toast ref={toast} />
      <ConfirmDialog />

      <div className="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-3 mb-4">
        <div>
          <h2 className="m-0 tituloSeccion">
            <IconPool className="iconTabler" size={30} /> Piscinas
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
        <Card className="contenedorInfoPiscinaTarjetas">
          <PoolsCardsView
            pools={pools}
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
          <PoolsTableView
            pools={pools}
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
        className="DialogPool"
        onHide={() => {
          document.body.style.overflow = "";
          document.body.style.paddingRight = "";
          closeDialog();
        }}
        header={editingPool.id ? "Editar piscina" : "Nueva piscina"}
        footer={customDialogFooter}
        style={{
          width: "100%",
          maxWidth: editingPool.id ? "75rem" : "40rem",
        }}
        modal
      >
        <div className="flex flex-column gap-3 contenedorInputNuevaPiscina">
          <div style={{ textAlign: "center" }}>
            <img
              src={
                editingPool?.imageUrl
                  ? (getImageUrl(editingPool.imageUrl) ?? defaultPoolImage)
                  : defaultPoolImage
              }
              alt="Piscina"
              style={{
                width: "120px",
                height: "80px",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />
          </div>

          <div className="flex gap-2 contenedorFileUpload">
            <FileUpload
              mode="basic"
              accept="image/png,image/jpeg,image/jpg,image/webp,image/heic,image/heif"
              maxFileSize={10000000}
              chooseOptions={chooseOptions}
              auto
              customUpload
              onSelect={(e) => {
                const file = e.files?.[0] ?? null;
                updateEditingPool({ image: file });
              }}
              onValidationFail={() => {
                document.body.style.overflow = "";
                document.body.style.paddingRight = "";
                toast.current?.show({
                  severity: "warn",
                  summary: "Imagen no válida",
                  detail: "La imagen no cumple el formato o tamaño permitido",
                });
              }}
              onError={() => {
                document.body.style.overflow = "";
                document.body.style.paddingRight = "";
                toast.current?.show({
                  severity: "error",
                  summary: "Error",
                  detail: "No se pudo cargar la imagen",
                });
              }}
            />
            {editingPool.imageUrl && (
              <div style={{ textAlign: "center" }}>
                <Button
                  icon="pi pi-times"
                  rounded
                  raised
                  text
                  severity="danger"
                  className="buttonImageAddDelete"
                  onClick={() => removePoolImage(editingPool.id || "")}
                />
              </div>
            )}
          </div>

          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <i className="pi pi-tablet"></i>
            </span>
            <InputText
              id="name"
              placeholder="Nombre"
              className="w-full"
              value={editingPool.name}
              onChange={(e) => updateEditingPool({ name: e.target.value })}
            />
          </div>

          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <i className="pi pi-map-marker"></i>
            </span>
            <Dropdown
              inputId="zoneCode"
              className="w-full"
              value={editingPool.zoneCode}
              options={poolZoneOptions}
              onChange={(e) => updateEditingPool({ zoneCode: e.value })}
              placeholder="Zona"
            />
          </div>

          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <i className="pi pi-arrows-h"></i>
            </span>
            <InputText
              id="dimensionsText"
              placeholder="Medidas"
              className="w-full"
              value={editingPool.dimensionsText}
              onChange={(e) =>
                updateEditingPool({ dimensionsText: e.target.value })
              }
            />
          </div>

          <div className="p-inputgroup flex-1">
            <span className="p-inputgroup-addon">
              <i className="pi ">m3</i>
            </span>
            <InputText
              id="cubicMeters"
              placeholder="Metros cúbicos"
              className="w-full"
              value={editingPool.cubicMeters}
              onChange={(e) =>
                updateEditingPool({ cubicMeters: e.target.value })
              }
            />
          </div>

          <div className="flex align-items-center justify-content-between inputSwitchContainer">
            <span className="p-inputgroup-addon" style={{ height: "stretch" }}>
              <IconDroplet size={19} />
            </span>
            <div className="w-full flex align-items-center justify-content-center">
              <InputSwitch
                checked={editingPool.waterOpen}
                onChange={(e) =>
                  updateEditingPool({
                    waterOpen: e.value,
                    waterOpenAt: e.value ? editingPool.waterOpenAt : "",
                  })
                }
              />
            </div>
          </div>
          <div className="flex align-items-center justify-content-between  inputSwitchContainer">
            <span className="p-inputgroup-addon" style={{ height: "stretch" }}>
              <IconEngine size={19} />
            </span>
            <div className="w-full flex align-items-center justify-content-center">
              <InputSwitch
                inputId="manualPumpOn"
                checked={editingPool.manualPumpOn}
                onChange={(e) =>
                  updateEditingPool({
                    manualPumpOn: e.value,
                    manualPumpOnAt: e.value ? editingPool.manualPumpOnAt : "",
                  })
                }
              />
            </div>
          </div>
        </div>
        {editingPool.id && (
          <div className="mt-4">
            <div className="grid">
              <div className="col-12 md:col-6">
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-user"></i>
                  </span>
                  <InputText
                    className="w-full"
                    value={editingPool.lastWork?.user?.name ?? "-"}
                    disabled
                  />
                </div>
              </div>

              <div className="col-12 md:col-6">
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-calendar"></i>
                  </span>
                  <InputText
                    className="w-full"
                    value={`${formatLastWorkDate(editingPool.lastWork?.finishedAt)} (${formatWorkDurationMinutes(
                      editingPool.lastWork?.startedAt,
                      editingPool.lastWork?.finishedAt,
                    )})`}
                    disabled
                  />
                </div>
              </div>

              <div className="col-12 md:col-3">
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">PH</span>
                  <InputText
                    className="w-full"
                    value={formatPoolLevel(editingPool.lastWork?.ph)}
                    disabled
                  />
                </div>
              </div>

              <div className="col-12 md:col-3">
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">CL</span>
                  <InputText
                    className="w-full"
                    value={formatPoolLevel(editingPool.lastWork?.freeChlorine)}
                    disabled
                  />
                </div>
              </div>

              <div className="col-12 md:col-3">
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">CLT</span>
                  <InputText
                    className="w-full"
                    value={formatPoolLevel(editingPool.lastWork?.totalChlorine)}
                    disabled
                  />
                </div>
              </div>

              <div className="col-12 md:col-3">
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">AL</span>
                  <InputText
                    className="w-full"
                    value={formatPoolLevel(editingPool.lastWork?.alkalinity)}
                    disabled
                  />
                </div>
              </div>

              <div className="col-12 md:col-6">
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <IconDroplet size={16} />
                  </span>
                  <InputText
                    className="w-full"
                    value={editingPool.lastWork?.waterAppearance ?? "-"}
                    disabled
                  />
                </div>
              </div>

              <div className="col-12 md:col-6">
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <IconArrowsVertical size={16} />
                  </span>
                  <InputText
                    className="w-full"
                    value={editingPool.lastWork?.waterLevel ?? "-"}
                    disabled
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        {editingPool.id && (
          <div className="mt-4">
            <h3 className="mb-3" style={{ color: "aqua" }}>
              Histórico de mantenimientos
            </h3>

            <WorksHistoryTable
              works={poolWorks}
              showUser
              loading={loadingPoolWorks}
            />
          </div>
        )}
      </Dialog>
    </section>
  );
}
