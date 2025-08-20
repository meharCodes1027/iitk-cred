import React from 'react';

const AnimatedButton = ({ children, onClick, disabled = false, className = "" }) => {
  return (
    <button 
      className={`animated-button magnetic ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default AnimatedButton;
