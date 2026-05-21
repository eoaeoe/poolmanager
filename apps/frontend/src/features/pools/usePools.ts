import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatDateTimeLocal } from "../../utils/date.utils";
import axios, { AxiosError } from "axios";
import {
  getPoolsApi,
  createPoolApi,
  updatePoolApi,
  deletePoolApi,
  removePoolImageApi,
} from "./pools.api";
import { useDebounce } from "../../hooks/useDebounce";
import type { PoolFormValues, PoolItem, PoolsPageState } from "./pools.types";
import { emptyPoolForm } from "./pools.types";
import { getWorksByPoolApi } from "../works/works.api";
import type { Work } from "../works/works.types";

export function usePools() {
  const [state, setState] = useState<PoolsPageState>({
    pools: [],
    totalRecords: 0,
    loading: false,
    saving: false,
    dialogVisible: false,
    editingPool: emptyPoolForm,
    pagination: {
      first: 0,
      rows: 10,
    },
    search: "",
    sort: {
      field: "createdAt",
      order: -1,
    },
  });

  const debouncedSearch = useDebounce(state.search, 400);
  const lastQueryRef = useRef("");
  const abortControllerRef = useRef<AbortController | null>(null);

  const page = useMemo(() => {
    return Math.floor(state.pagination.first / state.pagination.rows) + 1;
  }, [state.pagination.first, state.pagination.rows]);

  const sortOrderText: "ASC" | "DESC" = state.sort.order === 1 ? "ASC" : "DESC";
  const [poolWorks, setPoolWorks] = useState<Work[]>([]);
  const [loadingPoolWorks, setLoadingPoolWorks] = useState(false);

  async function loadPoolWorks(poolId: string) {
    setLoadingPoolWorks(true);

    try {
      const works = await getWorksByPoolApi(poolId);
      setPoolWorks(works);
    } finally {
      setLoadingPoolWorks(false);
    }
  }

  const loadPools = useCallback(
    async (
      customPage = page,
      customRows = state.pagination.rows,
      customSearch = debouncedSearch,
      customSortField = state.sort.field,
      customSortOrder = sortOrderText,
    ) => {
      const queryKey = JSON.stringify({
        page: customPage,
        rows: customRows,
        search: customSearch,
        sortField: customSortField,
        sortOrder: customSortOrder,
      });

      if (lastQueryRef.current === queryKey) {
        return;
      }

      lastQueryRef.current = queryKey;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        setState((prev) => ({ ...prev, loading: true }));

        const data = await getPoolsApi({
          page: customPage,
          limit: customRows,
          search: customSearch,
          sortField: customSortField || "createdAt",
          sortOrder: customSortOrder,
          signal: controller.signal,
        });

        setState((prev) => ({
          ...prev,
          pools: data.pools,
          totalRecords: data.total,
          loading: false,
        }));
      } catch (error: unknown) {
        if (axios.isCancel(error)) {
          return;
        }

        if (error instanceof AxiosError && error.code === "ERR_CANCELED") {
          return;
        }

        setState((prev) => ({ ...prev, loading: false }));
        throw error;
      }
    },
    [
      page,
      state.pagination.rows,
      debouncedSearch,
      state.sort.field,
      sortOrderText,
    ],
  );

  useEffect(() => {
    void loadPools(
      page,
      state.pagination.rows,
      debouncedSearch,
      state.sort.field,
      sortOrderText,
    );

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [
    page,
    state.pagination.rows,
    debouncedSearch,
    state.sort.field,
    state.sort.order,
    sortOrderText,
    loadPools,
  ]);

  const setPage = (first: number, rows: number) => {
    setState((prev) => {
      if (prev.pagination.first === first && prev.pagination.rows === rows) {
        return prev;
      }

      return {
        ...prev,
        pagination: { first, rows },
      };
    });
  };

  const setSearch = (search: string) => {
    setState((prev) => {
      const nextFirst = 0;

      if (prev.search === search && prev.pagination.first === nextFirst) {
        return prev;
      }

      return {
        ...prev,
        search,
        pagination: {
          ...prev.pagination,
          first: nextFirst,
        },
      };
    });
  };

  const setSort = (field: string, order: 1 | -1 | 0 | null | undefined) => {
    setState((prev) => {
      if (prev.sort.field === field && prev.sort.order === order) {
        return prev;
      }

      return {
        ...prev,
        sort: {
          field,
          order,
        },
      };
    });
  };

  const openCreateDialog = () => {
    setPoolWorks([]);
    setState((prev) => ({
      ...prev,
      dialogVisible: true,
      editingPool: emptyPoolForm,
    }));
  };

  const openEditDialog = (pool: PoolItem) => {
    setPoolWorks([]);
    setState((prev) => ({
      ...prev,
      dialogVisible: true,
      editingPool: {
        id: pool.id,
        name: pool.name,
        zoneCode: pool.zoneCode,
        dimensionsText: pool.dimensionsText ?? "",
        cubicMeters: pool.cubicMeters ? String(pool.cubicMeters) : "",
        waterOpen: pool.waterOpen,
        waterOpenAt: formatDateTimeLocal(pool.waterOpenAt),
        manualPumpOn: pool.manualPumpOn,
        manualPumpOnAt: formatDateTimeLocal(pool.manualPumpOnAt),
        imageUrl: pool.imageUrl ?? null,
        image: null,
        latitude: pool.latitude ?? null,
        longitude: pool.longitude ?? null,
        lastWork: pool.lastWork ?? null,
      },
    }));
    void loadPoolWorks(pool.id);
  };

  const closeDialog = () => {
    setPoolWorks([]);
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    setState((prev) => ({
      ...prev,
      dialogVisible: false,
      editingPool: emptyPoolForm,
    }));
  };

  const updateEditingPool = (patch: Partial<PoolFormValues>) => {
    setState((prev) => ({
      ...prev,
      editingPool: {
        ...prev.editingPool,
        ...patch,
      },
    }));
  };

  const createPool = async (values: PoolFormValues) => {
    setState((prev) => ({ ...prev, saving: true }));

    try {
      await createPoolApi(values);

      lastQueryRef.current = "";
      await loadPools();

      setState((prev) => ({
        ...prev,
        saving: false,
        dialogVisible: false,
        editingPool: emptyPoolForm,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, saving: false }));
      throw error;
    }
  };

  const editPool = async (values: PoolFormValues) => {
    if (!values.id) {
      throw new Error("No se puede editar una piscina sin id");
    }

    setState((prev) => ({ ...prev, saving: true }));

    try {
      await updatePoolApi(values);

      lastQueryRef.current = "";
      await loadPools();

      setState((prev) => ({
        ...prev,
        saving: false,
        dialogVisible: false,
        editingPool: emptyPoolForm,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, saving: false }));
      throw error;
    }
  };

  const savePool = async () => {
    if (state.editingPool.id) {
      await editPool(state.editingPool);
      return;
    }

    await createPool(state.editingPool);
  };

  const deletePool = async (id: string) => {
    await deletePoolApi(id);

    lastQueryRef.current = "";
    await loadPools();
  };

  const removePoolImage = async (id: string) => {
    await removePoolImageApi(id);

    setState((prev) => ({
      ...prev,
      editingPool: {
        ...prev.editingPool,
        imageUrl: null,
        image: null,
      },
    }));

    lastQueryRef.current = "";
    await loadPools();
  };

  return {
    pools: state.pools,
    totalRecords: state.totalRecords,
    loading: state.loading,
    saving: state.saving,
    dialogVisible: state.dialogVisible,
    editingPool: state.editingPool,
    pagination: state.pagination,
    search: state.search,
    sort: state.sort,
    setPage,
    setSearch,
    setSort,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    updateEditingPool,
    savePool,
    deletePool,
    removePoolImage,
    poolWorks,
    loadingPoolWorks,
  };
}
