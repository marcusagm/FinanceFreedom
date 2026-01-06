import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { AccountCard } from "../components/AccountCard";
import { CreateAccountDialog } from "../components/CreateAccountDialog";
import { DeleteAccountDialog } from "../components/DeleteAccountDialog";
import { Button } from "../components/ui/Button";
import "./Accounts.css";

interface Account {
    id: string;
    name: string;
    type: string;
    balance: number;
    color?: string;
}

export function Accounts() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const [editingAccount, setEditingAccount] = useState<Account | null>(null);
    const [deletingAccount, setDeletingAccount] = useState<Account | null>(
        null
    );
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchAccounts = async () => {
        try {
            const response = await api.get("/accounts");
            setAccounts(response.data);
        } catch (error) {
            console.error("Failed to fetch accounts", error);
        }
    };

    const handleEdit = (account: Account) => {
        setEditingAccount(account);
        setIsCreateOpen(true);
    };

    const handleDeleteClick = (account: Account) => {
        setDeletingAccount(account);
    };

    const handleConfirmDelete = async () => {
        if (!deletingAccount) return;
        setIsDeleting(true);
        try {
            await api.delete(`/accounts/${deletingAccount.id}`);
            await fetchAccounts();
            setDeletingAccount(null);
        } catch (error) {
            console.error("Failed to delete account", error);
            alert("Erro ao excluir conta. Tente novamente.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCreate = () => {
        setEditingAccount(null);
        setIsCreateOpen(true);
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    return (
        <div className="accounts-page">
            <div className="accounts-page__header">
                <div>
                    <h1 className="accounts-page__title">Contas</h1>
                    <p className="accounts-page__subtitle">
                        Gerencie seus saldos e fontes de receita.
                    </p>
                </div>
                <Button onClick={handleCreate}>+ Nova Conta</Button>
            </div>

            <div className="accounts-page__grid">
                {accounts.map((account) => (
                    <AccountCard
                        key={account.id}
                        id={account.id}
                        name={account.name}
                        type={account.type}
                        balance={Number(account.balance)}
                        color={account.color}
                        onEdit={() => handleEdit(account)}
                        onDelete={() => handleDeleteClick(account)}
                    />
                ))}

                {accounts.length === 0 && (
                    <div className="accounts-page__empty-state">
                        <p className="accounts-page__empty-text">
                            Nenhuma conta encontrada. Crie sua primeira conta!
                        </p>
                    </div>
                )}
            </div>

            <CreateAccountDialog
                isOpen={isCreateOpen}
                onClose={() => {
                    setIsCreateOpen(false);
                    setEditingAccount(null);
                }}
                onSuccess={fetchAccounts}
                accountToEdit={editingAccount}
            />

            <DeleteAccountDialog
                isOpen={!!deletingAccount}
                onClose={() => setDeletingAccount(null)}
                onConfirm={handleConfirmDelete}
                accountName={deletingAccount?.name || ""}
                isDeleting={isDeleting}
            />
        </div>
    );
}
