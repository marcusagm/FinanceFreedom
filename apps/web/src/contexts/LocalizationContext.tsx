import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface LocalizationContextType {
    currency: string;
    setCurrency: (currency: string) => void;
    dateFormat: string;
    setDateFormat: (format: string) => void;
    formatCurrency: (value: number, currencyOverride?: string) => string;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(
    undefined,
);

export function LocalizationProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { i18n } = useTranslation();
    const [currency, setCurrency] = useState(
        () => localStorage.getItem("app_currency") || "BRL",
    );
    const [dateFormat, setDateFormat] = useState(
        () => localStorage.getItem("app_date_format") || "dd/MM/yyyy",
    );

    useEffect(() => {
        localStorage.setItem("app_currency", currency);
    }, [currency]);

    useEffect(() => {
        localStorage.setItem("app_date_format", dateFormat);
    }, [dateFormat]);

    const formatCurrency = (value: number, currencyOverride?: string) => {
        try {
            return new Intl.NumberFormat(i18n.language, {
                style: "currency",
                currency: currencyOverride || currency,
            }).format(value);
        } catch (error) {
            console.error("Error formatting currency", error);
            return `${currencyOverride || currency} ${value}`;
        }
    };

    return (
        <LocalizationContext.Provider
            value={{
                currency,
                setCurrency,
                dateFormat,
                setDateFormat,
                formatCurrency,
            }}
        >
            {children}
        </LocalizationContext.Provider>
    );
}

export const useLocalization = () => {
    const context = useContext(LocalizationContext);
    if (!context)
        throw new Error(
            "useLocalization must be used within LocalizationProvider",
        );
    return context;
};
