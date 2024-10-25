import * as React from 'react';
import {useEffect, useState} from 'react';
import dayjs from 'dayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {DateCalendar} from '@mui/x-date-pickers/DateCalendar';
import TaskHistoryApi from "../api/TaskHistoryApi";
import TaskListModal from "../modal/TaskListModal";

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = {day: '2-digit', month: 'short', year: 'numeric'};
    return new Intl.DateTimeFormat('en-GB', options).format(date);
};
export default function Calendar() {
    const [value] = useState(dayjs());
    const [selectedDate, setSelectedDate] = useState(dayjs());
    const [isModalOpen, setModalOpen] = useState(false);
    const {allTaskHistory} = TaskHistoryApi();
    const [tasks, setTasks] = useState([]);
    useEffect(() => {
        if (allTaskHistory) {
            setTasks(allTaskHistory);
        }
    }, [allTaskHistory]);
    const DateHandler = (newValue) => {
        setSelectedDate(newValue);
        setModalOpen(true);
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
                <TaskListModal
                    open={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    tasks={tasks}
                    setTasks={setTasks}
                    selectedDate={formatDate(selectedDate.toDate())}
                />
            </div>
        </div>
    );
}
