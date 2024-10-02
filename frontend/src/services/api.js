import axios from 'axios';

// Base URL for the API
const API_BASE_URL = 'http://127.0.0.1:8000/';

// Create an axios instance with the base URL
const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add an interceptor to include the authentication token in all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// Function to handle user login
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

// Function to handle user logout
export const logout = () => api.post('/api/logout/');

// Function to handle user registration
export const register = (username, password, email) => 
  api.post('/api/register/', { username, password, email });

// Function to fetch events from the API
export const getEvents = async (startTime, endTime) => {
  console.log('Sending request to fetch events...');
  try {
      const params = {};
      if (startTime) params.start_time = startTime; // Add start_time to params
      if (endTime) params.end_time = endTime; // Add end_time to params

      const response = await api.get('/events/', { params });
      console.log('Events response received:', response.data);
      return response.data; // Return the event data
  } catch (error) {
      console.error('Error fetching events:', error);
      throw error; // Rethrow the error for further handling
  }
};

// Function to create a new event
export const createEvent = (eventData) => api.post('/api/events/', eventData);

// Function to update an existing event
export const updateEvent = (id, eventData) => api.put(`/api/events/${id}/`, eventData);

// Function to delete an event
export const deleteEvent = (id) => api.delete(`/api/events/${id}/`);

// Export the api instance as the default export
export default api;
