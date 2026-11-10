import React, { createContext, useContext, useEffect } from "react";

export type ThemeName = "carbon" | "stellar";

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "carbon",
  setTheme: () => {},
});

export interface ThemeProviderProps {
  theme: ThemeName;
  onChangeTheme: (theme: ThemeName) => void;
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  theme,
  onChangeTheme,
  children,
}) => {
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    const rootEl = document.getElementById("root");
    if (rootEl) {
      rootEl.className = theme === "stellar" ? "theme-stellar" : "theme-carbon";
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: onChangeTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
