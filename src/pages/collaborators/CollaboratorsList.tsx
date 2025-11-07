import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { collaboratorsService } from '../../services/collaboratorsService';
import { positionsService } from '../../services/positionsService';
import { teamsService } from '../../services/teamsService';
import { Collaborator, Position, Team } from '../../types';

const CollaboratorsList = () => {
  const { t } = useTranslation();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [collabData, posData, teamData] = await Promise.all([
        collaboratorsService.getAll(),
        positionsService.getAll(),
        teamsService.getAll(),
      ]);
      setCollaborators(collabData);
      setPositions(posData);
      setTeams(teamData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this collaborator?')) {
      return;
    }

    try {
      await collaboratorsService.delete(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const getPositionName = (positionId: string) => {
    return positions.find((p) => p.id === positionId)?.name || positionId;
  };

  const getTeamName = (teamId: string) => {
    return teams.find((t) => t.id === teamId)?.name || teamId;
  };

  if (loading) return <div className="loading">{t('loading')}</div>;
  if (error) return <div className="error">{t('error')}: {error}</div>;

  return (
    <div>
      <div className="page-header">
        <h1>{t('collaboratorsList')}</h1>
        <Link to="/collaborators/new">
          <button className="btn-primary">{t('createCollaborator')}</button>
        </Link>
      </div>

      <table>
        <thead>
          <tr>
            <th>{t('collaboratorId')}</th>
            <th>{t('firstName')}</th>
            <th>{t('lastName')}</th>
            <th>{t('position')}</th>
            <th>{t('team')}</th>
            <th>{t('tags')}</th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {collaborators.map((collaborator) => (
            <tr key={collaborator.id}>
              <td>{collaborator.id}</td>
              <td>{collaborator.firstName}</td>
              <td>{collaborator.lastName}</td>
              <td>{getPositionName(collaborator.positionId)}</td>
              <td>{getTeamName(collaborator.teamId)}</td>
              <td>
                <div className="tags">
                  {collaborator.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td>
                <div className="btn-group">
                  <Link to={`/collaborators/edit/${collaborator.id}`}>
                    <button className="btn-secondary btn-small">{t('edit')}</button>
                  </Link>
                  <button
                    className="btn-danger btn-small"
                    onClick={() => handleDelete(collaborator.id)}
                  >
                    {t('delete')}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CollaboratorsList;
