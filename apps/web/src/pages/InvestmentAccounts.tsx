import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { AddInvestmentDialog } from "../components/investment/AddInvestmentDialog";
import { DeleteInvestmentDialog } from "../components/investment/DeleteInvestmentDialog";
import {
    type InvestmentAccount,
    InvestmentAccountCard,
} from "../components/investment/InvestmentAccountCard";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import { api } from "../lib/api";

export function InvestmentAccounts() {
    const { t } = useTranslation();
    const [accounts, setAccounts] = useState<InvestmentAccount[]>([]);
    const [isAddAccountOpen, setIsAddAccountOpen] = useState(false);
    const [accountToEdit, setAccountToEdit] =
        useState<InvestmentAccount | null>(null);

    // Delete states
    const [accountToDelete, setAccountToDelete] =
        useState<InvestmentAccount | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchAccounts = async () => {
        try {
            const response = await api.get("/investment-accounts");
            setAccounts(response.data);
        } catch (error) {
            console.error("Error fetching investment accounts:", error);
            toast.error(t("investments.loadError"));
        }
    };

    useEffect(() => {
        fetchAccounts();
    }, []);

    const handleEditAccount = (account: InvestmentAccount) => {
        setAccountToEdit(account);
        setIsAddAccountOpen(true);
    };

    const handleDeleteClick = (account: InvestmentAccount) => {
        setAccountToDelete(account);
    };

    const handleConfirmDelete = async () => {
        if (!accountToDelete) return;
        setIsDeleting(true);
        try {
            await api.delete(`/investment-accounts/${accountToDelete.id}`);
            toast.success(t("investments.deleteSuccess"));
            fetchAccounts();
            setAccountToDelete(null);
        } catch (error) {
            console.error(error);
            toast.error(t("investments.deleteError"));
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCreate = () => {
        setAccountToEdit(null);
        setIsAddAccountOpen(true);
    };

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <PageHeader
                title={t("investments.title")}
                description={t("investments.subtitle")}
                actions={
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t("investments.newAccount")}
                    </Button>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        {t("investments.empty")}
                    </div>
                ) : (
                    accounts.map((acc) => (
                        <InvestmentAccountCard
                            key={acc.id}
                            account={acc}
                            onEdit={handleEditAccount}
                            onDelete={() => handleDeleteClick(acc)}
                        />
                    ))
                )}
            </div>

            <AddInvestmentDialog
                isOpen={isAddAccountOpen}
                onClose={() => setIsAddAccountOpen(false)}
                onSuccess={fetchAccounts}
                accountToEdit={accountToEdit}
            />

            <DeleteInvestmentDialog
                isOpen={!!accountToDelete}
                onClose={() => setAccountToDelete(null)}
                onConfirm={handleConfirmDelete}
                accountName={accountToDelete?.name || ""}
                isDeleting={isDeleting}
            />
        </div>
    );
}

export default InvestmentAccounts;
