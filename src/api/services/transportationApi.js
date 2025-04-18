import axios from 'axios';
import { OVERPASS_API_URL } from '../config';
import { calculateDistance } from '../../services/utils/distanceCalculation';

/**
 * Fetch transportation stops near a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in meters
 * @returns {Promise<Array>} - Array of transportation stops
 */
export const fetchTransportationStops = async (lat, lng, radius = 1000) => {
  try {
    console.log(`Fetching transportation stops around ${lat}, ${lng} with radius ${radius}m`);
    
    // Overpass query to get transportation stops
    const query = `
      [out:json][timeout:25];
      (
        // Bus stops
        node["highway"="bus_stop"](around:${radius},${lat},${lng});
        node["public_transport"="platform"]["bus"="yes"](around:${radius},${lat},${lng});
        node["public_transport"="stop_position"]["bus"="yes"](around:${radius},${lat},${lng});
        
        // Tram stops
        node["railway"="tram_stop"](around:${radius},${lat},${lng});
        node["public_transport"="platform"]["tram"="yes"](around:${radius},${lat},${lng});
        node["public_transport"="stop_position"]["tram"="yes"](around:${radius},${lat},${lng});
        
        // Metro stations
        node["station"="subway"](around:${radius},${lat},${lng});
        node["railway"="station"]["subway"="yes"](around:${radius},${lat},${lng});
        
        // Train stations
        node["railway"="station"](around:${radius},${lat},${lng});
        node["railway"="halt"](around:${radius},${lat},${lng});
      );
      out body;
    `;
    
    const response = await axios.post(OVERPASS_API_URL, query, {
      headers: {
        'Content-Type': 'text/plain',
      }
    });
    
    if (response.data && response.data.elements) {
      return processTransportationStops(response.data.elements, lat, lng);
    }
    
    throw new Error('Failed to fetch transportation stops');
  } catch (error) {
    console.error('Error fetching transportation stops:', error);
    // Return mock data for development/testing
    return generateMockTransportationStops(15, lat, lng, radius);
  }
};

// Helper functions for processing the API response
const processTransportationStops = (elements, centerLat, centerLng) => {
  if (!Array.isArray(elements)) {
    return [];
  }
  
  // Group stops by proximity
  const stopGroups = [];
  const PROXIMITY_THRESHOLD = 15; // meters
  
  // Group nearby stops
  elements.forEach(element => {
    if (typeof element.lat !== 'number' || typeof element.lon !== 'number') {
      return;
    }
    
    let foundGroup = false;
    for (const group of stopGroups) {
      for (const existingStop of group) {
        const distance = calculateDistance(
          element.lat, element.lon,
          existingStop.lat, existingStop.lon
        );
        
        if (distance < PROXIMITY_THRESHOLD) {
          group.push(element);
          foundGroup = true;
          break;
        }
      }
      if (foundGroup) break;
    }
    
    if (!foundGroup) {
      stopGroups.push([element]);
    }
  });
  
  // Process each group to a single stop
  return stopGroups.map(group => {
    // Sort by info score
    group.sort((a, b) => calculateInfoScore(b) - calculateInfoScore(a));
    
    const bestElement = group[0];
    const tags = bestElement.tags || {};
    const type = determineStopType(bestElement);
    
    // Collect all routes/lines from the group
    const allLines = new Set();
    group.forEach(element => {
      const lines = extractLines(element);
      lines.forEach(line => allLines.add(line));
    });
    
    // Calculate distance from center point
    const distance = calculateDistance(
      centerLat, centerLng,
      bestElement.lat, bestElement.lon
    );
    
    return {
      id: `osm-${bestElement.id}`,
      name: tags.name || tags.ref || `${type.charAt(0).toUpperCase() + type.slice(1)} Stop`,
      latitude: bestElement.lat,
      longitude: bestElement.lon,
      type: type,
      lines: Array.from(allLines),
      distance
    };
  }).filter(stop => {
    return typeof stop.latitude === 'number' && 
           typeof stop.longitude === 'number' &&
           !isNaN(stop.latitude) && 
           !isNaN(stop.longitude);
  });
};

// Calculate info score for prioritizing stops
const calculateInfoScore = (element) => {
  let score = 0;
  const tags = element.tags || {};
  
  if (tags.name) score += 10;
  if (tags.railway === 'station') score += 5;
  if (tags.railway === 'tram_stop') score += 5;
  if (tags.highway === 'bus_stop') score += 5;
  if (tags.route_ref) score += 5;
  if (tags.ref) score += 3;
  
  return score;
};

// Determine stop type from OSM tags
const determineStopType = (element) => {
  const tags = element.tags || {};
  
  if (tags.station === 'subway' || tags.subway === 'yes') {
    return 'metro';
  }
  
  if (tags.railway === 'station' || tags.railway === 'halt') {
    return 'train';
  }
  
  if (tags.railway === 'tram_stop' || tags.tram === 'yes') {
    return 'tram';
  }
  
  if (tags.highway === 'bus_stop' || tags.bus === 'yes') {
    return 'bus';
  }
  
  return 'bus';
};

// Extract lines information from tags
const extractLines = (element) => {
  const tags = element.tags || {};
  
  if (tags.route_ref) {
    return tags.route_ref.split(';').map(item => item.trim());
  }
  
  if (tags.ref) {
    return tags.ref.split(';').map(item => item.trim());
  }
  
  return [];
};

// Generate mock data for development
const generateMockTransportationStops = (count = 15, centerLat, centerLng, radius) => {
  const types = ['bus', 'tram', 'metro', 'train'];
  const stops = [];
  
  for (let i = 0; i < count; i++) {
    // Random angle and distance within radius
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.sqrt(Math.random()) * radius;
    
    const latChange = distance / 111000 * Math.cos(angle);
    const lngChange = distance / (111000 * Math.cos(centerLat * Math.PI / 180)) * Math.sin(angle);
    
    const lat = centerLat + latChange;
    const lng = centerLng + lngChange;
    const type = types[Math.floor(Math.random() * types.length)];
    
    stops.push({
      id: `mock-${i}`,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} Stop ${i+1}`,
      latitude: lat,
      longitude: lng,
      type: type,
      lines: [`${Math.floor(Math.random() * 20) + 1}`],
      distance
    });
  }
  
  return stops;
};