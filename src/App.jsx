import "./App.css";
import TodoList from "./Components/TodoList";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import ReducerProvider from "./Contexts/TaskContext";
import { AlertProvider } from "./Contexts/AlertContext";

const theme = createTheme({
  palette: {
    primary: {
      main: "rgba(0, 149, 146, 1)",
      contrastText: "#fff",
    },
    completed: {
      main: "#4caf50",
    },
    error: { main: "#d32f2f" },
    warning: { main: "#ed6c02" },
  },
  typography: {
    fontFamily: "exo2",
  },
});

function App() {
 
  return (
    <ThemeProvider theme={theme}>
      <ReducerProvider>
      <AlertProvider>
       
          <div>
            <TodoList />
          </div>
        
      </AlertProvider>
      </ReducerProvider>
    </ThemeProvider>
  );
}

export default App;
