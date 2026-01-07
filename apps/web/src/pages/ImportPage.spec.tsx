import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ImportPage } from "./ImportPage";
import { api } from "../lib/api";
import { ImportService } from "../services/import.service";
import { BrowserRouter } from "react-router-dom";

// Mock dependencies
vi.mock("../lib/api");
vi.mock("../services/import.service");
vi.mock("../components/ui/Modal", () => ({
    Modal: ({ isOpen, children, title }: any) =>
        isOpen ? (
            <div role="dialog" aria-label={title}>
                {children}
            </div>
        ) : null,
}));

vi.mock("react-dropzone", () => ({
    useDropzone: ({ onDrop }: any) => ({
        getRootProps: () => ({
            onClick: () => {
                // Simulate dropping a valid file by clicking
                const file = new File(["OFX CONTENT"], "stmt.ofx", {
                    type: "application/x-ofx",
                });
                onDrop([file]);
            },
        }),
        getInputProps: () => ({}),
        isDragActive: false,
        isDragAccept: false,
        isDragReject: false,
        open: vi.fn(),
    }),
}));

const renderWithRouter = (ui: React.ReactElement) => {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("ImportPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
        (api.get as any).mockResolvedValue({ data: [] });
    });

    it("renders the title", async () => {
        renderWithRouter(<ImportPage />);
        expect(screen.getByText("Smart Import")).toBeInTheDocument();
    });

    it("fetches and lists accounts", async () => {
        (api.get as any).mockResolvedValue({
            data: [
                { id: "1", name: "Bank A", type: "CHECKING" },
                { id: "2", name: "Bank B", type: "SAVINGS" },
            ],
        });

        renderWithRouter(<ImportPage />);

        await waitFor(() => {
            expect(api.get).toHaveBeenCalledWith("/accounts");
        });

        await waitFor(() => {
            expect(screen.getByText("Bank A (CHECKING)")).toBeInTheDocument();
        });
    });

    it("shows alert if file selected without account", async () => {
        // Mock no accounts response so selectedAccount is empty
        (api.get as any).mockResolvedValue({ data: [] });

        renderWithRouter(<ImportPage />);

        // Find the dropzone text and click it to trigger our mocked onDrop
        const dropText = screen.getByText("Drag & drop an OFX file here");
        fireEvent.click(dropText);

        await waitFor(() => {
            expect(screen.getByRole("dialog")).toBeInTheDocument();
            expect(
                screen.getByText("Please select an account first")
            ).toBeInTheDocument();
        });
    });
});
