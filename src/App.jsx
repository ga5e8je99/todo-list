import "./App.css";
import TodoList from "./Components/TodoList";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import { v4 as taskId } from "uuid";
import { TaskContext } from "./Contexts/inputContext";
const theme = createTheme({
  palette: {
    primary: {
      light: "#757ce8",
      main: "rgba(0, 149, 146, 1)",
      dark: "rgb(3, 82, 81)",
      contrastText: "#fff",
    },
  },
  typography: {
    fontFamily: "exo2",
  },
});

function App() {
  let inatialTaskes = [
    {
      id: taskId(),
      title: "Design Meeting",
      description: "Discuss UI layout for the new dashboard.",
      time: "10:00 AM",
      date: "15/10/2025",
      isCompleted: false,
    },
    {
      id: taskId(),
      title: "Code Review",
      description: "Review pull requests for frontend repo.",
      time: "12:00 PM",
      date: "16/10/2025",
      isCompleted: true,
    },
    {
      id: taskId(),
      title: "Project Planning",
      description: "Plan tasks for the next sprint.",
      time: "02:00 PM",
      date: "17/10/2025",
      isCompleted: false,
    },
    {
      id: taskId(),
      title: "Write Unit Tests",
      description: "Add unit tests for user authentication module.",
      time: "11:30 AM",
      date: "18/10/2025",
      isCompleted: true,
    },
    {
      id: taskId(),
      title: "Fix Bugs",
      description: "Resolve reported bugs in the event form.",
      time: "04:00 PM",
      date: "19/10/2025",
      isCompleted: false,
    },
    {
      id: taskId(),
      title: "Update Docs",
      description: "Update documentation for API endpoints.",
      time: "09:00 AM",
      date: "20/10/2025",
      isCompleted: true,
    },
    {
      id: taskId(),
      title: "Team Sync",
      description: "Weekly sync with the development team.",
      time: "03:00 PM",
      date: "21/10/2025",
      isCompleted: false,
    },
    {
      id: taskId(),
      title: "Deploy to Staging",
      description: "Push latest changes to the staging environment.",
      time: "01:30 PM",
      date: "22/10/2025",
      isCompleted: true,
    },
    {
      id: taskId(),
      title: "Client Demo",
      description: "Present prototype to the client.",
      time: "05:00 PM",
      date: "23/10/2025",
      isCompleted: false,
    },
    {
      id: taskId(),
      title: "Performance Testing",
      description: "Test app performance under load.",
      time: "08:00 AM",
      date: "24/10/2025",
      isCompleted: true,
    },
  ];

  let [allTasks, setAllTasks] = useState(inatialTaskes);
  return (
    <ThemeProvider theme={theme}>
      <TaskContext.Provider value={{allTasks,setAllTasks}}>
        <div>
        <TodoList />
      </div>
      </TaskContext.Provider>
    </ThemeProvider>
  );
}

export default App;
