import { useTranslation } from 'react-i18next';
import { useTeamForm } from './useTeamForm';

const TeamForm = () => {
  const { t } = useTranslation();
  
  const {
    formData,
    newTag,
    setNewTag,
    loading,
    error,
    isEditing,
    handleSubmit,
    handleChange,
    handleTextAreaChange,
    handleCancel,
  } = useTeamForm();

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

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              {t('description')}
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleTextAreaChange}
              className="form-textarea"
              placeholder={t('enterDescription', 'Ingrese una descripción (opcional)')}
              rows={4}
              disabled={loading}
            />
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
              onClick={handleCancel}
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
