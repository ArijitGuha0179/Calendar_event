import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { getEvents, deleteEvent } from '../services/api';

const EventList = ({ onEdit }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await getEvents();
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
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
      <List>
        {events.map((event) => (
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
        ))}
      </List>
    </div>
  );
};

export default EventList;
