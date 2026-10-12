const noteText = document.querySelector("#note-text");
const charCount = document.querySelector("#char-count");
const wordCount = document.querySelector("#word-count");
const clearBtn = document.querySelector("#clear-btn");
const themeToggle = document.querySelector("#theme-toggle");

const DRAFT_KEY = "quicknotes-day4-draft";
const THEME_KEY = "quicknotes-day4-theme";

function updateCounts() {
const text = noteText.value;
const characters = text.length;


const words = text.trim() === ""
    ? 0
    : text.trim().split(/\s+/).length;

charCount.textContent = `${characters} / 200 characters`;
wordCount.textContent = `${words} words`;

charCount.classList.toggle("warning", characters > 180);
charCount.classList.toggle("over", characters > 200);


}

function saveDraft() {
localStorage.setItem(DRAFT_KEY, noteText.value);
}

function clearNote() {
noteText.value = "";
localStorage.removeItem(DRAFT_KEY);
updateCounts();
}

function setTheme(isDark) {
document.body.classList.toggle("dark", isDark);


themeToggle.textContent = isDark ? "Light mode" : "Dark mode";

localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");

}

// Restore the saved draft.
const savedDraft = localStorage.getItem(DRAFT_KEY);

if (savedDraft !== null) {
noteText.value = savedDraft;
}

// Restore the saved theme.
const savedTheme = localStorage.getItem(THEME_KEY);
setTheme(savedTheme === "dark");

// Display the correct counters on page load.
updateCounts();

// Update counters and save the draft while typing.
noteText.addEventListener("input", () => {
updateCounts();
saveDraft();
});

// Clear button.
clearBtn.addEventListener("click", clearNote);

// Escape key.
noteText.addEventListener("keydown", (event) => {
if (event.key === "Escape") {
clearNote();
}
});

// Theme toggle.
themeToggle.addEventListener("click", () => {
const isDark = document.body.classList.contains("dark");
setTheme(!isDark);
});
