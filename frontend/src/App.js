import React, { useState, useEffect } from 'react';
import { Container, Button } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import Login from './components/Login';
import EventList from './components/EventList';
import EventForm from './components/EventForm';
import Calendar from './components/Calendar';
import { getEvents } from './services/api';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
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
      setEvents(response.data);
      scheduleReminders(response.data);
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
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
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

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container>
        <Button onClick={handleLogout}>Logout</Button>
        <Button onClick={() => setView('calendar')}>Calendar View</Button>
        <Button onClick={() => setView('list')}>List View</Button>
        {editingEvent ? (
          <EventForm event={editingEvent} onSave={handleSaveEvent} onCancel={handleCancelEdit} />
        ) : view === 'calendar' ? (
          <Calendar 
            onSelectEvent={handleEditEvent} 
            onSelectSlot={handleSelectSlot}
          />
        ) : (
          <EventList events={events} onEdit={handleEditEvent} />
        )}
        <Button onClick={handleCreateNewEvent}>Create New Event</Button>
      </Container>
    </LocalizationProvider>
  );
}

export default App;
