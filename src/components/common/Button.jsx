import React from 'react';

/**
 * Reusable button component
 */
const Button = ({ 
  onClick, 
  disabled, 
  type = 'button', 
  className = '', 
  children 
}) => {
  return (
    <button
      type={type}
      className={`button ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;