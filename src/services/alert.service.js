import api from './api';

export const getAlerts = () => api.get('/alerts');

export const createAlert = (data) => api.post('/alerts', data);

export const deleteAlert = (id) => api.delete(`/alerts/${id}`);

export const toggleAlert = (id) => api.patch(`/alerts/${id}/toggle`);
