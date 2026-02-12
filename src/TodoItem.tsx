import { Trash, Pencil, Check } from "lucide-react"
import { useState } from "react"

type Priority = "Urgente" | "Moyenne" | "Basse"

type Todo = {
  id: number
  text: string
  priority: Priority
}

type Props = {
  todo: Todo
  onDelete: () => void
  isSelected: boolean
  onToggleSelect: (id: number) => void
  onUpdate: (id: number, newText: string) => void
}

const TodoItem = ({
  todo,
  onDelete,
  isSelected,
  onToggleSelect,
  onUpdate,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(todo.text)

  function validateEdit() {
    if (editedText.trim() === "") return
    onUpdate(todo.id, editedText.trim())
    setIsEditing(false)
  }

  return (
    <li className="p-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 w-full">
          <input
            type="checkbox"
            className="checkbox checkbox-primary checkbox-sm"
            checked={isSelected}
            onChange={() => onToggleSelect(todo.id)}
          />

          {/* ✏️ Texte / Édition */}
          {isEditing ? (
            <input
              type="text"
              className="input input-sm w-full"
              value={editedText}
              autoFocus
              onChange={(e) => setEditedText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && validateEdit()}
            />
          ) : (
            <span
              className={`text-md font-bold ${
                isSelected ? "line-through opacity-50" : ""
              }`}
            >
              {todo.text}
            </span>
          )}

          {/* 🏷️ Priorité */}
          <span
            className={`badge badge-sm badge-soft
              ${
                todo.priority === "Urgente"
                  ? "badge-error"
                  : todo.priority === "Moyenne"
                  ? "badge-warning"
                  : "badge-success"
              }`}
          >
            {todo.priority}
          </span>
        </div>

        {/* 🎛️ Actions */}
        <div className="flex gap-2">
          {isEditing ? (
            <button
              onClick={validateEdit}
              className="btn btn-sm btn-success btn-soft"
            >
              <Check className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="btn btn-sm btn-info btn-soft"
            >
              <Pencil className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={onDelete}
            className="btn btn-sm btn-error btn-soft"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </div>
    </li>
  )
}

export default TodoItem
