import { Loader2, Plus } from "lucide-react";
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
import { type Category, categoryService } from "../services/category.service";

export function Categories() {
    const { t } = useTranslation();
    const [categories, setCategories] = useState<Category[]>([]);
    const [budgetData, setBudgetData] = useState<BudgetStatus[]>([]);
    const [incomeData, setIncomeData] = useState<IncomeStatus[]>([]);
    const [loading, setLoading] = useState(true);

    // Dialog states
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(
        null
    );

    // Delete states
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
        null
    );
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [categoriesData, budgetsData, incomesData] =
                await Promise.all([
                    categoryService.getAll(),
                    analyticsService.getBudgets().catch((err) => {
                        console.error("Failed to fetch budgets", err);
                        return [];
                    }),
                    analyticsService.getIncomes().catch((err) => {
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

    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader
                title={t("categories.title")}
                description={t("categories.subtitle")}
                actions={
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" />{" "}
                        {t("categories.newCategory")}
                    </Button>
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
                />
            )}

            <CategoryDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSuccess={fetchData}
                categoryToEdit={editingCategory}
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
