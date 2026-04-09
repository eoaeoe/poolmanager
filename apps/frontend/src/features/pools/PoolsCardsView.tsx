import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { DataView } from "primereact/dataview";
import { Paginator, type PaginatorPageChangeEvent } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import { InputSwitch } from "primereact/inputswitch";
import type { PoolItem } from "./pools.types";
import { getZoneNameByCode } from "./pools.constants";
import defaultPoolImage from "../../assets/default-pool.jpg";
import { IconDroplet, IconEngine } from "@tabler/icons-react";
import { formatElapsedTime } from "./pools.utils";
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
                    ? `http://localhost:8080${pool.imageUrl}`
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
                <IconDroplet size={16} />
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
                <IconEngine size={16} />
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

            {/* <div className="p-inputgroup flex-1">
              <span className="p-inputgroup-addon">
                <i className="pi pi-calendar"></i>
              </span>
              <InputText
                id="createdAt"
                placeholder="Fecha de alta"
                className="w-full"
                value={new Date(pool.createdAt).toLocaleDateString()}
                disabled
              />
            </div> */}

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
