const PROD_FALLBACK_API = 'https://lee-business-web.onrender.com';
const apiBaseFromEnv = import.meta.env.VITE_API_BASE?.replace(/\/$/, '');

let API_BASE = '';

if (typeof window !== 'undefined') {
  const host = window.location.hostname;
  // If we're running on localhost, prefer the local backend regardless of .env
  if (host === 'localhost' || host === '127.0.0.1') {
    API_BASE = 'http://localhost:3001';
  } else if (apiBaseFromEnv) {
    API_BASE = apiBaseFromEnv;
  } else if (import.meta.env.PROD) {
    API_BASE = PROD_FALLBACK_API;
  } else {
    API_BASE = '';
  }
} else {
  API_BASE = apiBaseFromEnv || (import.meta.env.PROD ? PROD_FALLBACK_API : '');
}

export const apiUrl = (path) => (API_BASE ? `${API_BASE}${path}` : path);
