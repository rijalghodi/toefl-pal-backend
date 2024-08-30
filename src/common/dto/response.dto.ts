export interface Pagination {
  page: number;
  totalPage: number;
  pageSize: number;
  totalData: number;
}

export class ResponseDto<T> {
  readonly message: string;
  readonly data: T;
  readonly status?: number;
  readonly pagination?: Pagination;

  constructor(
    message: string,
    data: T,
    pagination?: Pagination,
    status?: number,
  ) {
    this.message = message;
    this.data = data;
    this.pagination = pagination;
    this.status = status;
  }
}
