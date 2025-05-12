import { useEffect, useState } from "react";
import type { Task } from "../types/task";
import { getTasks } from "../api/tasksApi";

export function TasksList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    getTasks().then(setTasks);
  }, []);

  return (
    <div>
      <h2>Todas las notas</h2>

      <input
  type="text"
  className="form-control mb-3"
  placeholder="Buscar tareas..."
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
/>

      <ul>
        {tasks.filter(task =>
  task.Title.toLowerCase().includes(searchTerm.toLowerCase())
).map((task) => (
          <li key={task.IdTask}>
            <h4>{task.Title}</h4>
            <p>{task.Description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}