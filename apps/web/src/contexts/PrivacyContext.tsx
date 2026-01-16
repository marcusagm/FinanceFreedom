import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface PrivacyContextType {
    isObfuscated: boolean;
    toggleObfuscation: () => void;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

import { useTheme } from "../components/providers/ThemeProvider";
import { useAuth } from "./AuthContext";

export function PrivacyProvider({ children }: { children: React.ReactNode }) {
    const { privacyMode } = useTheme();
    const { isAuthenticated } = useAuth();
    const [isObfuscated, setIsObfuscated] = useState(privacyMode);

    // Sync with default setting from ThemeProvider and reset on Auth change
    useEffect(() => {
        setIsObfuscated(privacyMode);
    }, [privacyMode, isAuthenticated]);

    const toggleObfuscation = () => {
        setIsObfuscated((prev) => !prev);
    };

    return (
        <PrivacyContext.Provider value={{ isObfuscated, toggleObfuscation }}>
            {children}
        </PrivacyContext.Provider>
    );
}

export function usePrivacy() {
    const context = useContext(PrivacyContext);
    if (context === undefined) {
        throw new Error("usePrivacy must be used within a PrivacyProvider");
    }
    return context;
}
