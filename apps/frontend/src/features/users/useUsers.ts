import { useEffect, useMemo, useState } from "react";
import { api } from "../../services/api";
import type {
  UserFormValues,
  UserItem,
  UsersPageState,
  UsersResponse,
} from "./users.types";
import { emptyUserForm } from "./users.types";

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

  const page = useMemo(() => {
    return Math.floor(state.pagination.first / state.pagination.rows) + 1;
  }, [state.pagination.first, state.pagination.rows]);

  const sortOrderText = state.sort.order === 1 ? "ASC" : "DESC";

  const loadUsers = async (
    customPage = page,
    customRows = state.pagination.rows,
    customSearch = state.search,
    customSortField = state.sort.field,
    customSortOrder = sortOrderText,
  ) => {
    try {
      setState((prev) => ({ ...prev, loading: true }));

      const params = new URLSearchParams({
        page: String(customPage),
        limit: String(customRows),
        search: customSearch,
        sortField: customSortField || "createdAt",
        sortOrder: customSortOrder,
      });

      const response = await api.get<UsersResponse>(
        `/users?${params.toString()}`,
      );

      setState((prev) => ({
        ...prev,
        users: response.data.users,
        totalRecords: response.data.total,
        loading: false,
      }));
    } catch (error) {
      setState((prev) => ({ ...prev, loading: false }));
      throw error;
    }
  };

  useEffect(() => {
    void loadUsers(
      page,
      state.pagination.rows,
      state.search,
      state.sort.field,
      sortOrderText,
    );
  }, [
    page,
    state.pagination.rows,
    state.search,
    state.sort.field,
    state.sort.order,
  ]);

  const setPage = (first: number, rows: number) => {
    setState((prev) => ({
      ...prev,
      pagination: { first, rows },
    }));
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

  const openCreateDialog = () => {
    setState((prev) => ({
      ...prev,
      dialogVisible: true,
      editingUser: emptyUserForm,
    }));
  };

  const openEditDialog = (user: UserItem) => {
    setState((prev) => ({
      ...prev,
      dialogVisible: true,
      editingUser: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: "",
        role: user.role,
      },
    }));
  };

  const closeDialog = () => {
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
      await api.post("/users", {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      });

      await loadUsers(
        page,
        state.pagination.rows,
        state.search,
        state.sort.field,
        sortOrderText,
      );

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
      await api.put(`/users/${values.id}`, {
        name: values.name,
        email: values.email,
        password: values.password || undefined,
        role: values.role,
      });

      await loadUsers(
        page,
        state.pagination.rows,
        state.search,
        state.sort.field,
        sortOrderText,
      );

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
    await api.delete(`/users/${id}`);
    await loadUsers(
      page,
      state.pagination.rows,
      state.search,
      state.sort.field,
      sortOrderText,
    );
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
  };
}
