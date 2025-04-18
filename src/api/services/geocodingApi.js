import axios from 'axios';
import { NOMINATIM_API_URL, WARSAW_BOUNDING_BOX, USER_AGENT } from '../config';

/**
 * Search for an address using OpenStreetMap Nominatim API
 * @param {string} query - Address query
 * @returns {Promise<Array>} - Array of geocoding results
 */
export const searchAddress = async (query) => {
  try {
    const response = await axios.get(NOMINATIM_API_URL, {
      params: {
        q: `${query}, Warsaw, Poland`,
        format: 'json',
        limit: 5,
        addressdetails: 1,
        ...WARSAW_BOUNDING_BOX
      },
      headers: {
        'User-Agent': USER_AGENT
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Error searching address:', error);
    throw error;
  }
};