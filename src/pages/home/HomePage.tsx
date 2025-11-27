import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { teamsService } from '../../services/teamsService';
import { collaboratorsService } from '../../services/collaboratorsService';
import { projectsService } from '../../services/projectsService';
import { positionsService } from '../../services/positionsService';
import { Team, Collaborator, Project, Position } from '../../types';
import { DataTable, SearchAndFilter, useFilteredPaginatedData } from '@orioncode/design-system';

// Mock: En producción esto vendría del contexto de autenticación
const CURRENT_TEAM_ID = 'team-006';

const HomePage = () => {
  const { t } = useTranslation();
  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<Collaborator[]>(null);
  const [positions, setPositions] = useState<{ [key: string]: Position }>({});
  const [showAllProjects, setShowAllProjects] = useState(false);
  
  // Usar hook de paginación con filtros para proyectos
  const { 
    data: projects, 
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
      // Si showAllProjects es false, filtrar por ownerId del equipo actual
      if (!showAllProjects) {
        return projectsService.getAll(page, pageSize, CURRENT_TEAM_ID, 'ownerId');
      }
      // Si showAllProjects es true, usar los filtros normales
      return projectsService.getAll(page, pageSize, search, filter);
    },
    dependencies: [showAllProjects],
  });

  // Load team info
  useEffect(() => {
    const fetchTeamInfo = async () => {
      try {
        const teamData = await teamsService.getById(CURRENT_TEAM_ID);
        setTeam(teamData);
      } catch (err) {
        console.error('Error loading team info:', err);
      }
    };

    fetchTeamInfo();
  }, []);

  // Load team members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await collaboratorsService.getAll(1, 100, CURRENT_TEAM_ID, 'teamId');
        setMembers(response.data);
        
        // Load positions for members
        const positionIds = [...new Set(response.data.map(m => m.positionId))];
        const positionsMap: { [key: string]: Position } = {};
        
        await Promise.all(
          positionIds.map(async (posId) => {
            try {
              const position = await positionsService.getById(posId);
              positionsMap[posId] = position;
            } catch (err) {
              console.error(`Error loading position ${posId}:`, err);
            }
          })
        );
        
        setPositions(positionsMap);
      } catch (err) {
        console.error('Error loading members:', err);
      }
    };

    fetchMembers();
  }, []);

  const toggleProjectView = () => {
    setShowAllProjects(!showAllProjects);
  };

  const projectColumns = [
    {
      key: 'name',
      header: t('projectName'),
      render: (project: Project) => project.name,
    },
    {
      key: 'description',
      header: t('projectDescription'),
      render: (project: Project) => project.description || '-',
    },
    {
      key: 'status',
      header: t('projectStatus'),
      render: (project: Project) => (
        <span style={{
          padding: '0.25rem 0.5rem',
          borderRadius: '0.25rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          backgroundColor: 
            project.status === 'ACTIVE' ? '#d4edda' :
            project.status === 'DRAFT' ? '#fff3cd' : '#f8d7da',
          color:
            project.status === 'ACTIVE' ? '#155724' :
            project.status === 'DRAFT' ? '#856404' : '#721c24',
        }}>
          {t(project.status)}
        </span>
      ),
    },
    {
      key: 'type',
      header: t('projectType'),
      render: (project: Project) => t(project.type),
    },
    {
      key: 'ownerId',
      header: t('owner'),
      render: (project: Project) => project.ownerId,
    },
  ];

  return (
    <div className="page-container" style={{ paddingRight: '300px' }}>
      {/* Projects Section - Main Content */}
      <div>
        <div className="page-header">
          <h1 className="page-title">{t('home')}</h1>
        </div>
        
        <div className="page-header" style={{ marginTop: '0' }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            color: 'var(--text-primary)',
          }}>
            {showAllProjects ? t('allProjects') : t('teamProjects')}
          </h2>
          
          <button
            onClick={toggleProjectView}
            className="btn-secondary"
            style={{ fontSize: '0.875rem' }}
          >
            {showAllProjects ? t('showTeamProjects') : t('showAllProjects')}
          </button>
        </div>

        {showAllProjects && (
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
        )}

        <DataTable
          data={projects}
          columns={projectColumns}
          loading={loading}
          error={error}
          pagination={pagination}
          className="data-table"
          emptyMessage={t('noProjects')}
          onPageChange={goToPage}
          onPreviousPage={goToPreviousPage}
          onNextPage={goToNextPage}
          onPageSizeChange={changePageSize}
        />
      </div>

      {/* Team Information - Secondary Sidebar */}
      {team && (
        <div style={{
          position: 'fixed',
          right: '1rem',
          top: '5rem',
          width: '280px',
          maxHeight: 'calc(100vh - 6rem)',
          overflowY: 'auto',
          backgroundColor: 'var(--bg-secondary)',
          padding: '1rem',
          borderRadius: '0.5rem',
          border: '1px solid var(--border-color)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        }}>
          <h3 style={{
            fontSize: '0.875rem',
            fontWeight: '600',
            color: 'var(--accent-purple)',
            marginBottom: '0.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            {t('myTeam')}
          </h3>
          
          <div style={{ marginBottom: '1rem' }}>
            <div style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: 'var(--text-primary)',
              marginBottom: '0.25rem',
            }}>
              {team.name}
            </div>
            {team.description && (
              <div style={{
                color: 'var(--text-secondary)',
                fontSize: '0.75rem',
                lineHeight: '1.4',
              }}>
                {team.description}
              </div>
            )}
          </div>

          {/* Team Members - Compact List */}
          {members && members.length > 0 && (
            <>
              <h4 style={{
                fontSize: '0.75rem',
                fontWeight: '600',
                color: 'var(--text-secondary)',
                marginBottom: '0.5rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
              }}>
                {t('teamMembers')} ({members.length})
              </h4>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {members.map((member) => (
                  <div
                    key={member.id}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '0.25rem',
                      border: '1px solid var(--border-color)',
                      backgroundColor: 'var(--bg-primary)',
                    }}
                  >
                    <div style={{
                      fontWeight: '500',
                      fontSize: '0.8rem',
                      marginBottom: '0.125rem',
                      color: 'var(--text-primary)',
                    }}>
                      {member.firstName} {member.lastName}
                    </div>
                    <div style={{
                      fontSize: '0.7rem',
                      color: 'var(--accent-purple)',
                    }}>
                      {positions[member.positionId]?.name || member.positionId}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
