import * as React from 'react';
import {useState} from 'react';
import dayjs from 'dayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DateCalendar} from '@mui/x-date-pickers/DateCalendar';
import TaskModal from "../modal/TaskModal";
const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = {day: '2-digit', month: 'short', year: 'numeric'};
    return new Intl.DateTimeFormat('en-GB', options).format(date);
};
export default function Calendar() {
    const [value, setValue] = useState(dayjs());
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [isModalOpen, setModalOpen] = useState(false);
     const [tasks, setTasks] = useState([
        { id: 1, title: "Complete project report", date: "2024-10-18", startTime: "10:00 AM", endTime: "11:00 AM" },
        { id: 2, title: "Team meeting", date: "2024-10-19", startTime: "02:00 PM", endTime: "03:00 PM" },
        { id: 3, title: "Submit code review", date: "2024-10-20", startTime: "04:00 PM", endTime: "05:00 PM" }
    ]);
    const DateHandler = (newValue) => {
        setSelectedDate(newValue);
        setModalOpen(true);
        // alert("Your Selected Date: " + newValue.format('YYYY-MM-DD'));
    };
    const handleSaveTask = (newTask) => {
        setTasks(prevTasks => [...prevTasks, newTask]);
        console.log("Task saved:", newTask);
    };
    return (
        <div className="p-4 space-y-6">
            <div className="bg-gray-800 rounded-lg p-4">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateCalendar
                        value={value}
                        onChange={DateHandler}
                        slotProps={{calendarHeader: {sx: {color: '#22d3ee', width: '100%'}}}}
                    />
                </LocalizationProvider>
                <TaskModal
                    open={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    onSave={handleSaveTask}
                    tasks={tasks}
                    selectedDate={formatDate(selectedDate.toDate())}
                />
            </div>
        </div>
    );
}
