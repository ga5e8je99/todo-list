import {
  Box,
  Button,
  Grid,
  Typography,
  Paper,
  IconButton,
  Chip,
  Container,
  Avatar,
  Tooltip,
  Badge,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useContext, useState, useEffect } from "react";
import { TaskContext } from "../Contexts/inputContext";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import TaskAltIcon from '@mui/icons-material/TaskAlt';

export default function TodoItem({ task }) {
  const { allTasks, setAllTasks } = useContext(TaskContext);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [updateTask, setUpdateTask] = useState(task);
  const [openAlert, setOpenAlert] = useState(false);
  const [alert, setAlert] = useState({ text: "", color: "" });

  const colors = {
    primary: "#009592",
    primaryDark: "#035251",
    completed: "#4caf50",
    completedDark: "#2e7d32",
    error: "#d32f2f",
    info: "#0288d1",
    warning: "#ed6c02",
  };

  useEffect(() => {
    if (openAlert) {
      const timer = setTimeout(() => setOpenAlert(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [openAlert]);

  const handleCompleted = () => {
    const updatedTasks = allTasks.map(t => 
      t.id === task.id ? { ...t, isCompleted: !t.isCompleted } : t
    );
    localStorage.setItem("task", JSON.stringify(updatedTasks));
    setAllTasks(updatedTasks);
    setAlert({ 
      text: task.isCompleted ? "Task marked incomplete" : "Task completed!", 
      color: "success" 
    });
    setOpenAlert(true);
  };

  const handleDeleted = () => {
    setAlert({ text: "Task deleted successfully", color: "error" });
    setOpenAlert(true);
    
    setTimeout(() => {
      const deletedTasks = allTasks.filter(e => e.id !== task.id);
      localStorage.setItem("task", JSON.stringify(deletedTasks));
      setAllTasks(deletedTasks);
      setIsOpen(false);
    }, 100);
  };

  const handleUpdate = () => {
    if (!updateTask.title.trim()) {
      setAlert({ text: "Task title is required", color: "warning" });
      setOpenAlert(true);
      return;
    }
    
    const updatedTasks = allTasks.map(t => 
      t.id === task.id ? { ...t, ...updateTask } : t
    );
    localStorage.setItem("task", JSON.stringify(updatedTasks));
    setAllTasks(updatedTasks);
    setIsOpenUpdate(false);
    setAlert({ text: "Task updated successfully", color: "info" });
    setOpenAlert(true);
  };

  return (
    <>
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: "24px",
            width: "100%",
            maxWidth: "450px"
          }
        }}
      >
        <DialogTitle sx={{ 
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: colors.error
        }}>
          <DeleteIcon color="error" />
          Delete Task
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Are you sure you want to delete this task?
          </Typography>
          <Paper elevation={2} sx={{ 
            p: 2, 
            mt: 2,
            backgroundColor: 'rgba(211, 47, 47, 0.08)'
          }}>
            <Typography variant="subtitle1" fontWeight={600}>
              {task.title}
            </Typography>
            {task.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {task.description}
              </Typography>
            )}
          </Paper>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 2 }}>
          <Button 
            onClick={() => setIsOpen(false)}
            variant="outlined"
            sx={{ 
              borderRadius: "12px",
              textTransform: 'none',
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleted}
            variant="contained"
            color="error"
            sx={{ 
              borderRadius: "12px",
              textTransform: 'none',
              px: 3
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Update Task Dialog */}
      <Dialog 
        open={isOpenUpdate} 
        onClose={() => setIsOpenUpdate(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: "16px",
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ 
          backgroundColor: colors.primary,
          color: 'white',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          <EditIcon />
          Update Task
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <TextField
              label="Task Title"
              variant="outlined"
              fullWidth
              value={updateTask.title}
              onChange={(e) => setUpdateTask({ ...updateTask, title: e.target.value })}
              required
              error={!updateTask.title.trim()}
              helperText={!updateTask.title.trim() ? "Title is required" : ""}
            />
            
            <TextField
              label="Task Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={updateTask.description}
              onChange={(e) => setUpdateTask({ ...updateTask, description: e.target.value })}
            />
            
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Date"
                    value={dayjs(updateTask.date, "DD/MM/YYYY, dddd")}
                    minDate={dayjs()}
                    format="DD/MM/YYYY, dddd"
                    onChange={(date) => setUpdateTask({ 
                      ...updateTask, 
                      date: date ? date.format("DD/MM/YYYY, dddd") : "" 
                    })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TimePicker
                    label="Time"
                    value={dayjs(updateTask.time, "HH:mm A")}
                    minTime={
                      dayjs(updateTask.date, "DD/MM/YYYY").isSame(dayjs(), "day") ? 
                      dayjs() : null
                    }
                    format="hh:mm A"
                    onChange={(time) => setUpdateTask({ 
                      ...updateTask, 
                      time: time ? time.format("HH:mm A") : "" 
                    })}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions sx={{ 
          justifyContent: 'flex-end',
          px: 3,
          pb: 3,
          gap: 2
        }}>
          <Button 
            onClick={() => setIsOpenUpdate(false)}
            variant="outlined"
            sx={{ 
              borderRadius: "12px",
              textTransform: 'none',
              px: 3
            }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpdate}
            variant="contained"
            sx={{ 
              borderRadius: "12px",
              textTransform: 'none',
              px: 3,
              backgroundColor: colors.primary,
              '&:hover': {
                backgroundColor: colors.primaryDark
              }
            }}
            startIcon={<TaskAltIcon />}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Task Item */}
      <Container maxWidth="sm" sx={{ py: 1 }}>
        <Paper
          elevation={task.isCompleted ? 1 : 3}
          sx={{
            borderRadius: "14px",
            background: task.isCompleted
              ? `linear-gradient(135deg, ${colors.completed}20 0%, ${colors.completedDark}20 100%)`
              : `linear-gradient(135deg, ${colors.primary}15 0%, ${colors.primaryDark}15 100%)`,
            border: `2px solid ${task.isCompleted ? colors.completed : colors.primary}30`,
            p: 3,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: task.isCompleted ? 3 : 6,
              borderColor: task.isCompleted ? colors.completed : colors.primary
            },
            position: "relative",
            overflow: "hidden",

          }}
        >
          {task.isCompleted && (
            <Box sx={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 0,
              height: 0,
              borderStyle: 'solid',
              borderWidth: '0 60px 60px 0',
              borderColor: `transparent ${colors.completed} transparent transparent`,
            }}>
              <CheckIcon sx={{
                position: 'absolute',
                top: 10,
                right: -50,
                color: 'white',
                fontSize: '1.2rem'
              }} />
            </Box>
          )}
          
          <Grid container spacing={2} sx={{display:'grid', gridTemplateColumns:'auto'}}>
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                mb: 1,
                
              }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    task.isCompleted ? (
                      <Tooltip title="Completed">
                        <Avatar sx={{ 
                          width: 24, 
                          height: 24, 
                          bgcolor: colors.completed,
                          border: `2px solid white`
                        }}>
                          <CheckIcon sx={{ fontSize: '1rem' }} />
                        </Avatar>
                      </Tooltip>
                    ) : null
                  }
                >
                  <Avatar sx={{ 
                    bgcolor: task.isCompleted ? colors.completed : colors.primary,
                    color: 'white',
                    fontWeight: 700
                  }}>
                    {task.title.charAt(0).toUpperCase()}
                  </Avatar>
                </Badge>
                
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 700,
                    textDecoration: task.isCompleted ? "line-through" : "none",
                    color: task.isCompleted ? colors.completedDark : 'text.primary',
                    flexGrow: 1
                  }}
                >
                  {task.title}
                </Typography>
              </Box>
              
              {task.description && (
                <Typography 
                  variant="body1" 
                  sx={{ 
                    ml: 7,
                    color: 'text.secondary',
                    textDecoration: task.isCompleted ? "line-through" : "none",
                  }}
                >
                  {task.description}
                </Typography>
              )}
            </Grid>
            
            {(task.date || task.time) && (
              <Grid item xs={12}>
                <Paper elevation={0} sx={{ 
                  p: 1.5,
                  borderRadius: '10px',
                  backgroundColor: 'rgba(0, 149, 146, 0.05)',
                  border: `1px solid ${colors.primary}20`,
                  
                  width:'max-content'
                }}>
                  <Grid container spacing={1}>
                    {task.time && (
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          color: colors.primary
                        }}>
                          <AccessTimeIcon fontSize="small" />
                          <Typography variant="body2" fontWeight={500}>
                            {task.time}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                    {task.date && (
                      <Grid item xs={12} sm={6}>
                        <Box sx={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: 1,
                          color: colors.primary
                        }}>
                          <CalendarTodayIcon fontSize="small" />
                          <Typography variant="body2" fontWeight={500}>
                            {task.date}
                          </Typography>
                        </Box>
                      </Grid>
                    )}
                  </Grid>
                </Paper>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: 1.5,
                mt: 1,
                flexWrap: 'wrap'
              }}>
                <Tooltip title={task.isCompleted ? "Mark incomplete" : "Complete task"}>
                  <Button
                    variant={task.isCompleted ? "outlined" : "contained"}
                    color={task.isCompleted ? "inherit" : "success"}
                    onClick={handleCompleted}
                    sx={{ 
                      borderRadius: "20px",
                      textTransform: "none",
                      px: 2.5,
                      fontWeight: 600,
                      minWidth: '120px'
                    }}
                    startIcon={<CheckIcon />}
                  >
                    {task.isCompleted ? "Undo" : "Complete"}
                  </Button>
                </Tooltip>
                
                <Tooltip title="Edit task">
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => {
                      setUpdateTask(task);
                      setIsOpenUpdate(true);
                    }}
                    sx={{ 
                      borderRadius: "20px",
                      textTransform: "none",
                      px: 2.5,
                      fontWeight: 600,
                      minWidth: '100px'
                    }}
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                </Tooltip>
                
                <Tooltip title="Delete task">
                  <Button
                    variant="outlined"
                    color="error"
                    onClick={() => setIsOpen(true)}
                    sx={{ 
                      borderRadius: "20px",
                      textTransform: "none",
                      px: 2.5,
                      fontWeight: 600,
                      minWidth: '100px'
                    }}
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>

      {/* Alert Notification */}
      <Box sx={{ 
        position: "fixed", 
        bottom: 24, 
        left: 24, 
        zIndex: 9999 
      }}>
        <Collapse in={openAlert}>
          <Alert
            severity={alert.color}
            variant="filled"
            iconMapping={{
              success: <TaskAltIcon fontSize="inherit" />,
              error: <DeleteIcon fontSize="inherit" />,
              info: <EditIcon fontSize="inherit" />,
              warning: <CheckIcon fontSize="inherit" />,
            }}
            action={
              <IconButton
                size="small"
                color="inherit"
                onClick={() => setOpenAlert(false)}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            }
            sx={{ 
              borderRadius: "12px",
              minWidth: "300px",
              boxShadow: 3,
              alignItems: 'center'
            }}
          >
            <Typography variant="body1" fontWeight={500}>
              {alert.text}
            </Typography>
          </Alert>
        </Collapse>
      </Box>
    </>
  );
}