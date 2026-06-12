import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("cb-theme") || "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("cb-theme", theme);

    // Apply dark mode CSS vars directly to root
    const root = document.documentElement;
    if (theme === "dark") {
      root.style.setProperty("--bg-page", "#111111");
      root.style.setProperty("--bg-card", "#1E1E1E");
      root.style.setProperty("--bg-nav", "#161616");
      root.style.setProperty("--text-primary", "#F5F0E8");
      root.style.setProperty("--text-muted", "#888888");
      root.style.setProperty("--border", "#333333");
      root.style.setProperty("--shadow", "#000000");
    } else {
      root.style.setProperty("--bg-page", "#FAE8D8");
      root.style.setProperty("--bg-card", "#FFFFFF");
      root.style.setProperty("--bg-nav", "#FFFFFF");
      root.style.setProperty("--text-primary", "#1A1A1A");
      root.style.setProperty("--text-muted", "#6B6B6B");
      root.style.setProperty("--border", "#1A1A1A");
      root.style.setProperty("--shadow", "#1A1A1A");
    }
  }, [theme]);

  const toggle = () => setTheme(t => t === "light" ? "dark" : "light");

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);