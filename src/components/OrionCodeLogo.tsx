interface OrionCodeLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

const OrionCodeLogo = ({ size = 32, showText = true, className = "" }: OrionCodeLogoProps) => {
  if (!showText) {
    // Solo el icono - red de nodos conectados como en el diseño original
    return (
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Líneas de conexión primero (para que estén detrás de los círculos) */}
        <path 
          d="M8 8L16 12L24 8M8 8L12 20L24 8M12 20L16 12L20 20M8 24L12 20L20 20L24 24" 
          stroke="#8b5cf6" 
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        
        {/* Nodos/puntos de la red */}
        <circle cx="8" cy="8" r="3" fill="#8b5cf6"/>
        <circle cx="16" cy="12" r="3.5" fill="#7c3aed"/>
        <circle cx="24" cy="8" r="3" fill="#8b5cf6"/>
        <circle cx="12" cy="20" r="3" fill="#6366f1"/>
        <circle cx="20" cy="20" r="3" fill="#6366f1"/>
        <circle cx="8" cy="24" r="2.5" fill="#a855f7"/>
        <circle cx="24" cy="24" r="2.5" fill="#a855f7"/>
      </svg>
    );
  }

  // Logo completo con texto
  const logoWidth = size * 3.75; // Ratio 120:32
  return (
    <svg 
      width={logoWidth} 
      height={size} 
      viewBox="0 0 120 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Líneas de conexión */}
      <path 
        d="M6 6L12 10L20 6M6 6L10 18L20 6M10 18L12 10L16 18M6 22L10 18L16 18L20 22" 
        stroke="#8b5cf6" 
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      
      {/* Nodos de la red */}
      <circle cx="6" cy="6" r="2.5" fill="#8b5cf6"/>
      <circle cx="12" cy="10" r="3" fill="#7c3aed"/>
      <circle cx="20" cy="6" r="2.5" fill="#8b5cf6"/>
      <circle cx="10" cy="18" r="2.5" fill="#6366f1"/>
      <circle cx="16" cy="18" r="2.5" fill="#6366f1"/>
      <circle cx="6" cy="22" r="2" fill="#a855f7"/>
      <circle cx="20" cy="22" r="2" fill="#a855f7"/>
      
      {/* Texto OrionCode */}
      <text 
        x="32" 
        y="20" 
        fill="#ffffff" 
        fontFamily="Inter, sans-serif" 
        fontWeight="600" 
        fontSize="16" 
        letterSpacing="-0.3px"
      >
        OrionCode
      </text>
    </svg>
  );
};

export default OrionCodeLogo;