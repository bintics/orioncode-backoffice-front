import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { positionsService } from '../../services/positionsService';
import { Position } from '../../types';
import { useFilteredPaginatedData } from '../../hooks/useFilteredPaginatedData';
import DataTable from '../../components/DataTable';
import { SearchAndFilter } from '../../components/SearchAndFilter';

const PositionsList = () => {
  const { t } = useTranslation();

  const { 
    data: positions, 
    pagination, 
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
    changePageSize 
  } = useFilteredPaginatedData({
    fetchFunction: positionsService.getAll,
  });

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('confirmDelete'))) {
      return;
    }

    try {
      await positionsService.delete(id);
      await reload();
    } catch (err) {
      console.error('Error deleting position:', err);
    }
  };

  const columns = [
    {
      key: 'id',
      header: t('positionId'),
      render: (position: Position) => (
        <span className="id-cell" title={position?.id}>
          {position?.id}
        </span>
      ),
      width: '180px',
    },
    {
      key: 'name',
      header: t('positionName'),
      withd: '300px',
      render: (position: Position) => position?.name || '',
    },
    {
      key: 'description',
      header: t('description'),
      width: '500px',
      render: (position: Position) => position?.description || '',
    },
    {
      key: 'actions',
      header: t('actions'),
      render: (position: Position) => (
        <div className="btn-group">
          <Link to={`/positions/edit/${position?.id}`} className="btn-secondary">
            {t('edit')}
          </Link>
          <button
            className="btn-danger"
            onClick={() => position?.id && handleDelete(position.id)}
          >
            {t('delete')}
          </button>
        </div>
      ),
      width: '200px',
      className: 'text-right',
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{t('positionsList')}</h1>
        <Link to="/positions/new" className="btn-primary">
          + {t('createPosition')}
        </Link>
      </div>

      <SearchAndFilter
        filterField={filterField}
        searchValue={searchValue}
        availableFilters={availableFilters}
        onFilterFieldChange={setFilterField}
        onSearchValueChange={setSearchValue}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        loading={loading}
      />

      <DataTable
        data={positions}
        columns={columns}
        loading={loading}
        error={error}
        pagination={pagination}
        className="data-table positions"
        emptyMessage={t('noPositions', 'No positions found')}
        onPageChange={goToPage}
        onPreviousPage={goToPreviousPage}
        onNextPage={goToNextPage}
        onPageSizeChange={changePageSize}
      />
    </div>
  );
};

export default PositionsList;
