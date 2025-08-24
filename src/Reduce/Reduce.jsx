import { v4 as taskId } from "uuid";

export default function Reducer(initialTasks, action) {
  switch (action.type) {
    case "added": {
      if (!action.payload.title.trim()) {
        return initialTasks; 
      }

      const newTask = {
        id: taskId(),
        title: action.payload.title,
        description: action.payload.description,
        time: action.payload.time,
        date: action.payload.date,
        isCompleted: false,
      };

      const taskStorage = [...initialTasks, newTask];
      localStorage.setItem("task", JSON.stringify(taskStorage));
      return taskStorage;
    }

    case "update": {
      if (!action.payload.title.trim()) {
        return initialTasks; 
      }

      const updatedTasks = initialTasks.map((t) =>
        t.id === action.payload.id ? { ...t, ...action.payload.updateTask } : t
      );
      localStorage.setItem("task", JSON.stringify(updatedTasks));
      return updatedTasks;
    }

    case "deleted": {
      const deletedTasks = initialTasks.filter((e) => e.id !== action.payload.id);
      localStorage.setItem("task", JSON.stringify(deletedTasks));
      return deletedTasks;
    }

    case "get": {
      const storeTask = localStorage.getItem("task");
      return storeTask ? JSON.parse(storeTask) : initialTasks; 
    }
    case 'completed':{
      const updatedTasks = initialTasks.map((t) =>
      t.id === action.payload.id ? { ...t, isCompleted: !t.isCompleted } : t
    );
    localStorage.setItem("task", JSON.stringify(updatedTasks));
    return updatedTasks;
    }
    
    default:
      return initialTasks;
  }
}
