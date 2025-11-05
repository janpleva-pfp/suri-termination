import axios from 'axios';
const rest = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
// Add request/response interceptors for debugging
rest.interceptors.request.use(
  (config) => {
    devlogger.log('Making request to:', config.url, 'with data:', config.data);
    return config;
  },
  (error) => {
    devlogger.error('Request error:', error);
    return Promise.reject(error);
  },
);

rest.interceptors.response.use(
  (response) => {
    devlogger.log('Response received:', response.status, response.data);
    return response;
  },
  (error) => {
    devlogger.error('Response error:', error);
    return Promise.reject(error);
  },
);

export { rest };
