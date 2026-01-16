import { Loader2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { DeleteFixedExpenseDialog } from "../components/fixed-expense/DeleteFixedExpenseDialog";
import { FixedExpenseDialog } from "../components/fixed-expense/FixedExpenseDialog";
import { FixedExpenseList } from "../components/fixed-expense/FixedExpenseList";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import { api } from "../lib/api";
import { type Category, categoryService } from "../services/category.service";
import {
    type FixedExpense,
    fixedExpenseService,
} from "../services/fixed-expense.service";
import type { Account } from "../types";

export function FixedExpenses() {
    const { t } = useTranslation();
    const [expenses, setExpenses] = useState<FixedExpense[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);

    // Dialog State
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<FixedExpense | null>(
        null
    );

    // Delete State
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [expenseToDelete, setExpenseToDelete] = useState<FixedExpense | null>(
        null
    );
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [expensesData, categoriesData, accountsRes] =
                await Promise.all([
                    fixedExpenseService.getAll(),
                    categoryService.getAll(),
                    api.get("/accounts"),
                ]);
            setExpenses(expensesData);
            setCategories(categoriesData);
            setAccounts(accountsRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
            toast.error(t("fixedExpenses.loadError"));
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = () => {
        setEditingExpense(null);
        setIsDialogOpen(true);
    };

    const handleEdit = (expense: FixedExpense) => {
        setEditingExpense(expense);
        setIsDialogOpen(true);
    };

    const handleDeleteClick = (expense: FixedExpense) => {
        setExpenseToDelete(expense);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!expenseToDelete) return;
        setIsDeleting(true);
        try {
            await fixedExpenseService.delete(expenseToDelete.id);
            toast.success(t("fixedExpenses.deleteSuccess"));
            await fetchData();
            setIsDeleteDialogOpen(false);
            setExpenseToDelete(null);
        } catch (error) {
            console.error("Failed to delete expense", error);
            toast.error(t("fixedExpenses.deleteError"));
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader
                title={t("fixedExpenses.title")}
                description={t("fixedExpenses.subtitle")}
                actions={
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" />{" "}
                        {t("fixedExpenses.newFixedExpense")}
                    </Button>
                }
            />

            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <FixedExpenseList
                    expenses={expenses}
                    onEdit={handleEdit}
                    onDelete={(id) => {
                        const expense = expenses.find((e) => e.id === id);
                        if (expense) handleDeleteClick(expense);
                    }}
                />
            )}

            <FixedExpenseDialog
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                onSuccess={fetchData}
                expenseToEdit={editingExpense}
                categories={categories}
                accounts={accounts}
            />

            <DeleteFixedExpenseDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleConfirmDelete}
                description={expenseToDelete?.description || ""}
                isDeleting={isDeleting}
            />
        </div>
    );
}
