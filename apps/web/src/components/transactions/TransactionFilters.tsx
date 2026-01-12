import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { DatePicker } from "../ui/DatePicker";
import { X } from "lucide-react";
import { format } from "date-fns";
import type { Account } from "../../types";

export interface FilterState {
    search: string;
    accountId: string;
    category: string;
    startDate: string;
    endDate: string;
}

interface TransactionFiltersProps {
    filters: FilterState;
    onChange: (filters: FilterState) => void;
    accounts: Account[];
    categories: string[];
}

export function TransactionFilters({
    filters,
    onChange,
    accounts,
    categories,
}: TransactionFiltersProps) {
    const handleChange = (key: keyof FilterState, value: string) => {
        onChange({ ...filters, [key]: value });
    };

    const handleClear = () => {
        onChange({
            search: "",
            accountId: "all",
            category: "all",
            startDate: "",
            endDate: "",
        });
    };

    return (
        <div className="bg-card border rounded-xl p-4 mb-6 shadow-sm space-y-4 md:space-y-0 md:flex md:items-center md:gap-4 md:flex-wrap">
            {/* Search - Grows to fill available space */}
            <div className="w-full md:flex-1 min-w-50">
                <Input
                    placeholder="Buscar por descrição..."
                    value={filters.search}
                    onChange={(e) => handleChange("search", e.target.value)}
                    className="w-full"
                />
            </div>

            {/* Account & Category - 50% on mobile, auto on desktop */}
            <div className="grid grid-cols-2 gap-2 w-full md:w-auto md:flex md:gap-2">
                <div className="w-full md:w-45">
                    <Select
                        value={filters.accountId}
                        onChange={(value) => handleChange("accountId", value)}
                        options={[
                            { value: "all", label: "Todas as Contas" },
                            ...accounts.map((acc) => ({
                                value: acc.id,
                                label: acc.name,
                            })),
                        ]}
                        placeholder="Conta"
                    />
                </div>
                <div className="w-full md:w-45">
                    <Select
                        value={filters.category}
                        onChange={(value) => handleChange("category", value)}
                        options={[
                            { value: "all", label: "Todas as Categorias" },
                            ...categories.map((cat) => ({
                                value: cat,
                                label: cat,
                            })),
                        ]}
                        placeholder="Categoria"
                    />
                </div>
            </div>

            {/* Dates - Grouped */}
            <div className="flex items-center gap-2 w-full md:w-auto">
                <DatePicker
                    date={
                        filters.startDate
                            ? new Date(filters.startDate + "T00:00:00")
                            : undefined
                    }
                    setDate={(date) =>
                        handleChange(
                            "startDate",
                            date ? format(date, "yyyy-MM-dd") : ""
                        )
                    }
                    className="w-full md:w-37.5"
                    placeholder="Início"
                />
                <span className="text-muted-foreground">-</span>
                <DatePicker
                    date={
                        filters.endDate
                            ? new Date(filters.endDate + "T00:00:00")
                            : undefined
                    }
                    setDate={(date) =>
                        handleChange(
                            "endDate",
                            date ? format(date, "yyyy-MM-dd") : ""
                        )
                    }
                    className="w-full md:w-37.5"
                    placeholder="Fim"
                />
            </div>

            {/* Clear Filters - Icon Only */}
            <div className="flex justify-end md:justify-start">
                <Button
                    variant="ghost"
                    onClick={handleClear}
                    className="text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 h-10 w-10 p-0"
                    size="icon"
                    title="Limpar Filtros"
                    data-testid="clear-filters-button"
                >
                    <X className="w-5 h-5" />
                    <span className="sr-only">Limpar Filtros</span>
                </Button>
            </div>
        </div>
    );
}
