import axios from 'axios';

// Create base instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://amazon-clone-scaler-ai.onrender.com', 
});

// Request interceptor for auth
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response interceptor for handling common errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto-logout or redirect can happen here or via AuthContext
      console.warn('Unauthorized - user may need to login again');
    }
    return Promise.reject(error);
  }
);

/** --- AUTH --- **/
export const loginUser = (data) => API.post('/api/auth/login', data);
export const registerUser = (data) => API.post('/api/auth/register', data);
export const getProfile = () => API.get('/api/auth/me');

/** --- PRODUCTS --- **/
export const fetchProducts = (params) => API.get('/api/products', { params });
export const fetchCategories = () => API.get('/api/products/categories');
export const fetchProductById = (id) => API.get(`/api/products/${id}`);

/** --- CART --- **/
export const fetchCart = () => API.get('/api/cart');
export const addToCart = (productId, quantity = 1) => API.post('/api/cart', { product_id: productId, quantity });
export const updateCartItem = (itemId, quantity) => API.put(`/api/cart/item/${itemId}`, { quantity });
export const removeCartItem = (itemId) => API.delete(`/api/cart/item/${itemId}`);

/** --- ORDERS --- **/
export const placeOrder = (orderData) => API.post('/api/orders', orderData);
export const fetchUserOrders = () => API.get('/api/orders/user/me');
export const fetchOrderById = (id) => API.get(`/api/orders/${id}`);

export default API;
