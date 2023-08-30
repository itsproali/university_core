export type IGenericErrorMessage = {
  path: string | number;
  message: string;
};

export type IGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorMessages: IGenericErrorMessage[];
};

export type IQueryParams = {
  page: number;
  limit: number;
  search: string;
  sortBy: string;
  // sortOrder: 1 | -1;
  sortOrder: "asc" | "desc" | string;
  filters: { [key: string]: number | string | boolean };
  fields?: { [key: string]: number };
};

export type IServiceResponse<T> = {
  data: T;
  totalPages: number;
  page: number;
  limit: number;
  totalResult: number;
  totalDocuments: number;
};
