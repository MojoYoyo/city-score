import axios from 'axios';
import { OVERPASS_API_URL } from '../config';
import { calculateDistance } from '../../services/utils/distanceCalculation';

/**
 * Fetch healthcare facilities near a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in meters
 * @returns {Promise<Array>} - Array of healthcare facilities
 */
export const fetchHealthcareFacilities = async (lat, lng, radius = 1000) => {
  try {
    console.log(`Fetching healthcare facilities around ${lat}, ${lng} with radius ${radius}m`);
    
    // Overpass query to get healthcare facilities
    const query = `
      [out:json][timeout:25];
      (
        // Hospitals
        node["amenity"="hospital"](around:${radius},${lat},${lng});
        way["amenity"="hospital"](around:${radius},${lat},${lng});
        relation["amenity"="hospital"](around:${radius},${lat},${lng});
        
        // Clinics
        node["amenity"="clinic"](around:${radius},${lat},${lng});
        way["amenity"="clinic"](around:${radius},${lat},${lng});
        
        // Doctors
        node["amenity"="doctors"](around:${radius},${lat},${lng});
        way["amenity"="doctors"](around:${radius},${lat},${lng});
        
        // Pharmacies
        node["amenity"="pharmacy"](around:${radius},${lat},${lng});
        way["amenity"="pharmacy"](around:${radius},${lat},${lng});
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
      return processHealthcareFacilities(response.data.elements, lat, lng);
    }
    
    throw new Error('Failed to fetch healthcare facilities');
  } catch (error) {
    console.error('Error fetching healthcare facilities:', error);
    // Return mock data for development/testing
    return generateMockHealthcareFacilities(4, lat, lng, radius);
  }
};

// Process OpenStreetMap data for healthcare facilities
const processHealthcareFacilities = (elements, centerLat, centerLng) => {
  const processed = [];
  const uniqueIds = new Set();
  
  for (const element of elements) {
    if (uniqueIds.has(element.id)) continue;
    uniqueIds.add(element.id);
    
    let lat, lng;
    let type = 'unknown';
    const tags = element.tags || {};
    
    // Determine type
    if (tags.amenity === 'hospital') type = 'hospital';
    else if (tags.amenity === 'clinic') type = 'clinic';
    else if (tags.amenity === 'doctors') type = 'doctor';
    else if (tags.amenity === 'pharmacy') type = 'pharmacy';
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
      id: `healthcare-${element.id}`,
      type,
      name: tags.name || `${type.charAt(0).toUpperCase() + type.slice(1)}`,
      latitude: lat,
      longitude: lng,
      distance,
      emergency: tags.emergency === 'yes',
      speciality: tags.healthcare_speciality || tags.speciality || ''
    });
  }
  
  return processed;
};

// Generate mock healthcare facilities data for development
const generateMockHealthcareFacilities = (count = 4, centerLat, centerLng, radius) => {
  const types = ['hospital', 'clinic', 'doctor', 'pharmacy'];
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
    
    facilities.push({
      id: `mock-healthcare-${i}`,
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${i+1}`,
      latitude: lat,
      longitude: lng,
      distance,
      emergency: Math.random() > 0.8,
      speciality: type === 'doctor' ? ['general', 'pediatric', 'cardiology'][Math.floor(Math.random() * 3)] : ''
    });
  }
  
  return facilities;
};