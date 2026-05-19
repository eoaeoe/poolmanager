import { api } from "../../services/api";

export interface AIDiagnosis {
  title: string;
  criticals: string[];
  alerts: string[];
  positives: string[];
}

export async function generatePoolDiagnosisApi(poolData: unknown) {
  const response = await api.post<{ diagnosis: AIDiagnosis }>(
    "/ai/pool-diagnosis",
    poolData,
  );

  return response.data.diagnosis;
}
