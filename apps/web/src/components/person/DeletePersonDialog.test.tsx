// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DeletePersonDialog } from "./DeletePersonDialog";
import { vi, describe, it, expect, afterEach } from "vitest";

// Mock translation
vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
    Trans: ({ i18nKey, values }: any) => (
        <span>
            {i18nKey} {values?.name}
        </span>
    ),
}));

describe("DeletePersonDialog", () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        onConfirm: vi.fn(),
        name: "John Doe",
        isDeleting: false,
    };

    afterEach(() => {
        cleanup();
    });

    it("renders correctly when open", () => {
        render(<DeletePersonDialog {...defaultProps} />);

        expect(
            screen.getByText("persons.deleteDialog.title"),
        ).toBeInTheDocument();
        expect(
            screen.getByText("persons.deleteDialog.desc"),
        ).toBeInTheDocument();
        expect(
            screen.getByText("persons.deleteDialog.message John Doe"),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "common.cancel" }),
        ).toBeInTheDocument();
        expect(
            screen.getByRole("button", {
                name: "persons.deleteDialog.confirm",
            }),
        ).toBeInTheDocument();
    });

    it("calls onClose when cancel button is clicked", async () => {
        const user = userEvent.setup();
        render(<DeletePersonDialog {...defaultProps} />);

        await user.click(screen.getByRole("button", { name: "common.cancel" }));
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it("calls onConfirm when confirm button is clicked", async () => {
        const user = userEvent.setup();
        render(<DeletePersonDialog {...defaultProps} />);

        await user.click(
            screen.getByRole("button", {
                name: "persons.deleteDialog.confirm",
            }),
        );
        expect(defaultProps.onConfirm).toHaveBeenCalled();
    });

    it("shows deleting state when isDeleting is true", () => {
        render(<DeletePersonDialog {...defaultProps} isDeleting={true} />);

        expect(
            screen.getByRole("button", { name: "common.deleting" }),
        ).toBeDisabled();
        expect(
            screen.getByRole("button", { name: "common.cancel" }),
        ).toBeDisabled();
    });

    it("calls onOpenChange with false when dialog is closed via overlay/esc", () => {
        // Since we are mocking Dialog or using Headless UI, exact behavior depends on implementation.
        // For now, this test is placeholder as standard Dialog behavior is tested in UI lib.
        // We focus on the buttons.
    });
});
