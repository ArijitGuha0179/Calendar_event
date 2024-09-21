import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { login } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Attempting login...');
      const response = await login(username, password);
      console.log('Login response:', response);
      localStorage.setItem('token', response.data.token);
      console.log('Token stored in localStorage');
      onLogin();
      console.log('onLogin callback called');
      navigate('/'); // Add this line to navigate to the main page after login
    } catch (error) {
      console.error('Login failed:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error message:', error.message);
      }
    }
  };

  return (
    <Container maxWidth="xs" className="login-container">
      <Box className="login-form">
        <Typography variant="h4" gutterBottom>Login</Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Login
          </Button>
        </form>
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
