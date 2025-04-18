import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';

// Get the basename from the package.json homepage
const getBasename = () => {
  // Extract path from homepage URL if it exists
  const { homepage } = require('../package.json');
  if (homepage) {
    try {
      const url = new URL(homepage);
      return url.pathname;
    } catch (e) {
      return '/';
    }
  }
  return '/';
};

function RouteWrapper() {
  return (
    <Router basename={getBasename()}>
      <Routes>
        <Route path="/" element={<App />} />
        {/* Add your other routes here */}
      </Routes>
    </Router>
  );
}

export default RouteWrapper;