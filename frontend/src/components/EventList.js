import React, { useState, useEffect } from 'react';
import { List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Typography } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material';
import { getEvents, deleteEvent } from '../services/api';

// EventList component for displaying and managing a list of events
// Props:
//   onEdit: Callback function to handle editing an event
const EventList = ({ onEdit }) => {
  // State to store the list of events
  const [events, setEvents] = useState([]);

  // Effect hook to fetch events when the component mounts
  useEffect(() => {
    fetchEvents();
  }, []);

  // Function to fetch events from the API
  const fetchEvents = async () => {
    try {
      const response = await getEvents();
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events:', error);
      // TODO: Add error handling, e.g., displaying an error message to the user
    }
  };

  // Function to handle deleting an event
  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      // Refresh the event list after successful deletion
      fetchEvents();
    } catch (error) {
      console.error('Failed to delete event:', error);
      // TODO: Add error handling, e.g., displaying an error message to the user
    }
  };

  return (
    <div>
      {/* Component title */}
      <Typography variant="h4">Events</Typography>
      
      {/* List of events */}
      <List>
        {events.map((event) => (
          // Individual event item
          <ListItem key={event.id}>
            {/* Event title and time range */}
            <ListItemText
              primary={event.title}
              secondary={`${new Date(event.start_time).toLocaleString()} - ${new Date(event.end_time).toLocaleString()}`}
            />
            {/* Action buttons for editing and deleting */}
            <ListItemSecondaryAction>
              {/* Edit button */}
              <IconButton edge="end" aria-label="edit" onClick={() => onEdit(event)}>
                <Edit />
              </IconButton>
              {/* Delete button */}
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
