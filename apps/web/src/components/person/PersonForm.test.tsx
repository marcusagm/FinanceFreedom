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

vi.mock("../ui/Input", async (importOriginal) => {
    const React = await import("react");
    return {
        Input: React.forwardRef((props: any, ref: any) => (
            <input data-testid="ui-input" ref={ref} {...props} />
        )),
    };
});

vi.mock("../ui/Button", () => ({
    Button: (props: any) => <button {...props} />,
}));

vi.mock("../ui/Dialog", () => ({
    Dialog: ({ children, open }: any) => (open ? <div>{children}</div> : null),
    DialogContent: ({ children }: any) => <div>{children}</div>,
    DialogHeader: ({ children }: any) => <div>{children}</div>,
    DialogTitle: ({ children }: any) => <div>{children}</div>,
    DialogBody: ({ children }: any) => <div>{children}</div>,
    DialogFooter: ({ children }: any) => <div>{children}</div>,
}));

vi.mock("../ui/Form", async () => {
    const { Controller } = await import("react-hook-form");
    const React = await import("react");
    const MockFormContext = React.createContext<any>({});

    return {
        Form: ({ children }: any) => <>{children}</>,
        FormControl: ({ children }: any) => <div>{children}</div>,
        FormItem: ({ children }: any) => <div>{children}</div>,
        FormLabel: ({ children }: any) => <label>{children}</label>,
        FormMessage: () => {
            const { error } = React.useContext(MockFormContext);
            return error ? <div>{error.message}</div> : null;
        },
        FormField: ({ control, name, render }: any) => (
            <Controller
                control={control}
                name={name}
                render={(props: any) => (
                    <MockFormContext.Provider
                        value={{ error: props.fieldState.error }}
                    >
                        {render(props)}
                    </MockFormContext.Provider>
                )}
            />
        ),
    };
});

vi.mock("react-number-format", () => ({
    PatternFormat: ({ customInput: Component, ...props }: any) => {
        // If customInput is provided, render it with props
        if (Component) return <Component {...props} />;
        return <input {...props} />;
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
        expect(screen.getByText("persons.form.nameLabel")).toBeInTheDocument();
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

        const nameInput = screen.getByPlaceholderText(
            "persons.form.namePlaceholder",
        );
        await user.type(nameInput, "John Doe");

        const saveButton = screen.getByRole("button", { name: "common.save" });
        fireEvent.submit(saveButton.closest("form")!);

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

        const nameInput = screen.getByPlaceholderText(
            "persons.form.namePlaceholder",
        );
        await user.clear(nameInput);
        await user.type(nameInput, "Jane Smith");

        const saveButton = screen.getByRole("button", { name: "common.save" });
        fireEvent.submit(saveButton.closest("form")!);

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
