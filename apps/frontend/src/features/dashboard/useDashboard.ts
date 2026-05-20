import { useEffect, useState } from "react";
import {
  getDashboardSummaryApi,
  getPoolLevelsDashboardApi,
} from "./dashboard.api";
import type {
  DashboardSummary,
  PoolLevelDashboardItem,
} from "./dashboard.types";

export function useDashboard() {
  const [dashboard, setDashboard] = useState<DashboardSummary | null>(null);
  const [poolLevels, setPoolLevels] = useState<PoolLevelDashboardItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [summaryData, poolLevelsData] = await Promise.all([
          getDashboardSummaryApi(),
          getPoolLevelsDashboardApi(),
        ]);

        setDashboard(summaryData);
        setPoolLevels(poolLevelsData);
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return {
    dashboard,
    poolLevels,
    loading,
  };
}
