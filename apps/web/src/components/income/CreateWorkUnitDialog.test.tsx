import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { CreateWorkUnitDialog } from "./CreateWorkUnitDialog";
import { vi, describe, it, expect, beforeEach, beforeAll } from "vitest";
import "@testing-library/jest-dom";
import * as IncomeService from "../../services/income.service";
import { api } from "../../lib/api";

vi.mock("../../services/income.service", () => ({
    createWorkUnit: vi.fn(),
}));

vi.mock("../../lib/api", () => ({
    api: {
        patch: vi.fn(),
    },
}));

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

describe("CreateWorkUnitDialog", () => {
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

    it("should submit new work unit", async () => {
        render(<CreateWorkUnitDialog {...defaultProps} />);

        fireEvent.change(screen.getByPlaceholderText("Ex: Logo Design"), {
            target: { value: "Design" },
        });
        fireEvent.change(screen.getByPlaceholderText("0,00"), {
            target: { value: "500" },
        });
        fireEvent.change(screen.getByPlaceholderText("Hrs"), {
            target: { value: "10" },
        });

        fireEvent.click(screen.getByText("Salvar"));

        await waitFor(() => {
            expect(IncomeService.createWorkUnit).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: "Design",
                    defaultPrice: 500,
                    estimatedTime: 10,
                })
            );
        });
    });
});
