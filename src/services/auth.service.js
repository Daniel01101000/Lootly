import api from './api';

export const loginUser = (credentials) => api.post('/auth/login', credentials);

export const registerUser = (data) => api.post('/auth/register', data);

export const getProfile = () => api.get('/auth/profile');
