import type { Task } from "../types/task"

interface Props {
  Task: Task
  onDelete: (id: number) => void
  onEdit: (Task: Task) => void
  onToggle: (id: number) => void
}

export const TaskItem = ({ Task, onDelete, onEdit, onToggle }: Props) => {
  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <h5 className={`card-title ${Task.Completed ? 'text-decoration-line-through' : ''}`}>
          {Task.Title}
        </h5>
        <p className="card-text">{Task.Description}</p>
                 <p className="card-text">
           {Task.CreationDate ? new Date(Task.CreationDate).toLocaleDateString() : ""}
         </p>
        <button className="btn btn-sm btn-success me-2" onClick={() => onToggle(Task.IdTask)}>
          {Task.Completed ? "Marcar incompleta" : "Marcar completa"}
        </button>
        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => onEdit(Task)}>
          Editar
        </button>
        <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(Task.IdTask)}>
          Eliminar
        </button>

      </div>
    </div>
  )
}
