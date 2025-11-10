import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { teamsService } from '../../services/teamsService';
import { Team } from '../../types';

const TeamsList = () => {
  const { t } = useTranslation();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTeams();
  }, []);

  const loadTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await teamsService.getAll();
      setTeams(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('confirmDelete'))) {
      return;
    }

    try {
      await teamsService.delete(id);
      await loadTeams();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) return <div className="loading">{t('loading')}</div>;
  if (error) return <div className="error">{t('error')}: {error}</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{t('teamsList')}</h1>
        <Link to="/teams/new" className="btn-primary">
          + {t('createTeam')}
        </Link>
      </div>

      <div className="table-container">
        <table className="data-table teams">
          <thead>
            <tr>
              <th>{t('teamId')}</th>
              <th>{t('name')}</th>
              <th>{t('tags')}</th>
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.id}>
                <td>
                  <span className="id-cell" title={team.id}>
                    {team.id}
                  </span>
                </td>
                <td>{team.name}</td>
                <td>
                  <div className="tags">
                    {team?.tags?.map((tag, index) => (
                      <span key={index} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="btn-group">
                    <Link to={`/teams/edit/${team.id}`} className="btn-secondary">
                      {t('edit')}
                    </Link>
                    <button
                      className="btn-danger"
                      onClick={() => handleDelete(team.id)}
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
    </div>
  );
};

export default TeamsList;
