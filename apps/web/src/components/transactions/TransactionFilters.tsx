import { format } from "date-fns";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Category } from "../../services/category.service";
import type { Account } from "../../types";
import { Button } from "../ui/Button";
import { DatePicker } from "../ui/DatePicker";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";

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
    categories: Category[];
}

export function TransactionFilters({
    filters,
    onChange,
    accounts,
    categories,
}: TransactionFiltersProps) {
    const { t } = useTranslation();

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
                    placeholder={t("transactions.filters.searchPlaceholder")}
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
                            {
                                value: "all",
                                label: t("transactions.filters.allAccounts"),
                            },
                            ...accounts.map((acc) => ({
                                value: acc.id,
                                label: acc.name,
                            })),
                        ]}
                        placeholder={t(
                            "transactions.filters.accountPlaceholder"
                        )}
                    />
                </div>
                <div className="w-full md:w-45">
                    <Select
                        value={filters.category}
                        onChange={(value) => handleChange("category", value)}
                        options={[
                            {
                                value: "all",
                                label: t("transactions.filters.allCategories"),
                            },
                            ...categories
                                .sort((a, b) => {
                                    if (a.type === b.type)
                                        return a.name.localeCompare(b.name);
                                    return (a.type || "EXPENSE") === "INCOME"
                                        ? -1
                                        : 1;
                                })
                                .map((cat) => ({
                                    value: cat.name,
                                    label:
                                        cat.type === "INCOME"
                                            ? `${cat.name}`
                                            : `${cat.name}`,
                                })),
                        ]}
                        placeholder={t(
                            "transactions.filters.categoryPlaceholder"
                        )}
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
                    placeholder={t("transactions.filters.dateStart")}
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
                    placeholder={t("transactions.filters.dateEnd")}
                />
            </div>

            {/* Clear Filters - Icon Only */}
            <div className="flex justify-end md:justify-start">
                <Button
                    variant="ghost"
                    onClick={handleClear}
                    className="text-muted-foreground hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 h-10 w-10 p-0"
                    size="icon"
                    title={t("transactions.filters.clear")}
                    data-testid="clear-filters-button"
                >
                    <X className="w-5 h-5" />
                    <span className="sr-only">
                        {t("transactions.filters.clear")}
                    </span>
                </Button>
            </div>
        </div>
    );
}
