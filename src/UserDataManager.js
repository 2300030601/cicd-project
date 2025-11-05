// src/UserDataManager.js

// --- 1. CONFIGURATION: THE LOCAL STORAGE KEY ---
const APP_DATA_STORAGE_KEY = "financeApp_allUserData";
const LOGGED_USER_KEY = "financeApp_loggedUser";

// --- 2. GETTER FUNCTIONS ---

/**
 * Gets the ID of the currently logged-in user.
 * @returns {string | null} The user ID or null if none is logged in.
 */
export const getLoggedInUser = () => {
    return localStorage.getItem(LOGGED_USER_KEY);
};

/**
 * Gets all data for the current user (transactions, profile, etc.).
 * @returns {object} The current user's data object.
 */
export const getUserData = () => {
    const userId = getLoggedInUser();
    if (!userId) {
        console.warn("Attempted to get data, but no user is logged in.");
        return {};
    }

    const allAppData = JSON.parse(localStorage.getItem(APP_DATA_STORAGE_KEY)) || {};

    // Return current user's data, providing defaults for a new user
    return allAppData[userId] || {
        profile: {},
        transactions: [],
        budgets: [], // Matches your Dashboard and BudgetPlanner components
        settings: {}
    };
};


// --- 3. SETTER FUNCTIONS ---

/**
 * Updates the user ID in local storage upon successful login/signup.
 * @param {string} userId - The unique ID of the user.
 */
export const setLoggedInUser = (userId) => {
    localStorage.setItem(LOGGED_USER_KEY, userId);
    // You might want to refresh the page or redirect here
};

/**
 * Updates a portion of the current user's data (e.g., just transactions, or just profile).
 * @param {object} newData - The partial data object to merge (e.g., { transactions: [...] }).
 */
export const updateUserData = (newData) => {
    const userId = getLoggedInUser();
    if (!userId) {
        console.error("Cannot save data: User ID missing.");
        return;
    }

    // 1. Load all data
    const allAppData = JSON.parse(localStorage.getItem(APP_DATA_STORAGE_KEY)) || {};
    
    // 2. Get current user's data (or empty object if new user)
    const currentUserData = allAppData[userId] || {};

    // 3. Merge the new data with the old data
    allAppData[userId] = {
        ...currentUserData,
        ...newData
    };

    // 4. Save all data back
    localStorage.setItem(APP_DATA_STORAGE_KEY, JSON.stringify(allAppData));
};