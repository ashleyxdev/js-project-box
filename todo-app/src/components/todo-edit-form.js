export default function createTodoEditForm(title, priority) {
  const form = document.createElement("form");
  form.className = "todo__edit__wrapper";

  const input = document.createElement("input");
  input.value = title;
  input.className = "todo__input todo__input--edit";

  const picker = document.createElement("div");
  picker.className = "todo__priority__picker priority__picker";

  ["high", "medium", "low"].forEach((p) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.dataset.priority = p;
    btn.className = `priority__dot priority__dot--${p}`;

    if (p === priority) btn.classList.add("priority__dot--selected");

    picker.append(btn);
  });

  form.append(input, picker);

  return { form, input, picker };
}
