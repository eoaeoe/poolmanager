import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import type {
  DataTablePageEvent,
  DataTableSortEvent,
} from "primereact/datatable";
import { IconClipboardList, IconSearch } from "@tabler/icons-react";
import { useIsMobile } from "../../hooks/useIsMobile";
import { useWorksList } from "./useWorksList";
import WorksTableView from "./WorksTableView";
import WorksCardsView from "./WorksCardsView";

export default function WorksListPage() {
  const isMobile = useIsMobile();

  const {
    works,
    totalRecords,
    loading,
    pagination,
    search,
    sort,
    setPage,
    setSearch,
    setSort,
  } = useWorksList();

  const onPageChange = (event: DataTablePageEvent) => {
    setPage(event.first, event.rows);
  };

  const onSortChange = (event: DataTableSortEvent) => {
    setSort(event.sortField, event.sortOrder);
  };

  return (
    <section>
      <div className="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-3 mb-4">
        <div>
          <h2 className="m-0 tituloSeccion">
            <IconClipboardList className="iconTabler" size={30} /> Trabajos
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
        </div>
      </div>

      {isMobile ? (
        <Card className="contenedorInfoPiscinaTarjetas">
          <WorksCardsView
            works={works}
            loading={loading}
            totalRecords={totalRecords}
            first={pagination.first}
            rows={pagination.rows}
            onPageChange={onPageChange}
          />
        </Card>
      ) : (
        <Card>
          <WorksTableView
            works={works}
            totalRecords={totalRecords}
            loading={loading}
            first={pagination.first}
            rows={pagination.rows}
            sort={sort}
            onPageChange={onPageChange}
            onSortChange={onSortChange}
          />
        </Card>
      )}
    </section>
  );
}
