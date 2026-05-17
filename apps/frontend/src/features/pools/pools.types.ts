export type PoolItem = {
  id: string;
  name: string;
  zoneCode: number;
  dimensionsText?: string | null;
  cubicMeters?: string | number | null;
  waterOpen: boolean;
  waterOpenAt?: string | null;
  manualPumpOn: boolean;
  manualPumpOnAt?: string | null;
  imageUrl?: string | null;
  createdAt: string;
  lastWork?: PoolLastWork | null;
};

export type PoolMeasurement = string | number | null;

export interface PoolLastWork {
  id: string;
  startedAt: string | null;
  finishedAt: string | null;
  ph: PoolMeasurement;
  freeChlorine: PoolMeasurement;
  totalChlorine: PoolMeasurement;
  alkalinity: PoolMeasurement;
  waterAppearance: string | null;
  waterLevel: string | null;
  user?: {
    id: string;
    name: string;
  } | null;
}

export type PoolsResponse = {
  pools: PoolItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PoolFormValues = {
  id?: string;
  name: string;
  zoneCode: number | null;
  dimensionsText: string;
  cubicMeters: string;
  waterOpen: boolean;
  waterOpenAt: string;
  manualPumpOn: boolean;
  manualPumpOnAt: string;
  image?: File | null;
  imageUrl?: string | null;
  lastWork?: PoolLastWork | null;
};

export const emptyPoolForm: PoolFormValues = {
  name: "",
  zoneCode: null,
  dimensionsText: "",
  cubicMeters: "",
  waterOpen: false,
  waterOpenAt: "",
  manualPumpOn: false,
  manualPumpOnAt: "",
  image: null,
  imageUrl: null,
};

export type PoolsPagination = {
  first: number;
  rows: number;
};

export type PoolsSort = {
  field: string;
  order: 1 | -1 | 0 | null | undefined;
};

export type PoolsPageState = {
  pools: PoolItem[];
  totalRecords: number;
  loading: boolean;
  saving: boolean;
  dialogVisible: boolean;
  editingPool: PoolFormValues;
  pagination: PoolsPagination;
  search: string;
  sort: PoolsSort;
};

export interface PoolOption {
  id: string;
  name: string;
}
