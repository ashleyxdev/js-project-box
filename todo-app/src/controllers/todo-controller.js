import react from "../features/mascot-react.js";

export default class TodoController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindAdd(this.handleAddTodo);
    this.view.bindDelete(this.handleDeleteTodo);
    this.view.bindToggle(this.handleToggleTodo);
    this.view.bindEdit(this.handleEditTodo);
    this.view.bindFilter(this.handleFilterTodo);
    this.view.bindSort(this.handleSortTodos);

    this._renderApp();
  }

  _renderApp() {
    const hasTodos = this.model.hasTodos();
    const count = this.model.getActiveTodos().length;
    const { filter } = this.view.getState();

    switch (filter) {
      case "high":
        this.view.render(this.model.getHighPriorityTodos(), hasTodos, count);
        break;
      case "medium":
        this.view.render(this.model.getMediumPriorityTodos(), hasTodos, count);
        break;
      case "low":
        this.view.render(this.model.getLowPriorityTodos(), hasTodos, count);
        break;
      default:
        this.view.render(this.model.getTodos(), hasTodos, count);
        break;
    }
  }

  handleAddTodo = () => {
    const { title, priority } = this.view.getState();
    this.model.addTodo(title, priority);
    this.view.resetState();
    this._renderApp();
    react("happy");
  };

  handleDeleteTodo = (id) => {
    this.model.deleteTodo(id);
    this._renderApp();
  };

  handleToggleTodo = (id) => {
    this.model.toggleTodo(id);
    this._renderApp();
    react("celebrate");
  };

  handleEditTodo = (id, data) => {
    this.model.editTodo(id, data);
    this._renderApp();
  };

  handleFilterTodo = () => {
    this._renderApp();
  };

  handleSortTodos = () => {
    this.model.sortTodos();
    this._renderApp();
  };
}
