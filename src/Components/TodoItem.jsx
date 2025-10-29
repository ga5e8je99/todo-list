import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  Avatar,
  Tooltip,
  Badge,
  Grid as Grid2,
} from "@mui/material";

import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useContext } from "react";

import { AlertContext } from "../Contexts/AlertContext";
import { useTheme } from "@mui/material/styles";
import { useTask } from "../Contexts/TaskContext";

export default function TodoItem({ task, handelDelete, handelUpdate }) {
  const theme = useTheme();
  const { dispatch } = useTask();

  const { handelOpenAlert, setTextAlert,setColorAlert } = useContext(AlertContext);
  

  const handleCompleted = () => {
    
    dispatch({ type: "completed", payload: { id: task.id } });
    handelOpenAlert();
    if(!task.isCompleted){
      setTextAlert("Task has been completed successful !");
      setColorAlert('success')
    }else if(task.isCompleted){
      setTextAlert("Task has not been completed !");
      setColorAlert('error')
    }
  };

  return (
    <>
      {/* Task Item */}
      <Container maxWidth="sm" sx={{ py: 1 }}>
        <Paper
          elevation={task.isCompleted ? 1 : 3}
          sx={{
            borderRadius: "14px",
            background: task.isCompleted
              ? `linear-gradient(135deg, ${theme.palette.completed.main}20 0%, ${theme.palette.completed.main}20 100%)`
              : `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.main}15 100%)`,
            border: `2px solid ${
              task.isCompleted
                ? theme.palette.completed.main
                : theme.palette.primary.main
            }30`,
            p: 3,
            transition: "all 0.3s ease",
            "&:hover": {
              transform: "translateY(-3px)",
              boxShadow: task.isCompleted ? 3 : 6,
              borderColor: task.isCompleted
                ? theme.palette.completed.main
                : theme.palette.primary.main,
            },
            position: "relative",
            overflow: "hidden",
          }}
        >
          {task.isCompleted && (
            <Box
              sx={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 0,
                height: 0,
                borderStyle: "solid",
                borderWidth: "0 60px 60px 0",
                borderColor: `transparent ${theme.palette.completed.main} transparent transparent`,
              }}
            >
              <CheckIcon
                sx={{
                  position: "absolute",
                  top: 10,
                  right: -50,
                  color: "white",
                  fontSize: "1.2rem",
                }}
              />
            </Box>
          )}

          <Grid2
            container
            spacing={2}
            sx={{ display: "grid", gridTemplateColumns: "auto" }}
          >
            <Grid2 item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  mb: 1,
                }}
              >
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                  badgeContent={
                    task.isCompleted ? (
                      <Tooltip title="Completed">
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: theme.palette.completed.main,
                            border: `2px solid white`,
                          }}
                        >
                          <CheckIcon sx={{ fontSize: "1rem" }} />
                        </Avatar>
                      </Tooltip>
                    ) : null
                  }
                >
                  <Avatar
                    sx={{
                      bgcolor: task.isCompleted
                        ? theme.palette.completed.main
                        : theme.palette.primary.main,
                      color: "white",
                      fontWeight: 700,
                    }}
                  >
                    {task.title.charAt(0).toUpperCase()}
                  </Avatar>
                </Badge>

                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 700,
                    textDecoration: task.isCompleted ? "line-through" : "none",
                    color: task.isCompleted
                      ? theme.palette.completed.main
                      : "text.primary",
                    flexGrow: 1,
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
                    color: "text.secondary",
                    textDecoration: task.isCompleted ? "line-through" : "none",
                  }}
                >
                  {task.description}
                </Typography>
              )}
            </Grid2>

            {(task.date || task.time) && (
              <Grid2 item xs={12}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 1.5,
                    borderRadius: "10px",
                    backgroundColor: "rgba(0, 149, 146, 0.05)",
                    border: `1px solid ${theme.palette.primary.main}20`,

                    width: "max-content",
                  }}
                >
                  <Grid2 container spacing={1}>
                    {task.time && (
                      <Grid2 item xs={12} sm={6}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: theme.palette.primary.main,
                          }}
                        >
                          <AccessTimeIcon fontSize="small" />
                          <Typography variant="body2" fontWeight={500}>
                            {task.time}
                          </Typography>
                        </Box>
                      </Grid2>
                    )}
                    {task.date && (
                      <Grid2 item xs={12} sm={6}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                            color: theme.palette.primary.main,
                          }}
                        >
                          <CalendarTodayIcon fontSize="small" />
                          <Typography variant="body2" fontWeight={500}>
                            {task.date}
                          </Typography>
                        </Box>
                      </Grid2>
                    )}
                  </Grid2>
                </Paper>
              </Grid2>
            )}

            <Grid2 item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 1.5,
                  mt: 1,
                  flexWrap: "wrap",
                }}
              >
                <Tooltip
                  title={task.isCompleted ? "Mark incomplete" : "Complete task"}
                >
                  <Button
                    variant={task.isCompleted ? "outlined" : "contained"}
                    color={task.isCompleted ? "inherit" : "success"}
                    onClick={handleCompleted}
                    sx={{
                      borderRadius: "20px",
                      textTransform: "none",
                      px: 2.5,
                      fontWeight: 600,
                      minWidth: "120px",
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
                    onClick={() => handelUpdate(task)}
                    sx={{
                      borderRadius: "20px",
                      textTransform: "none",
                      px: 2.5,
                      fontWeight: 600,
                      minWidth: "100px",
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
                    onClick={() => handelDelete(task)}
                    sx={{
                      borderRadius: "20px",
                      textTransform: "none",
                      px: 2.5,
                      fontWeight: 600,
                      minWidth: "100px",
                    }}
                    startIcon={<DeleteIcon />}
                  >
                    Delete
                  </Button>
                </Tooltip>
              </Box>
            </Grid2>
          </Grid2>
        </Paper>
      </Container>
    </>
  );
}
