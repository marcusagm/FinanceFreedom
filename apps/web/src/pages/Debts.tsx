import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DebtCard } from "../components/debt/DebtCard";
import { type Debt, DebtForm } from "../components/debt/DebtForm";
import { DeleteDebtDialog } from "../components/debt/DeleteDebtDialog";
import { StrategyComparison } from "../components/debt/StrategyComparison";
import { AppAlert } from "../components/ui/AppAlert";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../components/ui/Tabs";
import { api } from "../lib/api";

export default function Debts() {
    const { t } = useTranslation();
    const [debts, setDebts] = useState<Debt[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [debtToEdit, setDebtToEdit] = useState<Debt | null>(null);
    const [debtToDelete, setDebtToDelete] = useState<Debt | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [viewMode, setViewMode] = useState<"LIST" | "STRATEGY">("LIST");
    const [error, setError] = useState<string | null>(null);

    const fetchDebts = async () => {
        try {
            const response = await api.get("/debts");
            setDebts(response.data);
        } catch (error) {
            console.error("Failed to fetch debts", error);
        }
    };

    useEffect(() => {
        fetchDebts();
    }, []);

    const handleEdit = (debt: Debt) => {
        setDebtToEdit(debt);
        setIsFormOpen(true);
    };

    const handleCreate = () => {
        setDebtToEdit(null);
        setIsFormOpen(true);
    };

    const handleDeleteClick = (debt: Debt) => {
        setDebtToDelete(debt);
    };

    const handleConfirmDelete = async () => {
        if (!debtToDelete) return;
        setIsDeleting(true);
        try {
            await api.delete(`/debts/${debtToDelete.id}`);
            await fetchDebts();
            setDebtToDelete(null);
            setError(null); // Clear error on successful delete
        } catch (error) {
            console.error("Failed to delete debt", error);
            setError(t("debts.deleteError"));
        } finally {
            setIsDeleting(false);
        }
    };

    const handleUpdateInstallments = async (
        id: string,
        installmentsPaid: number
    ) => {
        try {
            await api.patch(`/debts/${id}`, { installmentsPaid });
            await fetchDebts();
        } catch (error) {
            console.error("Failed to update installments", error);
            setError(t("debts.updateInstallmentsError"));
        }
    };

    return (
        <div className="space-y-4 p-8 pt-6">
            {/* Error Alert Placeholder - could be better managed with a global toast context, but local state for now */}
            {/* Note: In a real app, I'd suggest a Toast provider. For now, we will rely on console errors silently or use a local state if needed. 
               The native alert was "alert('Erro ao excluir dívida.')". 
               I will add a simple error state to show AppAlert if needed.
            */}
            {error && (
                <AppAlert
                    variant="destructive"
                    title={t("common.error")}
                    description={error}
                    className="mb-4"
                />
            )}

            <PageHeader
                title={t("debts.title")}
                description={t("debts.subtitle")}
                actions={
                    <Button onClick={handleCreate}>{t("debts.newDebt")}</Button>
                }
            />
            <Tabs
                defaultValue="LIST"
                value={viewMode}
                onValueChange={(v) => setViewMode(v as "LIST" | "STRATEGY")}
            >
                <TabsList>
                    <TabsTrigger value="LIST">{t("debts.myDebts")}</TabsTrigger>
                    <TabsTrigger value="STRATEGY">
                        {t("debts.strategies")}
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="LIST">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {debts.map((debt) => (
                            <DebtCard
                                key={debt.id}
                                id={debt.id}
                                name={debt.name}
                                totalAmount={debt.totalAmount}
                                interestRate={debt.interestRate}
                                minimumPayment={debt.minimumPayment}
                                dueDate={debt.dueDate}
                                installmentsTotal={debt.installmentsTotal}
                                installmentsPaid={debt.installmentsPaid}
                                firstInstallmentDate={debt.firstInstallmentDate}
                                onEdit={() => handleEdit(debt)}
                                onDelete={() => handleDeleteClick(debt)}
                                onUpdateInstallments={(count) =>
                                    handleUpdateInstallments(debt.id, count)
                                }
                            />
                        ))}

                        {debts.length === 0 && (
                            <div className="col-span-full text-center py-10 text-muted-foreground border rounded-lg bg-card/50">
                                {t("debts.empty")}
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="STRATEGY">
                    <StrategyComparison
                        onEdit={handleEdit}
                        onDelete={handleDeleteClick}
                    />
                </TabsContent>
            </Tabs>
            <DebtForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSuccess={fetchDebts}
                debtToEdit={debtToEdit}
            />
            <DeleteDebtDialog
                isOpen={!!debtToDelete}
                onClose={() => setDebtToDelete(null)}
                onConfirm={handleConfirmDelete}
                debtName={debtToDelete?.name || ""}
                isDeleting={isDeleting}
            />
        </div>
    );
}
