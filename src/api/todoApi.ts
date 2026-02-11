import axios from 'axios';

const API_URL = 'import.meta.env.VITE_API_URL';

export type Priority = 'Urgente' | 'Moyenne' | 'Basse';

export interface Todo {
  _id: string;
  text: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export const fetchTodos = async (): Promise<Todo[]> => {
  const response = await axios.get(`${API_URL}/api/todos`);
  return response.data;
};

export const createTodo = async (text: string, priority: Priority): Promise<Todo> => {
  const response = await axios.post(`${API_URL}/api/todos`, { text, priority });
  return response.data;
};

export const updateTodo = async (
  id: string,
  text: string,
  priority: Priority
): Promise<Todo> => {
  const response = await axios.put(`${API_URL}/api/todos/${id}`, { text, priority });
  return response.data;
};

export const toggleTodoComplete = async (id: string): Promise<Todo> => {
  const response = await axios.patch(`${API_URL}/api/todos/${id}/toggle`);
  return response.data;
};

export const deleteTodo = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/api/todos/${id}`);
};