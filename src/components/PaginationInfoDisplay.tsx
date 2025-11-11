import { useTranslation } from 'react-i18next';
import { PaginationInfo } from '../types';

interface PaginationInfoDisplayProps {
  pagination: PaginationInfo;
  itemName?: string;
  className?: string;
}

const PaginationInfoDisplay = ({ 
  pagination, 
  itemName = 'items',
  className = 'pagination-info'
}: PaginationInfoDisplayProps) => {
  const { t } = useTranslation();

  if (pagination.totalItems === 0) {
    return null;
  }

  const startItem = pagination.pageSize * (pagination.page - 1) + 1;
  const endItem = Math.min(pagination.pageSize * pagination.page, pagination.totalItems);

  return (
    <div className={className}>
      <p>
        {t('showing', 'Showing')} {startItem} - {endItem} {t('of', 'of')} {pagination.totalItems} {t(itemName, itemName)}
      </p>
    </div>
  );
};

export default PaginationInfoDisplay;