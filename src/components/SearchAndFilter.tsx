import React from 'react';

interface SearchAndFilterProps {
  filterField: string;
  searchValue: string;
  availableFilters: string[];
  onFilterFieldChange: (field: string) => void;
  onSearchValueChange: (value: string) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  loading?: boolean;
}

export const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  filterField,
  searchValue,
  availableFilters,
  onFilterFieldChange,
  onSearchValueChange,
  onApplyFilters,
  onClearFilters,
  loading = false,
}) => {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onApplyFilters();
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
              value={filterField}
              onChange={(e) => onFilterFieldChange(e.target.value)}
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
              placeholder={filterField ? `Valor para ${filterField.charAt(0).toUpperCase() + filterField.slice(1)}...` : "Valor a filtrar..."}
              value={searchValue}
              onChange={(e) => onSearchValueChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="filter-input"
              disabled={loading || !filterField}
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
      {(filterField && searchValue) && (
        <div className="active-filters">
          <span className="active-filters-label">Filtro activo:</span>
          <span className="active-filter-tag">
            {filterField}: "{searchValue}"
            <button 
              onClick={() => {
                onFilterFieldChange('');
                onSearchValueChange('');
              }}
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