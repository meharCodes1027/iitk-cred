import React from 'react';

const GlareCard = ({ children, onClick, className = "" }) => {
  return (
    <div 
      className={`glare-card magnetic ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlareCard;
