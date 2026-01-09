import React, { createContext, useContext, useEffect, useState } from "react";

interface PrivacyContextType {
    isObfuscated: boolean;
    toggleObfuscation: () => void;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

export function PrivacyProvider({ children }: { children: React.ReactNode }) {
    const [isObfuscated, setIsObfuscated] = useState(() => {
        const stored = localStorage.getItem("privacy_mode");
        return stored === "true";
    });

    useEffect(() => {
        localStorage.setItem("privacy_mode", String(isObfuscated));
    }, [isObfuscated]);

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
