import React from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Create a localizer using moment for BigCalendar
const localizer = momentLocalizer(moment);

// Define the Calendar component
function Calendar({ events, onSelectEvent, onSelectSlot }) {
  return (
    // Wrapper div with fixed height for the calendar
    <div style={{ height: '500px' }}>
      {/* BigCalendar component */}
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
