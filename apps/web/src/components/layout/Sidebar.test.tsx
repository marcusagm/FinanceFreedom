import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it, vi } from "vitest";
import { AuthProvider } from "../../contexts/AuthContext";
import { PrivacyProvider } from "../../contexts/PrivacyContext";
import { Sidebar } from "./Sidebar";

// Mock hooks
const mockLogout = vi.fn();
const mockUser = { email: "test@example.com" };

vi.mock("../../contexts/AuthContext", async () => {
    const actual = await vi.importActual("../../contexts/AuthContext");
    return {
        ...actual,
        useAuth: () => ({
            logout: mockLogout,
            user: mockUser,
            isAuthenticated: true,
        }),
        AuthProvider: ({ children }: { children: React.ReactNode }) => (
            <>{children}</>
        ),
    };
});

vi.mock("../../contexts/PrivacyContext", async () => {
    return {
        usePrivacy: () => ({
            isObfuscated: false,
            toggleObfuscation: vi.fn(),
        }),
        PrivacyProvider: ({ children }: { children: React.ReactNode }) => (
            <>{children}</>
        ),
    };
});

describe("Sidebar Component", () => {
    const renderSidebar = () => {
        return render(
            <BrowserRouter>
                <AuthProvider>
                    <PrivacyProvider>
                        <Sidebar />
                    </PrivacyProvider>
                </AuthProvider>
            </BrowserRouter>
        );
    };

    it("renders correctly with user info", () => {
        renderSidebar();
        expect(screen.getByText("FinanceFreedom")).toBeInTheDocument();
        expect(screen.getByText("test@example.com")).toBeInTheDocument();
    });

    it("renders all navigation groups", () => {
        renderSidebar();
        expect(screen.getByText("Geral")).toBeInTheDocument();
        expect(screen.getByText("Despesas")).toBeInTheDocument();
        expect(screen.getByText("Faturamento")).toBeInTheDocument();
        expect(screen.getByText("Planejamento")).toBeInTheDocument();
        expect(screen.getByText("Sistema")).toBeInTheDocument();
    });

    it("renders navigation links", () => {
        renderSidebar();
        expect(screen.getByText("Dashboard")).toBeInTheDocument();
        expect(screen.getByText("Transações")).toBeInTheDocument();
        expect(screen.getByText("Contas")).toBeInTheDocument();
        expect(screen.getByText("Dívidas")).toBeInTheDocument();
        expect(screen.getByText("Despesas Fixas")).toBeInTheDocument();
        expect(screen.getByText("Renda")).toBeInTheDocument();
        expect(screen.getByText("Investimentos")).toBeInTheDocument();
        expect(screen.getByText("Categorias")).toBeInTheDocument();
        expect(screen.getByText("Metas")).toBeInTheDocument();
        expect(screen.getByText("Projeção")).toBeInTheDocument();
        expect(screen.getByText("Importações")).toBeInTheDocument();
        expect(screen.getByText("Configurações")).toBeInTheDocument();
    });

    it("toggles collapse state when clicking toggle button", () => {
        renderSidebar();
        const sidebarElement = screen.getByRole("complementary"); // aside tag defaults to complementary role
        expect(sidebarElement).toHaveClass("w-64");

        const toggleBtn = screen.getAllByRole("button")[0]; // First button should be the toggle
        fireEvent.click(toggleBtn);

        expect(sidebarElement).toHaveClass("w-16");
        // Text should be hidden or removed in collapsed state (implementation dependent, usually handled by css or conditional rendering)
        // In our implementation, we wrap text in specific conditional logic
        expect(screen.queryByText("FinanceFreedom")).not.toBeInTheDocument();
    });

    it("calls logout when logout button is clicked", () => {
        renderSidebar();
        // The logout button is usually at the bottom. We can find it by title="Sair" or icon.
        const logoutBtn = screen.getByTitle("Sair");
        fireEvent.click(logoutBtn);
        expect(mockLogout).toHaveBeenCalled();
    });
});
