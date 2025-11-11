import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { teamsService } from '../../services/teamsService';
import { Team } from '../../types';
import { useFilteredPaginatedData } from '../../hooks/useFilteredPaginatedData';
import DataTable from '../../components/DataTable';
import { SearchAndFilter } from '../../components/SearchAndFilter';

const TeamsList = () => {
  const { t } = useTranslation();

  const { 
    data: teams, 
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
    fetchFunction: teamsService.getAll,
  });

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('confirmDelete'))) {
      return;
    }

    try {
      await teamsService.delete(id);
      await reload();
    } catch (err) {
      console.error('Error deleting team:', err);
    }
  };

  const columns = [
    {
      key: 'id',
      header: t('teamId'),
      render: (team: Team) => (
        <span className="id-cell" title={team?.id}>
          {team?.id}
        </span>
      ),
      width: '180px',
    },
    {
      key: 'name',
      header: t('teamName'),
      render: (team: Team) => team?.name || '',
    },
    {
      key: 'description',
      header: t('description'),
      width: '500px',
      render: (team: Team) => team?.description || '',
    },
    {
      key: 'tags',
      header: t('tags'),
      render: (team: Team) => (
        <div className="tags">
          {Array.isArray(team?.tags) && team.tags.map((tag, index) => (
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
      render: (team: Team) => (
        <div className="btn-group">
          <Link to={`/teams/edit/${team?.id}`} className="btn-secondary">
            {t('edit')}
          </Link>
          <button
            className="btn-danger"
            onClick={() => team?.id && handleDelete(team.id)}
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
        <h1 className="page-title">{t('teamsList')}</h1>
        <Link to="/teams/new" className="btn-primary">
          + {t('createTeam')}
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
        data={teams}
        columns={columns}
        loading={loading}
        error={error}
        pagination={pagination}
        className="data-table teams"
        emptyMessage={t('noTeams', 'No teams found')}
        onPageChange={goToPage}
        onPreviousPage={goToPreviousPage}
        onNextPage={goToNextPage}
        onPageSizeChange={changePageSize}
      />
    </div>
  );
};

export default TeamsList;
