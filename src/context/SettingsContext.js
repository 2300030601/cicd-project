import React, { createContext, useState, useEffect } from "react";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const defaultSettings = {
    username: "Guest",
    theme: "light",
    currency: "₹",
  };

  const [settings, setSettings] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const username = storedUser?.name || "Guest";
    const savedSettings = JSON.parse(localStorage.getItem(`settings_${username}`));
    return savedSettings || defaultSettings;
  });

  // ✅ Automatically save when settings change
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const username = storedUser?.name || "Guest";
    localStorage.setItem(`settings_${username}`, JSON.stringify(settings));
  }, [settings]);

  // ✅ Apply theme globally whenever settings.theme changes
  useEffect(() => {
    document.body.className =
      settings.theme === "light" ? "light-theme" : "dark-theme";
  }, [settings.theme]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
