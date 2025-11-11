import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import PaginationControls from './PaginationControls';
import { PaginationInfo } from '../types';

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  width?: string;
  className?: string;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading: boolean;
  error: string | null;
  pagination?: PaginationInfo;
  emptyMessage?: string;
  className?: string;
  onPageChange?: (page: number) => void;
  onPreviousPage?: () => void;
  onNextPage?: () => void;
  onPageSizeChange?: (pageSize: number) => void;
}

const DataTable = <T,>({
  data,
  columns,
  loading,
  error,
  pagination,
  emptyMessage,
  className = 'data-table',
  onPageChange,
  onPreviousPage,
  onNextPage,
  onPageSizeChange,
}: DataTableProps<T>) => {
  const { t } = useTranslation();

  if (loading) {
    return <div className="loading">{t('loading')}</div>;
  }

  if (error) {
    return <div className="error">{t('error')}: {error}</div>;
  }

  return (
    <div className="table-container">
      {!Array.isArray(data) || data.length === 0 ? (
        <div className="empty-state">
          <p>{emptyMessage || t('noDataFound', 'No data found')}</p>
        </div>
      ) : (
        <>
          <table className={className}>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th 
                    key={column.key}
                    style={{ width: column.width }}
                    className={column.className}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={`row-${index}`}>
                  {columns.map((column) => (
                    <td 
                      key={`${index}-${column.key}`}
                      className={column.className}
                    >
                      {column.render(item)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          
          {pagination && onPageChange && onPreviousPage && onNextPage && (
            <PaginationControls
              pagination={pagination}
              onPageChange={onPageChange}
              onPreviousPage={onPreviousPage}
              onNextPage={onNextPage}
              onPageSizeChange={onPageSizeChange}
              loading={loading}
            />
          )}
        </>
      )}
    </div>
  );
};

export default DataTable;