import { api } from "../../services/api";

export interface PoolLevelDashboardItem {
  poolId: string;
  poolName: string;
  finishedAt: string;
  ph: number | null;
  freeChlorine: number | null;
  totalChlorine: number | null;
  alkalinity: number | null;
  waterAppearance: string | null;
  waterLevel: string | null;
}

export async function getPoolLevelsDashboardApi() {
  const response = await api.get<PoolLevelDashboardItem[]>(
    "/dashboard/pool-levels",
  );

  return response.data;
}
