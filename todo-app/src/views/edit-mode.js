import createTodoEditForm from "../components/todo-edit-form.js";
import handlePrioritySelect from "./priority-picker.js";

export default 
function enterEditMode({
  id,
  title,
  priority,
  actionEl,
  onEditTodo,
}) {
  let currentPriority = priority;

  const { wrapper, input, picker } = createTodoEditForm(title, priority);

  actionEl.replaceWith(wrapper);
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
    const newPriority = handlePrioritySelect({
      event: e,
      picker,
      input,
      currentPriority,
    });

    if (newPriority) currentPriority = newPriority;
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      isCancelled = true;
      wrapper.replaceWith(actionEl);
    }
  });

  wrapper.addEventListener("submit", (e) => {
    e.preventDefault();
    isSubmitted = true;

    onEditTodo(id, {
      title: input.value,
      priority: currentPriority,
    });

    wrapper.replaceWith(actionEl);
  });

  input.addEventListener("blur", () => {
    // Don't close edit mode if clicking on priority picker
    // Don't trigger blur if submited with enter or cancelled with esc
    if (isClickingPicker || isSubmitted || isCancelled) return;

    onEditTodo(id, {
      title: input.value,
      priority: currentPriority,
    });

    wrapper.replaceWith(actionEl);
  }); // *
}
