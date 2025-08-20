import React from 'react';

const SpotlightCard = ({ children, className = "" }) => {
  return (
    <div className={`spotlight-card ${className}`}>
      {children}
    </div>
  );
};

export default SpotlightCard;
