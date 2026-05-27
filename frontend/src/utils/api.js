const PROD_FALLBACK_API = 'https://lee-business-web.onrender.com';
const apiBaseFromEnv = import.meta.env.VITE_API_BASE?.replace(/\/$/, '');
const API_BASE = apiBaseFromEnv || (import.meta.env.PROD ? PROD_FALLBACK_API : '');

export const apiUrl = (path) => `${API_BASE}${path}`;
