import React, { createContext, useState, useEffect } from "react";

export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const [transactions, setTransactions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  // Load logged user and transactions on app start
  useEffect(() => {
    const loggedUsername = localStorage.getItem("loggedUser");
    if (loggedUsername) {
      const savedTransactions = localStorage.getItem(`transactions_${loggedUsername}`);
      setTransactions(savedTransactions ? JSON.parse(savedTransactions) : []);
      setCurrentUser({ name: loggedUsername });
    }
  }, []);

  // ✅ Function to add new transaction (user-specific)
  const addTransaction = (newTxn) => {
    if (!currentUser || !currentUser.name) {
      alert("No user logged in. Please log in first.");
      return;
    }

    const updatedTransactions = [...transactions, newTxn];
    setTransactions(updatedTransactions);

    // Save to localStorage under user key
    localStorage.setItem(
      `transactions_${currentUser.name}`,
      JSON.stringify(updatedTransactions)
    );
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        addTransaction, // ✅ expose this
        setTransactions,
        currentUser,
        setCurrentUser,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
