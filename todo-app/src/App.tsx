import { useEffect, useState,useRef } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './api/tasksApi';
import type { Task } from './types/task';
import { TaskForm } from './components/TaskForm';
import { TaskItem } from './components/TaskItem';

function App() {
  const [Tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const formRef = useRef<HTMLDivElement>(null);

  
  const handleEdit = (task: Task) => {
    setEditingTask(task);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); // scroll automático
  };
  
  const fetchTasks = async () => {
    const data = await getTasks();
    setTasks(data);
  };

  const handleSave = async (Task: Task) => {
    if (Task.IdTask === 0) {
      await createTask(Task);
    } else {
      await updateTask(Task.IdTask, Task);
    }
    fetchTasks();
  };

  const handleDelete = async (IdTask: number) => {
    await deleteTask(IdTask);
    fetchTasks();
  };

  const handleToggle = async (IdTask: number) => {
    const Task = Tasks.find((n) => n.IdTask === IdTask);
    if (Task) {
      await updateTask(IdTask, { ...Task, Completed: !Task.Completed });
      fetchTasks();
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

useEffect(() => {
  console.log("Notas cargadas:", Tasks);
}, [Tasks]);


  return (
    <div className="container mt-5" ref={formRef}>
      <h1>Tareas</h1>
      <TaskForm onSave={handleSave} editingTask={editingTask} />
      <div className="mt-4">
        {Tasks.map((Task) => (
          <TaskItem
            key={Task.IdTask}
            Task={Task}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
