# Context & Standards - OrionCode Backoffice Frontend

Este archivo contiene los estándares, especificaciones y contexto técnico del proyecto que deben ser considerados en todo momento durante el desarrollo.

## 🌍 Internacionalización (i18n)

### Estándares obligatorios:
- **NUNCA usar texto hardcodeado** en componentes
- **SIEMPRE usar `useTranslation()` hook** para cualquier texto visible al usuario
- **Agregar nuevas traducciones** al archivo `src/i18n/index.ts` para inglés y español
- **Usar fallbacks** en formularios: `t('key', 'Fallback text')`
- **Interpolación** con doble llaves: `{{variable}}` para variables dinámicas

### Formato de traducciones:
```typescript
// Estructura en src/i18n/index.ts
en: {
  translation: {
    // Navegación
    positions: 'Positions',
    
    // Común
    save: 'Save',
    cancel: 'Cancel',
    
    // Específico por sección
    createPosition: 'Create Position',
  }
}
```

## 🎨 Sistema de Estilos CSS

### Clases CSS reutilizables establecidas:
```css
/* Contenedores */
.page-container
.page-header
.page-title
.form-container

/* Formularios */
.form
.form-group
.form-label
.form-input
.form-select
.form-textarea
.form-actions
.required (para asteriscos *)

/* Botones */
.btn-primary      /* Botones principales - SIEMPRE color blanco */
.btn-secondary    /* Botones secundarios */
.btn-danger       /* Botones de eliminar */

/* Alertas */
.alert
.alert-error
.alert-success
.alert-warning

/* Tags y filtros */
.tags
.tag
.remove-filter

/* Tablas */
.table-container
.data-table
.btn-group
```

### Colores CSS Variables:
```css
var(--bg-primary)
var(--bg-secondary)
var(--text-primary)
var(--text-secondary)
var(--accent-purple)
var(--accent-purple-hover)
var(--border-color)
```

## 🔧 Arquitectura de Componentes

### Estructura de formularios:
```tsx
const ComponentForm = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Interfaz específica para formulario (sin id)
  interface ComponentFormData {
    field1: string;
    field2: string[];
  }
  
  // Estados estándar
  const [formData, setFormData] = useState<ComponentFormData>({...});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // JSX con estructura estándar
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{t('title')}</h1>
      </div>
      
      {error && (
        <div className="alert alert-error">
          <strong>{t('error')}:</strong> {error}
        </div>
      )}
      
      <div className="form-container">
        <form onSubmit={handleSubmit} className="form">
          {/* Secciones con títulos */}
          <div style={{marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)'}}>
            <h3 style={{marginBottom: '1rem', color: 'var(--accent-purple)', fontSize: '1.1rem', fontWeight: '600'}}>
              {t('sectionTitle')}
            </h3>
            
            <div className="form-group">
              <label htmlFor="field" className="form-label">
                {t('fieldLabel')} <span className="required">*</span>
              </label>
              <input
                type="text"
                id="field"
                className="form-input"
                placeholder={t('placeholder')}
                required
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? t('saving') : t('save')}
            </button>
            <button type="button" className="btn-secondary" onClick={() => navigate('/path')}>
              {t('cancel')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
```

### Estructura de listas:
```tsx
const ComponentList = () => {
  const { t } = useTranslation();
  
  // Usar hook de paginación con filtros
  const { 
    data, 
    pagination, 
    loading, 
    error,
    filterField,
    searchValue,
    availableFilters,
    setFilterField,
    setSearchValue,
    applyFilters,
    clearFilters
  } = useFilteredPaginatedData({
    fetchFunction: service.getAll
  });
  
  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{t('listTitle')}</h1>
        <Link to="/path/new" className="btn-primary">
          + {t('createButton')}
        </Link>
      </div>
      
      <SearchAndFilter
        filterField={filterField}
        searchValue={searchValue}
        availableFilters={availableFilters}
        onFilterFieldChange={setFilterField}
        onSearchValueChange={setSearchValue}
        onApplyFilters={applyFilters}
        onClearFilters={clearFilters}
        loading={loading}
      />
      
      <DataTable
        data={data}
        columns={columns}
        loading={loading}
        error={error}
        pagination={pagination}
        className="data-table"
        emptyMessage={t('emptyMessage')}
      />
    </div>
  );
};
```

## 📡 Servicios API

