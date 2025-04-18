import axios from 'axios';
import { OVERPASS_API_URL } from '../config';
import { calculateDistance } from '../../services/utils/distanceCalculation';

/**
 * Fetch green spaces near a location
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @param {number} radius - Search radius in meters
 * @returns {Promise<Array>} - Array of green spaces
 */
export const fetchGreenSpaces = async (lat, lng, radius = 1000) => {
  try {
    console.log(`Fetching green spaces around ${lat}, ${lng} with radius ${radius}m`);
    
    // Overpass query to get green spaces
    const query = `
      [out:json][timeout:25];
      (
        // Parks and gardens
        node["leisure"="park"](around:${radius},${lat},${lng});
        way["leisure"="park"](around:${radius},${lat},${lng});
        relation["leisure"="park"](around:${radius},${lat},${lng});
        
        // Gardens
        node["leisure"="garden"](around:${radius},${lat},${lng});
        way["leisure"="garden"](around:${radius},${lat},${lng});
        relation["leisure"="garden"](around:${radius},${lat},${lng});
        
        // Forests and woods
        node["landuse"="forest"](around:${radius},${lat},${lng});
        way["landuse"="forest"](around:${radius},${lat},${lng});
        relation["landuse"="forest"](around:${radius},${lat},${lng});
        way["natural"="wood"](around:${radius},${lat},${lng});
        relation["natural"="wood"](around:${radius},${lat},${lng});
        
        // Meadows
        way["landuse"="meadow"](around:${radius},${lat},${lng});
        relation["landuse"="meadow"](around:${radius},${lat},${lng});
        
        // Greenery and nature areas
        way["landuse"="grass"](around:${radius},${lat},${lng});
        relation["landuse"="grass"](around:${radius},${lat},${lng});
        way["landuse"="village_green"](around:${radius},${lat},${lng});
        relation["landuse"="village_green"](around:${radius},${lat},${lng});
        
        // Playgrounds
        node["leisure"="playground"](around:${radius},${lat},${lng});
        way["leisure"="playground"](around:${radius},${lat},${lng});
        
        // Nature reserves
        node["leisure"="nature_reserve"](around:${radius},${lat},${lng});
        way["leisure"="nature_reserve"](around:${radius},${lat},${lng});
        relation["leisure"="nature_reserve"](around:${radius},${lat},${lng});
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
      return processGreenSpaces(response.data.elements, lat, lng);
    }
    
    throw new Error('Failed to fetch green spaces');
  } catch (error) {
    console.error('Error fetching green spaces:', error);
    // Return mock data for development/testing
    return generateMockGreenSpaces(5, lat, lng, radius);
  }
};

// Process OpenStreetMap data for green spaces
const processGreenSpaces = (elements, centerLat, centerLng) => {
  const nodeMap = {};
  elements.forEach(element => {
    if (element.type === 'node') {
      nodeMap[element.id] = element;
    }
  });
  
  // First pass - extract all potential green spaces
  const uniqueIds = new Set();
  const potentialSpaces = [];
  
  for (const element of elements) {
    if (uniqueIds.has(element.id)) continue;
    uniqueIds.add(element.id);
    
    let lat, lng, size;
    let type = 'unknown';
    const tags = element.tags || {};
    
    // Determine type
    if (tags.leisure === 'park') type = 'park';
    else if (tags.leisure === 'garden') type = 'garden';
    else if (tags.landuse === 'forest' || tags.natural === 'wood') type = 'forest';
    else if (tags.leisure === 'playground') type = 'playground';
    else if (tags.leisure === 'nature_reserve') type = 'nature_reserve';
    else if (tags.landuse === 'grass' || tags.landuse === 'village_green') type = 'park';
    else if (tags.landuse === 'meadow') type = 'park';
    else if (tags.leisure === 'recreation_ground') type = 'park';
    else continue;
    
    // Extract coordinates
    if (element.type === 'node') {
      lat = element.lat;
      lng = element.lon;
      size = 'small';
    } else if (element.type === 'way' || element.type === 'relation') {
      if (element.lat && element.lon) {
        lat = element.lat;
        lng = element.lon;
      } else if (element.center && element.center.lat && element.center.lon) {
        lat = element.center.lat;
        lng = element.center.lon;
      } else if (element.type === 'way' && element.nodes && element.nodes.length > 0) {
        const firstNode = nodeMap[element.nodes[0]];
        if (firstNode) {
          lat = firstNode.lat;
          lng = firstNode.lon;
        }
      } else if (element.bounds) {
        lat = (element.bounds.minlat + element.bounds.maxlat) / 2;
        lng = (element.bounds.minlon + element.bounds.maxlon) / 2;
      } else {
        continue;
      }
      
      // Estimate size
      if (element.type === 'way' && element.nodes) {
        size = element.nodes.length > 20 ? 'large' : 
               element.nodes.length > 10 ? 'medium' : 'small';
      } else if (element.bounds) {
        const width = element.bounds.maxlon - element.bounds.minlon;
        const height = element.bounds.maxlat - element.bounds.minlat;
        const area = width * height;
        size = area > 0.0001 ? 'large' : 
               area > 0.00001 ? 'medium' : 'small';
      } else {
        size = 'medium';
      }
    }
    
    if (!lat || !lng) continue;
    
    const distance = calculateDistance(centerLat, centerLng, lat, lng);
    
    potentialSpaces.push({
      id: `green-${element.id}`,
      type,
      name: tags.name || `${type.charAt(0).toUpperCase() + type.slice(1)}`,
      latitude: lat,
      longitude: lng,
      size,
      distance,
      amenities: extractGreenSpaceAmenities(tags)
    });
  }
  
  // Second pass - cluster nearby spaces of the same type
  const CLUSTER_RADIUS = 200; // meters
  const clustered = [];
  const usedIndices = new Set();
  
  // Sort by size (prefer larger spaces as cluster centers)
  potentialSpaces.sort((a, b) => {
    const sizeRank = { 'large': 3, 'medium': 2, 'small': 1 };
    return (sizeRank[b.size] || 0) - (sizeRank[a.size] || 0);
  });
  
  // Cluster spaces
  for (let i = 0; i < potentialSpaces.length; i++) {
    if (usedIndices.has(i)) continue;
    
    const space = potentialSpaces[i];
    usedIndices.add(i);
    
    // Find all spaces of the same type within clustering radius
    const clusterMembers = [space];
    
    for (let j = 0; j < potentialSpaces.length; j++) {
      if (i === j || usedIndices.has(j)) continue;
      
      const otherSpace = potentialSpaces[j];
      
      // Only cluster same types together
      if (space.type !== otherSpace.type) continue;
      
      const spaceDist = calculateDistance(
        space.latitude, space.longitude,
        otherSpace.latitude, otherSpace.longitude
      );
      
      if (spaceDist <= CLUSTER_RADIUS) {
        clusterMembers.push(otherSpace);
        usedIndices.add(j);
      }
    }
    
    // Choose the most significant member as representative
    const namedMembers = clusterMembers.filter(m => m.name && m.name !== `${m.type.charAt(0).toUpperCase() + m.type.slice(1)}`);
    
    const representative = namedMembers.length > 0 ? 
      namedMembers[0] : clusterMembers[0];
    
    // If cluster has multiple members, add count to the name
    if (clusterMembers.length > 1) {
      const originalName = representative.name;
      representative.name = `${originalName} (area with ${clusterMembers.length} ${representative.type}s)`;
      representative.clusterCount = clusterMembers.length;
    }
    
    clustered.push(representative);
  }
  
  return clustered.length > 0 ? clustered : generateMockGreenSpaces(5, centerLat, centerLng, 1000);
};

// Extract amenities from green space tags
const extractGreenSpaceAmenities = (tags) => {
  const amenities = [];
  
  if (tags.playground === 'yes') amenities.push('playground');
  if (tags.bench === 'yes') amenities.push('benches');
  if (tags.sport) amenities.push('sports');
  if (tags.dog === 'yes' || tags.dogs === 'yes') amenities.push('dog-friendly');
  if (tags.water === 'yes' || tags.water_feature === 'yes') amenities.push('water-feature');
  
  return amenities;
};

// Generate mock green spaces data for development
const generateMockGreenSpaces = (count = 8, centerLat, centerLng, radius) => {
  const types = ['park', 'garden', 'forest', 'playground', 'nature_reserve'];
  const sizes = ['small', 'medium', 'large'];
  const spaces = [];
  
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.pow(Math.random(), 0.5) * radius;
    
    const latChange = distance / 111000 * Math.cos(angle);
    const lngChange = distance / (111000 * Math.cos(centerLat * Math.PI / 180)) * Math.sin(angle);
    
    const lat = centerLat + latChange;
    const lng = centerLng + lngChange;
    
    const typeRoll = Math.random();
    let type;
    if (typeRoll < 0.5) type = 'park';
    else if (typeRoll < 0.7) type = 'garden';
    else if (typeRoll < 0.85) type = 'forest';
    else if (typeRoll < 0.95) type = 'playground';
    else type = 'nature_reserve';
    
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    
    spaces.push({
      id: `mock-green-${i}`,
      type,
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${i+1}`,
      latitude: lat,
      longitude: lng,
      size,
      distance,
      amenities: []
    });
  }
  
  return spaces;
};