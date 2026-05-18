import { Card } from "primereact/card";
import { DataView } from "primereact/dataview";
import { Paginator } from "primereact/paginator";
import { InputText } from "primereact/inputtext";
import type { DataTablePageEvent } from "primereact/datatable";
import {
  IconClock,
  IconDroplet,
  IconEngine,
  IconPool,
  IconStopwatch,
  IconUser,
  IconArrowsVertical,
} from "@tabler/icons-react";
import type { WorkListItem } from "./works.types";
import {
  formatWorkDate,
  formatWorkDurationMinutes,
  formatWorkLevel,
  formatYesNo,
} from "./works.utils";

interface Props {
  readonly works: WorkListItem[];
  readonly loading: boolean;
  readonly totalRecords: number;
  readonly first: number;
  readonly rows: number;
  readonly onPageChange: (event: DataTablePageEvent) => void;
}

export default function WorksCardsView({
  works,
  loading,
  totalRecords,
  first,
  rows,
  onPageChange,
}: Props) {
  return (
    <div className="flex flex-column gap-3">
      <DataView
        value={works}
        layout="list"
        loading={loading}
        emptyMessage="No hay trabajos disponibles"
        itemTemplate={(work: WorkListItem) => (
          <div className="col-12">
            <Card className="mb-4">
              <div className="flex flex-column gap-2">
                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <IconPool size={16} />
                  </span>
                  <InputText
                    className="w-full"
                    value={work.pool?.name ?? "-"}
                    disabled
                  />
                </div>

                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <IconUser size={16} />
                  </span>
                  <InputText
                    className="w-full"
                    value={work.user?.name ?? "-"}
                    disabled
                  />
                </div>

                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <IconClock size={16} />
                  </span>
                  <InputText
                    className="w-full"
                    value={formatWorkDate(work.finishedAt)}
                    disabled
                  />
                </div>

                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <IconStopwatch size={16} />
                  </span>
                  <InputText
                    className="w-full"
                    value={formatWorkDurationMinutes(
                      work.startedAt,
                      work.finishedAt,
                    )}
                    disabled
                  />
                </div>

                <div className="grid">
                  <div className="col-6">
                    <div className="p-inputgroup">
                      <span className="p-inputgroup-addon">PH</span>
                      <InputText
                        className="w-full"
                        value={formatWorkLevel(work.ph)}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="p-inputgroup">
                      <span className="p-inputgroup-addon">CL</span>
                      <InputText
                        className="w-full"
                        value={formatWorkLevel(work.freeChlorine)}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="p-inputgroup">
                      <span className="p-inputgroup-addon">CLT</span>
                      <InputText
                        className="w-full"
                        value={formatWorkLevel(work.totalChlorine)}
                        disabled
                      />
                    </div>
                  </div>

                  <div className="col-6">
                    <div className="p-inputgroup">
                      <span className="p-inputgroup-addon">AL</span>
                      <InputText
                        className="w-full"
                        value={formatWorkLevel(work.alkalinity)}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <IconDroplet size={16} />
                  </span>
                  <InputText
                    className="w-full"
                    value={work.waterAppearance ?? "-"}
                    disabled
                  />
                </div>

                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <IconArrowsVertical size={16} />
                  </span>
                  <InputText
                    className="w-full"
                    value={work.waterLevel ?? "-"}
                    disabled
                  />
                </div>

                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <IconDroplet size={16} />
                  </span>
                  <InputText
                    className="w-full"
                    value={`Agua abierta: ${formatYesNo(work.waterOpen)}`}
                    disabled
                  />
                </div>

                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <IconEngine size={16} />
                  </span>
                  <InputText
                    className="w-full"
                    value={`Bomba manual: ${formatYesNo(work.manualPumpOn)}`}
                    disabled
                  />
                </div>

                <div className="p-inputgroup flex-1">
                  <span className="p-inputgroup-addon">
                    <i className="pi pi-comment"></i>
                  </span>
                  <InputText
                    className="w-full"
                    value={work.comment ?? "-"}
                    disabled
                  />
                </div>
              </div>
            </Card>
          </div>
        )}
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
