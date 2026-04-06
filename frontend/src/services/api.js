import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
});

export const getProducts = () => api.get('/products');
export const getProductById = (id, userId) => api.get(`/products/${id}${userId ? '?user_id=' + userId : ''}`);
export const getByCategory = (cat) => api.get(`/categories/${cat}`);

export const getPersonalizedRecommendations = (userId) => api.get(`/recommendations/personalized${userId ? '?user_id=' + userId : ''}`);
export const getTrendingRecommendations = () => api.get('/recommendations/trending');
export const getSimilarRecommendations = (id) => api.get(`/recommendations/similar/${id}`);
export const getFrequentRecommendations = (id) => api.get(`/recommendations/frequent/${id}`);

export const toggleWishlist = (productId, userId) => api.post(`/wishlist/${productId}?user_id=${userId}`);
export const getWishlist = (userId) => api.get(`/wishlist/${userId}`);

export const createOrder = (data) => api.post('/orders', data);

export const loginUser = (data) => api.post('/login', data);
export const registerUser = (data) => api.post('/register', data);
