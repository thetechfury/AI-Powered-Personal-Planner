import React, {useState} from "react";
import {Box, Button, Checkbox, FormControlLabel, MenuItem, Modal, TextField, Typography} from "@mui/material";

// Styles for the modal
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#1f2937',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
const textFieldStyles = {
    bgcolor: '#1f2937',
    '& .MuiInputBase-input': {
        color: 'white',
    },
    '& .MuiInputLabel-root': {
        color: 'white',
    },
    '& .MuiOutlinedInput-root': {
        border: '1px solid gray',
        '&:hover fieldset': {
            borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white',
        },
    },
    '& .MuiInput-underline:before': {
        borderColor: 'white',
    },
    '& .MuiInput-underline:after': {
        borderColor: 'white',
    },
    '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
        borderColor: 'white',
    },
    '& .MuiSvgIcon-root': {
        color: 'white',
    },
    '& .Mui-focused': {
        '--tw-ring-color': 'rgba(255, 255, 255, 0.5)',
    },
};

const taskTypes = ["Event", "Reminder", "Flexible"];

const daysOfWeek = [
    {name: 'Monday', value: 'Mon'},
    {name: 'Tuesday', value: 'Tue'},
    {name: 'Wednesday', value: 'Wed'},
    {name: 'Thursday', value: 'Thu'},
    {name: 'Friday', value: 'Fri'},
    {name: 'Saturday', value: 'Sat'},
    {name: 'Sunday', value: 'Sun'}
];
const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = {day: '2-digit', month: 'short', year: 'numeric'};
    return new Intl.DateTimeFormat('en-GB', options).format(date);
};

const AddTaskModal = ({open, onClose, onSave}) => {
    const [title, setTitle] = useState("");
    const [taskType, setTaskType] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [hours, setHours] = useState("");
    const [recurringDays, setRecurringDays] = useState([]);
    const [tags, setTags] = useState("");

    // Toggle a day selection
    const handleRecurringChange = (day) => {
        if (recurringDays.includes(day)) {
            setRecurringDays(recurringDays.filter(d => d !== day));
        } else {
            setRecurringDays([...recurringDays, day]);
        }
    };
    const formatTimeWithAmPm = (timeStr) => {
        const [hours, minutes] = timeStr.split(':');
        let hoursInt = parseInt(hours);
        const period = hoursInt >= 12 ? 'PM' : 'AM';
        if (hoursInt > 12) hoursInt -= 12;
        if (hoursInt === 0) hoursInt = 12;
        return `${hoursInt}:${minutes} ${period}`;
    };
    const handleSubmit = () => {
        const formattedDate = date ? formatDate(date) : '';
        const formattedStartTime = formatTimeWithAmPm(startTime);
        const newTask = {
            title,
            task_type: taskType,
            date: formattedDate,
            startTime: formattedStartTime,
            hours: hours || null,
            recurring: recurringDays.length > 0 ? recurringDays.join(', ') : 'None',
            tags,
        };
        onSave(newTask);
        // Reset fields and close modal
        setTitle("");
        setTaskType("");
        setDate("");
        setStartTime("");
        setHours("");
        setRecurringDays([]);
        setTags("");
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="add-task-modal-title"
            aria-describedby="add-task-modal-description"
        >
            <Box sx={modalStyle}>
                <Typography id="add-task-modal-title" variant="h6" component="h2" className='text-white'>
                    Add New Task
                </Typography>
                <TextField
                    label="Title"
                    fullWidth
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    inputProps={{maxLength: 50, minLength: 1}}
                    margin="normal"
                    sx={textFieldStyles}
                />

                <Box display="flex" justifyContent="space-between" gap="16px">
                    <TextField
                        label="Date"
                        type="date"
                        fullWidth
                        required
                        InputLabelProps={{shrink: true}}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        margin="normal"
                        sx={textFieldStyles}
                    />
                    <TextField
                        label="Start Time"
                        type="time"
                        fullWidth
                        required
                        InputLabelProps={{shrink: true}}
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        margin="normal"
                        sx={textFieldStyles}
                    />
                </Box>
                <TextField
                    label="Duration in minuts"
                    type="number"
                    fullWidth
                    InputProps={{inputProps: {min: 0, max: 9223372036854776000}}}
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    margin="normal"
                    sx={textFieldStyles}
                />

                <Typography variant="body1" component="p" sx={{mt: 2}} className='text-white'>
                    Recurring Days
                </Typography>
                <Box display="flex" flexDirection="row" flexWrap="wrap" mt={1}>
                    {daysOfWeek.map((day) => (
                        <FormControlLabel
                            key={day.value}
                            control={
                                <Checkbox
                                    checked={recurringDays.includes(day.value)}
                                    onChange={() => handleRecurringChange(day.value)}
                                    sx={{color: 'white'}}
                                />
                            }
                            label={day.name}
                            className='text-white'
                        />
                    ))}
                </Box>
                <Box display="flex" justifyContent="space-between" gap="16px">
                    <TextField
                        label="Task Type"
                        select
                        fullWidth
                        required
                        value={taskType}
                        onChange={(e) => setTaskType(e.target.value)}
                        margin="normal"
                        sx={textFieldStyles}
                    >
                        {taskTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        label="Tags"
                        type="text"
                        fullWidth
                        required
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        margin="normal"
                        sx={textFieldStyles}
                    />
                </Box>
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button onClick={onClose} sx={{mr: 1}}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>Save</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddTaskModal;
