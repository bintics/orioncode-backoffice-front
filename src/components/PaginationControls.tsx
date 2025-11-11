import { useTranslation } from 'react-i18next';
import { PaginationInfo } from '../types';

interface PaginationControlsProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onPageSizeChange?: (pageSize: number) => void;
  loading?: boolean;
  className?: string;
}

const PaginationControls = ({
  pagination,
  onPageChange,
  onPreviousPage,
  onNextPage,
  onPageSizeChange,
  loading = false,
  className = 'pagination-controls',
}: PaginationControlsProps) => {
  const { t } = useTranslation();

  const generatePageNumbers = () => {
    const { page, totalPages } = pagination;
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Ajustar si no hay suficientes páginas al final
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const pageNumbers = generatePageNumbers();

  if (pagination.totalPages <= 1) {
    return null;
  }

  return (
    <div className={className}>
      <div className="pagination-info-section">
        <span className="pagination-info-text">
          {t('showing', 'Showing')} {pagination.pageSize * (pagination.page - 1) + 1} - {Math.min(pagination.pageSize * pagination.page, pagination.totalItems)} {t('of', 'of')} {pagination.totalItems}
        </span>
      </div>

      <div className="pagination-controls-section">
        {/* Botón Previous */}
        <button
          className="pagination-btn pagination-btn-prev"
          onClick={onPreviousPage}
          disabled={pagination.page <= 1 || loading}
          title={t('previousPage', 'Previous page')}
        >
          ‹ {t('previous', 'Previous')}
        </button>

        {/* Números de página */}
        <div className="pagination-numbers">
          {/* Primera página si no está visible */}
          {pageNumbers[0] > 1 && (
            <>
              <button
                className="pagination-btn pagination-number"
                onClick={() => onPageChange(1)}
                disabled={loading}
              >
                1
              </button>
              {pageNumbers[0] > 2 && <span className="pagination-ellipsis">...</span>}
            </>
          )}

          {/* Páginas visibles */}
          {pageNumbers.map((pageNum) => (
            <button
              key={pageNum}
              className={`pagination-btn pagination-number ${pageNum === pagination.page ? 'active' : ''}`}
              onClick={() => onPageChange(pageNum)}
              disabled={loading}
            >
              {pageNum}
            </button>
          ))}

          {/* Última página si no está visible */}
          {pageNumbers[pageNumbers.length - 1] < pagination.totalPages && (
            <>
              {pageNumbers[pageNumbers.length - 1] < pagination.totalPages - 1 && <span className="pagination-ellipsis">...</span>}
              <button
                className="pagination-btn pagination-number"
                onClick={() => onPageChange(pagination.totalPages)}
                disabled={loading}
              >
                {pagination.totalPages}
              </button>
            </>
          )}
        </div>

        {/* Botón Next */}
        <button
          className="pagination-btn pagination-btn-next"
          onClick={onNextPage}
          disabled={pagination.page >= pagination.totalPages || loading}
          title={t('nextPage', 'Next page')}
        >
          {t('next', 'Next')} ›
        </button>
      </div>

      {/* Selector de tamaño de página */}
      {onPageSizeChange && (
        <div className="page-size-selector">
          <label htmlFor="page-size">{t('itemsPerPage', 'Items per page')}:</label>
          <select
            id="page-size"
            value={pagination.pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            disabled={loading}
            className="page-size-select"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default PaginationControls;