import { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
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
  filterField: string;
  searchValue: string;
  availableFilters: string[];
  setFilterField: (field: string) => void;
  setSearchValue: (value: string) => void;
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
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [data, setData] = useState<T[]>([]);
  const [metadata, setMetadata] = useState<ApiMetadata | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Obtener valores desde la URL
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const pageSizeFromUrl = parseInt(searchParams.get('pageSize') || initialPageSize.toString(), 10);
  const filterFieldFromUrl = searchParams.get('filter') || '';
  const searchValueFromUrl = searchParams.get('search') || '';
  
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: pageFromUrl,
    pageSize: pageSizeFromUrl,
    totalItems: 0,
    totalPages: 1,
  });
  
  // Estados para filtros - separados según API
  const [filterField, setFilterFieldState] = useState<string>(filterFieldFromUrl);
  const [searchValue, setSearchValueState] = useState<string>(searchValueFromUrl);

  const availableFilters = useMemo(() => {
    return metadata?.filters || [];
  }, [metadata]);

  // Función para actualizar los URL params
  const updateUrlParams = useCallback((updates: { 
    page?: number; 
    pageSize?: number; 
    filterField?: string; 
    searchValue?: string; 
  }) => {
    setSearchParams(prev => {
      const newParams = new URLSearchParams(prev);
      
      if (updates.page !== undefined) {
        if (updates.page === 1) {
          newParams.delete('page');
        } else {
          newParams.set('page', updates.page.toString());
        }
      }
      
      if (updates.pageSize !== undefined) {
        if (updates.pageSize === initialPageSize) {
          newParams.delete('pageSize');
        } else {
          newParams.set('pageSize', updates.pageSize.toString());
        }
      }
      
      if (updates.filterField !== undefined) {
        if (updates.filterField === '') {
          newParams.delete('filter');
        } else {
          newParams.set('filter', updates.filterField);
        }
      }
      
      if (updates.searchValue !== undefined) {
        if (updates.searchValue === '') {
          newParams.delete('search');
        } else {
          newParams.set('search', updates.searchValue);
        }
      }
      
      return newParams;
    });
  }, [setSearchParams, initialPageSize]);

  const loadData = async (
    page: number = pagination.page,
    pageSize: number = pagination.pageSize,
    searchVal: string = searchValue,
    filterFieldVal: string = filterField
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetchFunction(page, pageSize, searchVal, filterFieldVal);
      
      setData(Array.isArray(response?.data) ? response.data : []);
      setPagination(response?.pagination || {
        page: page,
        pageSize: pageSize,
        totalItems: 0,
        totalPages: 1,
      });
      setMetadata(response?.metadata);
      
      // Actualizar URL
      updateUrlParams({ page, pageSize, filterField: filterFieldVal, searchValue: searchVal });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData([]);
      setPagination({
        page: 1,
        pageSize: pageSize,
        totalItems: 0,
        totalPages: 1,
      });
    } finally {
      setLoading(false);
    }
  };

  const setFilterField = (newFilterField: string) => {
    setFilterFieldState(newFilterField);
  };

  const setSearchValue = (newSearchValue: string) => {
    setSearchValueState(newSearchValue);
  };

  const clearFilters = () => {
    setFilterFieldState('');
    setSearchValueState('');
    loadData(1, pagination.pageSize, '', '');
  };

  const applyFilters = async () => {
    await loadData(1, pagination.pageSize, searchValue, filterField);
  };

  const goToPage = async (page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      await loadData(page, pagination.pageSize, searchValue, filterField);
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
    await loadData(1, pageSize, searchValue, filterField);
  };

  const reload = async () => {
    await loadData(pagination.page, pagination.pageSize, searchValue, filterField);
  };

  // Effect para cargar datos iniciales y responder a cambios en URL
  useEffect(() => {
    const currentPage = parseInt(searchParams.get('page') || '1', 10);
    const currentPageSize = parseInt(searchParams.get('pageSize') || initialPageSize.toString(), 10);
    const currentFilterField = searchParams.get('filter') || '';
    const currentSearchValue = searchParams.get('search') || '';
    
    // Actualizar estado local si es diferente
    if (filterField !== currentFilterField) {
      setFilterFieldState(currentFilterField);
    }
    if (searchValue !== currentSearchValue) {
      setSearchValueState(currentSearchValue);
    }
    
    loadData(currentPage, currentPageSize, currentSearchValue, currentFilterField);
  }, [searchParams, ...dependencies]);

  return {
    data,
    pagination,
    metadata,
    loading,
    error,
    filterField,
    searchValue,
    availableFilters,
    setFilterField,
    setSearchValue,
    clearFilters,
    applyFilters,
    reload,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    changePageSize,
  };
};