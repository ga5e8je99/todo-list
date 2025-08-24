import { createContext, useContext, useReducer } from "react";
import Reducer from "../Reduce/Reduce";
export let TaskContext = createContext([]);

const ReducerProvider = ({ children }) => {
  const [ allTasks, dispatch ] = useReducer(Reducer, []);
  return (
    <TaskContext.Provider value={{ allTasks, dispatch }}>
      {children}
    </TaskContext.Provider>
  );
};
export const useTask = () => {
  return useContext(TaskContext);
};

export default ReducerProvider;
