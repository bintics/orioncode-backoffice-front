import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { teamsService } from '../../services/teamsService';
import { CreateTeamRequest } from '../../types';

interface TeamFormData {
  name: string;
  tags: string[];
}

const TeamForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<TeamFormData>({
    name: '',
    tags: [],
  });
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadTeam(id);
    }
  }, [id]);

  const loadTeam = async (teamId: string) => {
    try {
      setLoading(true);
      const response = await teamsService.getById(teamId);
      setFormData({
        name: response.name,
        tags: response.tags,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error loading team');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);

      // Convert form data to API format
      const apiData: CreateTeamRequest = {
        id: uuidv4(), // Generate UUID for team
        name: formData.name,
        tags: formData.tags,
      };

      if (isEditing && id) {
        // For updates, we can use the same data structure but remove the id field
        const { id: _, ...updateData } = apiData;
        await teamsService.update(id, updateData);
      } else {
        await teamsService.create(apiData);
      }

      navigate('/teams');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error saving team');
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (loading && isEditing) return <div className="loading">{t('loading')}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          {isEditing ? t('editTeam') : t('createTeam')}
        </h1>
      </div>

      {error && (
        <div className="alert alert-error">
          <strong>{t('error')}:</strong> {error}
        </div>
      )}

      <div className="form-container">
        <form onSubmit={handleSubmit} className="form">
          {/* Team Information */}
          <div style={{
            marginBottom: '2rem', 
            paddingBottom: '1.5rem', 
            borderBottom: '1px solid var(--border-color)'
          }}>
            <h3 style={{
              marginBottom: '1rem', 
              color: 'var(--accent-purple)',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              {t('teamInfo', 'Team Information')}
            </h3>

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                {t('teamName')} <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder={t('enterTeamName', 'Ingrese el nombre del equipo')}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 style={{
              marginBottom: '1rem', 
              color: 'var(--accent-purple)',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              {t('tags')}
            </h3>

            <div className="form-group">
              <label htmlFor="newTag" className="form-label">
                {t('addTag', 'Add Tag')}
              </label>
              <div style={{display: 'flex', gap: '0.5rem'}}>
                <input
                  type="text"
                  id="newTag"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="form-input"
                  placeholder={t('enterTag', 'Ingrese una etiqueta')}
                  style={{flex: 1}}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="btn-secondary"
                  disabled={loading || !newTag.trim()}
                >
                  {t('add', 'Agregar')}
                </button>
              </div>
            </div>

            {formData.tags.length > 0 && (
              <div style={{marginTop: '1rem'}}>
                <div className="tags">
                  {formData.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="remove-filter"
                        disabled={loading}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading || !formData.name.trim()}
            >
              {loading ? t('saving', 'Guardando...') : t('save', 'Guardar')}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/teams')}
              disabled={loading}
            >
              {t('cancel', 'Cancelar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamForm;
