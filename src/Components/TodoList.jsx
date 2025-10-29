import {
  Button,
  Divider,
  Typography,
  Box,
  IconButton,
  Paper,
  Chip,
  Grid,
  LinearProgress,
} from "@mui/material";
import TextField from "@mui/material/TextField";
import TodoItem from "./TodoItem";
import CloseIcon from "@mui/icons-material/Close";
import InsertInvitationIcon from "@mui/icons-material/InsertInvitation";
import SearchIcon from "@mui/icons-material/Search";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { useTheme } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect, useMemo } from "react";
import InputAdornment from "@mui/material/InputAdornment";
import { useTask } from "../Contexts/TaskContext";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DeleteIcon from "@mui/icons-material/Delete";
import TaskAltIcon from "@mui/icons-material/TaskAlt";

import EditIcon from "@mui/icons-material/Edit";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

import { useAlert } from "../Contexts/AlertContext";
import alertSoundUrl from "../assets/Audio.mp3";
dayjs.extend(customParseFormat);
export default function TodoList() {
  const [value, setValue] = useState("all");
  const [showInput, setShowInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


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
    time: dayjs().format("HH:mm A"),
    date: dayjs().format("DD/MM/YYYY, dddd"),
    isCompleted: false,
  });

  // helper: parse a task's due datetime into a dayjs or null
  const parseDueAt = (t) => {
    const dateStr = t?.date || "";
    const timeStr = t?.time || "";
    const candidates = [
      "DD/MM/YYYY, dddd HH:mm A",
      "DD/MM/YYYY ,dddd HH:mm A",
      "DD/MM/YYYY HH:mm A",
    ];
    for (const fmt of candidates) {
      const dt = dayjs(`${dateStr} ${timeStr}`.trim(), fmt, true);
      if (dt.isValid()) return dt;
    }
    return null;
  };

  // play an alert sound from bundled audio file (graceful noop on failure).
  // Uses an HTMLAudioElement so browser autoplay policies behave more predictably.
  const playAlertSound = () => {
    try {
      if (!alertSoundUrl) return;
      const audio = new Audio(alertSoundUrl);
      audio.volume = 0.6;
      // try to play, but ignore rejections (browsers may block autoplay)
      const p = audio.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          // failed to play (likely autoplay policy); swallow the error
        });
      }
    } catch (err) {
      console.warn("playAlertSound failed:", err);
    }
  };

  // Overdue dialog state
  const [overdueTask, setOverdueTask] = useState(null);
  const [isOverdueOpen, setIsOverdueOpen] = useState(false);
  const dismissedOverdueIdsRef = (function(){
    // simple lazy ref without importing useRef, to avoid extra import churn
    // we keep it on window in dev to persist during hot reloads
    if (typeof window !== "undefined") {
      window.__dismissedOverdueIds = window.__dismissedOverdueIds || new Set();
      return { current: window.__dismissedOverdueIds };
    }
    return { current: new Set() };
  })();

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
      time: dayjs().format("HH:mm A"),
      date: dayjs().format("DD/MM/YYYY, dddd"),
      isCompleted: false,
    });

    handelOpenAlert();
    setTextAlert("Task has been added successful !");
  }
  // end add task
  useEffect(() => {
    dispatch({ type: "get" });
    
  }, [dispatch]);

  // persist theme mode


  // Check for overdue tasks periodically
  useEffect(() => {
    const findOverdue = () => {
      if (!allTasks || isOverdueOpen) return null;
      const now = dayjs();
      for (const t of allTasks) {
        if (t.isCompleted) continue;
        if (dismissedOverdueIdsRef.current.has(t.id)) continue;
        const dueAt = parseDueAt(t);
        if (!dueAt) continue;
        if (now.isAfter(dueAt)) return t;
      }
      return null;
    };

    const check = () => {
      const overdue = findOverdue();
      if (overdue) {
        setOverdueTask(overdue);
        // play a short alert and open the dialog
        try {
          playAlertSound();
        } catch {
          // ignore audio errors
        }
        setIsOverdueOpen(true);
      }
    };

    // initial check and set interval
    check();
    const id = setInterval(check, 30000);
    return () => clearInterval(id);
  // dismissedOverdueIdsRef is a stable window-backed container; intentionally omit it from
  // the dependency array to avoid recreating the interval on every render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allTasks, isOverdueOpen]);

  const handleUpdate = () => {
    dispatch({
      type: "update",
      payload: { title: updateTask.title, id: task.id, updateTask },
    });
    setIsOpenUpdate(false);
    handelOpenAlert();
    setTextAlert("Task has been updated successful !");
  };
  const filteredTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = (allTasks || []).filter((t) => {
      if (!query) return true;
      const title = (t.title || "").toLowerCase();
      const description = (t.description || "").toLowerCase();
      const date = (t.date || "").toLowerCase();
      const time = (t.time || "").toLowerCase();
      return (
        title.includes(query) ||
        description.includes(query) ||
        date.includes(query) ||
        time.includes(query)
      );
    });

    // Attach parsed dueAt for sorting
    const now = dayjs();
    const withDue = list.map((t) => ({
      task: t,
      dueAt: parseDueAt(t),
    }));

    // Sort so that: overdue incomplete tasks come first (oldest due first),
    // then tasks with earliest due dates, then tasks without due date.
    withDue.sort((a, b) => {
      const aOver = !a.task.isCompleted && a.dueAt && now.isAfter(a.dueAt);
      const bOver = !b.task.isCompleted && b.dueAt && now.isAfter(b.dueAt);
      if (aOver !== bOver) return aOver ? -1 : 1;
      if (a.dueAt && b.dueAt) {
        if (a.dueAt.isBefore(b.dueAt)) return -1;
        if (a.dueAt.isAfter(b.dueAt)) return 1;
        return 0;
      }
      if (a.dueAt) return -1;
      if (b.dueAt) return 1;
      return 0;
    });

    return withDue.map((x) => x.task);
  }, [allTasks, searchQuery]);

  const completedTasks = useMemo(
    () => filteredTasks.filter((t) => t.isCompleted),
    [filteredTasks]
  );
  const uncompletedTasks = useMemo(
    () => filteredTasks.filter((t) => !t.isCompleted),
    [filteredTasks]
  );

  const progressPercent = useMemo(() => {
    const total = allTasks?.length || 0;
    if (total === 0) return 0;
    const done = allTasks.filter((t) => t.isCompleted).length;
    return Math.round((done / total) * 100);
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
      {/* Overdue Alert Dialog */}
      <Dialog
        open={isOverdueOpen}
        onClose={() => {
          if (overdueTask?.id) dismissedOverdueIdsRef.current.add(overdueTask.id);
          setIsOverdueOpen(false);
          setOverdueTask(null);
        }}
        PaperProps={{
          sx: {
            borderRadius: "16px",
            padding: 0,
            width: "100%",
            maxWidth: "480px",
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: 700,
            color: theme.palette.warning.main,
          }}
        >
          <WarningAmberIcon color="warning" />
          Task overdue
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Typography variant="body1" sx={{ mt: 1 }}>
            The due time for this task has passed and it is not marked as done.
          </Typography>
          {overdueTask && (
            <Paper elevation={0} sx={{ p: 2, mt: 2, bgcolor: "rgba(255, 193, 7, 0.12)" }}>
              <Typography variant="subtitle1" fontWeight={700}>
                {overdueTask.title}
              </Typography>
              {overdueTask.description && (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {overdueTask.description}
                </Typography>
              )}
              {(overdueTask.date || overdueTask.time) && (
                <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                  Due {overdueTask.date} {overdueTask.time}
                </Typography>
              )}
            </Paper>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, justifyContent: "space-between" }}>
          <Button
            variant="outlined"
            onClick={() => {
              if (overdueTask?.id) dismissedOverdueIdsRef.current.add(overdueTask.id);
              setIsOverdueOpen(false);
              setOverdueTask(null);
            }}
            sx={{ borderRadius: "12px", textTransform: "none", px: 3 }}
          >
            Dismiss
          </Button>
          <Button
            variant="contained"
            startIcon={<TaskAltIcon />}
            onClick={() => {
              if (!overdueTask) return;
              const updated = { ...overdueTask, isCompleted: true };
              dispatch({ type: "update", payload: { title: updated.title, id: updated.id, updateTask: updated } });
              setIsOverdueOpen(false);
              setOverdueTask(null);
              handelOpenAlert();
              setTextAlert("Task marked as completed.");
            }}
            sx={{ borderRadius: "12px", textTransform: "none", px: 3 }}
          >
            Mark as done
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
            height: "85vh",
            boxShadow:
              "0 10px 30px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)",
            bgcolor: "background.paper",
          }}
        >
          {/* Header Section */}
          <Box
            sx={{
              background: "linear-gradient(to right, #009592, #007a78)",
              p: 3,
              color: "white",
              textAlign: "center",
              position: "relative",
            }}
          >
            <Typography variant="h4" component="h1" fontWeight="medium">
              My Todo
            </Typography>

            <Box sx={{ mt: 2 }}>
              <LinearProgress
                variant="determinate"
                value={progressPercent}
                sx={{
                  height: 8,
                  borderRadius: 999,
                  backgroundColor: "rgba(255,255,255,0.35)",
                  "& .MuiLinearProgress-bar": { backgroundColor: "#fff" },
                }}
              />
              <Typography variant="caption" sx={{ mt: 0.75, display: "block" }}>
                {progressPercent}% completed • {allTasks?.length || 0} total
              </Typography>
            </Box>
          </Box>

          {/* Filter Buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1.5,
              p: 2,
              bgcolor: "background.paper",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "center", gap: 1.25 }}>
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
            <TextField
              placeholder="Search by title, description, date or time"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              sx={{
                mt: 0.5,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 2 },
              }}
            />
          </Box>

          <Divider />

          {/* Tasks List */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              bgcolor: "background.default",
              "&::-webkit-scrollbar": { width: 8 },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "rgba(0,0,0,0.2)",
                borderRadius: 8,
              },
            }}
          >
            {value === "all" && (
              <>
                {filteredTasks?.length > 0 ? (
                  filteredTasks.map((task) => (
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
                    {searchQuery ? "No results for your search." : "No tasks yet. Add your first task!"}
                  </Typography>
                )}
              </>
            )}

            {value === "completed" && (
              <>
                {completedTasks.length > 0 ? (
                  completedTasks.map((t) => (
                    <TodoItem
                      key={t.id}
                      task={t}
                      handelDelete={() => {
                        handelShowDelete(t);
                      }}
                      handelUpdate={() => {
                        handelShowUpdate(t);
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
                )}
              </>
            )}

            {value === "uncompleted" && (
              <>
                {uncompletedTasks.length > 0 ? (
                  uncompletedTasks.map((t) => (
                    <TodoItem
                      key={t.id}
                      task={t}
                      handelDelete={() => {
                        handelShowDelete(t);
                      }}
                      handelUpdate={() => {
                        handelShowUpdate(t);
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
              onClick={() => {
                setNowTaskData((prev) => ({
                  ...prev,
                  time: dayjs().format("HH:mm A"),
                  date: dayjs().format("DD/MM/YYYY, dddd"),
                }));
                setShowInput(true);
              }}
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
                    value={dayjs(nowTaskData.date, "DD/MM/YYYY, dddd")}
                    minDate={dayjs()}
                    format="DD/MM/YYYY, dddd"
                    onChange={(date) => {
                      setNowTaskData({
                        ...nowTaskData,
                        date: date ? date.format("DD/MM/YYYY, dddd") : "",
                      });
                    }}
                    sx={{ width: "100%", mb: 2 }}
                  />
                </Box>

                <Box sx={{ mb: 3 }}>
                  <TimePicker
                    label="Time"
                    value={dayjs(nowTaskData.time, "HH:mm A")}
                    minTime={
                      dayjs(nowTaskData.date, "DD/MM/YYYY, dddd").isSame(
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
                        time: time ? time.format("HH:mm A") : "",
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
