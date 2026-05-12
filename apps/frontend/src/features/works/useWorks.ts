import { useEffect, useState } from "react";
import { getAllPoolsApi } from "../pools/pools.api";
import { finishWork, getCurrentWork, startWork } from "./works.api";
import type { FinishWorkPayload, Work } from "./works.types";
import type { PoolOption } from "../pools/pools.types";
import { initialFinishWorkData } from "./works.utils";

export function useWorks() {
  const [pools, setPools] = useState<PoolOption[]>([]);
  const [selectedPoolId, setSelectedPoolId] = useState<string | null>(null);
  const [currentWork, setCurrentWork] = useState<Work | null>(null);

  const [finishDialogVisible, setFinishDialogVisible] = useState(false);
  const [finishData, setFinishData] = useState<FinishWorkPayload>(
    initialFinishWorkData,
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadInitialData() {
    setLoading(true);
    setError("");

    try {
      const [currentWorkData, poolsData] = await Promise.all([
        getCurrentWork(),
        getAllPoolsApi(),
      ]);

      setCurrentWork(currentWorkData);
      setPools(poolsData);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se han podido cargar los datos del módulo de trabajos",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadInitialData();
  }, []);

  async function handleStartWork() {
    if (!selectedPoolId) return;

    setLoading(true);
    setError("");

    try {
      const work = await startWork(selectedPoolId);
      setCurrentWork(work);
      setSelectedPoolId(null);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se ha podido iniciar el mantenimiento",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleFinishWork() {
    if (!currentWork?.id) return;

    setLoading(true);
    setError("");

    try {
      await finishWork(currentWork.id, finishData);

      setCurrentWork(null);
      setFinishDialogVisible(false);
      setFinishData(initialFinishWorkData);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "No se ha podido finalizar el mantenimiento",
      );
    } finally {
      setLoading(false);
    }
  }

  return {
    pools,
    selectedPoolId,
    setSelectedPoolId,
    currentWork,
    finishDialogVisible,
    setFinishDialogVisible,
    finishData,
    setFinishData,
    loading,
    error,
    handleStartWork,
    handleFinishWork,
  };
}
