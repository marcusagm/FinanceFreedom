import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { Settings } from "./Settings";
import { systemConfigService } from "../services/system-config.service";
import { categoryService } from "../services/category.service";
import { toast } from "sonner";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock dependencies
vi.mock("../services/system-config.service");
vi.mock("../services/category.service");
vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe("Settings Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should load and display settings", async () => {
        (systemConfigService.getAll as any).mockResolvedValue({
            closingDay: "10",
            defaultInterestRate: "5",
            workOnWeekends: "true",
        });
        (categoryService.getAll as any).mockResolvedValue([{ name: "Income" }]);

        render(<Settings />);

        expect(
            screen.getByText("Configurações do Sistema")
        ).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByDisplayValue("10")).toBeInTheDocument();
            expect(screen.getByDisplayValue("5")).toBeInTheDocument();
        });
    });

    it("should save settings", async () => {
        (systemConfigService.getAll as any).mockResolvedValue({
            closingDay: "1",
            defaultInterestRate: "0",
            workOnWeekends: "false",
        });
        (categoryService.getAll as any).mockResolvedValue([]);
        (systemConfigService.setMany as any).mockResolvedValue({});

        render(<Settings />);

        await waitFor(() =>
            expect(systemConfigService.getAll).toHaveBeenCalled()
        );

        // Change closing day
        fireEvent.change(screen.getByLabelText("Dia Padrão de Fechamento"), {
            target: { value: "15" },
        });

        // Save
        fireEvent.click(screen.getByText("Salvar Configurações"));

        await waitFor(() => {
            expect(systemConfigService.setMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    closingDay: "15",
                })
            );
            expect(toast.success).toHaveBeenCalledWith(
                "Configurações salvas com sucesso!"
            );
        });
    });
});
