import React, {useState} from "react";
import {Box, Button, IconButton, List, ListItem, ListItemText, Modal, Typography} from "@mui/material";
import {Close, Edit,} from '@mui/icons-material';
import AddNewTaskModal from "./AddNewTaskModal";
import {createSvgIcon} from '@mui/material/utils';
// Styles for the modal
const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#1f2937',
    boxShadow: 24,
    p: 4,
};

// Task item style
const taskItemStyle = {
    border: '1px solid gray',
    borderRadius: '8px',
    padding: '8px',
    color: '#fff',
    marginBottom: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
};
const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const options = {day: '2-digit', month: 'short', year: 'numeric'};
    return new Intl.DateTimeFormat('en-GB', options).format(date);
};
const PlusIcon = createSvgIcon(
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15"/>
    </svg>,
    'Plus',
);

const TaskListModal = ({open, onClose, selectedDate, tasks, setTasks}) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [dateSelected, setDateSelected] = useState(selectedDate);

    const AddnewTask = () => {
        setDateSelected(selectedDate)
        setModalOpen(true);
    }

    const filteredTasks = tasks.filter(
        task => new Date(task.date).toDateString() === new Date(selectedDate).toDateString());
    const handleEditTask = (id) => {
        alert(`Edit task with id: ${id}`);
    };
    // const handleDeleteTask = (id) => {
    //     onSave(tasks.filter(task => task.id !== id));
    // };

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
                        <Typography id="task-list-modal-title" variant="h6" component="h2" className='text-[#22d3ee]'>
                            {formatDate(selectedDate)}
                        </Typography>
                        <Button onClick={AddnewTask} sx={{mr: -3}}>
                            <PlusIcon className='text-white'/>
                        </Button>

                    </Box>

                    {/* Task List */}
                    <List sx={{mt: 2}}>
                        {filteredTasks.length === 0 ? (
                            <Typography className='text-white !text-xs font-normal tracking-normal'>No tasks for this
                                date.</Typography>
                        ) : (
                            filteredTasks.map((task) => (
                                <ListItem key={task.id} sx={taskItemStyle}>
                                    <ListItemText
                                        primary={task.title}
                                        secondary={`${task.start_time} - ${task.end_time}`}
                                        sx={{
                                            ml: 2,
                                            '& .MuiTypography-root': {
                                                color: 'white',
                                            }
                                        }}
                                    />
                                    <Box display="flex" alignItems="center">
                                        <IconButton
                                            // onClick={() => handleDeleteTask(task.id)}
                                            size="small"
                                            sx={{position: 'absolute', top: '-8px', right: '-10px'}}>
                                            <Close fontSize="small"
                                                   className='text-white border border-1 rounded-full !bg-red-500'/>
                                        </IconButton>
                                        <IconButton onClick={() => handleEditTask(task.id)} size="small">
                                            <Edit fontSize="small"
                                                  className='text-white'/>
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
                setTaskHistory={newTask => setTasks(prevTasks => [newTask, ...prevTasks])}
                dateSelected={dateSelected}
            />
        </>
    );
};

export default TaskListModal;
