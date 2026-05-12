import type { WATER_APPEARANCES, WATER_LEVELS } from "./works.constants";

export type WorkStatus = "in_progress" | "finished";

export type WaterAppearance = (typeof WATER_APPEARANCES)[number]["code"];
export type WaterLevel = (typeof WATER_LEVELS)[number]["code"];
export type YesNoValue = "0" | "1";

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
