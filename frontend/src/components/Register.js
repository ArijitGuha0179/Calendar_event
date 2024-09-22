import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Box } from '@mui/material';
import { register } from '../services/api';
import { useNavigate } from 'react-router-dom';

// Register component for user registration
const Register = () => {
  // State hooks for form inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // Hook for programmatic navigation
  const navigate = useNavigate();

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(''); // Clear any previous errors
    try {
      // Call the register API function with user details
      await register(username, password, email);
      console.log('Registration successful');
      // Navigate to the login page after successful registration
      navigate('/login');
    } catch (err) {
      // Set error message if registration fails
      setError('Registration failed. Please try again.');
      console.error('Registration error:', err);
      // TODO: Add more specific error handling based on API response
    }
  };

  return (
    // Container to center the registration form and limit its width
    <Container maxWidth="xs" className="register-container">
      {/* Box to group the form elements */}
      <Box className="register-form">
        {/* Registration form title */}
        <Typography variant="h4" gutterBottom>Register</Typography>
        
        {/* Display error message if there's an error */}
        {error && <Typography color="error">{error}</Typography>}
        
        {/* Registration form */}
        <form onSubmit={handleSubmit}>
          {/* Username input field */}
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {/* Email input field */}
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {/* Password input field */}
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {/* Submit button */}
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
          </Button>
        </form>
        
        {/* Back to Login button */}
        <Box mt={2}>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => navigate('/login')}
          >
            Back to Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
