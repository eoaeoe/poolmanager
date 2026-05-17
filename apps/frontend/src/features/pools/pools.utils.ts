export function formatElapsedTime(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);
  const now = new Date();

  const diffMs = now.getTime() - date.getTime();

  if (Number.isNaN(diffMs) || diffMs < 0) {
    return "-";
  }

  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) {
    return `${days}d ${hours}h ${minutes}min`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}min`;
  }

  return `${minutes}min`;
}

export function formatDateTime(value?: string | null) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleString();
}

export function formatPoolLevel(value: string | number | null | undefined) {
  if (value === null || value === undefined || value === "") {
    return "-";
  }

  return Number(value).toString();
}

export function formatLastWorkDate(value: string | null | undefined) {
  if (!value) return "-";

  return new Date(value).toLocaleString();
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
