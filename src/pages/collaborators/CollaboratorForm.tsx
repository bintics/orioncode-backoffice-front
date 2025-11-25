import { useTranslation } from 'react-i18next';
import { useCollaboratorForm } from './useCollaboratorForm';

const CollaboratorForm = () => {
  const { t } = useTranslation();
  
  const {
    formData,
    positions,
    teams,
    newTag,
    setNewTag,
    loading,
    error,
    isEditing,
    handleSubmit,
    handleChange,
    handleAddTag,
    handleRemoveTag,
    handleKeyPress,
    handleCancel,
  } = useCollaboratorForm();

  if (loading && isEditing) return <div className="loading">{t('loading')}</div>;

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
        <form onSubmit={handleSubmit} className="form">
          {/* Personal Information */}
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
              {t('personalInfo', 'Personal Information')}
            </h3>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
              <div className="form-group">
                <label htmlFor="firstName" className="form-label">
                  {t('firstName')} <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder={t('enterFirstName', 'Ingrese el nombre')}
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
                  value={formData.lastName}
                  onChange={handleChange}
                  className="form-input"
                  placeholder={t('enterLastName', 'Ingrese el apellido')}
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Work Information */}
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
              {t('workInfo', 'Work Information')}
            </h3>

            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
              <div className="form-group">
                <label htmlFor="positionId" className="form-label">
                  {t('position')} <span className="required">*</span>
                </label>
                <select
                  id="positionId"
                  name="positionId"
                  value={formData.positionId}
                  onChange={handleChange}
                  className="form-select"
                  required
                  disabled={loading}
                >
                  <option value="">{t('selectPosition')}</option>
                  {positions.map((position) => (
                    <option key={position.id} value={position.id}>
                      {position.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="teamId" className="form-label">
                  {t('team')} <span className="required">*</span>
                </label>
                <select
                  id="teamId"
                  name="teamId"
                  value={formData.teamId}
                  onChange={handleChange}
                  className="form-select"
                  required
                  disabled={loading}
                >
                  <option value="">{t('selectTeam')}</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
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
              disabled={loading || !formData.firstName.trim() || !formData.lastName.trim() || !formData.positionId || !formData.teamId}
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

export default CollaboratorForm;