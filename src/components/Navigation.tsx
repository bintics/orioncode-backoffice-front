import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OrionCodeLogo from './OrionCodeLogo';

const Navigation = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <Link to="/" className="logo">
          <OrionCodeLogo size={32} showText={false} />
          <span style={{ marginLeft: '12px' }}>OrionCode</span>
        </Link>
      </div>
      
      <nav>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link 
              to="/positions" 
              className={`nav-link ${isActive('/positions') ? 'active' : ''}`}
            >
              <span className="nav-icon">📋</span>
              {t('positions')}
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/collaborators" 
              className={`nav-link ${isActive('/collaborators') ? 'active' : ''}`}
            >
              <span className="nav-icon">👥</span>
              {t('collaborators')}
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/teams" 
              className={`nav-link ${isActive('/teams') ? 'active' : ''}`}
            >
              <span className="nav-icon">🏢</span>
              {t('teams')}
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/config" 
              className={`nav-link ${isActive('/config') ? 'active' : ''}`}
            >
              <span className="nav-icon">⚙️</span>
              {t('configuration')}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="language-selector">
        <span>🌐</span>
        <button onClick={toggleLanguage} className="language-button">
          {i18n.language === 'en' ? 'ES' : 'EN'}
        </button>
      </div>
    </aside>
  );
};

export default Navigation;
