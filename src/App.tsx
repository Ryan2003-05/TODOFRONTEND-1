import { useEffect, useState } from "react"
import TodoItem from "./TodoItem"
import { Construction } from "lucide-react"

type Priority = "Urgente" | "Moyenne" | "Basse"

type Todo = {
  id: number
  text: string
  priority: Priority
}

function App() {
  const [input, setInput] = useState("")
  const [priority, setPriority] = useState<Priority>("Moyenne")
  const [filter, setFilter] = useState<Priority | "Tous">("Tous")
  const [selectedTodos, setSelectedTodos] = useState<Set<number>>(new Set())

  //  Initialisation propre depuis localStorage
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem("todos")
    return saved ? JSON.parse(saved) : []
  })

  //  Sauvegarde locale
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos))
  }, [todos])

  //  Ajouter une tâche
  function addTodo() {
    if (!input.trim()) return

    const newTodo: Todo = {
      id: Date.now(),
      text: input.trim(),
      priority,
    }

    setTodos((prev) => [newTodo, ...prev])
    setInput("")
    setPriority("Moyenne")
  }

  //  Supprimer une tâche
  function deleteTodo(id: number) {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
    setSelectedTodos((prev) => {
      const copy = new Set(prev)
      copy.delete(id)
      return copy
    })
  }

  //  Modifier une tâche (AVEC priorité maintenant !)
  function updateTodo(id: number, newText: string, newPriority: Priority) {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, text: newText, priority: newPriority } : todo
      )
    )
  }

  //  Sélection / désélection
  function toggleSelectTodo(id: number) {
    setSelectedTodos((prev) => {
      const copy = new Set(prev)

      if (copy.has(id)) {
        copy.delete(id)
      } else {
        copy.add(id)
      }

      return copy
    })
  }

  //  Supprimer les tâches sélectionnées
  function finishSelected() {
    setTodos((prev) => prev.filter((todo) => !selectedTodos.has(todo.id)))
    setSelectedTodos(new Set())
  }

  //  Filtrage
  const filteredTodos =
    filter === "Tous"
      ? todos
      : todos.filter((todo) => todo.priority === filter)

  //  Compteurs
  const urgentCount = todos.filter((t) => t.priority === "Urgente").length
  const mediumCount = todos.filter((t) => t.priority === "Moyenne").length
  const lowCount = todos.filter((t) => t.priority === "Basse").length

  return (
    <div className="flex justify-center">
      <div className="w-2/3 flex flex-col gap-4 my-12 bg-base-300 p-5 rounded-2xl">
        
        <h1 className="text-3xl font-bold text-center">Ma Todo Liste 📝</h1>

        {/* ➕ Ajout */}
        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            className="input w-full"
            placeholder="Ajouter une tâche..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
          />

          <select
            className="select w-full"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority)}
          >
            <option value="Urgente">Urgente</option>
            <option value="Moyenne">Moyenne</option>
            <option value="Basse">Basse</option>
          </select>

          <button onClick={addTodo} className="btn btn-primary w-full">
            Ajouter
          </button>
        </div>

        {/*  Filtres */}
        <div className="flex justify-between items-center flex-wrap gap-3">
          <div className="flex gap-2 flex-wrap">
            <button
              className={`btn btn-soft ${filter === "Tous" ? "btn-primary" : ""}`}
              onClick={() => setFilter("Tous")}
            >
              Tous ({todos.length})
            </button>

            <button
              className={`btn btn-soft ${filter === "Urgente" ? "btn-primary" : ""}`}
              onClick={() => setFilter("Urgente")}
            >
              Urgente ({urgentCount})
            </button>

            <button
              className={`btn btn-soft ${filter === "Moyenne" ? "btn-primary" : ""}`}
              onClick={() => setFilter("Moyenne")}
            >
              Moyenne ({mediumCount})
            </button>

            <button
              className={`btn btn-soft ${filter === "Basse" ? "btn-primary" : ""}`}
              onClick={() => setFilter("Basse")}
            >
              Basse ({lowCount})
            </button>
          </div>

          <button
            onClick={finishSelected}
            className="btn btn-primary"
            disabled={selectedTodos.size === 0}
          >
            Finir la sélection ({selectedTodos.size})
          </button>
        </div>

        {/*  Liste */}
        {filteredTodos.length > 0 ? (
          <ul className="divide-y divide-primary/20">
            {filteredTodos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                isSelected={selectedTodos.has(todo.id)}
                onDelete={() => deleteTodo(todo.id)}
                onToggleSelect={toggleSelectTodo}
                onUpdate={updateTodo}
              />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center p-5">
            <Construction className="w-40 h-40 text-primary" />
            <p className="text-sm">Aucune tâche pour ce filtre</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App