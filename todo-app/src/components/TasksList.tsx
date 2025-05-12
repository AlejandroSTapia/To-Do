import { useEffect, useState } from "react";
import type { Task } from "../types/task";
import { getTasks } from "../api/tasksApi";

export function TasksList() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    getTasks().then(setTasks);
  }, []);

  return (
    <div>
      <h2>Todas las notas</h2>
      <ul>
        {tasks.map((task) => (
          <li key={task.IdTask}>
            <h4>{task.Title}</h4>
            <p>{task.Description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}