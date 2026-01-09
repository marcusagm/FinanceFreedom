import { render, screen, waitFor, fireEvent } from "../utils/test-utils";
import IncomePage from "./Income";
import { vi, describe, it, expect, beforeEach } from "vitest";
import "@testing-library/jest-dom";

// Mock API and Services
const mockGetSources = vi.fn();
const mockGetWorkUnits = vi.fn();

vi.mock("../services/income.service", () => ({
    getIncomeSources: (...args: any[]) => mockGetSources(...args),
    getWorkUnits: (...args: any[]) => mockGetWorkUnits(...args),
    deleteIncomeSource: vi.fn(),
    deleteWorkUnit: vi.fn(),
    createIncomeSource: vi.fn(),
    createWorkUnit: vi.fn(),
}));

// Mock Dialogs to simplify integration test
vi.mock("../components/income/CreateIncomeSourceDialog", () => ({
    CreateIncomeSourceDialog: ({ isOpen, onClose }: any) =>
        isOpen ? (
            <div role="dialog">
                Mock Create Source Dialog{" "}
                <button onClick={onClose}>Close</button>
            </div>
        ) : null,
}));

vi.mock("../components/income/CreateWorkUnitDialog", () => ({
    CreateWorkUnitDialog: ({ isOpen, onClose }: any) =>
        isOpen ? (
            <div role="dialog">
                Mock Create Work Unit Dialog{" "}
                <button onClick={onClose}>Close</button>
            </div>
        ) : null,
}));

describe("Income Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should load and display data", async () => {
        mockGetSources.mockResolvedValue([
            { id: "1", name: "Salary", amount: 5000, payDay: 5 },
        ]);
        mockGetWorkUnits.mockResolvedValue([
            {
                id: "2",
                name: "Freelance",
                defaultPrice: 500,
                estimatedTime: 10,
            },
        ]);

        render(<IncomePage />);

        await waitFor(() => {
            expect(screen.getByText("Salary")).toBeInTheDocument();
            expect(screen.getByText("R$ 5.000,00")).toBeInTheDocument();
        });

        // Switch tabs
        const catalogTab = screen.getByText("Catálogo de Serviços");
        fireEvent.click(catalogTab);

        expect(screen.getByText("Freelance")).toBeInTheDocument();
    });

    it("should open create dialogs", async () => {
        mockGetSources.mockResolvedValue([]);
        mockGetWorkUnits.mockResolvedValue([]);

        render(<IncomePage />);

        const createButton = screen.getByText("+ Nova Fonte");
        fireEvent.click(createButton);

        expect(
            screen.getByText("Mock Create Source Dialog")
        ).toBeInTheDocument();

        // Switch tabs and check button change
        const catalogTab = screen.getByText("Catálogo de Serviços");
        fireEvent.click(catalogTab);

        const createServiceButton = screen.getByText("+ Novo Serviço");
        fireEvent.click(createServiceButton);

        expect(
            screen.getByText("Mock Create Work Unit Dialog")
        ).toBeInTheDocument();
    });
});
