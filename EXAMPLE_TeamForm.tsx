// EJEMPLO: TeamForm con estilos reutilizables
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const TeamFormExample = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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

      {success && (
        <div className="alert alert-success">
          <strong>{t('success')}:</strong> {t('teamSaved')}
        </div>
      )}

      <div className="form-container">
        <form className="form">
          {/* Información básica */}
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
              {t('basicInfo')}
            </h3>

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                {t('teamName')} <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="form-input"
                placeholder={t('enterTeamName')}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description" className="form-label">
                {t('description')}
              </label>
              <textarea
                id="description"
                name="description"
                className="form-textarea"
                placeholder={t('enterTeamDescription')}
                rows={4}
                disabled={loading}
              />
            </div>
          </div>

          {/* Configuración */}
          <div>
            <h3 style={{
              marginBottom: '1rem', 
              color: 'var(--accent-purple)',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}>
              {t('configuration')}
            </h3>

            <div className="form-group">
              <label htmlFor="department" className="form-label">
                {t('department')}
              </label>
              <select
                id="department"
                name="department"
                className="form-select"
                disabled={loading}
              >
                <option value="">{t('selectDepartment')}</option>
                <option value="engineering">Engineering</option>
                <option value="design">Design</option>
                <option value="marketing">Marketing</option>
                <option value="sales">Sales</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="maxMembers" className="form-label">
                {t('maxMembers')}
              </label>
              <input
                type="number"
                id="maxMembers"
                name="maxMembers"
                className="form-input"
                placeholder="10"
                min="1"
                max="50"
                disabled={loading}
              />
            </div>

            {/* Sección de Tags */}
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
                <span className="tag">
                  Frontend
                  <button className="remove-filter">×</button>
                </span>
                <span className="tag">
                  Agile
                  <button className="remove-filter">×</button>
                </span>
                <span className="tag">
                  Remote
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
              onClick={() => navigate('/teams')}
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

export default TeamFormExample;