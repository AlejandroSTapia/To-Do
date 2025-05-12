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
        <h5 className={`card-title ${note.Completed ? 'text-decoration-line-through' : ''}`}>
          {note.Title}
        </h5>
        <p className="card-text">{note.Description}</p>
        <button className="btn btn-sm btn-success me-2" onClick={() => onToggle(note.IdNote)}>
          {note.Completed ? "Marcar incompleta" : "Marcar completa"}
        </button>
        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(note)}>
          Editar
        </button>
        <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(note.IdNote)}>
          Eliminar
        </button>
      </div>
    </div>
  )
}
