import React from 'react';

const ShinyText = ({ text, className = "" }) => {
  return (
    <span className={`shiny-text ${className}`}>
      {text}
    </span>
  );
};

export default ShinyText;
