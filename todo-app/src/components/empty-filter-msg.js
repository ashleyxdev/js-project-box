export default 
function createEmptyFilterMsg(msg) {
  const li = document.createElement("li");
  li.className = "empty__filter__state";
  li.textContent = msg;
  return li;
}
