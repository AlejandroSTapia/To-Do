/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState,useRef } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './api/tasksApi';
import type { Task } from './types/task';
import { TaskForm } from './components/TaskForm';
import { TaskItem } from './components/TaskItem';
import { ToastAlert } from './components/ToastAlert';

import { mockTasks } from './data/mockTasks'; 


function App() {
  const [Tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);

  const formRef = useRef<HTMLDivElement>(null);

const [alertMessage, setAlertMessage] = useState<string | null>(null);
const [alertType, setAlertType] = useState<'success' | 'danger' | 'warning'>('success');

const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); // scroll automático
  };
  
  // const fetchTasks = async () => {
  //   try{
  //   const data = await getTasks();
  //   setTasks(data);
  //   }
  //   catch (e) {
  //     setAlertMessage('Error al obtener las tareas.');
  //     setAlertType('danger');
  //   }
  // };

  const fetchTasks = async () => {
  try {
    // Simula un fetch con datos en duro
    setTasks(mockTasks);
  } catch (e) {
    setAlertMessage('Error al obtener las tareas.');
    setAlertType('danger');
  }
};




//
const handleSave = async (task: Task) => {
  try {
    if (task.IdTask === 0) {
      // Simula agregar
      setTasks(prev => [...prev, { ...task, IdTask: Math.max(...prev.map(t => t.IdTask)) + 1 }]);
      setAlertMessage('Tarea creada con éxito!');
    } else {
      // Simula actualizar
      setTasks(prev => prev.map(t => t.IdTask === task.IdTask ? { ...task } : t));
      setAlertMessage('Tarea actualizada con éxito!');
    }
    setAlertType('success');
    setEditingTask(undefined);
  } catch (e) {
    setAlertMessage('Error al guardar la tarea.');
    setAlertType('danger');
  }
};

const handleDelete = async (IdTask: number) => {
  try {
    setTasks(prev => prev.filter(t => t.IdTask !== IdTask));
    setAlertMessage('Tarea eliminada con éxito.');
    setAlertType('success');
  } catch (e) {
    setAlertMessage('Error al eliminar la tarea.');
    setAlertType('danger');
  }
};

const handleToggle = async (IdTask: number) => {
  setTasks(prev => prev.map(t =>
    t.IdTask === IdTask ? { ...t, Completed: !t.Completed } : t
  ));
};

  // const handleSave = async (Task: Task) => {
  //    try {
  //   if (Task.IdTask === 0) {
  //     await createTask(Task);
  //           setAlertMessage('Tarea creada con éxito!');
  //     setAlertType('success');
  //   } else {
  //     await updateTask(Task.IdTask, Task);
  //      setAlertMessage('Tarea actualizada con éxito!');
  //     setAlertType('success');
  //   }
  //    setEditingTask(undefined); 
  //   fetchTasks();
  //   } catch (e) {
  //   setAlertMessage('Error al guardar la tarea.');
  //   setAlertType('danger');
  // }
  // };

  // const handleDelete = async (IdTask: number) => {
  //    try {
  //   await deleteTask(IdTask);
  //    setAlertMessage('Tarea eliminada con éxito.');
  //    setAlertType('success');
  //    fetchTasks();
  //   } catch (e) {
  //   setAlertMessage('Error al eliminar la tarea.');
  //   setAlertType('danger');
  //   }
  // };

  // //completed
  // const handleToggle = async (IdTask: number) => { 
  //   const Task = Tasks.find((n) => n.IdTask === IdTask);
  //   if (Task) {
  //     await updateTask(IdTask, { ...Task, Completed: !Task.Completed });
  //     fetchTasks();
  //   }
  // };

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



  return (
    <>
  <ToastAlert
    message={alertMessage}
    type={alertType}
    onClose={() => setAlertMessage(null)}
  />
<nav className="navbar navbar-light d-flex justify-content-center" style={{ backgroundColor: "#e6f0ff" }}>
  <h1 style={{color:"#333333"}}>ToDo List</h1>
</nav>

    <div className="container mt-5" ref={formRef}>
      

      <TaskForm onSave={handleSave} editingTask={editingTask} />
      <div className="mt-4">
<div className="input-group mb-3">
  <input
    type="text"
    className="form-control"
    placeholder="Buscar tareas..."
    aria-label="Buscar tareas"
    aria-describedby="button-search"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />
  <span className="input-group-text" id="button-search">
    🔍
  </span>
</div>

        {Tasks.filter(Task =>
  Task.Title.toLowerCase().includes(searchTerm.toLowerCase())
).map((Task) => (

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
