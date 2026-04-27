import { useDarkMode } from "../../hooks/useDarkMode";

export default function ThemeToggle() {
  const [theme, setTheme] = useDarkMode();
  
  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="w-fit px-4 py-2 bg-zinc-400 dark:bg-zinc-800 rounded border dark:border-zinc-700 hover:bg-zinc-400/50 hover:border-zinc-500 hover:dark:border-zinc-600 hover:dark:bg-zinc-700"
    >
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}