import axios from 'axios';
import type { Note } from '../types/note';

const API_URL = 'http://localhost:3000/notes';

export const getNotes = async (): Promise<Note[]> => {
  const response = await axios.get<Note[]>(API_URL);
    console.log("Notas desde API:", response.data);
  return response.data;
};

export const createNote = async (note: Note): Promise<void> => {
  await axios.post(API_URL, note);
};

export const updateNote = async (id: number, note: Note): Promise<void> => {
  await axios.put(`${API_URL}/${id}`, note);
};

export const deleteNote = async (id: number): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
