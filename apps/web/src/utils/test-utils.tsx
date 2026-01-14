import { type RenderOptions, render } from "@testing-library/react";
import type React from "react";
import { BrowserRouter } from "react-router-dom";
import { PrivacyProvider } from "../contexts/PrivacyContext";

export const renderWithProviders = (
    ui: React.ReactElement,
    options?: Omit<RenderOptions, "wrapper">,
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
