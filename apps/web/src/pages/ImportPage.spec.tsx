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
    Modal: ({ isOpen, children, title, footer }: any) =>
        isOpen ? (
            <div role="dialog" aria-label={title}>
                {children}
                <footer>{footer}</footer>
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
        await waitFor(() => {
            expect(api.get).toHaveBeenCalled();
        });
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

    it("uploads file and shows review step", async () => {
        (api.get as any).mockResolvedValue({
            data: [{ id: "1", name: "Bank A", type: "CHECKING" }],
        });
        (ImportService.uploadFile as any).mockResolvedValue([
            {
                date: new Date(),
                amount: 100,
                description: "Test Transaction",
            },
        ]);

        renderWithRouter(<ImportPage />);

        // Wait for accounts to load and select one (default first one selected)
        await waitFor(() => {
            expect(screen.getByText("Bank A (CHECKING)")).toBeInTheDocument();
        });

        // Trigger upload
        const dropText = screen.getByText("Drag & drop an OFX file here");
        fireEvent.click(dropText);

        // Expect loading state?
        // Expect review step
        await waitFor(() => {
            expect(screen.getByText("Review Transactions")).toBeInTheDocument();
            expect(
                screen.getByText("1 new transactions found.")
            ).toBeInTheDocument();
        });
    });

    it("handles upload error", async () => {
        (api.get as any).mockResolvedValue({
            data: [{ id: "1", name: "Bank A", type: "CHECKING" }],
        });
        (ImportService.uploadFile as any).mockRejectedValue(
            new Error("Parse error")
        );

        renderWithRouter(<ImportPage />);

        await waitFor(() => {
            expect(screen.getByText("Bank A (CHECKING)")).toBeInTheDocument();
        });

        const dropText = screen.getByText("Drag & drop an OFX file here");
        fireEvent.click(dropText);

        await waitFor(() => {
            expect(screen.getByRole("dialog")).toBeInTheDocument();
            expect(
                screen.getByText("Failed to parse file")
            ).toBeInTheDocument();
        });
    });

    it("confirms import successfully", async () => {
        (api.get as any).mockResolvedValue({
            data: [{ id: "1", name: "Bank A", type: "CHECKING" }],
        });
        // Setup state as if review is active
        (ImportService.uploadFile as any).mockResolvedValue([
            {
                date: new Date(),
                amount: 100,
                description: "Test Transaction",
            },
        ]);
        (ImportService.confirmImport as any).mockResolvedValue(true);

        renderWithRouter(<ImportPage />);
        await waitFor(() =>
            expect(screen.getByText("Bank A (CHECKING)")).toBeInTheDocument()
        );

        // Go to review
        fireEvent.click(screen.getByText("Drag & drop an OFX file here"));
        await waitFor(() =>
            expect(screen.getByText("Review Transactions")).toBeInTheDocument()
        );

        // Confirm
        fireEvent.click(screen.getByText("Confirm Import"));

        await waitFor(() => {
            expect(screen.getByRole("dialog")).toBeInTheDocument();
            expect(screen.getByText("Import successful!")).toBeInTheDocument();
        });

        // Should return to upload step
        fireEvent.click(screen.getByText("OK")); // Close alert
        expect(
            screen.queryByText("Review Transactions")
        ).not.toBeInTheDocument();
    });

    it("handles confirm error", async () => {
        (api.get as any).mockResolvedValue({
            data: [{ id: "1", name: "Bank A", type: "CHECKING" }],
        });
        (ImportService.uploadFile as any).mockResolvedValue([
            { date: new Date(), amount: 100, description: "Test" },
        ]);
        (ImportService.confirmImport as any).mockRejectedValue(
            new Error("API Error")
        );

        renderWithRouter(<ImportPage />);
        await waitFor(() =>
            expect(screen.getByText("Bank A (CHECKING)")).toBeInTheDocument()
        );
        fireEvent.click(screen.getByText("Drag & drop an OFX file here"));
        await waitFor(() =>
            expect(screen.getByText("Review Transactions")).toBeInTheDocument()
        );

        fireEvent.click(screen.getByText("Confirm Import"));

        await waitFor(() => {
            expect(screen.getByRole("dialog")).toBeInTheDocument();
            expect(
                screen.getByText("Failed to confirm import")
            ).toBeInTheDocument();
        });
    });

    it("cancels import review", async () => {
        (api.get as any).mockResolvedValue({
            data: [{ id: "1", name: "Bank A", type: "CHECKING" }],
        });
        (ImportService.uploadFile as any).mockResolvedValue([
            { date: new Date(), amount: 100, description: "Test" },
        ]);

        renderWithRouter(<ImportPage />);
        await waitFor(() =>
            expect(screen.getByText("Bank A (CHECKING)")).toBeInTheDocument()
        );
        fireEvent.click(screen.getByText("Drag & drop an OFX file here"));
        await waitFor(() =>
            expect(screen.getByText("Review Transactions")).toBeInTheDocument()
        );

        fireEvent.click(screen.getByText("Cancel"));

        await waitFor(() => {
            expect(
                screen.queryByText("Review Transactions")
            ).not.toBeInTheDocument();
            expect(
                screen.getByText("Drag & drop an OFX file here")
            ).toBeInTheDocument();
        });
    });
});
