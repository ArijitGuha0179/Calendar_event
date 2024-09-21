import axios from 'axios';

const API_URL = 'https://calendar-backend-1-whzc.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

export const login = (username, password) => api.post('/login/', { username, password });
export const logout = () => api.post('/logout/');
export const getEvents = () => api.get('/events/');
export const createEvent = (eventData) => api.post('/events/', eventData);
export const updateEvent = (id, eventData) => api.put(`/events/${id}/`, eventData);
export const deleteEvent = (id) => api.delete(`/events/${id}/`);

export default api;
