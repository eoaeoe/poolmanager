import { ProgressSpinner } from "primereact/progressspinner";
import { IconDashboard } from "@tabler/icons-react";
import { useDashboard } from "./useDashboard";
import { DashboardKpiCards } from "./DashboardKpiCards";
import { DashboardPoolStatusChart } from "./DashboardPoolStatusChart";
import { DashboardWorksByDayChart } from "./DashboardWorksByDayChart";
import { DashboardAlerts } from "./DashboardAlerts";
import { DashboardRecentActivity } from "./DashboardRecentActivity";
import { PoolLevelPieChart } from "./PoolLevelPieChart";

export default function DashboardPage() {
  const { dashboard, poolLevels, loading } = useDashboard();

  if (loading) {
    return (
      <section className="flex justify-content-center">
        <ProgressSpinner />
      </section>
    );
  }

  if (!dashboard) {
    return <section>No se pudo cargar el dashboard.</section>;
  }

  return (
    <section className="dashboardSection">
      <div className="flex flex-column md:flex-row md:align-items-center md:justify-content-between gap-3 mb-4">
        <div>
          <h2 className="m-0 tituloSeccion">
            <IconDashboard className="iconTabler" size={30} /> Dashboard
          </h2>
        </div>
      </div>

      <DashboardKpiCards dashboard={dashboard} />

      <div className="grid mt-3">
        <div className="col-12 lg:col-3">
          <DashboardPoolStatusChart dashboard={dashboard} />
        </div>

        <div className="col-12 lg:col-3">
          <DashboardWorksByDayChart dashboard={dashboard} />
        </div>

        <div className="col-12 lg:col-3">
          <DashboardAlerts dashboard={dashboard} />
        </div>

        <div className="col-12 lg:col-3">
          <DashboardRecentActivity dashboard={dashboard} />
        </div>
      </div>

      <div className="grid mt-3">
        <div className="col-12 md:col-3">
          <PoolLevelPieChart
            title="PH por valor"
            metric="ph"
            data={poolLevels}
          />
        </div>

        <div className="col-12 md:col-3">
          <PoolLevelPieChart
            title="Cloro libre por valor"
            metric="freeChlorine"
            data={poolLevels}
          />
        </div>

        <div className="col-12 md:col-3">
          <PoolLevelPieChart
            title="Cloro total por valor"
            metric="totalChlorine"
            data={poolLevels}
          />
        </div>

        <div className="col-12 md:col-3">
          <PoolLevelPieChart
            title="Alcalinidad por valor"
            metric="alkalinity"
            data={poolLevels}
          />
        </div>
      </div>
    </section>
  );
}
