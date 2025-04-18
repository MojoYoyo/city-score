import React from 'react';
import { BrowserRouter } from 'react-router-dom';

const RouteWrapper = ({ children }) => {
  // Get the base URL from package.json or default to '/'
  const basename = process.env.PUBLIC_URL || '/';
  
  return (
    <BrowserRouter basename={basename}>
      {children}
    </BrowserRouter>
  );
};

export default RouteWrapper;