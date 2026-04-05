import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    // set state from localStorage to persist user settings across sessions
    const [role, setRole] = useState(() => {
        return localStorage.getItem("app-role") || "admin";
    });

    const [dark, setDark] = useState(() => {
        const savedTheme = localStorage.getItem("app-theme");
        // default to light mode (false)
        return savedTheme ? JSON.parse(savedTheme) : false;
    });

    // Sync changes to localStorage
    useEffect(() => {
        localStorage.setItem("app-role", role);
    }, [role]);

    useEffect(() => {
        localStorage.setItem("app-theme", JSON.stringify(dark));
    }, [dark]);

    const toggleTheme = () => setDark(prev => !prev);

    return (
        <AppContext.Provider value={{
            role,
            setRole,
            dark,
            setDark,
            toggleTheme
        }}>
            {children}
        </AppContext.Provider>
    );
};

/**
 * Custom hook for accessing app state.
 * Validates the context's usage to ensure it's used within the Provider's scope.
 */
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        console.error("Use useAppContext in an AppContextProvider");
    }
    return context;
};