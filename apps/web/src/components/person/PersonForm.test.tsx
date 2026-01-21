// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import React from "react";
import {
    render,
    screen,
    fireEvent,
    waitFor,
    cleanup,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PersonForm } from "./PersonForm";
import { personService } from "../../services/person.service";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";
import type { Person } from "../../types/person";
import { LocalizationProvider } from "../../contexts/LocalizationContext";

// Mock dependencies
vi.mock("../../services/person.service", () => ({
    personService: {
        create: vi.fn(),
        update: vi.fn(),
    },
}));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            language: "en",
        },
    }),
}));

vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe("PersonForm", () => {
    const mockOnOpenChange = vi.fn();
    const mockOnSuccess = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it("renders correctly when open", () => {
        render(
            <LocalizationProvider>
                <PersonForm
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onSuccess={mockOnSuccess}
                />
            </LocalizationProvider>,
        );

        expect(screen.getByText("persons.form.titleNew")).toBeInTheDocument();
        expect(
            screen.getByLabelText("persons.form.nameLabel"),
        ).toBeInTheDocument();
    });

    it("submits the form with valid data (create)", async () => {
        const user = userEvent.setup();
        (personService.create as any).mockResolvedValue({});

        render(
            <LocalizationProvider>
                <PersonForm
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    onSuccess={mockOnSuccess}
                />
            </LocalizationProvider>,
        );

        const nameInput = screen.getByLabelText("persons.form.nameLabel");
        await user.type(nameInput, "John Doe");

        const saveButton = screen.getByRole("button", { name: "common.save" });
        await user.click(saveButton);

        await waitFor(() => {
            expect(personService.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: "John Doe",
                }),
            );
            expect(mockOnSuccess).toHaveBeenCalled();
            expect(mockOnOpenChange).toHaveBeenCalledWith(false);
        });
    });

    it("submits the form with valid data (update)", async () => {
        const user = userEvent.setup();
        const person: Person = {
            id: "1",
            name: "Jane Doe",
            email: "jane@example.com",
            phone: "",
            userId: "user1",
            createdAt: "",
            updatedAt: "",
        };

        (personService.update as any).mockResolvedValue({});

        render(
            <LocalizationProvider>
                <PersonForm
                    open={true}
                    onOpenChange={mockOnOpenChange}
                    personToEdit={person}
                    onSuccess={mockOnSuccess}
                />
            </LocalizationProvider>,
        );

        expect(screen.getByDisplayValue("Jane Doe")).toBeInTheDocument();

        const nameInput = screen.getByLabelText("persons.form.nameLabel");
        await user.clear(nameInput);
        await user.type(nameInput, "Jane Smith");

        const saveButton = screen.getByRole("button", { name: "common.save" });
        await user.click(saveButton);

        await waitFor(() => {
            expect(personService.update).toHaveBeenCalledWith(
                "1",
                expect.objectContaining({
                    name: "Jane Smith",
                }),
            );
            expect(mockOnSuccess).toHaveBeenCalled();
        });
    });
});
