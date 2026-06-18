import api from './api';

export const getProducts = (params) => api.get('/products', { params });

export const getStores = () => api.get('/products/stores');

export const getProduct = (id) => api.get(`/products/${id}`);

export const getPriceHistory = (id) => api.get(`/products/${id}/history`);
