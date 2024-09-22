import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { createEvent, updateEvent } from '../services/api';

// EventForm component for creating or editing events
// Props:
//   event: The event object to edit (null for new events)
//   onSave: Callback function to execute after successful save
//   onCancel: Callback function to execute when cancelling the form
const EventForm = ({ event, onSave, onCancel }) => {
  // State variables for form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [reminder, setReminder] = useState(false);

  // Effect hook to populate form fields when editing an existing event
  useEffect(() => {
    if (event) {
      // If an event is provided, populate the form with its data
      setTitle(event.title || '');
      setDescription(event.description || '');
      setStartTime(event.start_time ? new Date(event.start_time) : new Date());
      setEndTime(event.end_time ? new Date(event.end_time) : new Date());
      setReminder(event.reminder || false);
    } else {
      // If no event is provided (creating new), reset the form
      setTitle('');
      setDescription('');
      setStartTime(new Date());
      setEndTime(new Date());
      setReminder(false);
    }
  }, [event]);

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare event data object
    const eventData = { 
      title, 
      description, 
      start_time: startTime.toISOString(), 
      end_time: endTime.toISOString(),
      reminder 
    };
    try {
      if (event && event.id) {
        // If editing an existing event, update it
        await updateEvent(event.id, eventData);
      } else {
        // If creating a new event, create it
        await createEvent(eventData);
      }
      // Call the onSave callback to inform parent component
      onSave();
    } catch (error) {
      console.error('Failed to save event:', error);
      // TODO: Add error handling, e.g., displaying an error message to the user
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form title */}
      <Typography variant="h4">{event && event.id ? 'Edit Event' : 'Create Event'}</Typography>
      
      {/* Event title input */}
      <TextField
        label="Title"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      
      {/* Event description input */}
      <TextField
        label="Description"
        fullWidth
        margin="normal"
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      
      {/* Start time picker */}
      <DateTimePicker
        label="Start Time"
        value={startTime}
        onChange={(newValue) => setStartTime(newValue || new Date())}
        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
      />
      
      {/* End time picker */}
      <DateTimePicker
        label="End Time"
        value={endTime}
        onChange={(newValue) => setEndTime(newValue || new Date())}
        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
      />
      
      {/* Reminder checkbox */}
      <FormControlLabel
        control={
          <Checkbox
            checked={reminder}
            onChange={(e) => setReminder(e.target.checked)}
            name="reminder"
          />
        }
        label="Set Reminder"
      />
      
      {/* Submit button */}
      <Button type="submit" variant="contained" color="primary">
        Save
      </Button>
      
      {/* Cancel button */}
      <Button variant="contained" onClick={onCancel}>
        Cancel
      </Button>
    </form>
  );
};

export default EventForm;
