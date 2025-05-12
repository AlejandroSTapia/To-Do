import { useEffect, useState } from 'react';
import { getNotes, createNote, updateNote, deleteNote } from './api/notesApi';
import type { Note } from './types/note';
import { NoteForm } from './components/NoteForm';
import { NoteItem } from './components/NoteItem';

function App() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);

  const fetchNotes = async () => {
    const data = await getNotes();
    setNotes(data);
  };

  const handleSave = async (note: Note) => {
    if (note.IdNote === 0) {
      await createNote(note);
    } else {
      await updateNote(note.IdNote, note);
    }
    fetchNotes();
  };

  const handleDelete = async (IdNote: number) => {
    await deleteNote(IdNote);
    fetchNotes();
  };

  const handleToggle = async (IdNote: number) => {
    const note = notes.find((n) => n.IdNote === IdNote);
    if (note) {
      await updateNote(IdNote, { ...note, Completed: !note.Completed });
      fetchNotes();
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

useEffect(() => {
  console.log("Notas cargadas:", notes);
}, [notes]);


  return (
    <div className="container mt-5">
      <h1>Notas</h1>
      <NoteForm onSave={handleSave} editingNote={editingNote} />
      <div className="mt-4">
        {notes.map((note) => (
          <NoteItem
            key={note.IdNote}
            note={note}
            onDelete={handleDelete}
            onEdit={setEditingNote}
            onToggle={handleToggle}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
