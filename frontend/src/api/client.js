import axios from 'axios';

const client = axios.create({
    baseURL: '/api', // Proxied by Vite or Nginx
});

// Request interceptor to add token
client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor to track architecture flow
// Response interceptor to track architecture flow
client.interceptors.response.use(
    (response) => {
        // Ignore config requests to avoid overriding the main content status
        if (response.config && response.config.url && response.config.url.includes('/config')) {
            return response;
        }

        const cacheStatus = response.headers['x-cache'] || 'NONE';
        window.dispatchEvent(new CustomEvent('architecture-flow-update', {
            detail: { status: cacheStatus }
        }));
        return response;
    },
    (error) => {
        // Even on error, we might want to show flow if headers are present
        if (error.response) {
            // Ignore config requests
            if (error.config && error.config.url && error.config.url.includes('/config')) {
                return Promise.reject(error);
            }

            const cacheStatus = error.response.headers['x-cache'] || 'NONE';
            window.dispatchEvent(new CustomEvent('architecture-flow-update', {
                detail: { status: cacheStatus }
            }));
        }
        return Promise.reject(error);
    }
);

export default client;
