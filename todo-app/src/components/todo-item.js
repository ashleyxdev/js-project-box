export default 
function createTodoItem(todo) {
  const li = document.createElement("li");
  li.dataset.todoId = todo.id;
  li.dataset.todoTitle = todo.title
  li.dataset.todoPriority = todo.priority;
  li.dataset.todoAction = "edit";

  const priorityBar = document.createElement("span");
  priorityBar.className = `priority__bar priority__bar--${todo.priority}`;

  const checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.name = "todo-toggle";
  checkBox.dataset.todoAction = "toggle";

  const title = document.createElement("p");
  title.textContent = todo.title;
  title.className = "no__select";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "✕";
  deleteBtn.dataset.todoAction = "delete";

  if (todo.completed) checkBox.checked = true;

  li.append(priorityBar, checkBox, title, deleteBtn);
  return li;
}
