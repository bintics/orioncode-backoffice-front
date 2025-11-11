# 🎨 Guía de Formularios Reutilizables

## ✅ **Sistema de Clases CSS Genéricas**

### **Template Base para Cualquier Formulario:**

```tsx
const [EntityName]Form = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">
          {isEditing ? t('edit[Entity]') : t('create[Entity]')}
        </h1>
      </div>

      {error && (
        <div className="alert alert-error">
          <strong>{t('error')}:</strong> {error}
        </div>
      )}

      <div className="form-container">
        <form onSubmit={handleSubmit} className="form">
          
          {/* Campo de texto estándar */}
          <div className="form-group">
            <label htmlFor="fieldName" className="form-label">
              {t('fieldLabel')} <span className="required">*</span>
            </label>
            <input
              type="text"
              id="fieldName"
              name="fieldName"
              value={formData.fieldName}
              onChange={handleChange}
              className="form-input"
              placeholder={t('enterValue')}
              required
              disabled={loading}
            />
          </div>

          {/* Textarea */}
          <div className="form-group">
            <label htmlFor="description" className="form-label">
              {t('description')}
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleTextareaChange}
              className="form-textarea"
              placeholder={t('enterDescription')}
              rows={4}
              disabled={loading}
            />
          </div>

          {/* Select dropdown */}
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              {t('category')} <span className="required">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
              required
              disabled={loading}
            >
              <option value="">{t('selectCategory')}</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Acciones */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={loading || !isFormValid()}
            >
              {loading ? t('saving') : t('save')}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => navigate('/[entities]')}
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
```

## 🏗️ **Ejemplos Específicos de Reutilización**

### **1. Formulario de Colaborador:**

```tsx
// CollaboratorForm.tsx
<div className="form-container">
  <form className="form">
    <div className="form-group">
      <label className="form-label">
        {t('firstName')} <span className="required">*</span>
      </label>
      <input className="form-input" type="text" />
    </div>

    <div className="form-group">
      <label className="form-label">
        {t('lastName')} <span className="required">*</span>
      </label>
      <input className="form-input" type="text" />
    </div>

    <div className="form-group">
      <label className="form-label">
        {t('position')} <span className="required">*</span>
      </label>
      <select className="form-select">
        <option>{t('selectPosition')}</option>
      </select>
    </div>

    <div className="form-actions">
      <button className="btn-primary">{t('save')}</button>
      <button className="btn-secondary">{t('cancel')}</button>
    </div>
  </form>
</div>
```

### **2. Formulario de Equipo:**

```tsx
// TeamForm.tsx
<div className="form-container">
  <form className="form">
    <div className="form-group">
      <label className="form-label">
        {t('teamName')} <span className="required">*</span>
      </label>
      <input className="form-input" type="text" />
    </div>

    <div className="form-group">
      <label className="form-label">{t('description')}</label>
      <textarea className="form-textarea" rows={4} />
    </div>

    <div className="form-actions">
      <button className="btn-primary">{t('save')}</button>
      <button className="btn-secondary">{t('cancel')}</button>
    </div>
  </form>
</div>
```

### **3. Formulario de Configuración:**

```tsx
// SettingsForm.tsx
<div className="form-container">
  <form className="form">
    {/* Alert de éxito */}
    <div className="alert alert-success">
      <strong>{t('success')}:</strong> {t('settingsSaved')}
    </div>

    <div className="form-group">
      <label className="form-label">{t('appName')}</label>
      <input className="form-input" type="text" />
    </div>

    <div className="form-group">
      <label className="form-label">{t('theme')}</label>
      <select className="form-select">
        <option value="dark">{t('darkTheme')}</option>
        <option value="light">{t('lightTheme')}</option>
      </select>
    </div>

    <div className="form-actions">
      <button className="btn-primary">{t('save')}</button>
    </div>
  </form>
</div>
```

## 🎨 **Variaciones y Extensiones**

### **Formulario con Múltiples Columnas:**

```tsx
<div className="form-container">
  <form className="form">
    {/* Fila con dos columnas */}
    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
      <div className="form-group">
        <label className="form-label">{t('firstName')}</label>
        <input className="form-input" type="text" />
      </div>
      <div className="form-group">
        <label className="form-label">{t('lastName')}</label>
        <input className="form-input" type="text" />
      </div>
    </div>

    {/* Campo completo */}
    <div className="form-group">
      <label className="form-label">{t('email')}</label>
      <input className="form-input" type="email" />
    </div>

    <div className="form-actions">
      <button className="btn-primary">{t('save')}</button>
      <button className="btn-secondary">{t('cancel')}</button>
    </div>
  </form>
</div>
```

### **Formulario con Secciones:**

```tsx
<div className="form-container">
  <form className="form">
    {/* Sección 1 */}
    <div style={{marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)'}}>
      <h3 style={{marginBottom: '1rem', color: 'var(--accent-purple)'}}>
        {t('personalInfo')}
      </h3>
      <div className="form-group">
        <label className="form-label">{t('fullName')}</label>
        <input className="form-input" type="text" />
      </div>
    </div>

    {/* Sección 2 */}
    <div>
      <h3 style={{marginBottom: '1rem', color: 'var(--accent-purple)'}}>
        {t('workInfo')}
      </h3>
      <div className="form-group">
        <label className="form-label">{t('position')}</label>
        <select className="form-select">
          <option>{t('selectPosition')}</option>
        </select>
      </div>
    </div>

    <div className="form-actions">
      <button className="btn-primary">{t('save')}</button>
      <button className="btn-secondary">{t('cancel')}</button>
    </div>
  </form>
</div>
```

## ✅ **Ventajas del Sistema Reutilizable**

1. **✅ Consistencia Visual**: Todos los formularios se ven iguales
2. **✅ Mantenimiento Fácil**: Un solo lugar para cambiar estilos
3. **✅ Desarrollo Rápido**: Copy-paste de clases CSS
4. **✅ Responsive**: Funciona en todos los dispositivos
5. **✅ Accesibilidad**: Focus states y navegación por teclado
6. **✅ Temas**: Usa variables CSS para fácil personalización

## 🚀 **Para Implementar en Nueva Entidad**

1. ✅ **Copy-paste** el template base
2. ✅ **Cambiar** nombres de campos específicos  
3. ✅ **Agregar/quitar** form-groups según necesidad
4. ✅ **Usar** las mismas clases CSS
5. ✅ **Personalizar** solo si es absolutamente necesario

¡El sistema está 100% listo para ser reutilizado en cualquier formulario! 🎉