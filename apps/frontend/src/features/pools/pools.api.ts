import { api } from "../../services/api";
import type { PoolFormValues, PoolsResponse, PoolOption } from "./pools.types";

type GetPoolsParams = {
  page: number;
  limit: number;
  search: string;
  sortField: string;
  sortOrder: "ASC" | "DESC";
  signal?: AbortSignal;
};

export async function getAllPoolsApi(): Promise<PoolOption[]> {
  const response = await api.get<PoolOption[]>("/pools/all");
  return response.data;
}

export async function getPoolsApi(params: GetPoolsParams) {
  const { page, limit, search, sortField, sortOrder, signal } = params;

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
    sortField,
    sortOrder,
  });

  const response = await api.get<PoolsResponse>(`/pools?${query.toString()}`, {
    signal,
  });

  return response.data;
}

function buildPoolFormData(values: PoolFormValues) {
  const formData = new FormData();

  formData.append("name", values.name);
  formData.append("zoneCode", String(values.zoneCode ?? ""));
  formData.append("dimensionsText", values.dimensionsText);
  formData.append("waterOpen", String(values.waterOpen));
  formData.append("manualPumpOn", String(values.manualPumpOn));

  if (values.cubicMeters.trim() !== "") {
    formData.append("cubicMeters", values.cubicMeters);
  }

  if (values.waterOpen && values.waterOpenAt) {
    formData.append("waterOpenAt", values.waterOpenAt);
  }

  if (values.manualPumpOn && values.manualPumpOnAt) {
    formData.append("manualPumpOnAt", values.manualPumpOnAt);
  }

  if (values.image) {
    formData.append("image", values.image);
  }

  return formData;
}

export async function createPoolApi(values: PoolFormValues) {
  const formData = buildPoolFormData(values);

  const response = await api.post("/pools", formData);
  return response.data;
}

export async function updatePoolApi(values: PoolFormValues) {
  if (!values.id) {
    throw new Error("Piscina sin id");
  }

  const formData = buildPoolFormData(values);

  const response = await api.put(`/pools/${values.id}`, formData);
  return response.data;
}

export async function deletePoolApi(id: string) {
  const response = await api.delete(`/pools/${id}`);
  return response.data;
}

export async function removePoolImageApi(id: string) {
  const response = await api.delete(`/pools/${id}/image`);
  return response.data;
}
