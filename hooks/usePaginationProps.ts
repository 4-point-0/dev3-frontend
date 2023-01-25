interface IOptions {
  page: number;
  onPageChange: (p: number) => void;
  total?: number;
  limit: number;
}

export function usePaginationProps({
  page,
  onPageChange,
  total,
  limit,
}: IOptions): any {
  if ((total || 0) <= limit) {
    return {};
  }

  console.log(total);

  return {
    totalRecords: total,
    recordsPerPage: limit,
    onPageChange,
    page,
  };
}
