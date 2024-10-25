import React, {useEffect, useState} from "react";
import {Box, Button, MenuItem, Modal, TextField, Typography} from "@mui/material";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import CreateTaskApi from "../api/CreateTaskApi";
import dayjs from "dayjs";
import TaskHistoryApi from "../api/TaskHistoryApi";

// Validation schema using Yup
const validationSchema = Yup.object({
    title: Yup.string().min(1).max(50).required(),
    date: Yup.string().required(),
    start_time: Yup.string().required(),
    duration: Yup.number().min(0).required(),
    task_type: Yup.string().required(),
    tag: Yup.string().required(),
});

// Modal style definitions
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

const buttonStyle = (isSelected) => ({
    minWidth: 35,
    height: 35,
    border: '1px solid gray',
    borderRadius: '100px',
    margin: '6px',
    fontSize: '0.75rem',
    color: '#fff',
    backgroundColor: isSelected ? '#22d3ee' : 'transparent',
    '&:hover': {
        backgroundColor: isSelected ? '#22d3ee' : '#4b5563',
    },
});

const textFieldStyles = {
    color: 'white',
    bgcolor: '#1f2937',
    '& .MuiFormControlLabel-label': {
        fontSize: '0.75rem',
    },
    '& .MuiInputBase-input': {
        color: 'white',
        fontSize: '0.75rem',
    },
    '& .MuiInputLabel-root': {
        color: 'white',
    },
    '& .MuiOutlinedInput-root': {
        border: '1px solid gray',
        height: '60px',
        '&:hover fieldset': {
            borderColor: 'white',
        },
        '&.Mui-focused fieldset': {
            borderColor: 'white',
        },
        '&.Mui-focused': {
            border: 'none',
        },
    },
    '& .MuiSvgIcon-root': {
        color: 'white',
    },
};
const taskTypes = ["event", "reminder", "flexible"];
const daysOfWeek = [
    {name: 'S', value: 'Sun'},
    {name: 'M', value: 'Mon'},
    {name: 'T', value: 'Tue'},
    {name: 'W', value: 'Wed'},
    {name: 'T', value: 'Thu'},
    {name: 'F', value: 'Fri'},
    {name: 'S', value: 'Sat'},
];
const CustomErrorMessage = ({name}) => {
    return (
        <ErrorMessage
            name={name}
            component="div"
            style={{color: 'red', marginTop: '4px', fontSize: '0.75rem'}}
        />
    );
};
const AddTaskModal = ({open, onClose, dateSelected, setTaskHistory}) => {
    const {createTask, response, loading, error} = CreateTaskApi();
    const {fetchInitialTaskHistory, fetchTaskHistory} = TaskHistoryApi();
    const [recurringDays, setRecurringDays] = useState([]);
    const dateSelectedDayjs = dayjs(dateSelected);

    const handleRecurringChange = (day) => {
        setRecurringDays(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    useEffect(() => {
        if (open) {
            setRecurringDays([]);
        }
    }, [open]);

    // Define initial values outside the JSX
    const initialValues = {
        title: '',
        date: dateSelectedDayjs.format('YYYY-MM-DD'),
        start_time: '',
        duration: '',
        task_type: '',
        tag: '',
    };

    // Define handleSubmit function
    const handleSubmit = async (values, {setSubmitting, resetForm}) => {
        const newTask = {
            ...values,
            recurring: recurringDays.length > 0 ? recurringDays.join(', ') : 'None',
        };
        await createTask(newTask);
        if (!error) {
            resetForm();
            onClose();
        }
        setSubmitting(false);
    };
    useEffect(() => {
        if (Object.keys(response).length > 0) {
            setTaskHistory(response);
            fetchInitialTaskHistory();
            fetchTaskHistory();
        }
    }, [response]);
    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography id="add-task-modal-title" variant="h6" component="h2" className='text-[#22d3ee]'>
                    Add New Task
                </Typography>
                <Formik
                    initialValues={initialValues} // Use the separated initialValues
                    validationSchema={validationSchema}
                    onSubmit={handleSubmit} // Use the separated handleSubmit function
                >
                    {({isSubmitting, handleChange, values}) => (
                        <Form>
                            <Field name="title" as={TextField} label="Title" fullWidth required margin="normal"
                                   sx={textFieldStyles}/>
                            <CustomErrorMessage name="title"/>
                            <Box display="flex" justifyContent="space-between" gap="16px">
                                <Box className='!w-full'>
                                    <Field name="date" as={TextField} label="Date" type="date" fullWidth required
                                           margin="normal" sx={textFieldStyles}/>
                                    <CustomErrorMessage name="date"/>
                                </Box>
                                <Box className='!w-full'>
                                    <Field name="start_time" as={TextField} label="Start Time" type="time" fullWidth
                                           required margin="normal" sx={textFieldStyles}/>
                                    <CustomErrorMessage name="start_time"/>
                                </Box>
                            </Box>
                            <Field name="duration" as={TextField} label="Duration in minutes" fullWidth required
                                   margin="normal" sx={textFieldStyles}/>
                            <CustomErrorMessage name="duration"/>
                            <Typography variant="body1" component="p" sx={{mt: 2}} className='text-white'>
                                Recurring Days
                            </Typography>
                            <Box display="flex" flexDirection="row" flexWrap="wrap" mt={1}>
                                {daysOfWeek.map((day) => (
                                    <Button
                                        key={day.value}
                                        sx={buttonStyle(recurringDays.includes(day.value))}
                                        onClick={() => handleRecurringChange(day.value)}
                                    >
                                        {day.name}
                                    </Button>
                                ))}
                            </Box>
                            <Box display="flex" justifyContent="space-between" gap="16px">
                                <Box className='!w-full'>
                                    <Field
                                        name="task_type"
                                        as={TextField}
                                        label="Task Type"
                                        select
                                        fullWidth
                                        required
                                        margin="normal"
                                        sx={textFieldStyles}
                                        onChange={handleChange}
                                        value={values.taskType}
                                    >
                                        {taskTypes.map((type) => (
                                            <MenuItem key={type} value={type}
                                                      sx={{background: '#1f2937', color: 'white'}}>
                                                {type}
                                            </MenuItem>
                                        ))}
                                    </Field>
                                    <CustomErrorMessage name="task_type"/>
                                </Box>
                                <Box className='!w-full'>
                                    <Field
                                        name="tag"
                                        as={TextField}
                                        label="Tags"
                                        fullWidth
                                        required
                                        margin="normal"
                                        sx={textFieldStyles}
                                        onChange={handleChange}
                                        value={values.tags}
                                    />
                                    <CustomErrorMessage name="tag"/>
                                </Box>
                            </Box>
                            <Box display="flex" justifyContent="flex-end">
                                <Button onClick={onClose}>Cancel</Button>
                                <Button type="submit"
                                        disabled={isSubmitting || loading}>{isSubmitting || loading ? 'Saving...' : 'Save'}</Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
            </Box>
        </Modal>
    );
};

export default AddTaskModal;
