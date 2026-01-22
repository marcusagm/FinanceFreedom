import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { PageHeader } from "../components/ui/PageHeader";
import {
    analyticsService,
    type BudgetStatus,
} from "../services/analytics.service";
import type { Category } from "../services/category.service";
import { categoryService } from "../services/category.service";
import { format } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { useLocalization } from "../contexts/LocalizationContext";

export function Budgets() {
    const { t } = useTranslation();
    const { language } = useLocalization();
    const [categories, setCategories] = useState<Category[]>([]);
    const [budgetData, setBudgetData] = useState<BudgetStatus[]>([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [loading, setLoading] = useState(true);
    const [editingBudgets, setEditingBudgets] = useState<
        Record<string, number>
    >({});

    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const dateStr = format(selectedDate, "yyyy-MM-dd");
            const [categoriesData, budgetsData] = await Promise.all([
                categoryService.getAll(),
                analyticsService.getBudgets(dateStr),
            ]);
            setCategories(categoriesData);
            setBudgetData(budgetsData);
        } catch (error) {
            console.error("Failed to fetch budget data", error);
            toast.error(t("common.error"));
        } finally {
            setLoading(false);
        }
    };

    const handleMonthChange = (offset: number) => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setSelectedDate(newDate);
        setEditingBudgets({});
    };

    const handleBudgetChange = (categoryId: string, value: number) => {
        setEditingBudgets((prev) => ({
            ...prev,
            [categoryId]: value,
        }));
    };

    const handleSave = async (categoryId: string) => {
        const amount = editingBudgets[categoryId];
        if (amount === undefined) return;

        try {
            await analyticsService.upsertBudget({
                categoryId,
                amount,
                month: selectedDate.getMonth() + 1,
                year: selectedDate.getFullYear(),
            });
            toast.success(t("common.success"));
            fetchData();
        } catch (error) {
            console.error("Failed to save budget", error);
            toast.error(t("common.error"));
        }
    };

    const expenseCategories = categories.filter(
        (c) => !c.type || c.type === "EXPENSE",
    );

    // Helper to order categories hierarchically or alphabetically
    const sortedCategories = expenseCategories.sort((a, b) => {
        // Simple sort by name for now, or grouped by parent
        return a.name.localeCompare(b.name);
    });

    const getDateLocale = () => {
        return language === "pt-BR" ? ptBR : enUS;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader
                title={t("budgets.title", { defaultValue: "Orçamentos" })}
                description={t("budgets.subtitle", {
                    defaultValue: "Gerencie seus limites mensais",
                })}
                actions={
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleMonthChange(-1)}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="min-w-30 text-center font-medium capitalize">
                            {format(selectedDate, "MMMM yyyy", {
                                locale: getDateLocale(),
                            })}
                        </span>
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleMonthChange(1)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                }
            />

            <div className="bg-card border rounded-lg overflow-hidden mt-6">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                            <tr>
                                <th className="px-6 py-3">
                                    {t("categories.nameLabel")}
                                </th>
                                <th className="px-6 py-3">
                                    {t("categories.budgetLabel")} (Padrão)
                                </th>
                                <th className="px-6 py-3">
                                    {t("budgets.monthlyLimit", {
                                        defaultValue: "Limite Mensal",
                                    })}
                                </th>
                                <th className="px-6 py-3 text-right">
                                    {t("common.actions")}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-6 py-8 text-center text-muted-foreground"
                                    >
                                        {t("common.loading")}...
                                    </td>
                                </tr>
                            ) : sortedCategories.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-6 py-8 text-center text-muted-foreground"
                                    >
                                        {t("categories.emptyGroup")}
                                    </td>
                                </tr>
                            ) : (
                                sortedCategories.map((category) => {
                                    const budget = budgetData.find(
                                        (b) => b.categoryId === category.id,
                                    );
                                    const currentLimit =
                                        editingBudgets[category.id] !==
                                        undefined
                                            ? editingBudgets[category.id]
                                            : budget?.limit || 0;
                                    const hasChanges =
                                        editingBudgets[category.id] !==
                                            undefined &&
                                        editingBudgets[category.id] !==
                                            (budget?.limit || 0);

                                    const parentName = category.parentId
                                        ? categories.find(
                                              (c) => c.id === category.parentId,
                                          )?.name
                                        : null;

                                    return (
                                        <tr
                                            key={category.id}
                                            className="border-b last:border-0 hover:bg-muted/50 transition-colors"
                                        >
                                            <td className="px-6 py-4 font-medium">
                                                <div className="flex flex-col">
                                                    <span>{category.name}</span>
                                                    {parentName && (
                                                        <span className="text-xs text-muted-foreground">
                                                            {parentName}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground">
                                                {Number(
                                                    category.budgetLimit,
                                                ).toLocaleString("pt-BR", {
                                                    style: "currency",
                                                    currency: "BRL",
                                                })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="max-w-37.5">
                                                    <Input
                                                        currency
                                                        value={currentLimit}
                                                        onValueChange={(vals) =>
                                                            handleBudgetChange(
                                                                category.id,
                                                                vals.floatValue ||
                                                                    0,
                                                            )
                                                        }
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {hasChanges && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            handleSave(
                                                                category.id,
                                                            )
                                                        }
                                                        title={t("common.save")}
                                                    >
                                                        <Save className="w-4 h-4" />
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
