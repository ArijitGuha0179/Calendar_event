import React, { useState, useEffect } from 'react';
import { TextField, Button, Typography, Checkbox, FormControlLabel } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { createEvent, updateEvent } from '../services/api';

const EventForm = ({ event, onSave, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [reminder, setReminder] = useState(false);

  useEffect(() => {
    if (event) {
      setTitle(event.title || '');
      setDescription(event.description || '');
      setStartTime(event.start_time ? new Date(event.start_time) : new Date());
      setEndTime(event.end_time ? new Date(event.end_time) : new Date());
      setReminder(event.reminder || false);
    } else {
      // Reset form when creating a new event
      setTitle('');
      setDescription('');
      setStartTime(new Date());
      setEndTime(new Date());
      setReminder(false);
    }
  }, [event]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventData = { 
      title, 
      description, 
      start_time: startTime.toISOString(), 
      end_time: endTime.toISOString(),
      reminder 
    };
    try {
      if (event && event.id) {
        await updateEvent(event.id, eventData);
      } else {
        await createEvent(eventData);
      }
      onSave();
    } catch (error) {
      console.error('Failed to save event:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h4">{event && event.id ? 'Edit Event' : 'Create Event'}</Typography>
      <TextField
        label="Title"
        fullWidth
        margin="normal"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <TextField
        label="Description"
        fullWidth
        margin="normal"
        multiline
        rows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <DateTimePicker
        label="Start Time"
        value={startTime}
        onChange={(newValue) => setStartTime(newValue || new Date())}
        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
      />
      <DateTimePicker
        label="End Time"
        value={endTime}
        onChange={(newValue) => setEndTime(newValue || new Date())}
        renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
      />
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
      <Button type="submit" variant="contained" color="primary">
        Save
      </Button>
      <Button variant="contained" onClick={onCancel}>
        Cancel
      </Button>
    </form>
  );
};

export default EventForm;
