import { useState, useEffect, useMemo } from 'react';
import { ApiResponse, PaginationInfo, ApiMetadata } from '../types';

interface UseFilteredPaginatedDataProps<T> {
  fetchFunction: (page?: number, pageSize?: number, search?: string, filter?: string) => Promise<ApiResponse<T>>;
  dependencies?: any[];
  initialPageSize?: number;
}

interface UseFilteredPaginatedDataReturn<T> {
  data: T[];
  pagination: PaginationInfo;
  metadata: ApiMetadata | undefined;
  loading: boolean;
  error: string | null;
  filter: string;
  availableFilters: string[];
  setFilter: (filter: string) => void;
  clearFilters: () => void;
  applyFilters: () => Promise<void>;
  reload: () => Promise<void>;
  goToPage: (page: number) => Promise<void>;
  goToNextPage: () => Promise<void>;
  goToPreviousPage: () => Promise<void>;
  changePageSize: (pageSize: number) => Promise<void>;
}

export const useFilteredPaginatedData = <T>({
  fetchFunction,
  dependencies = [],
  initialPageSize = 10,
}: UseFilteredPaginatedDataProps<T>): UseFilteredPaginatedDataReturn<T> => {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    pageSize: initialPageSize,
    totalItems: 0,
    totalPages: 1,
  });
  const [metadata, setMetadata] = useState<ApiMetadata | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estados para filtros
  const [filter, setFilterState] = useState<string>('');
  
  // Estados internos para las consultas activas
  const [activeFilter, setActiveFilter] = useState<string>('');

  const availableFilters = useMemo(() => {
    return metadata?.filters || [];
  }, [metadata]);

  const loadData = async (
    page: number = pagination.page,
    pageSize: number = pagination.pageSize,
    filterValue: string = activeFilter
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchFunction(page, pageSize, '', filterValue);
      
      setData(Array.isArray(response?.data) ? response.data : []);
      setPagination(response?.pagination || {
        page: 1,
        pageSize: initialPageSize,
        totalItems: 0,
        totalPages: 1,
      });
      setMetadata(response?.metadata);
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

  const setFilter = (newFilter: string) => {
    setFilterState(newFilter);
  };

  const clearFilters = () => {
    setFilterState('');
    setActiveFilter('');
    loadData(1, pagination.pageSize, '');
  };

  const applyFilters = async () => {
    setActiveFilter(filter);
    await loadData(1, pagination.pageSize, filter);
  };

  const goToPage = async (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      await loadData(page, pagination.pageSize, activeFilter);
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
    await loadData(1, pageSize, activeFilter);
  };

  const reload = async () => {
    await loadData(pagination.page, pagination.pageSize, activeFilter);
  };

  useEffect(() => {
    loadData(1, initialPageSize, '');
  }, dependencies);

  return {
    data,
    pagination,
    metadata,
    loading,
    error,
    filter,
    availableFilters,
    setFilter,
    clearFilters,
    applyFilters,
    reload,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    changePageSize,
  };
};