import axios from 'axios';
import type { Task } from '../types/task';

const API_URL = 'http://localhost:3000/tasks';

export const getTasks = async (): Promise<Task[]> => {
  const response = await axios.get<Task[]>(API_URL);
    console.log("Notas desde API:", response.data);
  return response.data;
};

export const createTask = async (Task: Task): Promise<void> => {
  const response = await axios.post(API_URL, Task);
  console.log("Nota creada:", response.data);
};

export const updateTask = async (id: number, Task: Task): Promise<void> => {
  await axios.put(`${API_URL}/${id}`, Task);
};

export const deleteTask = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
