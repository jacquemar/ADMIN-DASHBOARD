import axios from 'axios';

// Créer une instance Axios avec la configuration de base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api-connect2card.incantix.net/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter automatiquement le token JWT à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token expiré ou invalide
      localStorage.removeItem('jwt_token');
      // Rediriger vers la page de connexion si nécessaire
      window.location.href = '/auth/signin';
    }
    return Promise.reject(error);
  }
);

export default api; 