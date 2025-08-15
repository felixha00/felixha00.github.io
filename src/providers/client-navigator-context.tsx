// context/ClientNavigatorContext.tsx
"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type NavigatorInfo = {
    userAgent: string;
    platform: string;
    language: string;
    languages: string[];
    vendor: string;
    online: boolean;
    cookieEnabled: boolean;
    isMobile: boolean;
    // Add more if needed
};

const defaultNavigatorInfo: NavigatorInfo = {
    userAgent: "",
    platform: "",
    language: "",
    languages: [],
    vendor: "",
    online: true,
    cookieEnabled: true,
    isMobile: false,
};

const NavigatorContext = createContext<NavigatorInfo>(defaultNavigatorInfo);

export const NavigatorProvider = ({ children }: { children: ReactNode }) => {
    const [navigatorInfo, setNavigatorInfo] = useState<NavigatorInfo>(defaultNavigatorInfo);

    useEffect(() => {
        if (typeof navigator !== "undefined") {
            const ua = navigator.userAgent || "";
            setNavigatorInfo({
                userAgent: ua,
                platform: navigator.platform,
                language: navigator.language,
                languages: Array.from(navigator.languages),
                vendor: navigator.vendor,
                online: navigator.onLine,
                cookieEnabled: navigator.cookieEnabled,
                isMobile: /Mobi|Android/i.test(ua),
            });
        }
    }, []);

    return (
        <NavigatorContext.Provider value={navigatorInfo}>
            {children}
        </NavigatorContext.Provider>
    );
};

// Hook for easy usage
export const useNavigator = () => useContext(NavigatorContext);
