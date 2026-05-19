import { api } from "../../services/api";

export async function generatePoolDiagnosisApi(poolData: unknown) {
  const response = await api.post<{ diagnosis: string }>(
    "/ai/pool-diagnosis",
    poolData,
  );

  return response.data.diagnosis;
}
