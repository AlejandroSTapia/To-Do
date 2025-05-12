import { useEffect, useState } from "react";
import type { Task } from "../types/task";

type Props = {
  onSave: (Task: Task) => void;
  editingTask?: Task;
};

export function TaskForm({ onSave, editingTask }: Props) {
  const [Task, setTask] = useState<Task>({
    IdTask: 0,
    Title: "",
    Description: "",
    Completed: false,
    CreationDate: new Date(),
    updated_at: new Date(),
  });

  useEffect(() => {
    if (editingTask) {
      setTask(editingTask);
    }
  }, [editingTask]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSave({
      ...Task,
      updated_at: new Date(),
    });
    //limpiar
    setTask({
    IdTask: 0,
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
        value={Task.Title ?? ""}
        onChange={(e) => setTask({ ...Task, Title: e.target.value })}
        className="form-control mb-2"
      />
      <textarea
        placeholder="Descripción"
        value={Task.Description ?? ""}
        onChange={(e) => setTask({ ...Task, Description: e.target.value })}
        className="form-control mb-2"
      />
      <button type="submit" className="btn btn-primary">
        {editingTask ? "Actualizar" : "Guardar"}
      </button>
    </form>
  );
}
