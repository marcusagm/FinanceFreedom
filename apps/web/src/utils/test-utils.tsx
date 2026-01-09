import React from "react";
import { render, type RenderOptions } from "@testing-library/react";
import { PrivacyProvider } from "../contexts/PrivacyContext";
import { BrowserRouter } from "react-router-dom";

export const renderWithProviders = (
    ui: React.ReactElement,
    options?: Omit<RenderOptions, "wrapper">
) => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => {
        return (
            <BrowserRouter>
                <PrivacyProvider>{children}</PrivacyProvider>
            </BrowserRouter>
        );
    };

    return render(ui, { wrapper: Wrapper, ...options });
};

export * from "@testing-library/react";
export { renderWithProviders as render };
