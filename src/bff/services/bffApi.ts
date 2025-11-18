import axios from 'axios';

/**
 * BFF API Client
 * This client connects to the Backend for Frontend layer
 * which combines multiple backend endpoints into optimized responses
 */

// BFF can use the same base URL as the main API or a different one
// For now, we'll use the same API base URL with a /bff prefix
const BFF_BASE_URL = import.meta.env.VITE_BFF_BASE_URL || 
                     (import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/bff` : '/api/bff');

const bffApiClient = axios.create({
  baseURL: BFF_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default bffApiClient;
