import { api } from "../../services/api";
import type { FinishWorkPayload, Work } from "./works.types";

export async function getCurrentWork(): Promise<Work | null> {
  const { data } = await api.get<Work | null>("/works/current");
  return data;
}

export async function startWork(poolId: string): Promise<Work> {
  const { data } = await api.post<Work>("/works/start", { poolId });
  return data;
}

export async function finishWork(
  workId: string,
  payload: FinishWorkPayload,
): Promise<Work> {
  const { data } = await api.post<Work>(`/works/${workId}/finish`, payload);
  return data;
}

export async function getWorksByUserApi(userId: string): Promise<Work[]> {
  const response = await api.get<Work[]>(`/works/by-user/${userId}`);
  return response.data;
}

export async function getWorksByPoolApi(poolId: string): Promise<Work[]> {
  const response = await api.get<Work[]>(`/works/by-pool/${poolId}`);
  return response.data;
}
