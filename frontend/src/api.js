import axios from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
});

// We can also intercept requests or responses here if needed
api.interceptors.request.use(config => {
    // If the URL is relative, and we are in production,
    // and the REACT_APP_API_URL is set, prepend it.
    // The baseURL option should handle this, but this is an extra safeguard.
    if (!config.url.startsWith('http') && process.env.NODE_ENV === 'production' && process.env.REACT_APP_API_URL) {
        config.url = process.env.REACT_APP_API_URL + config.url;
    }
    return config;
});


export default api;