### Estructura estándar:
```typescript
export const entityService = {
  getAll: async (
    page: number = 1, 
    pageSize: number = 10,
    search: string = '', 
    filter: string = ''  
  ): Promise<ApiResponse<Entity>> => {
    // Construir parámetros de consulta
    const params = new URLSearchParams({
      page: page.toString(),
      pageSize: pageSize.toString(),
    });

    // Agregar filtro si está especificado
    if (filter && filter.trim()) {
      params.append('filter', filter);
    }

    // Agregar search si está especificado
    if (search && search.trim()) {
      params.append('search', search);
    }

    const response = await apiClient.get<ApiResponse<Entity>>(`/endpoint?${params}`);
    return response.data;
  },
  
  getById: async (id: string): Promise<Entity> => {
    const response = await apiClient.get<Entity>(`/endpoint/${id}`);
    return response.data;
  },
  
  create: async (data: Omit<Entity, 'id'>): Promise<Entity> => {
    const response = await apiClient.post<Entity>('/endpoint', data);
    return response.data;
  },
  
  update: async (id: string, data: Partial<Entity>): Promise<Entity> => {
    const response = await apiClient.put<Entity>(`/endpoint/${id}`, data);
    return response.data;
  },
  
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/endpoint/${id}`);
  }
};
```

## 🔍 Sistema de Filtros y Búsqueda

### Funcionalidad "Buscar en todos los campos":
- **Campo vacío en filter** = busca en todos los campos disponibles
- **Campo específico en filter** = busca solo en ese campo
- **Componente SearchAndFilter** ya implementado y reutilizable
- **URL persistence** automático con `useFilteredPaginatedData`

### Hook estándar:
```typescript
const { 
  data, 
  pagination, 
  loading, 
  error,
  filterField,
  searchValue,
  availableFilters,
  setFilterField,
  setSearchValue,
  clearFilters,
  applyFilters
} = useFilteredPaginatedData({
  fetchFunction: service.getAll,
  dependencies: []
});
```

## 📝 TypeScript Standards

### Interfaces para formularios:
```typescript
// SIEMPRE crear interfaz específica para formularios (sin id)
interface EntityFormData {
  name: string;
  description?: string;
  tags: string[];
}

// La interfaz principal mantiene la estructura completa
interface Entity {
  id: string;
  name: string;
  description?: string;
  tags: string[];
  createdAt: string;
}
```

### Tipos de respuesta API:
```typescript
interface ApiResponse<T> {
  data: T[];
  pagination: PaginationInfo;
  metadata?: ApiMetadata;
}

interface PaginationInfo {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}
```

## 🚨 Validaciones y Manejo de Errores

### Estados estándar:
```typescript
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
```

### Manejo de errores en formularios:
```typescript
try {
  setLoading(true);
  setError(null);
  
  // Lógica de API
  
  navigate('/success-path');
} catch (err) {
  setError(err instanceof Error ? err.message : 'Error message');
  setLoading(false); // Solo en catch, no en try/finally
}
```

## 🎯 Patrones de Validación

### Campos requeridos:
```tsx
<label className="form-label">
  {t('label')} <span className="required">*</span>
</label>

<input
  required
  disabled={loading}
  // ...otros props
/>
```

### Botones con validación:
```tsx
<button 
  type="submit" 
  className="btn-primary" 
  disabled={loading || !formData.requiredField.trim()}
>
  {loading ? t('saving') : t('save')}
</button>
```

## 📱 Responsive Design

### Breakpoints:
- **Mobile**: `@media (max-width: 768px)`
- **Tablet**: `@media (max-width: 1024px)`
- **Desktop**: Por defecto

### Grid layouts:
```tsx
// Para formularios con campos lado a lado
<div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
  <div className="form-group">...</div>
  <div className="form-group">...</div>
</div>
```

## 🔧 Herramientas de Desarrollo

### Comandos estándar:
```bash
nvm use 20          # Usar Node 20
npm run dev         # Servidor de desarrollo
npm run build       # Build para producción
npm run lint        # Linter
```

### Estructura de archivos:
```
src/
├── components/     # Componentes reutilizables
├── pages/         # Páginas por entidad
├── services/      # Servicios API
├── hooks/         # Hooks personalizados
├── types/         # Tipos TypeScript
├── i18n/          # Configuración de idiomas
└── contexts/      # Contextos React
```

## 🔄 Flujo de Trabajo

### Al crear un nuevo componente:
1. ✅ Agregar traducciones a `i18n/index.ts`
2. ✅ Usar clases CSS existentes
3. ✅ Seguir estructura estándar de formularios/listas
4. ✅ Implementar manejo de errores
5. ✅ Validar campos requeridos
6. ✅ Verificar responsive design

### Al crear un nuevo servicio:
1. ✅ Seguir estructura estándar de servicios
2. ✅ Manejar parámetros filter/search correctamente
3. ✅ Usar tipos TypeScript apropiados
4. ✅ Implementar manejo de errores

### Al agregar nuevas funcionalidades:
1. ✅ Verificar que no hay errores de compilación
2. ✅ Probar en diferentes resoluciones
3. ✅ Verificar funcionamiento de i18n
4. ✅ Confirmar consistencia visual

---

> **Nota**: Este documento debe ser consultado SIEMPRE antes de realizar cambios en el proyecto. Cualquier nueva funcionalidad debe seguir estos estándares para mantener consistencia.