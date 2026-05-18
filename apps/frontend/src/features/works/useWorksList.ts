import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import { useDebounce } from "../../hooks/useDebounce";
import { getWorksApi } from "./works.api";
import type { WorksPageState } from "./works.types";

export function useWorksList() {
  const [state, setState] = useState<WorksPageState>({
    works: [],
    totalRecords: 0,
    loading: false,
    pagination: {
      first: 0,
      rows: 10,
    },
    search: "",
    sort: {
      field: "finishedAt",
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

  const loadWorks = useCallback(
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

      if (lastQueryRef.current === queryKey) return;

      lastQueryRef.current = queryKey;

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const controller = new AbortController();
      abortControllerRef.current = controller;

      try {
        setState((prev) => ({ ...prev, loading: true }));

        const data = await getWorksApi({
          page: customPage,
          limit: customRows,
          search: customSearch,
          sortField: customSortField || "finishedAt",
          sortOrder: customSortOrder,
          signal: controller.signal,
        });

        setState((prev) => ({
          ...prev,
          works: data.works,
          totalRecords: data.total,
          loading: false,
        }));
      } catch (error: unknown) {
        if (axios.isCancel(error)) return;

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
    void loadWorks(
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
    loadWorks,
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
    setState((prev) => ({
      ...prev,
      search,
      pagination: {
        ...prev.pagination,
        first: 0,
      },
    }));
  };

  const setSort = (field: string, order: 1 | -1 | 0 | null | undefined) => {
    setState((prev) => ({
      ...prev,
      sort: {
        field,
        order,
      },
    }));
  };

  return {
    works: state.works,
    totalRecords: state.totalRecords,
    loading: state.loading,
    pagination: state.pagination,
    search: state.search,
    sort: state.sort,
    setPage,
    setSearch,
    setSort,
  };
}
