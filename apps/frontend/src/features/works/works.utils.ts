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

export function formatWorkDate(value: string | null | undefined) {
  if (!value) return "-";
  return new Date(value).toLocaleString();
}

export function formatWorkLevel(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") return "-";
  return Number(value).toString();
}

export function formatWorkDurationMinutes(
  startedAt: string | null | undefined,
  finishedAt: string | null | undefined,
) {
  if (!startedAt || !finishedAt) return "-";

  const start = new Date(startedAt).getTime();
  const end = new Date(finishedAt).getTime();

  const minutes = Math.round((end - start) / 60000);

  if (Number.isNaN(minutes) || minutes < 0) return "-";

  return `${minutes} min`;
}

export function formatYesNo(value: "0" | "1" | null | undefined) {
  if (value === "1") return "Sí";
  if (value === "0") return "No";
  return "-";
}
