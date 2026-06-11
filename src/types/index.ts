import { Request } from "express";

/** Standard paginated query parameters */
export interface PaginationQuery {
  page?: number;
  limit?: number;
}

/** Standard paginated response metadata */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Paginated data envelope */
export interface PaginatedData<T> {
  items: T[];
  meta: PaginationMeta;
}

/** Express request with typed body */
export interface TypedRequest<TBody = unknown, TQuery = unknown, TParams = unknown>
  extends Request {
  body: TBody;
  query: TQuery & Record<string, string | string[] | undefined>;
  params: TParams & Record<string, string>;
}

/** Generic ID param */
export interface IdParam {
  id: string;
}
