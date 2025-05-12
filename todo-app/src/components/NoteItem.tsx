import type { Note } from "../types/note"

interface Props {
  note: Note
  onDelete: (id: number) => void
  onEdit: (note: Note) => void
  onToggle: (id: number) => void
}

export const NoteItem = ({ note, onDelete, onEdit, onToggle }: Props) => {
  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5 className={`card-title ${note.completed ? 'text-decoration-line-through' : ''}`}>
          {note.title}
        </h5>
        <p className="card-text">{note.description}</p>
        <button className="btn btn-sm btn-success me-2" onClick={() => onToggle(note.id)}>
          {note.completed ? "Marcar incompleta" : "Marcar completa"}
        </button>
        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(note)}>
          Editar
        </button>
        <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(note.id)}>
          Eliminar
        </button>
      </div>
    </div>
  )
}
