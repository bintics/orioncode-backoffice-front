import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { collaboratorsService } from '../../services/collaboratorsService';
import { positionsService } from '../../services/positionsService';
import { teamsService } from '../../services/teamsService';
import { Collaborator, Position, Team } from '../../types';

const CollaboratorForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<Collaborator>({
    id: '',
    firstName: '',
    lastName: '',
    positionId: '',
    teamId: '',
    tags: [],
  });
  const [positions, setPositions] = useState<Position[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadReferences();
    if (id) {
      loadCollaborator(id);
    }
  }, [id]);

  const loadReferences = async () => {
    try {
      const [posData, teamData] = await Promise.all([
        positionsService.getAll(),
        teamsService.getAll(),
      ]);
      setPositions(posData);
      setTeams(teamData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred loading references');
    }
  };

  const loadCollaborator = async (collaboratorId: string) => {
    try {
      setLoading(true);
      const data = await collaboratorsService.getById(collaboratorId);
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
        await collaboratorsService.update(id, formData);
      } else {
        await collaboratorsService.create(formData);
      }

      navigate('/collaborators');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      <h1>{isEditing ? t('editCollaborator') : t('createCollaborator')}</h1>

      {error && <div className="error">{t('error')}: {error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="id">{t('collaboratorId')}</label>
          <input
            type="text"
            id="id"
            name="id"
            value={formData.id}
            onChange={handleChange}
            required
            disabled={isEditing}
          />
        </div>

        <div className="form-group">
          <label htmlFor="firstName">{t('firstName')}</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">{t('lastName')}</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="positionId">{t('position')}</label>
          <select
            id="positionId"
            name="positionId"
            value={formData.positionId}
            onChange={handleChange}
            required
          >
            <option value="">Select a position</option>
            {positions.map((position) => (
              <option key={position.id} value={position.id}>
                {position.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="teamId">{t('team')}</label>
          <select
            id="teamId"
            name="teamId"
            value={formData.teamId}
            onChange={handleChange}
            required
          >
            <option value="">Select a team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
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
            onClick={() => navigate('/collaborators')}
          >
            {t('cancel')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CollaboratorForm;
