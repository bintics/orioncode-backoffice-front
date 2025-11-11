import React from 'react';
import { useTranslation } from 'react-i18next';
import MicrofrontendWrapper from '../../components/MicrofrontendWrapper';

const PositionsMicrofrontend: React.FC = () => {
  const { t } = useTranslation();

  // URL del microfrontend de posiciones - usando import.meta.env para Vite
  const microfrontendUrl = import.meta.env.VITE_POSITIONS_MICROFRONTEND_URL || 'http://localhost:3000';

  const handleMicrofrontendMessage = (data: any) => {
    console.log('📨 Received message from Positions Microfrontend:', data);
    
    switch (data.type) {
      case 'NAVIGATION_REQUEST':
        // Si el microfrontend solicita navegación
        if (data.payload.route) {
          console.log(`🧭 Navigation requested to: ${data.payload.route}`);
          // Aquí podrías manejar navegación si es necesario
        }
        break;
      
      case 'POSITION_CREATED':
        console.log('✅ Position created:', data.payload);
        // Aquí podrías actualizar algún estado global o mostrar notificación
        break;
      
      case 'POSITION_UPDATED':
        console.log('✏️ Position updated:', data.payload);
        break;
      
      case 'POSITION_DELETED':
        console.log('🗑️ Position deleted:', data.payload);
        break;
      
      case 'ERROR':
        console.error('❌ Error from microfrontend:', data.payload);
        break;
      
      default:
        console.log('ℹ️ Unknown message type:', data.type);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">{t('positionsList')}</h1>
        <div style={{ fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
          {t('poweredByMicrofrontend', 'Powered by Microfrontend')}
        </div>
      </div>

      <div className="microfrontend-section">
        <MicrofrontendWrapper
          src={microfrontendUrl}
          title="Positions Management Microfrontend"
          height="700px"
          onMessage={handleMicrofrontendMessage}
        />
      </div>
    </div>
  );
};

export default PositionsMicrofrontend;