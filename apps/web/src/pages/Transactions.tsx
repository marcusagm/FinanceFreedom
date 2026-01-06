import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { api } from "../lib/api";
import { Button } from "../components/ui/Button";
import { TransactionList } from "../components/transactions/TransactionList";
import { NewTransactionDialog } from "../components/transactions/NewTransactionDialog";
import { DeleteTransactionDialog } from "../components/transactions/DeleteTransactionDialog";
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
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Transações</h1>
                    <p className="text-muted-foreground">
                        Gerencie suas receitas e despesas.
                    </p>
                </div>
                <Button onClick={() => setIsNewTransactionOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Transação
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-8">Carregando...</div>
            ) : (
                <TransactionList
                    transactions={transactions}
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
