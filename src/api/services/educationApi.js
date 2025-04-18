import axios from 'axios';
import { OVERPASS_API_URL } from '../config';
import { calculateDistance } from '../../services/utils/distanceCalculation';

/**
 * Fetch educational institutions near a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in meters
 * @returns {Promise<Array>} - Array of educational institutions
 */
export const fetchEducationalInstitutions = async (lat, lng, radius = 1000) => {
  try {
    console.log(`Fetching educational institutions around ${lat}, ${lng} with radius ${radius}m`);
    
    // Overpass query to get educational institutions
    const query = `
      [out:json][timeout:25];
      (
        // Schools
        node["amenity"="school"](around:${radius},${lat},${lng});
        way["amenity"="school"](around:${radius},${lat},${lng});
        
        // Universities
        node["amenity"="university"](around:${radius},${lat},${lng});
        way["amenity"="university"](around:${radius},${lat},${lng});
        
        // Colleges
        node["amenity"="college"](around:${radius},${lat},${lng});
        way["amenity"="college"](around:${radius},${lat},${lng});
        
        // Kindergartens
        node["amenity"="kindergarten"](around:${radius},${lat},${lng});
        way["amenity"="kindergarten"](around:${radius},${lat},${lng});
        
        // Libraries
        node["amenity"="library"](around:${radius},${lat},${lng});
        way["amenity"="library"](around:${radius},${lat},${lng});
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
      return processEducationalInstitutions(response.data.elements, lat, lng);
    }
    
    throw new Error('Failed to fetch educational institutions');
  } catch (error) {
    console.error('Error fetching educational institutions:', error);
    // Return mock data for development/testing
    return generateMockEducationalInstitutions(4, lat, lng, radius);
  }
};

// Process OpenStreetMap data for educational institutions
const processEducationalInstitutions = (elements, centerLat, centerLng) => {
  const processed = [];
  const uniqueIds = new Set();
  
  for (const element of elements) {
    if (uniqueIds.has(element.id)) continue;
    uniqueIds.add(element.id);
    
    let lat, lng;
    let type = 'unknown';
    const tags = element.tags || {};
    
    // Determine type
    if (tags.amenity === 'school') type = 'school';
    else if (tags.amenity === 'university') type = 'university';
    else if (tags.amenity === 'college') type = 'college';
    else if (tags.amenity === 'kindergarten') type = 'kindergarten';
    else if (tags.amenity === 'library') type = 'library';
    
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
    
    let level = '';
    if (tags.isced) {
      level = tags.isced;
    } else if (type === 'school' && tags.school) {
      level = tags.school;
    }
    
    processed.push({
      id: `edu-${element.id}`,
      type,
      name: tags.name || `${type.charAt(0).toUpperCase() + type.slice(1)}`,
      latitude: lat,
      longitude: lng,
      level,
      distance,
      operator: tags.operator || ''
    });
  }
  
  return processed;
};

// Generate mock educational institutions data for development
const generateMockEducationalInstitutions = (count = 4, centerLat, centerLng, radius) => {
  const types = ['school', 'university', 'college', 'kindergarten', 'library'];
  const levels = ['primary', 'secondary', 'tertiary', 'all', ''];
  const names = [
    'Warsaw School of Economics', 
    'University of Warsaw', 
    'Primary School No.', 
    'High School No.', 
    'Public Library', 
    'International School',
    'Technical College',
    'Kindergarten No.'
  ];
  
  const institutions = [];
  
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.sqrt(Math.random()) * radius;
    
    const latChange = distance / 111000 * Math.cos(angle);
    const lngChange = distance / (111000 * Math.cos(centerLat * Math.PI / 180)) * Math.sin(angle);
    
    const lat = centerLat + latChange;
    const lng = centerLng + lngChange;
    
    const type = types[Math.floor(Math.random() * types.length)];
    let level = '';
    
    if (type === 'school') {
      level = levels[Math.floor(Math.random() * 2)];
    } else if (type === 'university' || type === 'college') {
      level = 'tertiary';
    }
    
    let nameBase = '';
    if (type === 'school') {
      nameBase = Math.random() > 0.5 ? 'Primary School No.' : 'High School No.';
    } else if (type === 'kindergarten') {
      nameBase = 'Kindergarten No.';
    } else {
      nameBase = names[Math.floor(Math.random() * names.length)];
    }
    
    let name = type === 'university' ? nameBase : `${nameBase} ${Math.floor(Math.random() * 100) + 1}`;
    
    institutions.push({
      id: `mock-edu-${i}`,
      type,
      name,
      latitude: lat,
      longitude: lng,
      level,
      distance,
      operator: Math.random() > 0.5 ? 'Public' : 'Private'
    });
  }
  
  return institutions;
};