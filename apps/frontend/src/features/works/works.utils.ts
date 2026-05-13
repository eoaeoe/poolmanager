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

export function formatWorkDuration(
  startedAt: string,
  finishedAt: string | null,
): string {
  if (!finishedAt) return "-";

  const start = new Date(startedAt).getTime();
  const end = new Date(finishedAt).getTime();

  const diffMinutes = Math.round((end - start) / 60000);

  if (Number.isNaN(diffMinutes) || diffMinutes < 0) {
    return "-";
  }

  return `${diffMinutes} min`;
}
