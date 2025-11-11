import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useSidebarContext } from '../contexts/SidebarContext';
import OrionCodeLogo from './OrionCodeLogo';

const Navigation = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const { isCollapsed, toggleSidebar } = useSidebarContext();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <Link to="/" className="logo">
          <OrionCodeLogo size={32} showText={false} />
          {!isCollapsed && <span style={{ marginLeft: '12px' }}>OrionCode</span>}
        </Link>
        <button onClick={toggleSidebar} className="sidebar-toggle">
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav>
        <ul className="nav-menu">
          <li className="nav-item">
            <Link 
              to="/positions" 
              className={`nav-link ${isActive('/positions') ? 'active' : ''}`}
              title={isCollapsed ? t('positions') : ''}
            >
              <span className="nav-icon">📋</span>
              {!isCollapsed && t('positions')}
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/collaborators" 
              className={`nav-link ${isActive('/collaborators') ? 'active' : ''}`}
              title={isCollapsed ? t('collaborators') : ''}
            >
              <span className="nav-icon">👥</span>
              {!isCollapsed && t('collaborators')}
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/teams" 
              className={`nav-link ${isActive('/teams') ? 'active' : ''}`}
              title={isCollapsed ? t('teams') : ''}
            >
              <span className="nav-icon">🏢</span>
              {!isCollapsed && t('teams')}
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/config" 
              className={`nav-link ${isActive('/config') ? 'active' : ''}`}
              title={isCollapsed ? t('configuration') : ''}
            >
              <span className="nav-icon">⚙️</span>
              {!isCollapsed && t('configuration')}
            </Link>
          </li>
        </ul>
      </nav>

      <div className="language-selector">
        <span>🌐</span>
        {!isCollapsed && (
          <button onClick={toggleLanguage} className="language-button">
            {i18n.language === 'en' ? 'ES' : 'EN'}
          </button>
        )}
        {isCollapsed && (
          <button 
            onClick={toggleLanguage} 
            className="language-button"
            title={i18n.language === 'en' ? 'Español' : 'English'}
          >
            {i18n.language === 'en' ? 'ES' : 'EN'}
          </button>
        )}
      </div>
    </aside>
  );
};

export default Navigation;
