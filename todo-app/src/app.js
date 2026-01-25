import "./styles/styles.css";
import "./styles/mascot.css";

import TodoModel from "./models/todo-model.js";
import TodoView from "./views/todo-view.js";
import TodoController from "./controllers/todo-controller.js";
import initTheme from "./features/theme-toggle.js";

new TodoController(new TodoModel(), new TodoView());
initTheme();
