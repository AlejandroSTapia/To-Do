import { useEffect, useState } from "react";
import { getNotes } from "../api/notesApi";
import type { Note } from "../types/note";

export function NotesList() {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    getNotes().then(setNotes);
  }, []);

  return (
    <div>
      <h2>Todas las notas</h2>
      <ul>
        {notes.map((note) => (
          <li key={note.IdNote}>
            <h4>{note.Title}</h4>
            <p>{note.Description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}