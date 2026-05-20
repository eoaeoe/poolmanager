export type StringOrNumber = string | number | null;
export interface DashboardSummary {
  kpis: {
    totalPools: number;
    worksToday: number;
    waterOpenPools: number;
    manualPumpOnPools: number;
    avgDurationMinutes: number;
    criticalPools: number;
    warningPools: number;
    okPools: number;
  };
  poolStatus: {
    ok: number;
    warning: number;
    critical: number;
  };
  activeAlerts: DashboardAlert[];
  worksByDay: DashboardWorksByDay[];
  recentActivity: DashboardRecentWork[];
}

export interface DashboardAlert {
  workId: string;
  poolId: string;
  poolName: string;
  status: "ok" | "warning" | "critical";
  finishedAt: string;
  ph: StringOrNumber;
  freeChlorine: StringOrNumber;
  alkalinity: StringOrNumber;
  waterAppearance: StringOrNumber;
  waterLevel: StringOrNumber;
}

export interface DashboardWorksByDay {
  date: string;
  total: string | number;
}

export interface DashboardRecentWork {
  id: string;
  finishedAt: string;
  pool?: {
    id: string;
    name: string;
  };
  user?: {
    id: string;
    name: string;
  };
}

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
