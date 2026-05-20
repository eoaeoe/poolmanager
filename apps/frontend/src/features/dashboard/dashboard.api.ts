import { api } from "../../services/api";
import type {
  DashboardSummary,
  PoolLevelDashboardItem,
} from "./dashboard.types";

export async function getPoolLevelsDashboardApi() {
  const response = await api.get<PoolLevelDashboardItem[]>(
    "/dashboard/pool-levels",
  );

  return response.data;
}

export async function getDashboardSummaryApi() {
  const response = await api.get<DashboardSummary>("/dashboard/summary");
  return response.data;
}
