import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { CreateWorkUnitDialog } from "./CreateWorkUnitDialog";
import "@testing-library/jest-dom";
import { api } from "../../lib/api";
import * as IncomeService from "../../services/income.service";

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
                    const floatValue = Number.parseFloat(e.target.value) || 0;
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
        fireEvent.change(screen.getByPlaceholderText("%"), {
            target: { value: "10" },
        });

        fireEvent.click(screen.getByText("Salvar"));

        await waitFor(() => {
            expect(IncomeService.createWorkUnit).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: "Design",
                    defaultPrice: 500,
                    estimatedTime: 10,
                    taxRate: 10,
                }),
            );
        });
    });
});
