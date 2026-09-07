// Definimos los únicos valores permitidos para la prioridad
export type Priority = 'baja' | 'media' | 'alta';

// Estructura exacta que tendrá cada tarea
export interface Task {
  id: string;          // Usaremos un string (como un UUID o Date.now) para identificarla
  title: string;
  description: string;
  category: string;
  priority: Priority;  // Usamos el tipo que creamos arriba
  completed: boolean;  // true si está terminada, false si está pendiente
  createdAt: number;   // Guardaremos la fecha en milisegundos (timestamp)
}