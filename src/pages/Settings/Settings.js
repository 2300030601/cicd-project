// ✅ Developed by Teammate 2 - UI & Navigation (User-Specific Version, Global Reflection Enabled)

import React, { useContext, useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./Settings.css";
import { SettingsContext } from "../../context/SettingsContext";
import axios from "axios";

function Settings() {
  const { settings, setSettings } = useContext(SettingsContext);
  const [tempSettings, setTempSettings] = useState(settings);

  // ✅ Load current logged-in user from localStorage
  const [currentUser] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    return storedUser || { name: "Guest", id: 0 };
  });

  const username = currentUser.name || "Guest";
  const userId = currentUser.id || 0;

  // ✅ Backend API base
  const API_BASE = "http://localhost:8080/api/settings";

  // ✅ Load settings (prefer backend, else localStorage)
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await axios.get(`${API_BASE}/${userId}`);
        if (res.data) {
          setTempSettings(res.data);
          setSettings(res.data);

          document.body.className =
            res.data.theme === "light" ? "light-theme" : "dark-theme";

          localStorage.setItem(
            `settings_${username}`,
            JSON.stringify(res.data)
          );
          return;
        }
      } catch (err) {
        console.warn("⚠️ No backend settings found, using localStorage data.");
      }

      // Fallback: localStorage
      const savedUserSettings =
        JSON.parse(localStorage.getItem(`settings_${username}`)) || settings;
      setTempSettings(savedUserSettings);
      setSettings(savedUserSettings);
      document.body.className =
        savedUserSettings.theme === "light" ? "light-theme" : "dark-theme";
    };

    fetchSettings();
  }, [username, userId, setSettings]);

  // ✅ Handle input changes
  const handleChange = (key, value) => {
    setTempSettings((prev) => ({ ...prev, [key]: value }));
  };

  // ✅ Save settings to backend + localStorage
  const handleSave = async () => {
    document.body.className =
      tempSettings.theme === "light" ? "light-theme" : "dark-theme";

    // Update global context
    setSettings(tempSettings);

    // Save locally
    localStorage.setItem(`settings_${username}`, JSON.stringify(tempSettings));

    // Save to backend
    try {
      await axios.post(`${API_BASE}/save`, {
        userId: userId,
        username: tempSettings.username || username,
        theme: tempSettings.theme,
        currency: tempSettings.currency,
      });

      alert(`✅ Settings saved successfully for ${username}!`);
    } catch (error) {
      console.error("❌ Error saving settings:", error);
      alert("⚠️ Failed to save settings to server.");
    }
  };

  return (
    <div className={`settings-page ${settings.theme}-theme`}>
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
