import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { positionsService } from '../../services/positionsService';
import { Position } from '../../types';
import { usePaginatedData } from '../../hooks/usePaginatedData';
import DataTable from '../../components/DataTable';

const PositionsList = () => {
  const { t } = useTranslation();

  const { data: positions, pagination, loading, error, reload } = usePaginatedData({
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
      header: t('name'),
      render: (position: Position) => position?.name || '',
    },
    {
      key: 'description',
      header: t('description'),
      render: (position: Position) => position?.description || '',
    },
    {
      key: 'tags',
      header: t('tags'),
      render: (position: Position) => (
        <div className="tags">
          {Array.isArray(position?.tags) && position.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      ),
      width: '150px',
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

      <DataTable
        data={positions}
        columns={columns}
        loading={loading}
        error={error}
        pagination={pagination}
        className="data-table positions"
        emptyMessage={t('noPositions', 'No positions found')}
        itemName="positions"
      />
    </div>
  );
};

export default PositionsList;