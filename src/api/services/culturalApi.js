import axios from 'axios';
import { OVERPASS_API_URL } from '../config';
import { calculateDistance } from '../../services/utils/distanceCalculation';

/**
 * Fetch cultural amenities near a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in meters
 * @returns {Promise<Array>} - Array of cultural amenities
 */
export const fetchCulturalAmenities = async (lat, lng, radius = 1000) => {
  try {
    console.log(`Fetching cultural amenities around ${lat}, ${lng} with radius ${radius}m`);
    
    // Overpass query to get cultural amenities
    const query = `
      [out:json][timeout:25];
      (
        // Museums
        node["tourism"="museum"](around:${radius},${lat},${lng});
        way["tourism"="museum"](around:${radius},${lat},${lng});
        
        // Theaters
        node["amenity"="theatre"](around:${radius},${lat},${lng});
        way["amenity"="theatre"](around:${radius},${lat},${lng});
        
        // Cinemas
        node["amenity"="cinema"](around:${radius},${lat},${lng});
        way["amenity"="cinema"](around:${radius},${lat},${lng});
        
        // Art galleries
        node["tourism"="gallery"](around:${radius},${lat},${lng});
        way["tourism"="gallery"](around:${radius},${lat},${lng});
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
      return processCulturalAmenities(response.data.elements, lat, lng);
    }
    
    throw new Error('Failed to fetch cultural amenities');
  } catch (error) {
    console.error('Error fetching cultural amenities:', error);
    // Return mock data for development/testing
    return generateMockCulturalAmenities(4, lat, lng, radius);
  }
};

// Process OpenStreetMap data for cultural amenities
const processCulturalAmenities = (elements, centerLat, centerLng) => {
  const processed = [];
  const uniqueIds = new Set();
  
  for (const element of elements) {
    if (uniqueIds.has(element.id)) continue;
    uniqueIds.add(element.id);
    
    let lat, lng;
    let type = 'unknown';
    const tags = element.tags || {};
    
    // Determine type
    if (tags.tourism === 'museum') type = 'museum';
    else if (tags.amenity === 'theatre') type = 'theatre';
    else if (tags.amenity === 'cinema') type = 'cinema';
    else if (tags.tourism === 'gallery') type = 'gallery';
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
      id: `cultural-${element.id}`,
      type,
      name: tags.name || `${type.charAt(0).toUpperCase() + type.slice(1)}`,
      latitude: lat,
      longitude: lng,
      distance,
      theme: tags.subject || '',
      website: tags.website || ''
    });
  }
  
  return processed;
};

// Generate mock cultural amenities data for development
const generateMockCulturalAmenities = (count = 4, centerLat, centerLng, radius) => {
  const types = ['museum', 'theatre', 'cinema', 'gallery'];
  const themes = ['art', 'history', 'science', 'local', 'modern', ''];
  const amenities = [];
  
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
    const theme = type === 'museum' ? themes[Math.floor(Math.random() * themes.length)] : '';
    
    amenities.push({
      id: `mock-cultural-${i}`,
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${i+1}`,
      latitude: lat,
      longitude: lng,
      distance,
      theme,
      website: ''
    });
  }
  
  return amenities;
};