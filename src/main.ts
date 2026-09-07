import './style.css';
import type { Task, Priority } from './models/task.model';
import { saveTasks, getTasks } from './services/storage.service';

// 1. Cargar las tareas guardadas al iniciar
let tasks: Task[] = getTasks();

// 2. Referencias a los elementos del DOM
const taskForm = document.getElementById('task-form') as HTMLFormElement;
const taskList = document.getElementById('task-list') as HTMLUListElement;
const filterStatus = document.getElementById('filter-status') as HTMLSelectElement;
const filterPriority = document.getElementById('filter-priority') as HTMLSelectElement;
const searchInput = document.getElementById('search-input') as HTMLInputElement;

// 3. Función principal para dibujar las tareas en pantalla
const renderTasks = () => {
  taskList.innerHTML = ''; // Limpiar la lista antes de volver a dibujar

  const statusValue = filterStatus.value;
  const priorityValue = filterPriority.value;
  const searchValue = searchInput.value.toLowerCase();

  // Aplicar todos los filtros
  const filteredTasks = tasks.filter(task => {
    const matchStatus = statusValue === 'all' 
      || (statusValue === 'completed' && task.completed) 
      || (statusValue === 'pending' && !task.completed);
    
    const matchPriority = priorityValue === 'all' || task.priority === priorityValue;
    const matchSearch = task.title.toLowerCase().includes(searchValue);

    return matchStatus && matchPriority && matchSearch;
  });

  // Generar el HTML de cada tarea
  filteredTasks.forEach(task => {
    const li = document.createElement('li');
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    
    li.innerHTML = `
      <div class="task-details">
        <h3 class="task-title">${task.title}</h3>
        <p>${task.description}</p>
        <small><strong>Categoría:</strong> ${task.category} | <strong>Prioridad:</strong> <span style="text-transform: capitalize;">${task.priority}</span></small>
      </div>
      <div class="task-actions">
        <input type="checkbox" ${task.completed ? 'checked' : ''} data-id="${task.id}" class="toggle-btn" />
        <button class="delete-btn" data-id="${task.id}">Eliminar</button>
      </div>
    `;
    taskList.appendChild(li);
  });
};

// 4. Lógica para guardar una nueva tarea
const addTask = (e: Event) => {
  e.preventDefault();

  const title = (document.getElementById('task-title') as HTMLInputElement).value;
  const description = (document.getElementById('task-desc') as HTMLTextAreaElement).value;
  const category = (document.getElementById('task-category') as HTMLInputElement).value;
  const priority = (document.getElementById('task-priority') as HTMLSelectElement).value as Priority;

  const newTask: Task = {
    id: Date.now().toString(),
    title,
    description,
    category,
    priority,
    completed: false,
    createdAt: Date.now()
  };

  tasks.push(newTask);
  saveTasks(tasks); // Guardar en localStorage
  renderTasks();    // Actualizar la pantalla
  taskForm.reset(); // Limpiar el formulario
};

// 5. Detectar clics en la lista (para eliminar o marcar como completada)
taskList.addEventListener('click', (e) => {
  const target = e.target as HTMLElement;
  
  // Marcar/Desmarcar completada
  if (target.classList.contains('toggle-btn')) {
    const id = target.getAttribute('data-id');
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      saveTasks(tasks);
      renderTasks();
    }
  }

  // Eliminar tarea
  if (target.classList.contains('delete-btn')) {
    const id = target.getAttribute('data-id');
    if (confirm('¿Estás seguro de eliminar esta tarea?')) {
      tasks = tasks.filter(t => t.id !== id); // Filtrar todas menos la que borramos
      saveTasks(tasks);
      renderTasks();
    }
  }
});

// 6. Asignar los eventos a los inputs y al formulario
taskForm.addEventListener('submit', addTask);
filterStatus.addEventListener('change', renderTasks);
filterPriority.addEventListener('change', renderTasks);
searchInput.addEventListener('input', renderTasks);

// 7. Dibujar las tareas por primera vez al cargar la página
renderTasks();