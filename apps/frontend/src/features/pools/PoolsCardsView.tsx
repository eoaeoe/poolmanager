import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { DataView } from "primereact/dataview";
import { Paginator, type PaginatorPageChangeEvent } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import type { PoolItem } from "./pools.types";
import { getZoneNameByCode } from "./pools.constants";
import defaultPoolImage from "../../assets/default-pool.jpg";
import { IconDroplet, IconEngine, IconStopwatch } from "@tabler/icons-react";
import {
  formatElapsedTime,
  formatLastWorkDate,
  formatPoolLevel,
  formatWorkDurationMinutes,
} from "./pools.utils";
import { getImageUrl } from "../../utils/imageUrl";

type Props = {
  pools: PoolItem[];
  loading: boolean;
  totalRecords: number;
  first: number;
  rows: number;
  onPageChange: (event: PaginatorPageChangeEvent) => void;
  onEdit: (pool: PoolItem) => void;
  onDelete: (pool: PoolItem) => void;
};

export default function PoolsCardsView({
  pools,
  loading,
  totalRecords,
  first,
  rows,
  onPageChange,
  onEdit,
  onDelete,
}: Readonly<Props>) {
  const itemTemplate = (pool: PoolItem) => {
    return (
      <div className="col-12">
        <Card className="mb-4">
          <div className="flex flex-column gap-2">
            <div style={{ textAlign: "center" }}>
              <img
                src={
                  pool.imageUrl
                    ? (getImageUrl(pool.imageUrl) ?? defaultPoolImage)
                    : defaultPoolImage
                }
                alt={pool.name}
                style={{
                  width: "120px",
                  height: "80px",
                  objectFit: "cover",
                  borderRadius: "12px",
                }}
              />
            </div>

            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-home"></i>
              </span>
              <InputText
                id="name"
                placeholder="Nombre"
                className="w-full"
                value={pool.name}
                disabled
              />
            </div>

            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-map-marker"></i>
              </span>
              <InputText
                id="zone"
                placeholder="Zona"
                className="w-full"
                value={getZoneNameByCode(pool.zoneCode)}
                disabled
              />
            </div>

            <div className="flex align-items-center justify-content-between inputSwitchContainerCardView">
              <span
                className="p-inputgroup-addon"
                style={{ height: "stretch" }}
              >
                <IconDroplet size={20} />
              </span>
              <div className="w-full flex align-items-center justify-content-center">
                <InputSwitch checked={pool.waterOpen} disabled />
              </div>
            </div>

            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-clock"></i>
              </span>
              <InputText
                id="waterOpenAt"
                placeholder="Desde"
                className="w-full"
                value={formatElapsedTime(pool.waterOpenAt)}
                disabled
              />
            </div>

            <div className="flex align-items-center justify-content-between inputSwitchContainerCardView">
              <span
                className="p-inputgroup-addon"
                style={{ height: "stretch" }}
              >
                <IconEngine size={20} />
              </span>
              <div className="w-full flex align-items-center justify-content-center">
                <InputSwitch checked={pool.manualPumpOn} disabled />
              </div>
            </div>

            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-clock"></i>
              </span>
              <InputText
                id="manualPumpOnAt"
                placeholder="Desde"
                className="w-full"
                value={formatElapsedTime(pool.manualPumpOnAt)}
                disabled
              />
            </div>
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-user"></i>
              </span>
              <InputText
                placeholder="Último empleado"
                className="w-full"
                value={pool.lastWork?.user?.name ?? "-"}
                disabled
              />
            </div>
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-calendar"></i>
              </span>
              <InputText
                placeholder="Último trabajo"
                className="w-full"
                value={formatLastWorkDate(pool.lastWork?.finishedAt)}
                disabled
              />
            </div>
            <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <IconStopwatch size={20} />
              </span>
              <InputText
                placeholder="Duración último trabajo"
                className="w-full"
                value={formatWorkDurationMinutes(
                  pool.lastWork?.startedAt,
                  pool.lastWork?.finishedAt,
                )}
                disabled
              />
            </div>
            <div className="pool-levels-grid">
              <div className="pool-level-item">
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon">PH</span>
                  <InputText
                    className="w-full"
                    value={formatPoolLevel(pool.lastWork?.ph)}
                    disabled
                  />
                </div>
              </div>

              <div className="pool-level-item">
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon">CL</span>
                  <InputText
                    className="w-full"
                    value={formatPoolLevel(pool.lastWork?.freeChlorine)}
                    disabled
                  />
                </div>
              </div>

              <div className="pool-level-item">
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon">CLT</span>
                  <InputText
                    className="w-full"
                    value={formatPoolLevel(pool.lastWork?.totalChlorine)}
                    disabled
                  />
                </div>
              </div>

              <div className="pool-level-item">
                <div className="p-inputgroup">
                  <span className="p-inputgroup-addon">AL</span>
                  <InputText
                    className="w-full"
                    value={formatPoolLevel(pool.lastWork?.alkalinity)}
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="flex gap-2 pt-2 justify-content-center">
              <Button
                icon="pi pi-pencil"
                raised
                rounded
                text
                size="small"
                onClick={() => onEdit(pool)}
              />
              <Button
                icon="pi pi-trash"
                raised
                rounded
                text
                severity="danger"
                outlined
                size="small"
                onClick={() => onDelete(pool)}
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
        value={pools}
        layout="list"
        itemTemplate={itemTemplate}
        loading={loading}
        emptyMessage="No hay piscinas disponibles"
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
