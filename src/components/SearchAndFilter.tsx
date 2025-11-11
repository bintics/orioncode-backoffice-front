import React from 'react';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
  
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
            {t('filterByField')}
          </label>
          <div className="filter-inputs">
            <select
              id="filter-field"
              value={filterField}
              onChange={(e) => onFilterFieldChange(e.target.value)}
              className="filter-select"
              disabled={loading}
            >
              <option value="">{t('allFields')}</option>
              {availableFilters.map((filterName) => (
                <option key={filterName} value={filterName}>
                  {filterName.charAt(0).toUpperCase() + filterName.slice(1)}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder={filterField ? t('searchInField', { field: filterField.charAt(0).toUpperCase() + filterField.slice(1) }) : t('searchInAllFields')}
              value={searchValue}
              onChange={(e) => onSearchValueChange(e.target.value)}
              onKeyPress={handleKeyPress}
              className="filter-input"
              disabled={loading}
            />
          </div>
        </div>

        {/* Botones de acción */}
        <div className="action-buttons">
          <button
            onClick={onApplyFilters}
            disabled={loading || !searchValue.trim()}
            className="apply-button"
          >
            {loading ? t('applying') : t('apply')}
          </button>
          <button
            onClick={onClearFilters}
            disabled={loading}
            className="clear-button"
          >
            {t('clear')}
          </button>
        </div>
      </div>

      {/* Indicador de filtros activos */}
      {searchValue && (
        <div className="active-filters">
          <span className="active-filters-label">{t('activeFilter')}</span>
          <span className="active-filter-tag">
            {filterField ? `${filterField}: "${searchValue}"` : `${t('allFields')}: "${searchValue}"`}
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