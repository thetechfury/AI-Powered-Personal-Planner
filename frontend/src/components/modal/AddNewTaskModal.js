import React, { useState } from "react";
import { Modal, Box, Button, TextField, Typography, MenuItem } from "@mui/material";

// Styles for the modal
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const taskTypes = ["Meeting", "Development", "Research"]; // Example task types
const recurringOptions = ["Daily", "Weekly", "Monthly"];  // Example recurring options

const AddTaskModal = ({ open, onClose, onSave }) => {
    const [title, setTitle] = useState("");
    const [taskType, setTaskType] = useState("");
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [hours, setHours] = useState("");
    const [recurring, setRecurring] = useState("");
    const [category, setCategory] = useState("");
    const [user, setUser] = useState("");

    const handleSubmit = () => {
        const newTask = {
            title,
            task_type: taskType,
            date,
            start_time: startTime,
            end_time: endTime || null,
            hours: hours || null,
            recurring,
            category: parseInt(category, 10),
            user: parseInt(user, 10),
        };
        // Call the onSave function passed from the parent component to save the task
        onSave(newTask);
        // Reset fields and close modal
        setTitle("");
        setTaskType("");
        setDate("");
        setStartTime("");
        setEndTime("");
        setHours("");
        setRecurring("");
        setCategory("");
        setUser("");
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
                <Typography id="add-task-modal-title" variant="h6" component="h2">
                    Add New Task
                </Typography>
                <TextField
                    label="Title"
                    fullWidth
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    inputProps={{ maxLength: 50, minLength: 1 }}
                    margin="normal"
                />
                <TextField
                    label="Task Type"
                    select
                    fullWidth
                    required
                    value={taskType}
                    onChange={(e) => setTaskType(e.target.value)}
                    margin="normal"
                >
                    {taskTypes.map((type) => (
                        <MenuItem key={type} value={type}>
                            {type}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Date"
                    type="date"
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label="Start Time"
                    type="time"
                    fullWidth
                    required
                    InputLabelProps={{ shrink: true }}
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label="End Time"
                    type="time"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label="Hours"
                    type="number"
                    fullWidth
                    InputProps={{ inputProps: { min: 0, max: 9223372036854776000 } }}
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label="Recurring"
                    select
                    fullWidth
                    required
                    value={recurring}
                    onChange={(e) => setRecurring(e.target.value)}
                    margin="normal"
                >
                    {recurringOptions.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}
                        </MenuItem>
                    ))}
                </TextField>
                <TextField
                    label="Category"
                    type="number"
                    fullWidth
                    required
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    margin="normal"
                />
                <TextField
                    label="User"
                    type="number"
                    fullWidth
                    required
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    margin="normal"
                />
                <Box mt={2} display="flex" justifyContent="flex-end">
                    <Button onClick={onClose} sx={{ mr: 1 }}>Cancel</Button>
                    <Button variant="contained" onClick={handleSubmit}>Save</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default AddTaskModal;
