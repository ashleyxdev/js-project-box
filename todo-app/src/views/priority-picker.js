export default 
function handlePrioritySelect({
  event,
  picker,
  input,
  currentPriority,
}) {
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
