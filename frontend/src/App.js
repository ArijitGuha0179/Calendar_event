import React, { useState, useEffect } from 'react';
import { Container, Button, Box, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import EventList from './components/EventList';
import EventForm from './components/EventForm';
import Calendar from './components/Calendar';
import { getEvents } from './services/api';
import Register from './components/Register';
import './App.css';

// Create a dark theme using Material-UI's createTheme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
});

function App() {
  // State for user authentication
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  // State for the event being edited
  const [editingEvent, setEditingEvent] = useState(null);
  // State for all events
  const [events, setEvents] = useState([]);
  // State for the current view (calendar or list)
  const [view, setView] = useState('calendar');

  // Effect hook to fetch events when the user logs in
  useEffect(() => {
    if (isLoggedIn) {
      fetchEvents();
    }
  }, [isLoggedIn]);

  // Function to fetch events from the API
  const fetchEvents = async () => {
    try {
      const response = await getEvents();
      // Format the events, converting date strings to Date objects
      const formattedEvents = response.data.map(event => ({
        ...event,
        start: new Date(event.start_time),
        end: new Date(event.end_time),
      }));
      setEvents(formattedEvents);
      scheduleReminders(formattedEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  // Function to schedule reminders for events
  const scheduleReminders = (events) => {
    events.forEach(event => {
      if (event.reminder) {
        const reminderTime = new Date(event.start_time) - 15 * 60000; // 15 minutes before
        const now = new Date();
        if (reminderTime > now) {
          setTimeout(() => {
            showNotification(event.title, event.description);
          }, reminderTime - now);
        }
      }
    });
  };

  // Function to show a notification
  const showNotification = (title, body) => {
    if (Notification.permission === 'granted') {
      new Notification(title, { body });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          new Notification(title, { body });
        }
      });
    }
  };

  // Function to handle user login
  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  // Function to handle user logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  // Function to handle editing an event
  const handleEditEvent = (event) => {
    setEditingEvent(event);
  };

  // Function to handle saving an event
  const handleSaveEvent = () => {
    setEditingEvent(null);
    fetchEvents();
  };

  // Function to handle canceling event editing
  const handleCancelEdit = () => {
    setEditingEvent(null);
  };

  // Function to handle selecting a time slot in the calendar
  const handleSelectSlot = ({ start, end }) => {
    setEditingEvent({ start_time: start, end_time: end });
  };

  // Function to handle creating a new event
  const handleCreateNewEvent = () => {
    setEditingEvent({}); 
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Container className="app-container">
            <Routes>
              {/* Route for login page */}
              <Route path="/login" element={<Login onLogin={handleLogin} />} />
              {/* Route for registration page */}
              <Route path="/register" element={<Register />} />
              {/* Main route */}
              <Route
                path="/"
                element={
                  isLoggedIn ? (
                    <>
                      {/* Header with logout button and view selection */}
                      <Box className="header">
                        <Button onClick={handleLogout} variant="outlined" color="secondary">Logout</Button>
                        <Box className="view-buttons">
                          <Button onClick={() => setView('calendar')} variant="contained" color="primary">Calendar View</Button>
                          <Button onClick={() => setView('list')} variant="contained" color="primary">List View</Button>
                        </Box>
                      </Box>
                      {/* Conditional rendering based on editing state and view */}
                      {editingEvent ? (
                        <Box className="event-form">
                          <EventForm event={editingEvent} onSave={handleSaveEvent} onCancel={handleCancelEdit} />
                        </Box>
                      ) : view === 'calendar' ? (
                        <Box className="calendar-container">
                          <Calendar 
                            events={events}
                            onSelectEvent={handleEditEvent} 
                            onSelectSlot={handleSelectSlot}
                          />
                        </Box>
                      ) : (
                        <Box className="event-list">
                          <EventList events={events} onEdit={handleEditEvent} />
                        </Box>
                      )}
                      {/* Button to create a new event */}
                      <Button onClick={handleCreateNewEvent} variant="contained" color="primary">Create New Event</Button>
                    </>
                  ) : (
                    // Redirect to login if not logged in
                    <Navigate to="/login" replace />
                  )
                }
              />
            </Routes>
          </Container>
        </LocalizationProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;