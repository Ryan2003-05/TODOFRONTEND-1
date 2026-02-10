import { useEffect, useState } from "react";
import TodoItem from "./TodoItem";
import { Construction } from "lucide-react";
import * as api from "./api/todoApi";

type Priority = "Urgente" | "Moyenne" | "Basse";

type Todo = {
  _id: string;
  text: string;
  priority: Priority;
  completed: boolean;
};

function App() {
  const [input, setInput] = useState("");
  const [priority, setPriority] = useState<Priority>("Moyenne");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Priority | "Tous" | "Terminées">("Tous");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadTodos();
  }, []);

  async function loadTodos() {
    try {
      setLoading(true);
      const data = await api.fetchTodos();
      setTodos(data);
    } catch (error) {
      console.error("Erreur lors du chargement:", error);
      alert(" Erreur de connexion au serveur. Vérifiez que le backend est démarré.");
    } finally {
      setLoading(false);
    }
  }

  async function addTodo() {
    if (input.trim() === "") return;

    try {
      const newTodo = await api.createTodo(input.trim(), priority);
      setTodos([newTodo, ...todos]);
      setInput("");
      setPriority("Moyenne");
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
      alert(" Erreur lors de l'ajout");
    }
  }

  async function deleteTodo(id: string) {
    try {
      await api.deleteTodo(id);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      alert(" Erreur lors de la suppression");
    }
  }

  async function toggleComplete(id: string) {
    try {
      const updatedTodo = await api.toggleTodoComplete(id);
      setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
    } catch (error) {
      console.error("Erreur lors du toggle:", error);
    }
  }

  async function editTodo(id: string, newText: string, newPriority: Priority) {
    try {
      const updatedTodo = await api.updateTodo(id, newText, newPriority);
      setTodos(todos.map((todo) => (todo._id === id ? updatedTodo : todo)));
    } catch (error) {
      console.error("Erreur lors de la modification:", error);
    }
  }

  let filteredTodos: Todo[] = [];

  if (filter === "Tous") {
    filteredTodos = todos;
  } else if (filter === "Terminées") {
    filteredTodos = todos.filter((todo) => todo.completed);
  } else {
    filteredTodos = todos.filter(
      (todo) => todo.priority === filter && !todo.completed
    );
  }

  const urgentCount = todos.filter((t) => t.priority === "Urgente" && !t.completed).length;
  const mediumCount = todos.filter((t) => t.priority === "Moyenne" && !t.completed).length;
  const lowCount = todos.filter((t) => t.priority === "Basse" && !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-2/3 flex flex-col gap-4 my-15 bg-base-300 p-5 rounded-2xl">
        <h1 className="text-3xl font-bold text-center">Ma Todo Liste 📝</h1>
        
        <div className="flex gap-4">
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

          <button onClick={addTodo} className="btn btn-primary">
            Ajouter
          </button>
        </div>

        <div className="space-y-2 flex-1 h-fit">
          <div className="flex flex-wrap gap-4">
            <button
              className={`btn btn-soft ${filter === "Tous" ? "btn-primary" : ""}`}
              onClick={() => setFilter("Tous")}
            >
              Tous ({totalCount})
            </button>

            <button
              className={`btn btn-soft ${filter === "Urgente" ? "btn-error" : ""}`}
              onClick={() => setFilter("Urgente")}
            >
              Urgentes ({urgentCount})
            </button>

            <button
              className={`btn btn-soft ${filter === "Moyenne" ? "btn-warning" : ""}`}
              onClick={() => setFilter("Moyenne")}
            >
              Moyennes ({mediumCount})
            </button>

            <button
              className={`btn btn-soft ${filter === "Basse" ? "btn-success" : ""}`}
              onClick={() => setFilter("Basse")}
            >
              Basses ({lowCount})
            </button>

            <button
              className={`btn btn-soft ${filter === "Terminées" ? "btn-primary" : ""}`}
              onClick={() => setFilter("Terminées")}
            >
              Terminées ({completedCount})
            </button>
          </div>

          {filteredTodos.length > 0 ? (
            <ul className="divide-y divide-primary/20">
              {filteredTodos.map((todo) => (
                <li key={todo._id}>
                  <TodoItem
                    todo={todo}
                    onDelete={() => deleteTodo(todo._id)}
                    onToggleComplete={() => toggleComplete(todo._id)}
                    onEdit={(newText, newPriority) =>
                      editTodo(todo._id, newText, newPriority)
                    }
                  />
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex justify-center items-center flex-col p-5">
              <div>
                <Construction strokeWidth={1} className="w-40 h-40 text-primary" />
              </div>
              <p className="text-sm">Aucune tâche pour ce filtre</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;