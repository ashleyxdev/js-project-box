import createTodoItem from "../components/todo-item.js";
import createEmptyFilterMsg from "../components/empty-filter-msg.js";
import enterEditMode from "./edit-mode.js";
import handlePrioritySelect from "./priority-picker.js";

export default class TodoView {
  constructor() {
    this._initElements();
    this._initState();
    this._initHandlers();
    this._bindEvents();
  }

  // INITIALIZATION

  _initElements() {
    // app container
    this.todoApp = document.getElementById("todo__app");

    // form and form fields
    this.todoForm = document.getElementById("todo__form");
    this.titleInput = document.getElementById("todo__input__title");
    this.priorityPicker = document.getElementById("todo__priority__picker");

    // header container
    this.todoHeader = document.getElementById("todo__header");
    this.todoCount = this.todoHeader.querySelector("[data-todo-action='count']");
    this.todoFilter = this.todoHeader.querySelector("[data-todo-action='filter']");
    this.todoSort = this.todoHeader.querySelector("[data-todo-action='sort']");

    // list container
    this.todoList = document.getElementById("todo__list");
    this.activeList = document.getElementById("active__list");
    this.completedList = document.getElementById("completed__list");
    this.completedSection = document.getElementById("todo__completed__section");
    this.completedToggle = document.getElementById("todo__completed__toggle");

    // empty state container
    this.emptyState = document.getElementById("todo__empty__state");
  }

  _initState() {
    // priority state of add todo form
    this.currentPriority = "medium";

    // filter state
    this.currentFilter = "all";

    // collaspsed state of completed section
    this.isCompletedCollapsed = false;
  }

  _initHandlers() {
    this.onAddTodo = () => {};
    this.onDeleteTodo = () => {};
    this.onToggleTodo = () => {};
    this.onEditTodo = () => {};
    this.onFilterChange = () => {};
    this.onSortTodos = () => {};
  }

  _bindEvents() {
    document.addEventListener("selectstart", (e) => e.preventDefault());
    this.todoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.onAddTodo();
    });
    this.todoList.addEventListener("click", this._handleTodoListClick);
    this.todoList.addEventListener("dblclick", this._handleTodoListDblClick);
    this.todoFilter.addEventListener("change", this._handleFilter);
    this.todoSort.addEventListener("click", (e) => {
      this.onSortTodos();
    });
    this.priorityPicker.addEventListener(
      "click",
      this._handlePrioritySelectClick,
    );
    // Prevent mousedown on priority picker buttons to maintain input focus
    this.priorityPicker.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });
    this.completedToggle.addEventListener("click", this._handleCompletedToggle);
  }

  // PUBLIC API

  bindAdd(handler) {
    this.onAddTodo = handler;
  }

  bindToggle(handler) {
    this.onToggleTodo = handler;
  }

  bindDelete(handler) {
    this.onDeleteTodo = handler;
  }

  bindEdit(handler) {
    this.onEditTodo = handler;
  }

  bindFilter(handler) {
    this.onFilterChange = handler;
  }

  bindSort(handler) {
    this.onSortTodos = handler;
  }

  getState() {
    const title = this.titleInput.value.trim();
    const priority = this.currentPriority;
    const filter = this.currentFilter;
    return { title, priority, filter};
  }

  resetState() {
    this.titleInput.value = "";

    this.currentPriority = "medium";
    this.priorityPicker
      .querySelectorAll("button")
      .forEach((btn) =>
        btn.dataset.priority === "medium"
          ? btn.classList.add("priority__dot--selected")
          : btn.classList.remove("priority__dot--selected"),
      );

    this.currentFilter = "all";
    this.todoFilter.value = "all";
  }

  render(todos, count) {
    const hasTodos = todos.length > 0;

    this._renderCount(count);
    this._renderEmptyState(hasTodos);
    if (!hasTodos) return;
    this._renderLists(todos);
  }

  // RENDER HELPERS

  _renderLists(todos) {
    this.completedList.replaceChildren();
    this.activeList.replaceChildren();

    const activeTodos = todos
      .filter((todo) => !todo.completed)
      .map((todo) => createTodoItem(todo));

    const completedTodos = todos
      .filter((todo) => todo.completed)
      .map((todo) => createTodoItem(todo));

    activeTodos.length
      ? this.activeList.append(...activeTodos)
      : this.activeList.append(createEmptyFilterMsg("No tasks here"));

    completedTodos.length
      ? this.completedList.append(...completedTodos)
      : this.completedList.append(createEmptyFilterMsg("No tasks here"));
  }

  _renderEmptyState(hasTodos) {
    this.emptyState.style.display = hasTodos ? "none" : "flex";
    this.todoHeader.style.display = hasTodos ? "flex" : "none";
    this.completedSection.style.display = hasTodos ? "block" : "none";
  }

  _renderCount(count) {
    const html = `
      <strong class="todo__count__number">${count}</strong>
      ${count === 1 ? "Task" : "Tasks"} left
      `;
    this.todoCount.replaceChildren();
    this.todoCount.insertAdjacentHTML("afterbegin", html);
  }

  // EVENT HANDLERS

  _handlePrioritySelectClick = (e) => {
    this.currentPriority = handlePrioritySelect({
      event: e,
      picker: this.priorityPicker,
      input: this.titleInput,
      currentPriority: this.currentPriority,
  });
  };

  _handleFilter = (e) => {
    this.currentFilter = this.todoFilter.value;
    this.onFilterChange();
  };

  _handleTodoListClick = (e) => {
    const actionEl = e.target.closest("[data-todo-action]");
    if (!actionEl) return;

    const action = actionEl.dataset.todoAction;
    const li = actionEl.closest("li");
    if (!li) return;

    const id = Number(li.dataset.todoId);

    if (action === "toggle") this.onToggleTodo(id);
    else if (action === "delete") this.onDeleteTodo(id);
  };

  _handleTodoListDblClick = (e) => {
    const context = this._getEditContext(e);
    if (!context) return;
    enterEditMode({
      ...context,
      onEditTodo: this.onEditTodo,
    });
  };

  _getEditContext(e) {
    if (this.todoList.querySelector("form")) return null; // *

    const actionEl = e.target.closest("[data-todo-action='edit']");
    if (!actionEl) return null;

    return {
      id: Number(actionEl.dataset.todoId),
      title: actionEl.dataset.todoTitle,
      priority: actionEl.dataset.todoPriority,
      actionEl,
    };
  }

  _handleCompletedToggle = (e) => {
    this.isCompletedCollapsed = !this.isCompletedCollapsed;

    this.isCompletedCollapsed
      ? this.completedSection.classList.add("collapsed")
      : this.completedSection.classList.remove("collapsed");
  };
}