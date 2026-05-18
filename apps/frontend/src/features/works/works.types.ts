import type { WATER_APPEARANCES, WATER_LEVELS } from "./works.constants";

export type WorkStatus = "in_progress" | "finished";

export type WaterAppearance = (typeof WATER_APPEARANCES)[number]["code"];
export type WaterLevel = (typeof WATER_LEVELS)[number]["code"];
export type YesNoValue = "0" | "1";
export type StringOrNumber = string | number | null;
export type NumericValue = string | number | null;

export interface Work {
  id: string;
  userId: string;
  poolId: string;
  startedAt: string;
  finishedAt: string | null;
  status: WorkStatus;

  ph: number | null;
  freeChlorine: number | null;
  totalChlorine: number | null;
  alkalinity: number | null;
  waterAppearance: WaterAppearance | null;
  waterLevel: WaterLevel | null;
  waterOpen: YesNoValue | null;
  manualPumpOn: YesNoValue | null;
  comment: string | null;

  pool?: {
    id: string;
    name: string;
  };

  user?: {
    id: string;
    name: string;
    email: string;
    role: "boss" | "employee";
  };
}

export interface FinishWorkPayload {
  ph: number | null;
  freeChlorine: number | null;
  totalChlorine: number | null;
  alkalinity: number | null;
  waterAppearance: WaterAppearance | null;
  waterLevel: WaterLevel | null;
  waterOpen: YesNoValue | null;
  manualPumpOn: YesNoValue | null;
  comment: string;
}

export interface WorkListItem {
  id: string;
  userId: string;
  poolId: string;
  startedAt: string;
  finishedAt: string | null;
  status: "in_progress" | "finished";
  ph: StringOrNumber;
  freeChlorine: StringOrNumber;
  totalChlorine: StringOrNumber;
  alkalinity: StringOrNumber;
  waterAppearance: string | null;
  waterLevel: string | null;
  waterOpen: "0" | "1" | null;
  manualPumpOn: "0" | "1" | null;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  pool?: {
    id: string;
    name: string;
    zoneCode?: number | null;
  } | null;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  } | null;
}

export interface WorksListResponse {
  works: WorkListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface WorksPageState {
  works: WorkListItem[];
  totalRecords: number;
  loading: boolean;
  pagination: {
    first: number;
    rows: number;
  };
  search: string;
  sort: {
    field: string;
    order: 1 | -1 | 0 | null | undefined;
  };
}
