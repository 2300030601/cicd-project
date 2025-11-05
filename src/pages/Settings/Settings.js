// Developed by Teammate 2 - UI & Navigation

import React, { useContext, useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Settings.css";
import { SettingsContext } from "../../context/SettingsContext";

function Settings() {
  const { settings, setSettings } = useContext(SettingsContext);
  const [tempSettings, setTempSettings] = useState(settings);

  const handleSave = () => {
    setSettings(tempSettings);
    alert("✅ Settings saved successfully!");
  };

  const handleChange = (key, value) => {
    setTempSettings((prev) => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    document.body.className = settings.theme === "light" ? "light-theme" : "dark-theme";
  }, [settings.theme]);

  return (
    <div className={`settings-page ${settings.theme}-theme`}>
      <Sidebar />
      <div className="settings-content">
        <div className="settings-header">
          <h2 style={{ color: "#007BFF" }}>⚙️ Settings</h2>
          <p>Personalize your Budget Planner experience.</p>
        </div>

        <div className="settings-grid">
          {/* Profile */}
          <div className="settings-card">
            <h3>👤 Profile</h3>
            <div className="settings-item">
              <label>Display Name</label>
              <input
                type="text"
                value={tempSettings.username}
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
                value={tempSettings.theme}
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
                value={tempSettings.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
              >
                <option value="₹">₹</option>
                <option value="$">$</option>
                <option value="€">€</option>
                <option value="£">£</option>
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
