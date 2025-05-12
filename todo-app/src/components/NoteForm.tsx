import { useEffect, useState } from "react";
import type { Note } from "../types/note";

type Props = {
  onSave: (note: Note) => void;
  editingNote?: Note;
};

export function NoteForm({ onSave, editingNote }: Props) {
  const [note, setNote] = useState<Note>({
    IdNote: 0,
    Title: "",
    Description: "",
    Completed: false,
    CreationDate: new Date(),
    updated_at: new Date(),
  });

  useEffect(() => {
    if (editingNote) {
      setNote(editingNote);
    }
  }, [editingNote]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({
      ...note,
      updated_at: new Date(),
    });
    //limpiar
    setNote({
    IdNote: 0,
    Title: "",
    Description: "",
    Completed: false,
    CreationDate: new Date(),
    updated_at: new Date(),
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Título"
        value={note.Title ?? ""}
        onChange={(e) => setNote({ ...note, Title: e.target.value })}
        className="form-control mb-2"
      />
      <textarea
        placeholder="Descripción"
        value={note.Description ?? ""}
        onChange={(e) => setNote({ ...note, Description: e.target.value })}
        className="form-control mb-2"
      />
      <button type="submit" className="btn btn-primary">
        {editingNote ? "Actualizar" : "Guardar"}
      </button>
    </form>
  );
}
