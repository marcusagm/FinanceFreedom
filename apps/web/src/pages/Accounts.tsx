import { useEffect, useState } from "react";
import { AccountCard } from "../components/account/AccountCard";
import { CreateAccountDialog } from "../components/account/CreateAccountDialog";
import { DeleteAccountDialog } from "../components/account/DeleteAccountDialog";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import { api } from "../lib/api";

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
    const [deletingAccount, setDeletingAccount] = useState<Account | null>(null);
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
        <div className="container mx-auto p-4 max-w-7xl">
            <PageHeader
                title="Contas"
                description="Gerencie seus saldos e fontes de receita."
                actions={<Button onClick={handleCreate}>+ Nova Conta</Button>}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    <div className="col-span-full text-center py-12">
                        <p className="text-muted-foreground">
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
