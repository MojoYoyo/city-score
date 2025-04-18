import axios from 'axios';
import { OVERPASS_API_URL } from '../config';
import { calculateDistance } from '../../services/utils/distanceCalculation';

/**
 * Fetch food and dining facilities near a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in meters
 * @returns {Promise<Array>} - Array of food and dining facilities
 */
export const fetchFoodDiningFacilities = async (lat, lng, radius = 1000) => {
  try {
    console.log(`Fetching food & dining facilities around ${lat}, ${lng} with radius ${radius}m`);
    
    // Overpass query to get food and dining facilities
    const query = `
      [out:json][timeout:25];
      (
        // Restaurants
        node["amenity"="restaurant"](around:${radius},${lat},${lng});
        way["amenity"="restaurant"](around:${radius},${lat},${lng});
        
        // Cafes
        node["amenity"="cafe"](around:${radius},${lat},${lng});
        way["amenity"="cafe"](around:${radius},${lat},${lng});
        
        // Pubs
        node["amenity"="pub"](around:${radius},${lat},${lng});
        way["amenity"="pub"](around:${radius},${lat},${lng});
        
        // Fast food
        node["amenity"="fast_food"](around:${radius},${lat},${lng});
        way["amenity"="fast_food"](around:${radius},${lat},${lng});
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
      return processFoodDiningFacilities(response.data.elements, lat, lng);
    }
    
    throw new Error('Failed to fetch food and dining facilities');
  } catch (error) {
    console.error('Error fetching food & dining facilities:', error);
    // Return mock data for development/testing
    return generateMockFoodDiningFacilities(5, lat, lng, radius);
  }
};

// Process OpenStreetMap data for food and dining facilities
const processFoodDiningFacilities = (elements, centerLat, centerLng) => {
  const processed = [];
  const uniqueIds = new Set();
  
  for (const element of elements) {
    if (uniqueIds.has(element.id)) continue;
    uniqueIds.add(element.id);
    
    let lat, lng;
    let type = 'unknown';
    const tags = element.tags || {};
    
    // Determine type
    if (tags.amenity === 'restaurant') type = 'restaurant';
    else if (tags.amenity === 'cafe') type = 'cafe';
    else if (tags.amenity === 'pub') type = 'pub';
    else if (tags.amenity === 'fast_food') type = 'fast_food';
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
    
    processed.push({
      id: `food-${element.id}`,
      type,
      name: tags.name || `${type.charAt(0).toUpperCase() + type.slice(1)}`,
      latitude: lat,
      longitude: lng,
      distance,
      cuisine: tags.cuisine || '',
      takeaway: tags.takeaway === 'yes',
      outdoor_seating: tags.outdoor_seating === 'yes'
    });
  }
  
  return processed;
};

// Generate mock food and dining facilities data for development
const generateMockFoodDiningFacilities = (count = 5, centerLat, centerLng, radius) => {
  const types = ['restaurant', 'cafe', 'pub', 'fast_food'];
  const cuisines = ['italian', 'polish', 'asian', 'american', 'mediterranean', ''];
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
    const cuisine = type === 'restaurant' ? cuisines[Math.floor(Math.random() * cuisines.length)] : '';
    
    facilities.push({
      id: `mock-food-${i}`,
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${i+1}`,
      latitude: lat,
      longitude: lng,
      distance,
      cuisine,
      takeaway: Math.random() > 0.5,
      outdoor_seating: Math.random() > 0.6
    });
  }
  
  return facilities;
};