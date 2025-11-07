import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { positionsService } from '../../services/positionsService';
import { Position } from '../../types';

const PositionsList = () => {
  const { t } = useTranslation();
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPositions();
  }, []);

  const loadPositions = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await positionsService.getAll();
      setPositions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this position?')) {
      return;
    }

    try {
      await positionsService.delete(id);
      await loadPositions();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) return <div className="loading">{t('loading')}</div>;
  if (error) return <div className="error">{t('error')}: {error}</div>;

  return (
    <div>
      <div className="page-header">
        <h1>{t('positionsList')}</h1>
        <Link to="/positions/new">
          <button className="btn-primary">{t('createPosition')}</button>
        </Link>
      </div>

      <table>
        <thead>
          <tr>
            <th>{t('name')}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {positions.map((position) => (
            <tr key={position.id}>
              <td>{position.name}</td>
              <td>
                <div className="btn-group">
                  <Link to={`/positions/edit/${position.id}`}>
                    <button className="btn-secondary btn-small">{t('edit')}</button>
                  </Link>
                  <button
                    className="btn-danger btn-small"
                    onClick={() => handleDelete(position.id!)}
                  >
                    {t('delete')}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PositionsList;
