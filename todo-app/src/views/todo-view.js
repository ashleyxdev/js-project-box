import createTodoItem from "../components/todo-item.js";
import createEmptyFilterMsg from "../components/empty-filter-msg.js";
import createTodoEditForm from "../components/todo-edit-form.js";

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
    this.todoCount = this.todoHeader.querySelector("[data-todo-action='count']",);
    this.todoFilter = this.todoHeader.querySelector("[data-todo-action='filter']",);
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
    // input field state of add todo form
    this.currentTitleInput = "";

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
    document.addEventListener("selectstart", (e) => {
      e.preventDefault();
    });

    this.todoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      this.currentTitleInput = this.titleInput.value.trim();
      this.onAddTodo();
    });

    this.priorityPicker.addEventListener("click", (e) => {
      this.currentPriority = this._handlePrioritySelect(e);
    });

    // Prevent mousedown on picker to maintain input focus
    this.priorityPicker.addEventListener("mousedown", (e) => {
      e.preventDefault();
    });

    this.todoFilter.addEventListener("change", (e) => {
      this.currentFilter = this.todoFilter.value;
      this.onFilterChange();
    });

    this.todoSort.addEventListener("click", (e) => {
      this.onSortTodos();
    });

    this.todoList.addEventListener("click", (e) => {
      this._handleTodoListClick(e);
    });

    this.todoList.addEventListener("dblclick", (e) => {
      const context = this._getEditContext(e);
      if (!context) return;
      this._enterEditMode({ ...context });
    });

    this.completedToggle.addEventListener("click", (e) => {
      this.isCompletedCollapsed = !this.isCompletedCollapsed;
      this.isCompletedCollapsed
        ? this.completedSection.classList.add("collapsed")
        : this.completedSection.classList.remove("collapsed");
    });
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
    const title = this.currentTitleInput;
    const priority = this.currentPriority;
    const filter = this.currentFilter;
    return { title, priority, filter };
  }

  resetState() {
    this.titleInput.value = "";
    this.currentPriority = "medium";
    this.currentFilter = "all";

    this.priorityPicker
      .querySelectorAll("button")
      .forEach((btn) =>
        btn.dataset.priority === this.currentPriority
          ? btn.classList.add("priority__dot--selected")
          : btn.classList.remove("priority__dot--selected"),
      );
    this.todoFilter.value = this.currentFilter;
  }

  render(todos, hasTodos, count) {
    this._renderEmptyState(hasTodos);
    if (!hasTodos) return;
    this._renderCount(count);
    this._renderLists(todos);
  }

  // RENDER HELPERS

  _renderEmptyState(hasTodos) {
    this.emptyState.style.display = hasTodos ? "none" : "flex";
    this.todoHeader.style.display = hasTodos ? "flex" : "none";
    this.todoList.style.display = hasTodos ? "block" : "none";
  }

  _renderCount(count) {
    const html = `
      <strong class="todo__count__number">${count}</strong>
      ${count === 1 ? "Item" : "Items"} left
      `;
    this.todoCount.replaceChildren();
    this.todoCount.insertAdjacentHTML("afterbegin", html);
  }

  _renderLists(todos) {
    this.activeList.replaceChildren();
    this.completedList.replaceChildren();

    const activeTodos = todos
      .filter((todo) => !todo.completed)
      .map((todo) => createTodoItem(todo));

    const completedTodos = todos
      .filter((todo) => todo.completed)
      .map((todo) => createTodoItem(todo));

    activeTodos.length
      ? this.activeList.append(...activeTodos)
      : this.activeList.append(createEmptyFilterMsg("No tasks"));

    completedTodos.length
      ? this.completedList.append(...completedTodos)
      : this.completedList.append(createEmptyFilterMsg("No tasks"));
  }

  // EVENT HANDLERS

  _handlePrioritySelect(
    event,
    picker = this.priorityPicker,
    input = this.titleInput,
    currentPriority = this.currentPriority,
  ) {
    event.preventDefault();

    const el = event.target.closest("[data-priority]");
    if (!el) return currentPriority;

    picker
      .querySelectorAll("button")
      .forEach((btn) => btn.classList.remove("priority__dot--selected"));

    el.classList.add("priority__dot--selected");

    input.focus(); // *

    return el.dataset.priority;
  }

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

  // EDIT EVENT HELPERS

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

  _enterEditMode({ id, title, priority, actionEl }) {
    let currentPriority = priority;

    const { form, input, picker } = createTodoEditForm(title, priority);

    actionEl.replaceWith(form);
    input.focus(); // *
    input.select(); // *

    // Track if we're clicking on the picker to prevent blur
    let isClickingPicker = false;

    // Track if edit form submited to avoid submit + blur double-call
    let isSubmitted = false;

    // for similar reason as above escape + blur double-call
    let isCancelled = false;

    // Prevent mousedown on picker to maintain input focus
    picker.addEventListener("mousedown", (e) => {
      e.preventDefault();
      isClickingPicker = true;
    });

    picker.addEventListener("click", (e) => {
      isClickingPicker = false;
      const newPriority = this._handlePrioritySelect(
        e,
        picker,
        input,
        currentPriority,
      );

      if (newPriority) currentPriority = newPriority;
    });

    input.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        isCancelled = true;
        form.replaceWith(actionEl);
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      isSubmitted = true;

      this.onEditTodo(id, {
        title: input.value,
        priority: currentPriority,
      });

      form.replaceWith(actionEl);
    });

    input.addEventListener("blur", () => {
      // Don't close edit mode if clicking on priority picker
      // Don't trigger blur if submited with enter or cancelled with esc
      if (isClickingPicker || isSubmitted || isCancelled) return;

      this.onEditTodo(id, {
        title: input.value,
        priority: currentPriority,
      });

      form.replaceWith(actionEl);
    }); // *
  }
}
