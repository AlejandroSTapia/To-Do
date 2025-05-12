import { useState, useEffect } from "react"
import type { Note } from "../types/note"

interface Props {
  onSave: (note: Note) => void
  editingNote?: Note
}

export const NoteForm = ({ onSave, editingNote }: Props) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title)
      setDescription(editingNote.description || "")
    }
  }, [editingNote])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return //

    const now = new Date()

    const note: Note = {
      id: editingNote ? editingNote.id : Date.now(),
      title,
      description,
      completed: editingNote ? editingNote.completed : false,
      created_at: editingNote?.created_at || now,
      updated_at: now,
    }

    onSave(note)
    setTitle("")
    setDescription("")
  }

  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        className="form-control mb-2"
        placeholder="Título"
        value={title}
        onChange={(e) => setTitle(e.target.value)}//
      />
      <textarea
        className="form-control mb-2"
        placeholder="Descripción (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button className="btn btn-primary" type="submit">
        {editingNote ? "Actualizar" : "Agregar Nota"}
      </button>
    </form>
  )
}
