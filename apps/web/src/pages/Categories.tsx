import { ChevronLeft, ChevronRight, Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { CategoryDialog } from "../components/category/CategoryDialog";
import { CategoryList } from "../components/category/CategoryList";
import { DeleteCategoryDialog } from "../components/category/DeleteCategoryDialog";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import {
    analyticsService,
    type BudgetStatus,
    type IncomeStatus,
} from "../services/analytics.service";
import { format } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { useLocalization } from "../contexts/LocalizationContext";
import { type Category, categoryService } from "../services/category.service";

export function Categories() {
    const { t } = useTranslation();
    const { language } = useLocalization();
    const [categories, setCategories] = useState<Category[]>([]);
    const [budgetData, setBudgetData] = useState<BudgetStatus[]>([]);
    const [incomeData, setIncomeData] = useState<IncomeStatus[]>([]);
    const [loading, setLoading] = useState(true);

    // Dialog states
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null,
    );

    // Delete states
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);

    // Date state
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        fetchData();
    }, [selectedDate]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const dateStr = format(selectedDate, "yyyy-MM-dd");
            const [categoriesData, budgetsData, incomesData] =
                await Promise.all([
                    categoryService.getAll(),
                    analyticsService.getBudgets(dateStr).catch((err) => {
                        console.error("Failed to fetch budgets", err);
                        return [];
                    }),
                    analyticsService.getIncomes(dateStr).catch((err) => {
                        console.error("Failed to fetch incomes", err);
                        return [];
                    }),
                ]);
            setCategories(categoriesData);
            setBudgetData(budgetsData);
            setIncomeData(incomesData);
        } catch (error) {
            console.error("Failed to fetch categories", error);
            toast.error(t("categories.loadError"));
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingCategory(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setIsDialogOpen(true);
    };

    const handleDeleteClick = (category: Category) => {
        setCategoryToDelete(category);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!categoryToDelete) return;
        setIsDeleting(true);
        try {
            await categoryService.delete(categoryToDelete.id);
            toast.success(t("categories.deleteSuccess"));
            await fetchData();
            setIsDeleteDialogOpen(false);
            setCategoryToDelete(null);
        } catch (error) {
            console.error("Failed to delete category", error);
            toast.error(t("categories.deleteError"));
        } finally {
            setIsDeleting(false);
        }
    };

    const handleBudgetChange = async (categoryId: string, amount: number) => {
        try {
            await analyticsService.upsertBudget({
                categoryId,
                amount,
                date: format(selectedDate, "yyyy-MM-dd"),
            });

            setBudgetData((prev) => {
                const existingIndex = prev.findIndex(
                    (b) => b.categoryId === categoryId,
                );
                if (existingIndex >= 0) {
                    const newArr = [...prev];
                    const existing = newArr[existingIndex];
                    const spent = existing.spent;
                    newArr[existingIndex] = {
                        ...existing,
                        limit: amount,
                        remaining: amount - spent,
                        percentage: amount > 0 ? (spent / amount) * 100 : 0,
                    };
                    return newArr;
                }
                // If not found, we rely on fetchData to add it, or we could look up the category and add it loosely.
                // For editing (which is the main case), this covers it.
                return prev;
            });

            toast.success(t("common.savedSuccess"));
            // Optimistically update or refetch
            fetchData();
        } catch (error) {
            console.error("Failed to save budget", error);
            toast.error(t("common.error"));
        }
    };

    const handleMonthChange = (offset: number) => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setSelectedDate(newDate);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader
                title={t("categories.title")}
                description={t("categories.subtitle")}
                actions={
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 mr-4 border rounded-md p-1">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMonthChange(-1)}
                                className="h-8 w-8"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="min-w-32 text-center font-medium capitalize text-sm">
                                {format(selectedDate, "MMMM yyyy", {
                                    locale: language === "pt-BR" ? ptBR : enUS,
                                })}
                            </span>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleMonthChange(1)}
                                className="h-8 w-8"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                        <Button onClick={handleCreate}>
                            <Plus className="mr-2 h-4 w-4" />{" "}
                            {t("categories.newCategory")}
                        </Button>
                    </div>
                }
            />

            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <CategoryList
                    categories={categories}
                    budgetData={budgetData}
                    incomeData={incomeData}
                    onEdit={handleEdit}
                    onDelete={(id) => {
                        const cat = categories.find((c) => c.id === id);
                        if (cat) handleDeleteClick(cat);
                    }}
                    onBudgetChange={handleBudgetChange}
                />
            )}

            <CategoryDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSuccess={fetchData}
                categoryToEdit={editingCategory}
                categories={categories}
            />

            <DeleteCategoryDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                categoryName={categoryToDelete?.name || ""}
                isDeleting={isDeleting}
            />
        </div>
    );
}
