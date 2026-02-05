import "./style.css";
import ThemeManager from "ash-theme-manager";

// DOM Elements
const toggleThemeBtn = document.getElementById("toggle__theme__btn");
const modeIcon = document.querySelector(".mode-icon");
const modeText = document.querySelector(".mode-text");
const baseThemeBtn = document.getElementById("base__theme__btn");
const draculaThemeBtn = document.getElementById("dracula__theme__btn");
const resetThemeBtn = document.getElementById("reset__theme__btn");
const copyBtn = document.getElementById("copy-btn");

// Status badges
const currentThemeBadge = document.getElementById("current-theme");
const currentModeBadge = document.getElementById("current-mode");

// SVG Icons
const sunIcon = `
  <path d="M8 11a3 3 0 100-6 3 3 0 000 6zM8 0a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2A.5.5 0 018 0zm0 13a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2A.5.5 0 018 13zm8-5a.5.5 0 01-.5.5h-2a.5.5 0 010-1h2a.5.5 0 01.5.5zM3 8a.5.5 0 01-.5.5h-2a.5.5 0 010-1h2A.5.5 0 013 8zm10.657-5.657a.5.5 0 010 .707l-1.414 1.415a.5.5 0 11-.707-.708l1.414-1.414a.5.5 0 01.707 0zm-9.193 9.193a.5.5 0 010 .707L3.05 13.657a.5.5 0 01-.707-.707l1.414-1.414a.5.5 0 01.707 0zm9.193 2.121a.5.5 0 01-.707 0l-1.414-1.414a.5.5 0 01.707-.707l1.414 1.414a.5.5 0 010 .707zM4.464 4.465a.5.5 0 01-.707 0L2.343 3.05a.5.5 0 11.707-.707l1.414 1.414a.5.5 0 010 .708z" fill="currentColor"/>
`;

const moonIcon = `
  <path d="M6 .278a.768.768 0 01.08.858 7.208 7.208 0 00-.878 3.46c0 4.021 3.278 7.277 7.318 7.277.527 0 1.04-.055 1.533-.16a.787.787 0 01.81.316.733.733 0 01-.031.893A8.349 8.349 0 018.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.752.752 0 016 .278z" fill="currentColor"/>
`;

// Initialize Theme Manager
const tm = new ThemeManager({
  themes: ["base", "dracula"],
  defaultTheme: "base",
  defaultMode: "light",
});

// Update UI to reflect current theme/mode state
function updateUI() {
  const currentTheme = tm.getTheme();
  const currentMode = tm.getMode();

  // Update active button states
  document.querySelectorAll(".btn--theme").forEach((btn) => {
    btn.classList.remove("active");
  });

  if (currentTheme === "base") {
    baseThemeBtn.classList.add("active");
  } else if (currentTheme === "dracula") {
    draculaThemeBtn.classList.add("active");
  }

  // Update mode button
  if (currentMode === "dark") {
    modeIcon.innerHTML = sunIcon;
    modeText.textContent = "Light";
  } else {
    modeIcon.innerHTML = moonIcon;
    modeText.textContent = "Dark";
  }

  // Update status badges
  currentThemeBadge.textContent = currentTheme;
  currentModeBadge.textContent = currentMode;
}

// Theme button handlers
baseThemeBtn.addEventListener("click", () => {
  tm.setTheme("base");
  updateUI();
});

draculaThemeBtn.addEventListener("click", () => {
  tm.setTheme("dracula");
  updateUI();
});

resetThemeBtn.addEventListener("click", () => {
  tm.reset();
  updateUI();
});

// Mode toggle handler
toggleThemeBtn.addEventListener("click", () => {
  tm.toggleMode();
  updateUI();
});

// Copy to clipboard handler
copyBtn.addEventListener("click", async () => {
  const textToCopy = "npm install ash-theme-manager";

  try {
    await navigator.clipboard.writeText(textToCopy);

    // Visual feedback
    copyBtn.style.transform = "scale(0.9)";
    setTimeout(() => {
      copyBtn.style.transform = "scale(1)";
    }, 150);
  } catch (err) {
    console.error("Failed to copy:", err);
  }
});

// Initialize UI on load
updateUI();
