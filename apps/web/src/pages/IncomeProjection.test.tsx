import { render, screen, waitFor } from "@testing-library/react";
import IncomeProjection from "./IncomeProjection";
import { api } from "../lib/api";
import { vi } from "vitest";

// Mock API
vi.mock("../lib/api");

describe("IncomeProjection Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render the page title", async () => {
        // Mock Work Units
        (api.get as any).mockImplementation((url: string) => {
            if (url === "/income/work-units") {
                return Promise.resolve({ data: [] });
            }
            if (url.includes("/income/projection")) {
                return Promise.resolve({ data: [] });
            }
            return Promise.resolve({ data: [] });
        });

        render(<IncomeProjection />);

        // Check for month title (current month)
        // Since we can't easily predict the exact month text in test without knowing date,
        // we check for static text or known elements.
        expect(screen.getByText(/Total Projetado:/i)).toBeInTheDocument();
        expect(screen.getByText("Unidades de Trabalho")).toBeInTheDocument();
    });

    it("should fetch and display work units", async () => {
        const mockWorkUnits = [
            {
                id: "1",
                name: "Design Job",
                defaultPrice: 200,
                estimatedTime: 4,
            },
        ];

        (api.get as any).mockImplementation((url: string) => {
            if (url === "/income/work-units") {
                return Promise.resolve({ data: mockWorkUnits });
            }
            if (url.includes("/income/projection")) {
                return Promise.resolve({ data: [] });
            }
            return Promise.resolve({ data: [] });
        });

        render(<IncomeProjection />);

        await waitFor(() => {
            expect(screen.getByText("Design Job")).toBeInTheDocument();
        });
    });
});
