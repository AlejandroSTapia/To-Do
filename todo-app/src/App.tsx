import { useState } from "react"
import type { Note } from "./types/note"
import { NoteForm } from "./components/NoteForm"
import { NoteItem } from "./components/NoteItem"

function App() {
  const [notes, setNotes] = useState<Note[]>([])
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined)

  const saveNote = (note: Note) => {
    setNotes((prev) =>
      prev.some(n => n.id === note.id)
        ? prev.map(n => n.id === note.id ? note : n)
        : [...prev, note]
    )
    setEditingNote(undefined)
  }

  const deleteNote = (id: number) => {
    setNotes(notes.filter(n => n.id !== id))
  }

  const toggleCompleted = (id: number) => {
    setNotes(notes.map(n =>
      n.id === id ? { ...n, completed: !n.completed, updated_at: new Date() } : n
    ))
  }

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">🗒️ Mis Notas</h2>
      <NoteForm onSave={saveNote} editingNote={editingNote} />
      {notes.length === 0 ? (
        <p className="text-center text-muted">No hay notas todavía.</p>
      ) : (
        notes.map(note => (
          <NoteItem
            key={note.id}
            note={note}
            onDelete={deleteNote}
            onEdit={setEditingNote}
            onToggle={toggleCompleted}
          />
        ))
      )}
    </div>
  )
}

export default App
