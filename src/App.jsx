import "./App.css";
import TodoList from "./Components/TodoList";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import ReducerProvider from "./Contexts/TaskContext";
import { AlertProvider } from "./Contexts/AlertContext";

const theme = createTheme({
  palette: {
    primary: {
      light: "#0288d1",
      main: "rgba(0, 149, 146, 1)",
      dark: "rgb(3, 82, 81)",
      contrastText: "#fff",
    },
    completed: {
      main: "#4caf50",
      dark: "#2e7d32",
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
