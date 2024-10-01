import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';

// Login component for user authentication
// Props:
//   onLogin: Callback function to execute after successful login
const Login = ({ onLogin }) => {
  // State variables for form fields
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting login...');
      // Call the login API function
      const response = await login(username, password);
      console.log('Login response:', response);
      
      // Store the authentication token in local storage
      localStorage.setItem('token', response.data.token);
      console.log('Token stored in localStorage');
      
      // Call the onLogin callback to update app state
      onLogin();
      console.log('onLogin callback called');
      
      // Navigate to the main page after successful login
      navigate('/');
    } catch (error) {
      // Error handling
      console.error('Login failed:', error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error message:', error.message);
      }
      
    }
  };

  return (
    <Container maxWidth="xs" className="login-container">
      <Box className="login-form">
        {/* Login form title */}
        <Typography variant="h4" gutterBottom>Login</Typography>
        
        {/* Login form */}
        <form onSubmit={handleSubmit}>
          {/* Username input field */}
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          
          {/* Password input field */}
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          {/* Submit button */}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
        
        {/* Registration link */}
        <Box mt={2}>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => navigate('/register')}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;