import type { FinishWorkPayload, Work } from "./works.types";

export const initialFinishWorkData: FinishWorkPayload = {
  ph: null,
  freeChlorine: null,
  totalChlorine: null,
  alkalinity: null,
  waterAppearance: null,
  waterLevel: null,
  waterOpen: null,
  manualPumpOn: null,
  comment: "",
};

export function isFinishWorkDisabled(
  data: FinishWorkPayload,
  loading: boolean,
): boolean {
  return (
    data.ph === null ||
    data.freeChlorine === null ||
    data.totalChlorine === null ||
    data.alkalinity === null ||
    !data.waterAppearance ||
    !data.waterLevel ||
    data.waterOpen === null ||
    data.manualPumpOn === null ||
    loading
  );
}

export function formatWorkStartDate(work: Work): string {
  return new Date(work.startedAt).toLocaleString();
}
