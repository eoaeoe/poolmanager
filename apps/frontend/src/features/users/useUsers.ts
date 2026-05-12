import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import axios, { AxiosError } from "axios";
import {
  getUsersApi,
  createUserApi,
  updateUserApi,
  deleteUserApi,
  removeUserImageApi,
} from "./users.api";
import { useDebounce } from "../../hooks/useDebounce";
import type { UserFormValues, UserItem, UsersPageState } from "./users.types";
import { emptyUserForm } from "./users.types";
import { getWorksByUserApi } from "../works/works.api";
import type { Work } from "../works/works.types";

export function useUsers() {
  const [state, setState] = useState<UsersPageState>({
    users: [],
    totalRecords: 0,
    loading: false,
    saving: false,
    dialogVisible: false,
    editingUser: emptyUserForm,
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
  const [userWorks, setUserWorks] = useState<Work[]>([]);
  const [loadingUserWorks, setLoadingUserWorks] = useState(false);

  async function loadUserWorks(userId: string) {
    setLoadingUserWorks(true);

    try {
      const works = await getWorksByUserApi(userId);
      setUserWorks(works);
    } finally {
      setLoadingUserWorks(false);
    }
  }

  const loadUsers = useCallback(
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

        const data = await getUsersApi({
          page: customPage,
          limit: customRows,
          search: customSearch,
          sortField: customSortField || "createdAt",
          sortOrder: customSortOrder,
          signal: controller.signal,
        });

        setState((prev) => ({
          ...prev,
          users: data.users,
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
    void loadUsers(
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
    loadUsers,
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
    setUserWorks([]);
    setState((prev) => ({
      ...prev,
      dialogVisible: true,
      editingUser: emptyUserForm,
    }));
  };

  const openEditDialog = (user: UserItem) => {
    setUserWorks([]);
    setState((prev) => ({
      ...prev,
      dialogVisible: true,
      editingUser: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
        imageUrl: user.imageUrl,
      },
    }));
    void loadUserWorks(user.id);
  };

  const closeDialog = () => {
    setUserWorks([]);
    setState((prev) => ({
      ...prev,
      dialogVisible: false,
      editingUser: emptyUserForm,
    }));
  };

  const updateEditingUser = (patch: Partial<UserFormValues>) => {
    setState((prev) => ({
      ...prev,
      editingUser: {
        ...prev.editingUser,
        ...patch,
      },
    }));
  };

  const createUser = async (values: UserFormValues) => {
    setState((prev) => ({ ...prev, saving: true }));

    try {
      await createUserApi(values);

      lastQueryRef.current = "";
      await loadUsers();

      setUserWorks([]);
      setState((prev) => ({
        ...prev,
        saving: false,
        dialogVisible: false,
        editingUser: emptyUserForm,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, saving: false }));
      throw error;
    }
  };

  const editUser = async (values: UserFormValues) => {
    if (!values.id) {
      throw new Error("No se puede editar un usuario sin id");
    }

    setState((prev) => ({ ...prev, saving: true }));

    try {
      await updateUserApi(values);

      lastQueryRef.current = "";
      await loadUsers();

      setState((prev) => ({
        ...prev,
        saving: false,
        dialogVisible: false,
        editingUser: emptyUserForm,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, saving: false }));
      throw error;
    }
  };

  const saveUser = async () => {
    if (state.editingUser.id) {
      await editUser(state.editingUser);
      return;
    }

    await createUser(state.editingUser);
  };

  const deleteUser = async (id: string) => {
    await deleteUserApi(id);

    lastQueryRef.current = "";
    await loadUsers();
  };

  const removeUserImage = async (id: string) => {
    await removeUserImageApi(id);

    setState((prev) => ({
      ...prev,
      editingUser: {
        ...prev.editingUser,
        imageUrl: null,
        image: null,
      },
    }));

    lastQueryRef.current = "";
    await loadUsers();
  };

  return {
    users: state.users,
    totalRecords: state.totalRecords,
    loading: state.loading,
    saving: state.saving,
    dialogVisible: state.dialogVisible,
    editingUser: state.editingUser,
    pagination: state.pagination,
    search: state.search,
    sort: state.sort,
    setPage,
    setSearch,
    setSort,
    openCreateDialog,
    openEditDialog,
    closeDialog,
    updateEditingUser,
    saveUser,
    deleteUser,
    removeUserImage,
    userWorks,
    loadingUserWorks,
  };
}
