import React, { createContext, useState, useEffect } from "react";

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // ✅ Auto-load user from localStorage on startup
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        transactions,
        setTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
