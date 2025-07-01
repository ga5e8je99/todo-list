import {
  Button,
  Container,
  Divider,
  Typography,
  Box,
  IconButton,
  Paper,
  Chip,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import TodoItem from "./TodoItem";
import CloseIcon from "@mui/icons-material/Close";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import dayjs from "dayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import AddIcon from "@mui/icons-material/Add";
import { useContext, useState, useEffect } from "react";
import { v4 as taskId } from "uuid";
import Alert from "@mui/material/Alert";
import Collapse from "@mui/material/Collapse";
import { TaskContext } from "../Contexts/inputContext";

export default function TodoList() {
  const [value, setValue] = useState("all");
  const [showInput, setShowInput] = useState(false);
  const { allTasks, setAllTasks } = useContext(TaskContext);
  const [open, setOpen] = useState(false);
  const [nowTaskData, setNowTaskData] = useState({
    title: "",
    description: "",
    time: "",
    date: "",
    isCompleted: false,
  });

  function handelAddTask() {
    if (!nowTaskData.title.trim()) {
      return; // Prevent adding empty tasks
    }
    
    const newTask = {
      id: taskId(),
      title: nowTaskData.title,
      description: nowTaskData.description,
      time: nowTaskData.time,
      date: nowTaskData.date,
      isCompleted: false,
    };
    
    const taskStorage = [...allTasks, newTask];
    setAllTasks(taskStorage);
    setShowInput(false);
    setNowTaskData({
      title: "",
      description: "",
      time: "",
      date: "",
      isCompleted: false,
    });
    localStorage.setItem("task", JSON.stringify(taskStorage));
    setOpen(true);
    setTimeout(() => setOpen(false), 4000);
  }

  useEffect(() => {
    const storeTask = localStorage.getItem("task");
    if (storeTask) {
      setAllTasks(JSON.parse(storeTask));
    }
  }, [setAllTasks]);

  return (
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
                allTasks.map((task) => <TodoItem key={task.id} task={task} />)
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

          {value === "completed" && (
            <>
              {allTasks?.filter((e) => e.isCompleted).length > 0 ? (
                allTasks
                  .filter((e) => e.isCompleted)
                  .map((e) => <TodoItem key={e.id} task={e} />)
              ) : (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  textAlign="center"
                  sx={{ mt: 4 }}
                >
                  No completed tasks
                </Typography>
              )}
            </>
          )}

          {value === "uncompleted" && (
            <>
              {allTasks?.filter((e) => !e.isCompleted).length > 0 ? (
                allTasks
                  .filter((e) => !e.isCompleted)
                  .map((e) => <TodoItem key={e.id} task={e} />)
              ) : (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  textAlign="center"
                  sx={{ mt: 4 }}
                >
                  All tasks are completed!
                </Typography>
              )}
            </>
          )}
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
                setNowTaskData({ ...nowTaskData, description: e.target.value });
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

      {/* Notification Alert */}
      <Box
        sx={{
          position: "fixed",
          bottom: 20,
          left: 20,
          zIndex: 1400,
        }}
      >
        <Collapse in={open}>
          <Alert
            severity="success"
            variant="filled"
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => setOpen(false)}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
            sx={{ boxShadow: 3 }}
          >
            Task added successfully!
          </Alert>
        </Collapse>
      </Box>
    </Box>
  );
}