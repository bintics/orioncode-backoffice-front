import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { teamsService } from '../../services/teamsService';
import { Team } from '../../types';

const TeamForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<Team>({
    id: '',
    name: '',
    tags: [],
  });
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadTeam(id);
    } else {
      // Generate UUID for new team
      setFormData((prev) => ({
        ...prev,
        id: crypto.randomUUID(),
      }));
    }
  }, [id]);

  const loadTeam = async (teamId: string) => {
    try {
      setLoading(true);
      const data = await teamsService.getById(teamId);
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
        await teamsService.update(id, formData);
      } else {
        await teamsService.create(formData);
      }

      navigate('/teams');
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

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  if (loading && isEditing) return <div className="loading">{t('loading')}</div>;

  return (
    <div>
      <h1>{isEditing ? t('editTeam') : t('createTeam')}</h1>

      {error && <div className="error">{t('error')}: {error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="id">{t('teamId')}</label>
          <input
            type="text"
            id="id"
            name="id"
            value={formData.id}
            onChange={handleChange}
            required
            disabled
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">{t('teamName')}</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="newTag">{t('tags')}</label>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              type="text"
              id="newTag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="btn-secondary"
            >
              {t('addTag')}
            </button>
          </div>
          <div className="tags">
            {formData.tags.map((tag, index) => (
              <span key={index} className="tag">
                {tag}
                <button type="button" onClick={() => handleRemoveTag(tag)}>
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <div className="btn-group">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? t('loading') : t('save')}
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate('/teams')}
          >
            {t('cancel')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeamForm;
