export const getPagination = (page: number = 1, pageSize: number = 10) => {
  const skip = (page - 1) * pageSize;
  return { skip, take: pageSize, page, pageSize };
};

export interface Pagination<T> {
  rows: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
export const formatPagination = <T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number
): Pagination<T> => ({
  rows: data,
  pagination: {
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  },
});