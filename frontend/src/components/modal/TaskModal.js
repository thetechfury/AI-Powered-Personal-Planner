import React, {useState} from "react";
import {Box, Button, IconButton, List, ListItem, ListItemText, Modal, Typography} from "@mui/material";
import {Close, Edit} from '@mui/icons-material';
import AddNewTaskModal from "./AddNewTaskModal";

// Styles for the modal
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'rgba(0, 0, 0, 0.6)',
    border: '1px solid #fff',
    boxShadow: 24,
    p: 4,
};

// Task item style
const taskItemStyle = {
    border: '1px solid #fff',
    borderRadius: '8px',
    padding: '8px',
    color: '#fff',
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};

const AddTaskModal = ({open, onClose, selectedDate, onSave}) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [tasks, setTasks] = useState([
        {id: 1, title: "Complete project report", date: "2024-10-18", startTime: "10:00 AM", endTime: "11:00 AM"},
        {id: 2, title: "Team meeting", date: "2024-10-19", startTime: "02:00 PM", endTime: "03:00 PM"},
        {id: 3, title: "Submit code review", date: "2024-10-20", startTime: "04:00 PM", endTime: "05:00 PM"},
    ]);

    // Filter tasks by selected date
    const filteredTasks = tasks.filter(task => task.date === selectedDate);

    // Handle Edit Task (you can expand this functionality)
    const handleEditTask = (id) => {
        alert(`Edit task with id: ${id}`);
    };

    // Handle Delete Task
    const handleDeleteTask = (id) => {
        setTasks(tasks.filter(task => task.id !== id));
    };

    return (
        <>
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="task-list-modal-title"
                aria-describedby="add-task-modal-description"
            >
                <Box sx={modalStyle}>
                    <Box display="flex" justifyContent="space-between">
                        <Typography id="task-list-modal-title" variant="h6" component="h2" className='text-white'>
                            {selectedDate}
                        </Typography>
                        <Button variant="contained" onClick={() => setModalOpen(true)} sx={{mr: 1}}>
                            Add New Task
                        </Button>
                    </Box>

                    {/* Task List */}
                    <List sx={{mt: 2}}>
                        {filteredTasks.length === 0 ? (
                            <Typography>No tasks for this date.</Typography>
                        ) : (
                            filteredTasks.map((task) => (
                                <ListItem key={task.id} sx={taskItemStyle}>


                                    <ListItemText
                                        primary={task.title}
                                        secondary={`${task.startTime} - ${task.endTime}`}
                                        sx={{
                                            ml: 2,
                                            '& .MuiTypography-root': {
                                                color: 'white',
                                            }
                                        }}
                                    />
                                    <Box display="flex" alignItems="center">
                                        <IconButton onClick={() => handleDeleteTask(task.id)} size="small" sx={{ position: 'absolute', top:'-14px',right:'-10px' }} >
                                            <Close fontSize="small" className='text-white'/>
                                        </IconButton>
                                        <IconButton onClick={() => handleEditTask(task.id)} size="small" >
                                            <Edit fontSize="small" className='text-white border border-1 !w-12 p-2 !h-12'/>
                                        </IconButton>

                                    </Box>
                                </ListItem>
                            ))
                        )}
                    </List>

                    <Box mt={2} display="flex" justifyContent="flex-end">
                        <Button onClick={onClose} sx={{mr: 1}}>Cancel</Button>
                    </Box>
                </Box>
            </Modal>

            <AddNewTaskModal
                open={isModalOpen}
                onClose={() => setModalOpen(false)}
                onSave={onSave}
            />
        </>
    );
};

export default AddTaskModal;
