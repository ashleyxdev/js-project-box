const STORAGE_KEY = "todostore";

const PRIORITY = Object.freeze({
  high: "high",
  medium: "medium",
  low: "low",
});

const PRIORITY_ORDER = Object.freeze({
  [PRIORITY.high]: 1,
  [PRIORITY.medium]: 2,
  [PRIORITY.low]: 3,
});

export default class TodoModel {
  constructor() {
    this.todos = this._read();
  }

  _save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.todos));
  }

  _read() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  addTodo(title, priority) {
    title = title.trim();
    priority = PRIORITY[priority] || PRIORITY.medium;
    if (!title) return;

    this.todos.push({
      id: Date.now(),
      title,
      priority,
      completed: false,
    });
    this._save();
  }

  deleteTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this._save();
  }

  toggleTodo(id) {
    this.todos = this.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    );
    this._save();
  }

  editTodo(id, { title, priority }) {
    title = title.trim();
    priority = PRIORITY[priority] || PRIORITY.medium;
    if (!title) return;

    this.todos = this.todos.map((todo) =>
      todo.id === id ? { ...todo, title, priority } : todo,
    );
    this._save();
  }

  // does not mutate localstorage

  sortTodos() {
    this.todos = this.todos.sort(
      (todoA, todoB) =>
        PRIORITY_ORDER[todoA.priority] - PRIORITY_ORDER[todoB.priority],
    );
  }

  // getters

  getTodos() {
    return this.todos;
  }

  getActiveTodos() {
    return this.todos.filter((todo) => !todo.completed);
  }

  getCompletedTodos() {
    return this.todos.filter((todo) => todo.completed);
  }

  getHighPriorityTodos() {
    return this.todos.filter((todo) => todo.priority === PRIORITY.high);
  }

  getMediumPriorityTodos() {
    return this.todos.filter((todo) => todo.priority === PRIORITY.medium);
  }

  getLowPriorityTodos() {
    return this.todos.filter((todo) => todo.priority === PRIORITY.low);
  }

  hasTodos() {
    return this.todos.length > 0;
  }
}
