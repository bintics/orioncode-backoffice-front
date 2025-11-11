import React from 'react';

interface SearchAndFilterProps {
  filter: string;
  availableFilters: string[];
  onFilterChange: (filter: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  loading?: boolean;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  filter,
  availableFilters,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  loading = false,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onApplyFilters();
    }
  };

  const parseFilter = () => {
    if (!filter) return { field: '', value: '' };
    const [field, value] = filter.split(':');
    return { field: field || '', value: value || '' };
  };

  const { field, value } = parseFilter();

  const handleFilterFieldChange = (newField: string) => {
    if (newField) {
      // Mantener el valor actual si existe, o usar cadena vacía
      onFilterChange(`${newField}:${value}`);
    } else {
      // Si no hay campo seleccionado, limpiar todo el filtro
      onFilterChange('');
    }
  };

  const handleFilterValueChange = (newValue: string) => {
    if (field) {
      // Siempre actualizar si hay un campo seleccionado, incluso si el valor está vacío
      onFilterChange(`${field}:${newValue}`);
    } else {
      // Si no hay campo seleccionado, no hacer nada
      onFilterChange('');
    }
  };

  return (
    <div className="search-and-filter">
      <div className="search-filter-row">
        {/* Filtro por campo específico */}
        <div className="filter-group">
          <label htmlFor="filter-field" className="filter-label">
            Filtrar por campo:
          </label>
          <div className="filter-inputs">
            <select
              id="filter-field"
              value={field}
              onChange={(e) => handleFilterFieldChange(e.target.value)}
              className="filter-select"
              disabled={loading}
            >
              <option value="">Seleccionar campo</option>
              {availableFilters.map((filterName) => (
                <option key={filterName} value={filterName}>
                  {filterName.charAt(0).toUpperCase() + filterName.slice(1)}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder={field ? `Valor para ${field.charAt(0).toUpperCase() + field.slice(1)}...` : "Valor a filtrar..."}
              value={value}
              onChange={(e) => handleFilterValueChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="filter-input"
              disabled={loading || !field}
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="action-buttons">
          <button
            onClick={onApplyFilters}
            disabled={loading}
            className="apply-button"
          >
            {loading ? 'Aplicando...' : 'Aplicar'}
          </button>
          <button
            onClick={onClearFilters}
            disabled={loading}
            className="clear-button"
          >
            Limpiar
          </button>
        </div>
      </div>

      {/* Indicador de filtros activos */}
      {(filter && field && value) && (
        <div className="active-filters">
          <span className="active-filters-label">Filtro activo:</span>
          <span className="active-filter-tag">
            {field}: "{value}"
            <button 
              onClick={() => onFilterChange('')}
              className="remove-filter"
              disabled={loading}
            >
              ×
            </button>
          </span>
        </div>
      )}
    </div>
  );
};