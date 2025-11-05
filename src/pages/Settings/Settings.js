// ✅ Developed by Teammate 2 - UI & Navigation (User-Specific Version)

import React, { useContext, useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Settings.css";
import { SettingsContext } from "../../context/SettingsContext";

function Settings() {
  const { settings, setSettings } = useContext(SettingsContext);
  const [tempSettings, setTempSettings] = useState(settings);

  // ✅ Load current logged-in user from localStorage
  const [currentUser] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    return storedUser || { name: "Guest", id: "guest" };
  });

  const username = currentUser.name || "Guest";

  // ✅ Load user-specific settings from localStorage
  useEffect(() => {
    const savedUserSettings =
      JSON.parse(localStorage.getItem(`settings_${username}`)) || settings;
    setTempSettings(savedUserSettings);
    setSettings(savedUserSettings);
  }, [username, setSettings]);

  // ✅ Save user-specific settings
  const handleSave = () => {
    setSettings(tempSettings);
    localStorage.setItem(`settings_${username}`, JSON.stringify(tempSettings));
    alert(`✅ Settings saved successfully for ${username}!`);
  };

  // ✅ Handle input change
  const handleChange = (key, value) => {
    setTempSettings((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ Apply theme to document body dynamically
  useEffect(() => {
    document.body.className =
      tempSettings.theme === "light" ? "light-theme" : "dark-theme";
  }, [tempSettings.theme]);

  return (
    <div className={`settings-page ${tempSettings.theme}-theme`}>
      <Sidebar />
      <div className="settings-content">
        <div className="settings-header">
          <h2 style={{ color: "#007BFF" }}>⚙️ Settings</h2>
          <p>Personalize your Budget Planner experience.</p>
          <p className="user-label">👤 User: {username}</p>
        </div>

        <div className="settings-grid">
          {/* Profile */}
          <div className="settings-card">
            <h3>👤 Profile</h3>
            <div className="settings-item">
              <label>Display Name</label>
              <input
                type="text"
                value={tempSettings.username || ""}
                onChange={(e) => handleChange("username", e.target.value)}
              />
            </div>
          </div>

          {/* Theme */}
          <div className="settings-card">
            <h3>🎨 Appearance</h3>
            <div className="settings-item">
              <label>Theme</label>
              <select
                value={tempSettings.theme || "light"}
                onChange={(e) => handleChange("theme", e.target.value)}
              >
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </div>
          </div>

          {/* Currency */}
          <div className="settings-card">
            <h3>💰 Currency</h3>
            <div className="settings-item">
              <label>Currency</label>
              <select
                value={tempSettings.currency || "₹"}
                onChange={(e) => handleChange("currency", e.target.value)}
              >
                <option value="₹">₹ (INR)</option>
                <option value="$">$ (USD)</option>
                <option value="€">€ (EUR)</option>
                <option value="£">£ (GBP)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <button className="btn-save" onClick={handleSave}>
            💾 Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
