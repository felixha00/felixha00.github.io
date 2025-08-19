// context/AppProvider.tsx
"use client";

import React, { createContext, useContext, ReactNode, useState, useEffect } from "react";

// Define the shape of your app context
interface AppContextType {
    ip: string;
    // setIp: (ip: string) => void;
    // Add any other global state you want here
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
    children: ReactNode;
    ip?: string;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children, ip }) => {
    const [_ip] = useState<string>(ip || "0.0.0.0");

    return (
        <AppContext.Provider value={{ ip: _ip }}>
            {children}
        </AppContext.Provider>
    );
};

// Custom hook for consuming context
export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
