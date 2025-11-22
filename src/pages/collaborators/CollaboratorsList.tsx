import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { collaboratorsService } from '../../services/collaboratorsService';
import { ApiResponse, Collaborator, CollaboratorView } from '../../types';
import { useFilteredPaginatedData } from '../../hooks/useFilteredPaginatedData';
import DataTable from '../../components/DataTable';
import { SearchAndFilter } from '../../components/SearchAndFilter';
import { positionsService } from '../../services/positionsService';
import { teamsService } from '../../services/teamsService';

const CollaboratorsList = () => {
  const { t } = useTranslation();

  const { 
    data: collaborators, 
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
    fetchFunction: async (page, pageSize, search, filter) => {
      var positions = await positionsService.getAllForDropdown();
      var teams = await teamsService.getAllForDropdown();
      
      var apiResponse = await collaboratorsService.getAll(page, pageSize, search, filter);
      var responseView: ApiResponse<CollaboratorView> = {
        ...apiResponse,
        data: apiResponse.data.map(collaborator => {
          const position = positions.find(pos => pos.id === collaborator.positionId);
          const team = teams.find(tm => tm.id === collaborator.teamId);

          return {
            ...collaborator,
            position: position,
            team: team,
          };
        }),
      };
      return responseView;
    },
  });

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('confirmDelete'))) {
      return;
    }

    try {
      await collaboratorsService.delete(id);
      await reload();
    } catch (err) {
      console.error('Error deleting collaborator:', err);
    }
  };

  const columns = [
    {
      key: 'id',
      header: t('collaboratorId'),
      render: (collaborator: CollaboratorView) => (
        <span className="id-cell" title={collaborator?.id}>
          {collaborator?.id}
        </span>
      ),
      width: '180px',
    },
    {
      key: 'firstName',
      header: t('firstName'),
      render: (collaborator: CollaboratorView) => collaborator?.firstName || '',
    },
    {
      key: 'lastName',
      header: t('lastName'),
      render: (collaborator:  CollaboratorView) => collaborator?.lastName || '',
    },
    {
      key: 'position',
      header: t('position'),
      render: (collaborator: CollaboratorView) => collaborator?.position?.name || '',
      width: '150px',
    },
    {
      key: 'team',
      header: t('team'),
      render: (collaborator: CollaboratorView) => collaborator?.team?.name || '',
      width: '150px',
    },
    {
      key: 'tags',
      header: t('tags'),
      render: (collaborator: CollaboratorView) => (
        <div className="tags">
          {Array.isArray(collaborator?.tags) && collaborator.tags.map((tag, index) => (
            <span key={index} className="tag">
              {tag}
            </span>
          ))}
        </div>
      ),
      width: '150px',
    },
    {
      key: 'actions',
      header: t('actions'),
      render: (collaborator: CollaboratorView) => (
        <div className="btn-group">
          <Link to={`/collaborators/edit/${collaborator?.id}`} className="btn-secondary">
            {t('edit')}
          </Link>
          <button
            className="btn-danger"
            onClick={() => collaborator?.id && handleDelete(collaborator.id)}
          >
            {t('delete')}
          </button>
        </div>
      ),
      width: '200px',
      className: 'text-right',
    },
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{t('collaboratorsList')}</h1>
        <Link to="/collaborators/new" className="btn-primary">
          + {t('createCollaborator')}
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
        data={collaborators}
        columns={columns}
        loading={loading}
        error={error}
        pagination={pagination}
        className="data-table collaborators"
        emptyMessage={t('noCollaborators', 'No collaborators found')}
        onPageChange={goToPage}
        onPreviousPage={goToPreviousPage}
        onNextPage={goToNextPage}
        onPageSizeChange={changePageSize}
      />
    </div>
  );
};

export default CollaboratorsList;
