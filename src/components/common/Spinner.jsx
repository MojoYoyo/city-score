import React from 'react';

/**
 * Loading spinner component
 */
const Spinner = ({ size = 'medium', message = 'Loading...' }) => {
  // Different size classes
  const sizeClasses = {
    small: { spinner: 'w-4 h-4', text: 'text-sm' },
    medium: { spinner: 'w-8 h-8', text: 'text-base' },
    large: { spinner: 'w-12 h-12', text: 'text-lg' },
  };
  
  const { spinner, text } = sizeClasses[size] || sizeClasses.medium;
  
  return (
    <div className="spinner-container">
      <div className={`spinner ${spinner} loading-pulse`}></div>
      {message && <p className={`spinner-text ${text}`}>{message}</p>}
    </div>
  );
};

export default Spinner;