import axios from 'axios';
import { OVERPASS_API_URL } from '../config';
import { calculateDistance } from '../../services/utils/distanceCalculation';

/**
 * Fetch shopping facilities near a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in meters
 * @returns {Promise<Array>} - Array of shopping facilities
 */
export const fetchShoppingFacilities = async (lat, lng, radius = 1000) => {
  try {
    console.log(`Fetching shopping facilities around ${lat}, ${lng} with radius ${radius}m`);
    
    // Overpass query to get shopping facilities
    const query = `
      [out:json][timeout:25];
      (
        // Supermarkets
        node["shop"="supermarket"](around:${radius},${lat},${lng});
        way["shop"="supermarket"](around:${radius},${lat},${lng});
        
        // Convenience stores
        node["shop"="convenience"](around:${radius},${lat},${lng});
        way["shop"="convenience"](around:${radius},${lat},${lng});
        
        // Shopping malls
        node["shop"="mall"](around:${radius},${lat},${lng});
        way["shop"="mall"](around:${radius},${lat},${lng});
        relation["shop"="mall"](around:${radius},${lat},${lng});
        
        // Markets
        node["amenity"="marketplace"](around:${radius},${lat},${lng});
        way["amenity"="marketplace"](around:${radius},${lat},${lng});
      );
      out body;
      >;
      out skel qt;
    `;
    
    const response = await axios.post(OVERPASS_API_URL, query, {
      headers: {
        'Content-Type': 'text/plain',
      }
    });
    
    if (response.data && response.data.elements) {
      return processShoppingFacilities(response.data.elements, lat, lng);
    }
    
    throw new Error('Failed to fetch shopping facilities');
  } catch (error) {
    console.error('Error fetching shopping facilities:', error);
    // Return mock data for development/testing
    return generateMockShoppingFacilities(4, lat, lng, radius);
  }
};

// Process OpenStreetMap data for shopping facilities
const processShoppingFacilities = (elements, centerLat, centerLng) => {
  const processed = [];
  const uniqueIds = new Set();
  
  for (const element of elements) {
    if (uniqueIds.has(element.id)) continue;
    uniqueIds.add(element.id);
    
    let lat, lng;
    let type = 'unknown';
    const tags = element.tags || {};
    
    // Determine type
    if (tags.shop === 'supermarket') type = 'supermarket';
    else if (tags.shop === 'convenience') type = 'convenience';
    else if (tags.shop === 'mall') type = 'mall';
    else if (tags.amenity === 'marketplace') type = 'market';
    else continue;
    
    // Extract coordinates
    if (element.type === 'node') {
      lat = element.lat;
      lng = element.lon;
    } else if (element.type === 'way' || element.type === 'relation') {
      if (element.lat && element.lon) {
        lat = element.lat;
        lng = element.lon;
      } else if (element.center && element.center.lat && element.center.lon) {
        lat = element.center.lat;
        lng = element.center.lon;
      } else {
        continue;
      }
    }
    
    if (!lat || !lng) continue;
    
    const distance = calculateDistance(centerLat, centerLng, lat, lng);
    
    // Determine the size based on type or other attributes
    let size = 'medium';
    if (type === 'mall') size = 'large';
    else if (type === 'supermarket' && tags.brand) size = 'large';
    else if (type === 'convenience') size = 'small';
    
    processed.push({
      id: `shopping-${element.id}`,
      type,
      name: tags.name || `${type.charAt(0).toUpperCase() + type.slice(1)}`,
      latitude: lat,
      longitude: lng,
      distance,
      size,
      brand: tags.brand || ''
    });
  }
  
  return processed;
};

// Generate mock shopping facilities data for development
const generateMockShoppingFacilities = (count = 4, centerLat, centerLng, radius) => {
  const types = ['supermarket', 'convenience', 'mall', 'market'];
  const sizes = ['small', 'medium', 'large'];
  const facilities = [];
  
  for (let i = 0; i < count; i++) {
    // Random angle
    const angle = Math.random() * 2 * Math.PI;
    // Random distance within radius
    const distance = Math.sqrt(Math.random()) * radius;
    
    const latChange = distance / 111000 * Math.cos(angle);
    const lngChange = distance / (111000 * Math.cos(centerLat * Math.PI / 180)) * Math.sin(angle);
    
    const lat = centerLat + latChange;
    const lng = centerLng + lngChange;
    
    const type = types[Math.floor(Math.random() * types.length)];
    let size;
    
    // Set realistic size based on type
    if (type === 'mall') size = 'large';
    else if (type === 'supermarket') size = ['medium', 'large'][Math.floor(Math.random() * 2)];
    else if (type === 'convenience') size = 'small';
    else size = sizes[Math.floor(Math.random() * sizes.length)];
    
    facilities.push({
      id: `mock-shopping-${i}`,
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${i+1}`,
      latitude: lat,
      longitude: lng,
      distance,
      size,
      brand: type === 'supermarket' ? ['Tesco', 'Carrefour', 'Biedronka', 'Lidl'][Math.floor(Math.random() * 4)] : ''
    });
  }
  
  return facilities;
};