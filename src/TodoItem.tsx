import { Trash, Edit, Check, X } from "lucide-react";
import { useState } from "react";

type Priority = "Urgente" | "Moyenne" | "Basse"

type Todo = {
  _id: string;
  text: string;
  priority: Priority;
  completed: boolean; 
}

type Props = {
  todo: Todo
  onDelete: () => void
  onToggleComplete: () => void 
  onEdit: (newText: string, newPriority: Priority) => void
}

const TodoItem = ({ todo, onDelete, onToggleComplete, onEdit }: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const [editPriority, setEditPriority] = useState(todo.priority)

  function handleSaveEdit() {
    if (editText.trim() === "") return
    onEdit(editText.trim(), editPriority)
    setIsEditing(false)
  }

  function handleCancelEdit() {
    setEditText(todo.text)
    setEditPriority(todo.priority)
    setIsEditing(false)
  }

  return (
    <li className="p-3">
      <div className="flex justify-between items-center gap-2">
        <div className="flex items-center gap-2 flex-1">
          <input 
            type="checkbox" 
            className="checkbox checkbox-primary checkbox-sm"
            checked={todo.completed}
            onChange={onToggleComplete}
          />

          {isEditing ? (
            // Mode édition
            <div className="flex gap-2 flex-1">
              <input 
                type="text"
                className="input input-sm flex-1"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                autoFocus
              />
              <select 
                className="select select-sm"
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as Priority)}
              >
                <option value="Urgente">Urgente</option>
                <option value="Moyenne">Moyenne</option>
                <option value="Basse">Basse</option>
              </select>
            </div>
          ) : (
            // Mode lecture
            <>
              <span className={`text-md ${todo.completed ? "line-through opacity-50" : "font-bold"}`}>
                {todo.text}
              </span>

              <span
                className={`badge badge-sm badge-soft
                  ${todo.priority === "Urgente" 
                      ? "badge-error" 
                      : todo.priority === "Moyenne" 
                        ? "badge-warning" 
                        : "badge-success"}`}
              >
                {todo.priority}
              </span>
            </>
          )}
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            // Boutons de sauvegarde/annulation
            <>
              <button
                onClick={handleSaveEdit}
                className="btn btn-sm btn-success btn-soft"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={handleCancelEdit}
                className="btn btn-sm btn-ghost"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          ) : (
            // Boutons normaux
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-sm btn-ghost"
                disabled={todo.completed}
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={onDelete}
                className="btn btn-sm btn-error btn-soft"
              >
                <Trash className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  )
}

export default TodoItem