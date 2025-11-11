import { useState, useEffect } from 'react';
import { ApiResponse, PaginationInfo } from '../types';

interface UsePaginatedDataProps<T> {
  fetchFunction: (page?: number, pageSize?: number) => Promise<ApiResponse<T>>;
  dependencies?: any[];
  initialPageSize?: number;
}

interface UsePaginatedDataReturn<T> {
  data: T[];
  pagination: PaginationInfo;
  loading: boolean;
  error: string | null;
  reload: () => Promise<void>;
  goToPage: (page: number) => Promise<void>;
  goToNextPage: () => Promise<void>;
  goToPreviousPage: () => Promise<void>;
  changePageSize: (pageSize: number) => Promise<void>;
}

export const usePaginatedData = <T>({
  fetchFunction,
  dependencies = [],
  initialPageSize = 10,
}: UsePaginatedDataProps<T>): UsePaginatedDataReturn<T> => {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: initialPageSize,
    totalItems: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async (page: number = pagination.page, pageSize: number = pagination.pageSize) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchFunction(page, pageSize);
      
      setData(Array.isArray(response?.data) ? response.data : []);
      setPagination(response?.pagination || {
        page: 1,
        pageSize: initialPageSize,
        totalItems: 0,
        totalPages: 1,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData([]);
      setPagination({
        page: 1,
        pageSize: initialPageSize,
        totalItems: 0,
        totalPages: 1,
      });
    } finally {
      setLoading(false);
    }
  };

  const goToPage = async (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      await loadData(page, pagination.pageSize);
    }
  };

  const goToNextPage = async () => {
    if (pagination.page < pagination.totalPages) {
      await goToPage(pagination.page + 1);
    }
  };

  const goToPreviousPage = async () => {
    if (pagination.page > 1) {
      await goToPage(pagination.page - 1);
    }
  };

  const changePageSize = async (pageSize: number) => {
    await loadData(1, pageSize);
  };

  const reload = async () => {
    await loadData(pagination.page, pagination.pageSize);
  };

  useEffect(() => {
    loadData(1, initialPageSize);
  }, dependencies);

  return {
    data,
    pagination,
    loading,
    error,
    reload,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    changePageSize,
  };
};