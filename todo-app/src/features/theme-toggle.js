export default 
function initTheme() {
  const toggleBtn = document.getElementById("theme__toggle");
  const toggleBtnImg = toggleBtn.querySelector("img");
  const savedTheme = localStorage.getItem("theme");

  const darkModeIcon = "/icons/dark-mode-icon.svg";
  const lightModeIcon = "/icons/light-mode-icon.svg";

  if (savedTheme === "dark") {
    document.body.classList.add("dark");
    toggleBtnImg.src = lightModeIcon;
  }

  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const isDark = document.body.classList.contains("dark");
    localStorage.setItem("theme", isDark ? "dark" : "light");

    toggleBtnImg.src = isDark ? lightModeIcon : darkModeIcon;
  });
}
