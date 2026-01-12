import { useEffect, useState } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { Plus } from "lucide-react";
import { api } from "../lib/api";
import { Button } from "../components/ui/Button";
import { TransactionList } from "../components/transactions/TransactionList";
import { NewTransactionDialog } from "../components/transactions/NewTransactionDialog";
import { DeleteTransactionDialog } from "../components/transactions/DeleteTransactionDialog";
import { TransactionFilters } from "../components/transactions/TransactionFilters";
import type { Account, Transaction } from "../types";

export function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isNewTransactionOpen, setIsNewTransactionOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    const [editingTransaction, setEditingTransaction] =
        useState<Transaction | null>(null);

    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] =
        useState<Transaction | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [transactionsRes, accountsRes] = await Promise.all([
                api.get("/transactions"),
                api.get("/accounts"),
            ]);
            setTransactions(transactionsRes.data);
            setAccounts(accountsRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [filters, setFilters] = useState({
        search: "",
        accountId: "all",
        category: "all",
        startDate: "",
        endDate: "",
    });

    const categories = Array.from(
        new Set(
            transactions.map((t) => t.category).filter((c): c is string => !!c)
        )
    ).sort();

    const filteredTransactions = transactions.filter((t) => {
        // Search
        if (
            filters.search &&
            !t.description.toLowerCase().includes(filters.search.toLowerCase())
        ) {
            return false;
        }

        // Account
        if (filters.accountId !== "all" && t.accountId !== filters.accountId) {
            return false;
        }

        // Category
        if (filters.category !== "all" && t.category !== filters.category) {
            return false;
        }

        // Date Range
        if (filters.startDate) {
            const txDate = new Date(t.date).setHours(0, 0, 0, 0);
            const startDate = new Date(filters.startDate).setHours(0, 0, 0, 0);
            if (txDate < startDate) return false;
        }
        if (filters.endDate) {
            const txDate = new Date(t.date).setHours(0, 0, 0, 0);
            const endDate = new Date(filters.endDate).setHours(0, 0, 0, 0);
            if (txDate > endDate) return false;
        }

        return true;
    });

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
            await fetchData();
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

            {loading ? (
                <div className="text-center py-8">Carregando...</div>
            ) : (
                <TransactionList
                    transactions={filteredTransactions}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            <NewTransactionDialog
                isOpen={isNewTransactionOpen}
                onClose={handleCloseDialog}
                onSuccess={fetchData}
                accounts={accounts}
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
