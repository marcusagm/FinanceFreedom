import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Button } from "../ui/Button";
import { X } from "lucide-react";
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
            <div className="w-full md:flex-1 min-w-[200px]">
                <Input
                    placeholder="Buscar por descrição..."
                    value={filters.search}
                    onChange={(e) => handleChange("search", e.target.value)}
                    className="w-full"
                />
            </div>

            {/* Account & Category - 50% on mobile, auto on desktop */}
            <div className="grid grid-cols-2 gap-2 w-full md:w-auto md:flex md:gap-2">
                <div className="w-full md:w-[180px]">
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
                <div className="w-full md:w-[180px]">
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
                <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleChange("startDate", e.target.value)}
                    className="w-full md:w-auto"
                    title="Data Inicial"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleChange("endDate", e.target.value)}
                    className="w-full md:w-auto"
                    title="Data Final"
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
                >
                    <X className="w-5 h-5" />
                    <span className="sr-only">Limpar Filtros</span>
                </Button>
            </div>
        </div>
    );
}
