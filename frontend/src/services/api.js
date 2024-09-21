import axios from 'axios';

const API_BASE_URL = 'https://calendar-backend-1-whzc.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const login = async (username, password) => {
  console.log('Sending login request...');
  try {
    const response = await api.post('/api/login/', { username, password });
    console.log('Login response received:', response);
    return response;
  } catch (error) {
    console.error('Error in login request:', error);
    throw error;
  }
};

export const logout = () => api.post('/api/logout/');

export const register = (username, password, email) => 
  api.post('/api/register/', { username, password, email });

export const getEvents = async () => {
  console.log('Sending request to fetch events...');
  try {
    const response = await api.get('/api/events/');
    console.log('Events response received:', response);
    return response;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const createEvent = (eventData) => api.post('/api/events/', eventData);

export const updateEvent = (id, eventData) => api.put(`/api/events/${id}/`, eventData);

export const deleteEvent = (id) => api.delete(`/api/events/${id}/`);

export default api;
