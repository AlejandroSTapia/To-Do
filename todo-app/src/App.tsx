import { useEffect, useState,useRef } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './api/tasksApi';
import type { Task } from './types/task';
import { TaskForm } from './components/TaskForm';
import { TaskItem } from './components/TaskItem';

function App() {
  const [Tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const formRef = useRef<HTMLDivElement>(null);

  const [alertMessage, setAlertMessage] = useState<string | null>(null);
const [alertType, setAlertType] = useState<'success' | 'danger' | 'info'>('success');

  
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
      showAlert("Tarea creada exitosamente", "success");
    } else {
      await updateTask(Task.IdTask, Task);
      showAlert("Tarea actualizada correctamente", "info");
    }
    fetchTasks();
  };

  const handleDelete = async (IdTask: number) => {
    await deleteTask(IdTask);
      showAlert("Tarea eliminada", "danger");
    fetchTasks();
  };

  const handleToggle = async (IdTask: number) => {
    const Task = Tasks.find((n) => n.IdTask === IdTask);
    if (Task) {
      await updateTask(IdTask, { ...Task, Completed: !Task.Completed });
      fetchTasks();
    }
  };

  const showAlert = (message: string, type: 'success' | 'danger' | 'info' = 'success') => {
  setAlertMessage(message);
  setAlertType(type);

  setTimeout(() => {
    setAlertMessage(null); // Ocultar después de 3 segundos
  }, 3000);
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
      
      {alertMessage && (
      <div className={`alert alert-${alertType} alert-dismissible fade show`} role="alert">
        {alertMessage}
      </div>
    )}

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
