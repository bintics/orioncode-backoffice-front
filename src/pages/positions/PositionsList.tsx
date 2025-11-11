import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { positionsService } from '../../services/positionsService';
import { Position } from '../../types';
import { usePaginatedData } from '../../hooks/usePaginatedData';
import DataTable from '../../components/DataTable';

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
    if (!window.confirm(t('confirmDelete'))) {
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
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{t('positionsList')}</h1>
        <Link to="/positions/new" className="btn-primary">
          + {t('createPosition')}
        </Link>
      </div>

      <div className="table-container">
        <table className="data-table simple">
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
                    <Link to={`/positions/edit/${position.id}`} className="btn-secondary">
                      {t('edit')}
                    </Link>
                    <button
                      className="btn-danger"
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
    </div>
  );
};

export default PositionsList;
