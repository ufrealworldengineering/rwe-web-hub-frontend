import axios from 'axios';

// base URL set to /api
const api = axios.create({
    baseURL: '/api', // should update to use .env once backend configured
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
