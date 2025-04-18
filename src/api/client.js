import axios from 'axios';
import { REQUEST_TIMEOUT } from './config';

// Create base axios client with common configuration
const createClient = (baseURL = '') => {
  const client = axios.create({
    baseURL,
    timeout: REQUEST_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // Add response interceptor for logging and error handling
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      console.error('API Error:', error);
      return Promise.reject(error);
    }
  );

  return client;
};

export default createClient;