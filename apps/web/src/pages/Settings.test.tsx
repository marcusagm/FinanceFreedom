// @vitest-environment jsdom
import { render, screen, waitFor } from "@testing-library/react";
import { Settings } from "./Settings";
import { systemConfigService } from "../services/system-config.service";
import { BrowserRouter } from "react-router-dom";
import { vi, describe, it, expect, beforeEach } from "vitest";

// Mock the service
vi.mock("../services/system-config.service", () => ({
    systemConfigService: {
        getAll: vi.fn(),
        setMany: vi.fn(),
    },
}));

describe("Settings Page", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render settings form with values", async () => {
        (systemConfigService.getAll as any).mockResolvedValue({
            closingDay: "10",
            defaultInterestRate: "2.5",
        });

        render(
            <BrowserRouter>
                <Settings />
            </BrowserRouter>
        );

        const closingDayInput = (await screen.findByLabelText(
            /Dia Padrão de Fechamento/i
        )) as HTMLInputElement;
        expect(closingDayInput.value).toBe("10");
    });
});
