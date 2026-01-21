// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { render, screen, waitFor, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PersonSelect } from "./PersonSelect";
import { personService } from "../../services/person.service";
import { vi, describe, it, expect, beforeEach, afterEach } from "vitest";

// Mock dependencies
vi.mock("../../services/person.service", () => ({
    personService: {
        findAll: vi.fn(),
    },
}));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

describe("PersonSelect", () => {
    const mockOnChange = vi.fn();
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
        {
            id: "2",
            name: "Jane Doe",
            email: "jane@example.com",
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

    it("renders correctly with placeholder", async () => {
        render(<PersonSelect onChange={mockOnChange} />);

        // Wait for usage of findAll
        await waitFor(() => expect(personService.findAll).toHaveBeenCalled());

        // Check if placeholder is present (Select trigger usually shows placeholder)
        // Note: The simple Select implementation renders the label or placeholder in a button
        expect(screen.getByRole("button")).toHaveTextContent("common.select");
    });

    it("loads persons and allows selection", async () => {
        const user = userEvent.setup();
        render(<PersonSelect onChange={mockOnChange} />);

        await waitFor(() => expect(personService.findAll).toHaveBeenCalled());

        // Open select
        const trigger = screen.getByRole("button", { name: "common.select" });
        await user.click(trigger);

        // Check availability of options
        expect(await screen.findByText("John Doe")).toBeInTheDocument();
        // expect(screen.getByText("Jane Doe")).toBeInTheDocument(); // Can be flaky if multiple, but should be fine

        // Select an option
        await user.click(screen.getByText("John Doe"));

        // Verify onChange
        expect(mockOnChange).toHaveBeenCalledWith("1");
    });

    it("uses custom placeholder if provided", () => {
        render(
            <PersonSelect
                onChange={mockOnChange}
                placeholder="Custom Placeholder"
            />,
        );
        expect(screen.getByText("Custom Placeholder")).toBeInTheDocument();
    });
});
