import axios from 'axios';
import { OVERPASS_API_URL } from '../config';
import { calculateDistance } from '../../services/utils/distanceCalculation';

/**
 * Fetch recreation and sports facilities near a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in meters
 * @returns {Promise<Array>} - Array of recreation and sports facilities
 */
export const fetchRecreationSportsFacilities = async (lat, lng, radius = 1000) => {
  try {
    console.log(`Fetching recreation & sports facilities around ${lat}, ${lng} with radius ${radius}m`);
    
    // Overpass query to get recreation and sports facilities
    const query = `
      [out:json][timeout:25];
      (
        // Sports centers
        node["leisure"="sports_centre"](around:${radius},${lat},${lng});
        way["leisure"="sports_centre"](around:${radius},${lat},${lng});
        
        // Swimming pools
        node["leisure"="swimming_pool"](around:${radius},${lat},${lng});
        way["leisure"="swimming_pool"](around:${radius},${lat},${lng});
        
        // Fitness centers
        node["leisure"="fitness_centre"](around:${radius},${lat},${lng});
        way["leisure"="fitness_centre"](around:${radius},${lat},${lng});
        
        // Sports pitches
        node["leisure"="pitch"](around:${radius},${lat},${lng});
        way["leisure"="pitch"](around:${radius},${lat},${lng});
        
        // Tennis courts
        node["leisure"="pitch"]["sport"="tennis"](around:${radius},${lat},${lng});
        way["leisure"="pitch"]["sport"="tennis"](around:${radius},${lat},${lng});
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
      return processRecreationSportsFacilities(response.data.elements, lat, lng);
    }
    
    throw new Error('Failed to fetch recreation and sports facilities');
  } catch (error) {
    console.error('Error fetching recreation & sports facilities:', error);
    // Return mock data for development/testing
    return generateMockRecreationSportsFacilities(4, lat, lng, radius);
  }
};

// Process OpenStreetMap data for recreation and sports facilities
const processRecreationSportsFacilities = (elements, centerLat, centerLng) => {
  const processed = [];
  const uniqueIds = new Set();
  
  for (const element of elements) {
    if (uniqueIds.has(element.id)) continue;
    uniqueIds.add(element.id);
    
    let lat, lng;
    let type = 'unknown';
    const tags = element.tags || {};
    
    // Determine type
    if (tags.leisure === 'sports_centre') type = 'sports_centre';
    else if (tags.leisure === 'swimming_pool') type = 'swimming_pool';
    else if (tags.leisure === 'fitness_centre') type = 'fitness_centre';
    else if (tags.leisure === 'pitch') {
      if (tags.sport === 'tennis') type = 'tennis';
      else type = 'pitch';
    }
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
      id: `recreation-${element.id}`,
      type,
      name: tags.name || `${type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')}`,
      latitude: lat,
      longitude: lng,
      distance,
      indoor: tags.indoor === 'yes',
      sport: tags.sport || '',
      access: tags.access || 'unknown'
    });
  }
  
  return processed;
};

// Generate mock recreation and sports facilities data for development
const generateMockRecreationSportsFacilities = (count = 4, centerLat, centerLng, radius) => {
  const types = ['sports_centre', 'swimming_pool', 'fitness_centre', 'pitch', 'tennis'];
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
    const sportType = type === 'pitch' ? ['football', 'basketball', 'volleyball'][Math.floor(Math.random() * 3)] : '';
    
    facilities.push({
      id: `mock-recreation-${i}`,
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ')} ${i+1}`,
      latitude: lat,
      longitude: lng,
      distance,
      indoor: Math.random() > 0.5,
      sport: sportType,
      access: ['public', 'private', 'members'][Math.floor(Math.random() * 3)]
    });
  }
  
  return facilities;
};