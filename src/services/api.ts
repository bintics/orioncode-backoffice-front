import axios from 'axios';

// En desarrollo, usa el proxy de Vite (/api)
// En producción, usa la variable de entorno o una URL por defecto
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
