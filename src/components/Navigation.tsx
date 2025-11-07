import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Navigation = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'es' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/positions">{t('positions')}</Link>
        </li>
        <li>
          <Link to="/collaborators">{t('collaborators')}</Link>
        </li>
        <li>
          <Link to="/teams">{t('teams')}</Link>
        </li>
        <li style={{ marginLeft: 'auto' }}>
          <button onClick={toggleLanguage}>
            {i18n.language === 'en' ? 'ES' : 'EN'}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
