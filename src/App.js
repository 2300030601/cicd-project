import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import WelcomePage from "./components/WelcomePage";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Dashboard from "./pages/Dashboard/Dashboard";
import AddTransaction from "./pages/AddTransaction/AddTransaction";
import ViewHistory from "./pages/ViewHistory/ViewHistory";
import BudgetPlanner from "./pages/BudgetPlanner/BudgetPlanner";
import DataManagement from "./pages/DataManagement/DataManagement";
import Settings from "./pages/Settings/Settings";
import Investments from "./pages/Investments/Investments";
import DebtGoals from "./pages/DebtGoals/DebtGoals";

// 🧠 Import global context providers
import { SettingsProvider } from "./context/SettingsContext";
import { TransactionProvider } from "./context/TransactionContext";

const App = () => {
  return (
    <SettingsProvider>
      <TransactionProvider>
        <Router>
          <Routes>
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/signin" element={<SignIn />} /> // signin page
            <Route path="/signup" element={<SignUp />} /> // signup page
            <Route path="/forgot-password" element={<ForgotPassword />} /> // ForgotPassword

            {/* 🧾 Protected app pages */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/add-transaction" element={<AddTransaction />} />
            <Route path="/view-history" element={<ViewHistory />} />
            <Route path="/budget-planner" element={<BudgetPlanner />} />
            <Route path="/data-management" element={<DataManagement />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/investments" element={<Investments />} />
            <Route path="/debt-goals" element={<DebtGoals />} />
          </Routes>
        </Router>
      </TransactionProvider>
    </SettingsProvider>
  );
};

export default App;
