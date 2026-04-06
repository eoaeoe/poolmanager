export type UserRole = "employee" | "boss";

export type UserItem = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  imageUrl?: string | null;
  createdAt: string;
};

export type UsersResponse = {
  users: UserItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type UserFormValues = {
  id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  image?: File | null;
  imageUrl?: string | null;
};

export const emptyUserForm: UserFormValues = {
  name: "",
  email: "",
  password: "",
  role: "employee",
  image: null,
  imageUrl: null,
};

export type UsersPagination = {
  first: number;
  rows: number;
};

export type UsersSort = {
  field: string;
  order: 1 | -1 | 0 | null | undefined;
};

export type UsersPageState = {
  users: UserItem[];
  totalRecords: number;
  loading: boolean;
  saving: boolean;
  dialogVisible: boolean;
  editingUser: UserFormValues;
  pagination: UsersPagination;
  search: string;
  sort: UsersSort;
};
