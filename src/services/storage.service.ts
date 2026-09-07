import type{ Task } from '../models/task.model';

// Definimos la llave que usaremos siempre en localStorage
const STORAGE_KEY = 'sistema_tareas_data';

// Función para guardar todo el arreglo de tareas
export const saveTasks = (tasks: Task[]): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

// Función para leer las tareas. Si no hay nada, devuelve un arreglo vacío []
export const getTasks = (): Task[] => {
  const storedTasks = localStorage.getItem(STORAGE_KEY);
  return storedTasks ? JSON.parse(storedTasks) : [];
};