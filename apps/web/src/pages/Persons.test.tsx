// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import {
    render,
    screen,
    waitFor,
    fireEvent,
    cleanup,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PersonsPage from "./Persons";
import { personService } from "../services/person.service";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

// Mock dependencies
vi.mock("../services/person.service", () => ({
    personService: {
        findAll: vi.fn(),
        remove: vi.fn(),
    },
}));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock sub-components
vi.mock("../components/person/PersonList", () => ({
    PersonList: ({ persons, onEdit, onDelete }: any) => (
        <div data-testid="person-list">
            {persons.map((p: any) => (
                <div key={p.id}>
                    {p.name}
                    <button onClick={() => onEdit(p)}>Edit {p.name}</button>
                    <button onClick={() => onDelete(p)}>Delete {p.name}</button>
                </div>
            ))}
        </div>
    ),
}));

vi.mock("../components/person/PersonForm", () => ({
    PersonForm: ({ open, onSuccess }: any) =>
        open ? (
            <div data-testid="person-form">
                <button onClick={onSuccess}>Save</button>
            </div>
        ) : null,
}));

vi.mock("../components/person/DeletePersonDialog", () => ({
    DeletePersonDialog: ({ isOpen, onConfirm, name }: any) =>
        isOpen ? (
            <div data-testid="delete-dialog">
                Deleting {name}
                <button onClick={onConfirm}>Confirm</button>
            </div>
        ) : null,
}));

describe("PersonsPage", () => {
    const persons = [
        {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            phone: "",
            userId: "u1",
            createdAt: "",
            updatedAt: "",
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        (personService.findAll as any).mockResolvedValue(persons);
    });

    afterEach(() => {
        cleanup();
    });

    it("loads and displays persons", async () => {
        render(<PersonsPage />);
        expect(screen.getByText("common.loading")).toBeInTheDocument();

        await waitFor(() =>
            expect(screen.getByTestId("person-list")).toBeInTheDocument(),
        );
        expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("opens create form", async () => {
        const user = userEvent.setup();
        render(<PersonsPage />);
        await waitFor(() =>
            expect(screen.getByTestId("person-list")).toBeInTheDocument(),
        );

        await user.click(screen.getByText("persons.newPerson"));
        expect(screen.getByTestId("person-form")).toBeInTheDocument();
    });

    it("opens edit form", async () => {
        const user = userEvent.setup();
        render(<PersonsPage />);
        await waitFor(() =>
            expect(screen.getByTestId("person-list")).toBeInTheDocument(),
        );

        await user.click(screen.getByText("Edit John Doe"));
        expect(screen.getByTestId("person-form")).toBeInTheDocument();
    });

    it("opens delete dialog and deletes person", async () => {
        const user = userEvent.setup();
        render(<PersonsPage />);
        await waitFor(() =>
            expect(screen.getByTestId("person-list")).toBeInTheDocument(),
        );

        await user.click(screen.getByText("Delete John Doe"));
        expect(screen.getByTestId("delete-dialog")).toBeInTheDocument();
        expect(screen.getByText("Deleting John Doe")).toBeInTheDocument();

        await user.click(screen.getByText("Confirm"));

        await waitFor(() =>
            expect(personService.remove).toHaveBeenCalledWith("1"),
        );
        expect(personService.findAll).toHaveBeenCalledTimes(2); // Initial + After delete
    });
});
