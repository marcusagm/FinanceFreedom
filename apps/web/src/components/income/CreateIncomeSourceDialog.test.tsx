import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CreateIncomeSourceDialog } from "./CreateIncomeSourceDialog";
import { vi, describe, it, expect, beforeEach, beforeAll } from "vitest";
import "@testing-library/jest-dom";
import * as IncomeService from "../../services/income.service";

// Mock Service
vi.mock("../../services/income.service", () => ({
    createIncomeSource: vi.fn(),
    createWorkUnit: vi.fn(),
}));

// Mock API
vi.mock("../../lib/api", () => ({
    api: {
        patch: vi.fn(),
    },
}));

// Mock Modal to avoid animation visibility issues
vi.mock("../ui/Modal", () => ({
    Modal: ({ isOpen, title, children, footer }: any) => {
        if (!isOpen) return null;
        return (
            <div data-testid="modal">
                <h2>{title}</h2>
                {children}
                {footer}
            </div>
        );
    },
}));

// Mock Input
vi.mock("../ui/Input", () => ({
    Input: ({ onValueChange, onChange, value, currency, ...props }: any) => (
        <input
            {...props}
            value={value}
            onChange={(e) => {
                onChange?.(e);
                if (onValueChange) {
                    const floatValue = parseFloat(e.target.value) || 0;
                    onValueChange({ floatValue, value: e.target.value });
                }
            }}
        />
    ),
}));

import { api } from "../../lib/api";

describe("CreateIncomeSourceDialog", () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        onSuccess: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    beforeAll(() => {
        global.ResizeObserver = class ResizeObserver {
            observe() {}
            unobserve() {}
            disconnect() {}
        };
    });

    it("should render correctly", () => {
        render(<CreateIncomeSourceDialog {...defaultProps} />);
        expect(screen.getByText("Nova Fonte de Renda")).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText("Nome da fonte")
        ).toBeInTheDocument();
    });

    it("should validate inputs", async () => {
        render(<CreateIncomeSourceDialog {...defaultProps} />);

        const saveButton = screen.getByText("Salvar");
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(screen.getByText("Nome é obrigatório")).toBeInTheDocument();
        });
    });

    it("should call createIncomeSource on submit", async () => {
        render(<CreateIncomeSourceDialog {...defaultProps} />);

        fireEvent.change(screen.getByPlaceholderText("Nome da fonte"), {
            target: { value: "Salário" },
        });

        fireEvent.change(screen.getByPlaceholderText("0,00"), {
            target: { value: "5000" },
        });

        fireEvent.change(screen.getByPlaceholderText("5"), {
            target: { value: "5" },
        });
        const saveButton = screen.getByText("Salvar");
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(IncomeService.createIncomeSource).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: "Salário",
                    amount: 5000,
                    payDay: 5,
                })
            );
            expect(defaultProps.onSuccess).toHaveBeenCalled();
        });
    });

    it("should call api.patch on edit", async () => {
        const itemToEdit = {
            id: "1",
            name: "Old Name",
            amount: 1000,
            payDay: 5,
        };
        render(
            <CreateIncomeSourceDialog
                {...defaultProps}
                itemToEdit={itemToEdit}
            />
        );

        expect(screen.getByDisplayValue("Old Name")).toBeInTheDocument();

        fireEvent.change(screen.getByPlaceholderText("Nome da fonte"), {
            target: { value: "New Name" },
        });
        fireEvent.click(screen.getByText("Salvar"));

        await waitFor(() => {
            expect(api.patch).toHaveBeenCalledWith(
                "/income/sources/1",
                expect.objectContaining({
                    name: "New Name",
                })
            );
        });
    });
});
