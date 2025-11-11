# 🔄 Componentes Reutilizables - Guía de Uso

## ✅ **100% Reutilizable** - Sistema de Paginación y Filtrado

### 1. **Hook: `useFilteredPaginatedData<T>`**

Completamente genérico para cualquier tipo de entidad:

```typescript
// Para Collaborators
const collaboratorsData = useFilteredPaginatedData<Collaborator>({
  fetchFunction: collaboratorsService.getAll,
});

// Para Positions 
const positionsData = useFilteredPaginatedData<Position>({
  fetchFunction: positionsService.getAll,
});

// Para Teams
const teamsData = useFilteredPaginatedData<Team>({
  fetchFunction: teamsService.getAll,
});
```

### 2. **Componente: `SearchAndFilter`**

UI completamente genérica, sin dependencias específicas:

```tsx
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
```

### 3. **Persistencia URL Automática**

URLs generadas automáticamente para cualquier entidad:

```
/collaborators?filter=firstName&search=Juan&page=3
/positions?filter=name&search=Developer&pageSize=20
/teams?filter=department&search=Engineering
```

## 🏗️ **Patrón de Implementación Estándar**

### Estructura de una Lista (Template):

```tsx
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { [ENTITY]Service } from '../../services/[ENTITY]Service';
import { [ENTITY] } from '../../types';
import { useFilteredPaginatedData } from '../../hooks/useFilteredPaginatedData';
import DataTable from '../../components/DataTable';
import { SearchAndFilter } from '../../components/SearchAndFilter';

const [ENTITY]List = () => {
  const { t } = useTranslation();

  // 🔥 Hook reutilizable - Solo cambiar el service
  const { 
    data: [entities], 
    pagination, 
    loading, 
    error,
    filterField,
    searchValue,
    availableFilters,
    setFilterField,
    setSearchValue,
    clearFilters,
    applyFilters,
    reload, 
    goToPage, 
    goToNextPage, 
    goToPreviousPage, 
    changePageSize 
  } = useFilteredPaginatedData({
    fetchFunction: [ENTITY]Service.getAll,  // ✅ Solo cambiar esto
  });

  // Lógica de delete estándar
  const handleDelete = async (id: string) => {
    if (!window.confirm(t('confirmDelete'))) return;
    try {
      await [ENTITY]Service.delete(id);
      await reload();
    } catch (err) {
      console.error('Error deleting [entity]:', err);
    }
  };

  // Definir columnas específicas de la entidad
  const columns = [
    // ... columnas específicas
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{t('[entity]List')}</h1>
        <Link to="/[entities]/new" className="btn-primary">
          + {t('create[Entity]')}
        </Link>
      </div>

      {/* 🔥 Componente reutilizable - Sin cambios */}
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

      {/* 🔥 DataTable reutilizable - Solo cambiar columnas y messages */}
      <DataTable
        data={[entities]}
        columns={columns}
        loading={loading}
        error={error}
        pagination={pagination}
        className="data-table [entities]"
        emptyMessage={t('no[Entities]', 'No [entities] found')}
        onPageChange={goToPage}
        onPreviousPage={goToPreviousPage}
        onNextPage={goToNextPage}
        onPageSizeChange={changePageSize}
      />
    </div>
  );
};
```

## ⚙️ **Requisitos para el Service**

Todos los services deben implementar la misma interfaz:

```typescript
export const [entity]Service = {
  getAll: async (
    page: number = 1, 
    pageSize: number = 10,
    search: string = '',     // ✅ Valor de búsqueda
    filter: string = ''      // ✅ Campo por el cual filtrar
  ): Promise<ApiResponse<[Entity]>> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pageSize.toString(),
      });

      // ✅ Formato estándar del API
      if (filter && filter.trim()) {
        params.append('filter', filter);
      }
      if (search && search.trim()) {
        params.append('search', search);
      }

      const response = await apiClient.get<ApiResponse<[Entity]>>(`/[entities]?${params}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching [entities]:', error);
      throw new Error('Failed to fetch [entities]');
    }
  },
  // ... otros métodos CRUD
};
```

## 🎯 **Beneficios del Sistema Reutilizable**

### ✅ **Consistencia Total**
- Misma UX en todas las listas
- Misma lógica de persistencia URL
- Mismo manejo de estados de carga

### ✅ **Mantenimiento Mínimo**
- Un solo lugar para arreglar bugs
- Nuevas features se propagan automáticamente
- Testing centralizado

### ✅ **Desarrollo Rápido**
- Nuevas listas en ~10 líneas de código único
- Copy-paste del template
- Solo definir columnas específicas

### ✅ **SEO y UX**
- URLs shareable automáticamente
- Estado persistente en refreshes
- Navegación browser-friendly

## 🚀 **Para Implementar en Nueva Entidad**

1. ✅ **Service**: Implementar firma estándar con `search` y `filter`
2. ✅ **Tipos**: Usar `ApiResponse<T>` genérico  
3. ✅ **Lista**: Copy-paste template y cambiar entidad
4. ✅ **Columnas**: Definir solo las columnas específicas

¡El resto funciona automáticamente! 🎉