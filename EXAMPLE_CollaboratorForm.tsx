// EJEMPLO: CollaboratorForm con estilos reutilizables
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CollaboratorFormExample = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          {isEditing ? t('editCollaborator') : t('createCollaborator')}
        </h1>
      </div>

      {error && (
        <div className="alert alert-error">
          <strong>{t('error')}:</strong> {error}
        </div>
      )}

      <div className="form-container">
        <form className="form">
          {/* Fila con dos columnas para nombre y apellido */}
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <div className="form-group">
              <label htmlFor="firstName" className="form-label">
                {t('firstName')} <span className="required">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                className="form-input"
                placeholder={t('enterFirstName')}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName" className="form-label">
                {t('lastName')} <span className="required">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                className="form-input"
                placeholder={t('enterLastName')}
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Fila con dos columnas para posición y equipo */}
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
            <div className="form-group">
              <label htmlFor="position" className="form-label">
                {t('position')} <span className="required">*</span>
              </label>
              <select
                id="position"
                name="position"
                className="form-select"
                required
                disabled={loading}
              >
                <option value="">{t('selectPosition')}</option>
                {/* positions.map(...) */}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="team" className="form-label">
                {t('team')} <span className="required">*</span>
              </label>
              <select
                id="team"
                name="team"
                className="form-select"
                required
                disabled={loading}
              >
                <option value="">{t('selectTeam')}</option>
                {/* teams.map(...) */}
              </select>
            </div>
          </div>

          {/* Sección de Tags */}
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
                {t('addTag')}
              </label>
              <div style={{display: 'flex', gap: '0.5rem'}}>
                <input
                  type="text"
                  id="newTag"
                  className="form-input"
                  placeholder={t('enterTag')}
                  style={{flex: 1}}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="btn-secondary"
                  disabled={loading}
                >
                  {t('add')}
                </button>
              </div>
            </div>

            {/* Tags existentes */}
            <div style={{marginTop: '1rem'}}>
              <div className="tags">
                {/* Simular tags */}
                <span className="tag">
                  React
                  <button className="remove-filter">×</button>
                </span>
                <span className="tag">
                  TypeScript  
                  <button className="remove-filter">×</button>
                </span>
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading}
            >
              {loading ? t('saving') : t('save')}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/collaborators')}
              disabled={loading}
            >
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollaboratorFormExample;