import React from 'react';

/**
 * Application header component
 */
const Header = ({ title = 'Warsaw City Score' }) => {
  return (
    <header className="header">
      <h1>{title}</h1>
    </header>
  );
};

export default Header;