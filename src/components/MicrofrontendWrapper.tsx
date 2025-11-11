import React, { useEffect, useRef } from 'react';

interface MicrofrontendWrapperProps {
  src: string;
  title: string;
  height?: string;
  onMessage?: (data: any) => void;
}

const MicrofrontendWrapper: React.FC<MicrofrontendWrapperProps> = ({
  src,
  title,
  height = '800px',
  onMessage
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verificar que el mensaje viene del microfrontend
      const microfrontendOrigin = new URL(src).origin;
      
      if (event.origin !== microfrontendOrigin) {
        return;
      }

      console.log('📨 Message from microfrontend:', event.data);

      if (onMessage) {
        onMessage(event.data);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [src, onMessage]);

  // Función para enviar mensajes al microfrontend
  const sendMessage = (data: any) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const microfrontendOrigin = new URL(src).origin;
      iframeRef.current.contentWindow.postMessage(data, microfrontendOrigin);
      console.log('📤 Message sent to microfrontend:', data);
    }
  };

  // Exponer la función sendMessage para uso externo
  useEffect(() => {
    // Guardar la referencia para uso externo si es necesario
    (window as any).sendToMicrofrontend = sendMessage;
  }, []);

  // Enviar configuración inicial al microfrontend cuando se carga
  const handleLoad = () => {
    setTimeout(() => {
      const authToken = localStorage.getItem('authToken');
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
      
      sendMessage({
        type: 'INIT_CONFIG',
        payload: {
          authToken,
          apiUrl,
          parentOrigin: window.location.origin
        }
      });
    }, 500); // Pequeño delay para asegurar que el iframe esté completamente cargado
  };

  return (
    <div className="microfrontend-container">
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        width="100%"
        height={height}
        frameBorder="0"
        onLoad={handleLoad}
        style={{
          border: 'none',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
          background: 'white',
          overflow: 'hidden'
        }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals"
      />
    </div>
  );
};

export default MicrofrontendWrapper;