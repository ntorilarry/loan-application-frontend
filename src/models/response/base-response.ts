export interface BaseResponse<T> {
  message?: string;
  data?: T;
  error?: BaseError;
  success?: boolean;
  pagination?: Pagination;
  stats?: any;
}

export interface BaseError {
  data?: any;
  message?: string;
  success?: boolean;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiError {
  data?: {
    error?: {
      errorMessage?: string;
    };
  };
}
