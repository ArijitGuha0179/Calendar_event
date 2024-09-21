import React, { useState, useEffect } from 'react';
import { Container, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import EventList from './components/EventList';
import EventForm from './components/EventForm';
import Calendar from './components/Calendar';
import { getEvents } from './services/api';
import Register from './components/Register';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
  const [editingEvent, setEditingEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [view, setView] = useState('calendar'); // 'calendar' or 'list'

  useEffect(() => {
    if (isLoggedIn) {
      fetchEvents();
    }
  }, [isLoggedIn]);

  const fetchEvents = async () => {
    try {
      const response = await getEvents();
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

  const handleLogin = () => {
    setIsLoggedIn(true);
    localStorage.setItem('isLoggedIn', 'true');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
  };

  const handleSaveEvent = () => {
    setEditingEvent(null);
    fetchEvents();
  };

  const handleCancelEdit = () => {
    setEditingEvent(null);
  };

  const handleSelectSlot = ({ start, end }) => {
    setEditingEvent({ start_time: start, end_time: end });
  };

  const handleCreateNewEvent = () => {
    setEditingEvent({}); // Pass an empty object, not null or undefined
  };

  return (
    <Router>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Container>
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLogin} />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <>
                    <Button onClick={handleLogout}>Logout</Button>
                    <Button onClick={() => setView('calendar')}>Calendar View</Button>
                    <Button onClick={() => setView('list')}>List View</Button>
                    {editingEvent ? (
                      <EventForm event={editingEvent} onSave={handleSaveEvent} onCancel={handleCancelEdit} />
                    ) : view === 'calendar' ? (
                      <Calendar 
                        events={events}
                        onSelectEvent={handleEditEvent} 
                        onSelectSlot={handleSelectSlot}
                      />
                    ) : (
                      <EventList events={events} onEdit={handleEditEvent} />
                    )}
                    <Button onClick={handleCreateNewEvent}>Create New Event</Button>
                  </>
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
          </Routes>
        </Container>
      </LocalizationProvider>
    </Router>
  );
}

export default App;