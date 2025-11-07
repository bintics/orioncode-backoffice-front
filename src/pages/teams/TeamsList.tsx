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
    <div>
      <div className="page-header">
        <h1>{t('teamsList')}</h1>
        <Link to="/teams/new">
          <button className="btn-primary">{t('createTeam')}</button>
        </Link>
      </div>

      <table>
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
              <td>{team.id}</td>
              <td>{team.name}</td>
              <td>
                <div className="tags">
                  {team.tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </td>
              <td>
                <div className="btn-group">
                  <Link to={`/teams/edit/${team.id}`}>
                    <button className="btn-secondary btn-small">{t('edit')}</button>
                  </Link>
                  <button
                    className="btn-danger btn-small"
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
  );
};

export default TeamsList;
