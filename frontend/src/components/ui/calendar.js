import * as React from 'react';
import { useState } from 'react';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
export default function Calendar() {
    const [value, setValue] = useState(dayjs());
    const DateHandler = (newValue) => {
        setValue(newValue);
        alert("Your Selected Date: " + newValue.format('YYYY-MM-DD'));
    };
    return (
        <div className="p-4 space-y-6">
            <div className="bg-gray-800 rounded-lg p-4">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                        value={value}
                        onChange={DateHandler}
                        slotProps={{ calendarHeader: { sx: { color: '#22d3ee', width: '100%' } }}}
                    />
                </LocalizationProvider>
            </div>
        </div>
    );
}
