import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { positionsService } from '../../services/positionsService';
import { Position } from '../../types';

const PositionForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<Position>({
    name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadPosition(id);
    }
  }, [id]);

  const loadPosition = async (positionId: string) => {
    try {
      setLoading(true);
      const data = await positionsService.getById(positionId);
      setFormData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      if (isEditing && id) {
        await positionsService.update(id, formData);
      } else {
        await positionsService.create(formData);
      }

      navigate('/positions');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (loading && isEditing) return <div className="loading">{t('loading')}</div>;

  return (
    <div>
      <h1>{isEditing ? t('editPosition') : t('createPosition')}</h1>

      {error && <div className="error">{t('error')}: {error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">{t('positionName')}</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="btn-group">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? t('loading') : t('save')}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/positions')}
          >
            {t('cancel')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PositionForm;
