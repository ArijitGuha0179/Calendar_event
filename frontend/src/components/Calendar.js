import React, { useState, useEffect } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { getEvents } from '../services/api';

const localizer = momentLocalizer(moment);

function Calendar({ onSelectEvent, onSelectSlot }) {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await getEvents();
      const formattedEvents = response.data.map(event => ({
        ...event,
        start: new Date(event.start_time),
        end: new Date(event.end_time),
      }));
      setEvents(formattedEvents);
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  return (
    <div style={{ height: '500px' }}>
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        selectable
        views={['month', 'week', 'day']}
      />
    </div>
  );
}

export default Calendar;
