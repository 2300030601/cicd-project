import React, { createContext, useState, useEffect } from "react";

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  // 🧠 Get the current logged-in user
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const username = currentUser?.name || "Guest";

  // 🏗 Load user-specific settings
  const getInitialSettings = () => {
    const saved = localStorage.getItem(`settings_${username}`);
    return saved
      ? JSON.parse(saved)
      : {
          username: username,
          theme: "dark",
          currency: "₹",
          notificationEnabled: true,
        };
  };

  const [settings, setSettings] = useState(getInitialSettings());

  // 💾 Save settings and apply theme dynamically
  useEffect(() => {
    localStorage.setItem(`settings_${username}`, JSON.stringify(settings));
    document.body.className =
      settings.theme === "light" ? "light-theme" : "dark-theme";
  }, [settings, username]);

  // 🔁 Reload settings when user changes (e.g., login/logout)
  useEffect(() => {
    const newSettings = getInitialSettings();
    setSettings(newSettings);
  }, [username]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
