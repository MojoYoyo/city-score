// API configuration constants
export const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';
export const NOMINATIM_API_URL = 'https://nominatim.openstreetmap.org/search';

// Warsaw bounding box for geocoding
export const WARSAW_BOUNDING_BOX = {
  viewbox: '20.8389, 52.3675, 21.2711, 52.0978',
  countrycodes: 'pl',
  bounded: 1
};

// Standard HTTP request timeout (ms)
export const REQUEST_TIMEOUT = 25000;

// User agent for nominatim
export const USER_AGENT = 'WarsawCityScore/1.0';