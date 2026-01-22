import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { categoryService } from "../../services/category.service";
import { CategoryDialog } from "./CategoryDialog";

// Mock dependencies
vi.mock("../../services/category.service");
vi.mock("sonner", () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

vi.mock("react-i18next", () => ({
    useTranslation: () => ({
        t: (key: string, options?: any) => {
            const map: Record<string, string> = {
                "categories.createTitle": "Nova Categoria",
                "categories.editTitle": "Editar Categoria",
                "categories.namePlaceholder": "Ex: Alimentação",
                "auth.validation.nameRequired": "Nome é obrigatório",
                "common.save": options?.defaultValue || "Salvar",
                "common.success": "Categoria criada!", // For create
                // Note: Component uses "common.success" for update too.
            };
            // Dynamic behavior for success message?
            if (key === "common.success") return "Categoria criada!";
            if (key === "common.error") return "Erro";

            // Allow default value
            if (options?.defaultValue) return options.defaultValue;

            return map[key] || key;
        },
    }),
    initReactI18next: {
        type: "3rdParty",
        init: () => {},
    },
}));

vi.mock("../ui/Input", () => ({
    Input: ({ onValueChange, currency, ...props }: any) => (
        <input
            data-testid="mock-input"
            {...props}
            onChange={(e) => {
                props.onChange?.(e);
                if (onValueChange) {
                    onValueChange({ floatValue: Number(e.target.value) });
                }
            }}
        />
    ),
}));

vi.mock("./CategorySelect", () => ({
    CategorySelect: (props: any) => (
        <select data-testid="category-select" {...props} />
    ),
}));

vi.mock("../ui/ColorInput", () => ({
    ColorInput: (props: any) => <input data-testid="color-input" {...props} />,
}));

vi.mock("../ui/Select", () => ({
    Select: (props: any) => <select data-testid="ui-select" {...props} />,
}));

vi.mock("../ui/Button", () => ({
    Button: (props: any) => <button {...props} />,
}));

vi.mock("lucide-react", () => ({
    Loader2: () => <span data-testid="loader" />,
}));

vi.mock("../ui/Form", async (importOriginal) => {
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

vi.mock("../ui/Dialog", () => {
    return {
        Dialog: ({ children, open }: any) =>
            open ? <div>{children}</div> : null,
        DialogContent: ({ children }: any) => <div>{children}</div>,
        DialogHeader: ({ children }: any) => <div>{children}</div>,
        DialogTitle: ({ children }: any) => <div>{children}</div>,
        DialogDescription: ({ children }: any) => <div>{children}</div>,
        DialogBody: ({ children }: any) => <div>{children}</div>,
        DialogFooter: ({ children }: any) => <div>{children}</div>,
    };
});

describe("CategoryDialog", () => {
    const mockOnClose = vi.fn();
    const mockOnSuccess = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should render create form correctly", async () => {
        render(
            <CategoryDialog
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
                categoryToEdit={null}
                categories={[]}
            />,
        );

        expect(screen.getByText(/Nova Categoria/i)).toBeInTheDocument();
        expect(
            screen.getByPlaceholderText(/Ex: Alimentação/i),
        ).toBeInTheDocument();
        // Color input text field
        expect(screen.getByDisplayValue("#3B82F6")).toBeInTheDocument();
        // Budget limit
        await waitFor(() => {
            const inputs = screen.getAllByRole("textbox");
            expect(inputs.length).toBeGreaterThanOrEqual(2); // Name, Color hex, Budget
        });
    });

    it("should render edit form correctly", () => {
        const category = {
            id: "1",
            name: "Food",
            color: "#FF0000",
            budgetLimit: 1000,
        };
        render(
            <CategoryDialog
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
                categoryToEdit={category}
                categories={[]}
            />,
        );

        expect(screen.getByText("Editar Categoria")).toBeInTheDocument();
        expect(screen.getByDisplayValue("Food")).toBeInTheDocument();
        expect(screen.getByDisplayValue("1000")).toBeInTheDocument(); // Mock Input renders raw value
    });

    it("should show validation errors", async () => {
        render(
            <CategoryDialog
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
                categoryToEdit={null}
                categories={[]}
            />,
        );

        fireEvent.click(screen.getByText("Salvar"));

        await waitFor(() => {
            expect(screen.getByText("Nome é obrigatório")).toBeInTheDocument();
        });
    });

    it("should call create service on submit", async () => {
        (categoryService.create as any).mockResolvedValue({});
        render(
            <CategoryDialog
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
                categoryToEdit={null}
                categories={[]}
            />,
        );

        fireEvent.change(screen.getByPlaceholderText("Ex: Alimentação"), {
            target: { value: "Transport" },
        });
        // Simulating color change might be tricky depending on ColorInput implementation,
        // usually it's an input type='color' or a custom component.
        // Assuming default color is fine.

        // Handling currency input
        const budgetInput = screen.getByPlaceholderText("0,00");
        fireEvent.change(budgetInput, { target: { value: "500" } });

        fireEvent.click(screen.getByText("Salvar"));

        await waitFor(() => {
            expect(categoryService.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    name: "Transport",
                    color: "#3B82F6", // Default value
                    budgetLimit: 500,
                    type: "EXPENSE",
                }),
            );
            expect(mockOnSuccess).toHaveBeenCalled();
            expect(mockOnClose).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith("Categoria criada!");
        });
    });

    it("should call update service on submit", async () => {
        const category = {
            id: "1",
            name: "Food",
            color: "#FF0000",
            budgetLimit: 1000,
        };
        (categoryService.update as any).mockResolvedValue({});

        render(
            <CategoryDialog
                isOpen={true}
                onClose={mockOnClose}
                onSuccess={mockOnSuccess}
                categoryToEdit={category}
                categories={[]}
            />,
        );

        fireEvent.change(screen.getByPlaceholderText("Ex: Alimentação"), {
            target: { value: "Food Updated" },
        });

        fireEvent.click(screen.getByText("Salvar"));

        await waitFor(() => {
            expect(categoryService.update).toHaveBeenCalledWith(
                "1",
                expect.objectContaining({
                    name: "Food Updated",
                    budgetLimit: 1000,
                    type: "EXPENSE",
                }),
            );
            expect(mockOnSuccess).toHaveBeenCalled();
            expect(mockOnClose).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith("Categoria criada!");
        });
    });
});
