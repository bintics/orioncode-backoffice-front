import { useTranslation } from 'react-i18next';
import { usePositionForm } from './usePositionForm';

const PositionForm = () => {
  const { t } = useTranslation();
  
  const {
    formData,
    loading,
    error,
    isEditing,
    handleSubmit,
    handleChange,
    handleTextAreaChange,
    handleCancel,
  } = usePositionForm();

  if (loading && isEditing) return <div className="loading">{t('loading')}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          {isEditing ? t('editPosition') : t('createPosition')}
        </h1>
      </div>

      {error && (
        <div className="alert alert-error">
          <strong>{t('error')}:</strong> {error}
        </div>
      )}

      <div className="form-container">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              {t('positionName')} <span className="required">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder={t('enterPositionName', 'Ingrese el nombre del puesto')}
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

export default PositionForm;
