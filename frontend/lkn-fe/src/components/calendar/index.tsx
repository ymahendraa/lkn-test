import React from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './custom-calendar.css';

const localizer = momentLocalizer(moment);

interface BigCalendarProps {
    events:
    {
        id: string,
        title: string,
        start: Date,
        end: Date,
    }[];
    onSelectEvent: (event: any) => void;
}

const BigCalendar: React.FC<BigCalendarProps> = ({ events, onSelectEvent }) => {
    return (
        <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500, width: '100%' }} // Make sure the calendar fills the width
            popup
            selectable
            onSelectEvent={onSelectEvent}
        />
    )
}

export default BigCalendar