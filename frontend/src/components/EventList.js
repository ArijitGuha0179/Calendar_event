import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography, TextField, Button } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { getEvents, deleteEvent } from '../services/api';

// EventList component for displaying and managing a list of events
const EventList = ({ onEdit }) => {
  const [events, setEvents] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await getEvents(startTime, endTime); // Pass date filters
      console.log('Fetched events:', response.data); // Debugging line
      setEvents(response|| []); // Ensure events is set to an empty array if undefined
    } catch (error) {
      console.error('Failed to fetch events:', error);
      setEvents([]); // Set events to an empty array on error
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      fetchEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  return (
    <div>
      <Typography variant="h4">Events</Typography>
      
      {/* Date filters */}
      <div>
        <TextField
          label="Start Time"
          type="datetime-local"
          onChange={(e) => setStartTime(e.target.value)}
        />
        <TextField
          label="End Time"
          type="datetime-local"
          onChange={(e) => setEndTime(e.target.value)}
        />
        <Button variant="contained" onClick={fetchEvents}>Filter</Button>
      </div>

      <List>
        {events && events.length > 0 ? ( // Check if events exist
          events.map((event) => (
            <ListItem key={event.id}>
              <ListItemText
                primary={event.title}
                secondary={`${new Date(event.start_time).toLocaleString()} - ${new Date(event.end_time).toLocaleString()}`}
              />
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label="edit" onClick={() => onEdit(event)}>
                  <Edit />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(event.id)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No events found." />
          </ListItem>
        )}
      </List>
    </div>
  );
};

export default EventList;