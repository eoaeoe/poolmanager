import { api } from "../../services/api";
import type { UsersResponse, UserFormValues } from "./users.types";

type GetUsersParams = {
  page: number;
  limit: number;
  search: string;
  sortField: string;
  sortOrder: "ASC" | "DESC";
  signal?: AbortSignal;
};

export async function getUsersApi(params: GetUsersParams) {
  const { page, limit, search, sortField, sortOrder, signal } = params;

  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    search,
    sortField,
    sortOrder,
  });

  const response = await api.get<UsersResponse>(`/users?${query.toString()}`, {
    signal,
  });

  return response.data;
}

export async function createUserApi(values: UserFormValues) {
  const response = await api.post("/users", {
    name: values.name,
    email: values.email,
    password: values.password,
    role: values.role,
  });

  return response.data;
}

export async function updateUserApi(values: UserFormValues) {
  if (!values.id) {
    throw new Error("Usuario sin id");
  }

  const response = await api.put(`/users/${values.id}`, {
    name: values.name,
    email: values.email,
    password: values.password || undefined,
    role: values.role,
  });

  return response.data;
}

export async function deleteUserApi(id: string) {
  const response = await api.delete(`/users/${id}`);
  return response.data;
}
