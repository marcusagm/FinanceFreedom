import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { DeleteTransactionDialog } from "../components/transactions/DeleteTransactionDialog";
import { NewTransactionDialog } from "../components/transactions/NewTransactionDialog";
import { TransactionFilters } from "../components/transactions/TransactionFilters";
import { TransactionList } from "../components/transactions/TransactionList";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import { useTransactions } from "../hooks/useTransactions";
import { api } from "../lib/api";
import { type Category, categoryService } from "../services/category.service";
import type { Account, Transaction } from "../types";

export function Transactions() {
    const queryClient = useQueryClient();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);

    const [editingTransaction, setEditingTransaction] =
        useState<Transaction | null>(null);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] =
        useState<Transaction | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const [filters, setFilters] = useState({
        search: "",
        accountId: "all",
        category: "all",
        startDate: "",
        endDate: "",
    });

    const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useTransactions(filters);

    const transactions = data?.pages.flatMap((page) => page.data) || [];

    const fetchAuxData = async () => {
        try {
            const [accountsRes, categoriesRes] = await Promise.all([
                api.get("/accounts"),
                categoryService.getAll(),
            ]);
            setAccounts(accountsRes.data);
            setCategories(categoriesRes);
        } catch (error) {
            console.error("Failed to fetch auxiliary data", error);
        }
    };

    useEffect(() => {
        fetchAuxData();
    }, []);

    const handleTransactionUpdated = () => {
        queryClient.invalidateQueries({ queryKey: ["transactions"] });
    };

    const handleEdit = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsNewTransactionOpen(true);
    };

    const handleDelete = (id: string) => {
        const transaction = transactions.find((t) => t.id === id);
        if (transaction) {
            setTransactionToDelete(transaction);
            setIsDeleteOpen(true);
        }
    };

    const confirmDelete = async () => {
        if (!transactionToDelete) return;
        try {
            setIsDeleting(true);
            await api.delete(`/transactions/${transactionToDelete.id}`);
            handleTransactionUpdated();
            setIsDeleteOpen(false);
            setTransactionToDelete(null);
        } catch (error) {
            console.error("Failed to delete transaction", error);
            alert("Erro ao excluir transação.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCloseDialog = () => {
        setIsNewTransactionOpen(false);
        setEditingTransaction(null);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader
                title="Transações"
                description="Gerencie suas receitas e despesas."
                actions={
                    <Button onClick={() => setIsNewTransactionOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Nova Transação
                    </Button>
                }
            />

            <TransactionFilters
                filters={filters}
                onChange={setFilters}
                accounts={accounts}
                categories={categories}
            />

            {isLoading ? (
                <div className="text-center py-8">Carregando...</div>
            ) : (
                <div className="space-y-4">
                    <div className="bg-card rounded-xl border shadow">
                        <TransactionList
                            transactions={transactions}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onTransactionUpdated={handleTransactionUpdated}
                        />
                    </div>
                    {hasNextPage && (
                        <div className="flex justify-center py-4">
                            <Button
                                variant="outline"
                                onClick={() => fetchNextPage()}
                                disabled={isFetchingNextPage}
                            >
                                {isFetchingNextPage
                                    ? "Carregando..."
                                    : "Carregar Mais"}
                            </Button>
                        </div>
                    )}
                </div>
            )}

            <NewTransactionDialog
                isOpen={isNewTransactionOpen}
                onClose={handleCloseDialog}
                onSuccess={handleTransactionUpdated}
                accounts={accounts}
                categories={categories}
                initialData={editingTransaction}
            />

            <DeleteTransactionDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={confirmDelete}
                description={transactionToDelete?.description || ""}
                isDeleting={isDeleting}
            />
        </div>
    );
}
