import { useEffect, useState,useRef } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './api/tasksApi';
import type { Task } from './types/task';
import { TaskForm } from './components/TaskForm';
import { TaskItem } from './components/TaskItem';
import { ToastAlert } from './components/ToastAlert';


function App() {
  const [Tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const formRef = useRef<HTMLDivElement>(null);

const [alertMessage, setAlertMessage] = useState<string | null>(null);
const [alertType, setAlertType] = useState<'success' | 'danger' | 'warning'>('success');

  
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
            setAlertMessage('Tarea creada con éxito!');
      setAlertType('success');
    } else {
      await updateTask(Task.IdTask, Task);
       setAlertMessage('Tarea actualizada con éxito!');
      setAlertType('success');
    }
    fetchTasks();
  };

  const handleDelete = async (IdTask: number) => {
    await deleteTask(IdTask);
     setAlertMessage('Tarea eliminada correctamente.');
    setAlertType('warning');
  };

  const handleToggle = async (IdTask: number) => {
    const Task = Tasks.find((n) => n.IdTask === IdTask);
    if (Task) {
      await updateTask(IdTask, { ...Task, Completed: !Task.Completed });
      fetchTasks();
    }
  };

useEffect(() => {
  if (alertMessage) {
    const timeout = setTimeout(() => {
      setAlertMessage(null);
    }, 3000);
    return () => clearTimeout(timeout);
  }
}, [alertMessage]);

  useEffect(() => {
    fetchTasks();
  }, []);

useEffect(() => {
  console.log("Notas cargadas:", Tasks);
}, [Tasks]);


  return (
    <>
  <ToastAlert
    message={alertMessage}
    type={alertType}
    onClose={() => setAlertMessage(null)}
  />

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
    </>
  );
}

export default App;
