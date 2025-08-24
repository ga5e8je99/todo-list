import {
  Button,
  Divider,
  Typography,
  Box,
  IconButton,
  Paper,
  Chip,
  Grid,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import TodoItem from "./TodoItem";
import CloseIcon from "@mui/icons-material/Close";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import dayjs from "dayjs";
import { useTheme } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect, useMemo } from "react";
import { useTask } from "../Contexts/TaskContext";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

import EditIcon from "@mui/icons-material/Edit";
import { useAlert } from "../Contexts/AlertContext";
import Reducer from "../Reduce/Reduce";
export default function TodoList() {
  const [value, setValue] = useState("all");
  const [showInput, setShowInput] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const { handelOpenAlert, setTextAlert } = useAlert();
  const theme = useTheme();
  const {allTasks, dispatch} = useTask();
  
  const [task, setTask] = useState({
    title: "",
    description: "",
    time: "",
    date: "",
    isCompleted: false,
  });

  const [updateTask, setUpdateTask] = useState({
    title: "",
    description: "",
    time: "",
    date: "",
    isCompleted: false,
  });
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);
  const [nowTaskData, setNowTaskData] = useState({
    title: "",
    description: "",
    time: "",
    date: "",
    isCompleted: false,
  });

  const handelShowDelete = (taskInfo) => {
    setIsOpen(true);
    setTask(taskInfo);
  };
  const handelShowUpdate = (taskInfo) => {
    setIsOpenUpdate(true);
    setTask(taskInfo);
    setUpdateTask(taskInfo);
  };
  const handleDeleted = () => {
    setTimeout(() => {
      dispatch({ type: "deleted", payload: { id: task.id } });
      setIsOpen(false);
    }, 100);
    handelOpenAlert();
    setTextAlert("Task has been deleted successful !");
    
  };

  // start add task
  function handelAddTask() {
    dispatch({
      type: "added",
      payload: {
        title: nowTaskData.title,
        description: nowTaskData.description,
        time: nowTaskData.time,
        date: nowTaskData.date,
      },
    });
    setShowInput(false);
    setNowTaskData({
      title: "",
      description: "",
      time: "",
      date: "",
      isCompleted: false,
    });

    handelOpenAlert();
    setTextAlert("Task has been added successful !");
  }
  // end add task
  useEffect(() => {
    dispatch({ type: "get" });
    
  }, []);

  const handleUpdate = () => {
    dispatch({
      type: "update",
      payload: { title: updateTask.title, id: task.id, updateTask },
    });
    setIsOpenUpdate(false);
    handelOpenAlert();
    setTextAlert("Task has been updated successful !");
  };
  const isCompleted = useMemo(() => {
    return allTasks?.filter((e) => e.isCompleted).length > 0 ? (
      allTasks
        .filter((e) => e.isCompleted)
        .map((e) => (
          <TodoItem
            key={e.id}
            task={e}
            handelDelete={() => {
              handelShowDelete(task);
            }}
            handelUpdate={() => {
              handelShowUpdate(task);
            }}
          />
        ))
    ) : (
      <Typography
        variant="body1"
        color="text.secondary"
        textAlign="center"
        sx={{ mt: 4 }}
      >
        No completed tasks
      </Typography>
    );
  }, [allTasks]);
  const isUnCompleted = useMemo(() => {
    return allTasks?.filter((e) => !e.isCompleted).length > 0 ? (
      allTasks
        .filter((e) => !e.isCompleted)
        .map((e) => (
          <TodoItem
            key={e.id}
            task={e}
            handelDelete={() => {
              handelShowDelete(task);
            }}
            handelUpdate={() => {
              handelShowUpdate(task);
            }}
          />
        ))
    ) : (
      <Typography
        variant="body1"
        color="text.secondary"
        textAlign="center"
        sx={{ mt: 4 }}
      >
        All tasks are completed!
      </Typography>
    );
  }, [allTasks]);
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
            maxWidth: "450px",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 1,
            color: theme.palette.error,
          }}
        >
          <DeleteIcon color="error" />
          Delete Task
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 1 }}>
            Are you sure you want to delete this task?
          </Typography>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              mt: 2,
              backgroundColor: "rgba(211, 47, 47, 0.08)",
            }}
          >
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
        <DialogActions sx={{ justifyContent: "space-between", px: 3, pb: 2 }}>
          <Button
            onClick={() => setIsOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              px: 3,
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
              textTransform: "none",
              px: 3,
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
            overflow: "hidden",
            height: "max-content",
          },
        }}
      >
        <DialogTitle
          sx={{
            backgroundColor: theme.palette.primary.main,
            color: "white",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
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
              onChange={(e) =>
                setUpdateTask({ ...updateTask, title: e.target.value })
              }
              required
            />

            <TextField
              label="Task Description"
              variant="outlined"
              fullWidth
              multiline
              rows={4}
              value={updateTask.description}
              onChange={(e) =>
                setUpdateTask({ ...updateTask, description: e.target.value })
              }
            />

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <DatePicker
                    label="Date"
                    value={dayjs(updateTask.date, "DD/MM/YYYY, dddd")}
                    minDate={dayjs()}
                    format="DD/MM/YYYY, dddd"
                    onChange={(date) =>
                      setUpdateTask({
                        ...updateTask,
                        date: date ? date.format("DD/MM/YYYY, dddd") : "",
                      })
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TimePicker
                    label="Time"
                    value={dayjs(updateTask.time, "HH:mm A")}
                    minTime={
                      dayjs(updateTask.date, "DD/MM/YYYY").isSame(
                        dayjs(),
                        "day"
                      )
                        ? dayjs()
                        : null
                    }
                    format="hh:mm A"
                    onChange={(time) =>
                      setUpdateTask({
                        ...updateTask,
                        time: time ? time.format("HH:mm A") : "",
                      })
                    }
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </LocalizationProvider>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "flex-end",
            px: 3,
            pb: 3,
            gap: 2,
          }}
        >
          <Button
            onClick={() => setIsOpenUpdate(false)}
            variant="outlined"
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              px: 3,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdate}
            variant="contained"
            sx={{
              borderRadius: "12px",
              textTransform: "none",
              px: 3,
              backgroundColor: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.dark,
              },
            }}
            startIcon={<TaskAltIcon />}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
      <Box
        sx={{
          position: "relative",
          width: "100vw",
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
          p: 2,
        }}
      >
        <Paper
          elevation={6}
          sx={{
            width: "100%",
            maxWidth: "600px",
            borderRadius: "16px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            height: "80vh",
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              background: "linear-gradient(to right, #009592, #007a78)",
              p: 3,
              color: "white",
              textAlign: "center",
            }}
          >
            <Typography variant="h4" component="h1" fontWeight="medium">
              My Todo
            </Typography>
          </Box>

          {/* Filter Buttons */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 2,
              p: 2,
              bgcolor: "background.paper",
            }}
          >
            {["all", "completed", "uncompleted"].map((filter) => (
              <Chip
                key={filter}
                label={filter.charAt(0).toUpperCase() + filter.slice(1)}
                onClick={() => setValue(filter)}
                color={value === filter ? "primary" : "default"}
                variant={value === filter ? "filled" : "outlined"}
                sx={{ textTransform: "capitalize" }}
              />
            ))}
          </Box>

          <Divider />

          {/* Tasks List */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              bgcolor: "background.default",
            }}
          >
            {value === "all" && (
              <>
                {allTasks?.length > 0 ? (
                  allTasks.map((task) => (
                    <TodoItem
                      key={task.id}
                      task={task}
                      handelDelete={() => {
                        handelShowDelete(task);
                      }}
                      handelUpdate={() => {
                        handelShowUpdate(task);
                      }}
                    />
                  ))
                ) : (
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    textAlign="center"
                    sx={{ mt: 4 }}
                  >
                    No tasks yet. Add your first task!
                  </Typography>
                )}
              </>
            )}

            {value === "completed" && <>{isCompleted}</>}

            {value === "uncompleted" && <>{isUnCompleted}</>}
          </Box>

          {/* Add Task Button */}
          <Box sx={{ p: 2, bgcolor: "background.paper" }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setShowInput(true)}
              sx={{
                bgcolor: "primary.main",
                "&:hover": { bgcolor: "primary.dark" },
                height: "48px",
                borderRadius: "12px",
              }}
            >
              Add New Task
            </Button>
          </Box>
        </Paper>

        {/* Add Task Modal */}
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(0,0,0,0.5)",
            display: showInput ? "flex" : "none",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1300,
            p: 2,
          }}
        >
          <Paper
            sx={{
              width: "100%",
              maxWidth: "500px",
              borderRadius: "16px",
              overflow: "hidden",
            }}
          >
            <Box
              sx={{
                bgcolor: "primary.main",
                color: "white",
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">New Task</Typography>
              <IconButton onClick={() => setShowInput(false)} color="inherit">
                <CloseIcon />
              </IconButton>
            </Box>

            <Box sx={{ p: 3 }}>
              <TextField
                fullWidth
                label="Task Title"
                variant="outlined"
                margin="normal"
                value={nowTaskData.title}
                onChange={(e) => {
                  setNowTaskData({ ...nowTaskData, title: e.target.value });
                }}
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                label="Task Description"
                variant="outlined"
                margin="normal"
                multiline
                rows={3}
                value={nowTaskData.description}
                onChange={(e) => {
                  setNowTaskData({
                    ...nowTaskData,
                    description: e.target.value,
                  });
                }}
                sx={{ mb: 2 }}
              />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Box sx={{ mb: 2 }}>
                  <DatePicker
                    label="Date"
                    defaultValue={dayjs(nowTaskData.date)}
                    minDate={dayjs()}
                    format="DD/MM/YYYY, dddd"
                    onChange={(date) => {
                      setNowTaskData({
                        ...nowTaskData,
                        date: date.format("DD/MM/YYYY ,dddd"),
                      });
                    }}
                    sx={{ width: "100%", mb: 2 }}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <TimePicker
                    label="Time"
                    defaultValue={dayjs(nowTaskData.time)}
                    minTime={
                      dayjs(nowTaskData.date, "DD/MM/YYYY").isSame(
                        dayjs(),
                        "day"
                      )
                        ? dayjs()
                        : null
                    }
                    format="hh:mm A"
                    onChange={(time) => {
                      setNowTaskData({
                        ...nowTaskData,
                        time: time.format("HH:mm A"),
                      });
                    }}
                    sx={{ width: "100%" }}
                  />
                </Box>
              </LocalizationProvider>

              <Button
                fullWidth
                variant="contained"
                startIcon={<InsertInvitationIcon />}
                onClick={handelAddTask}
                disabled={!nowTaskData.title.trim()}
                sx={{ height: "48px", borderRadius: "12px" }}
              >
                Add Task
              </Button>
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
}
