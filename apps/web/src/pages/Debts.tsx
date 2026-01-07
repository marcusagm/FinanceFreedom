import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Button } from "../components/ui/Button";
import { DebtForm, type Debt } from "../components/debt/DebtForm";
import { DebtCard } from "../components/debt/DebtCard";
import { DeleteDebtDialog } from "../components/debt/DeleteDebtDialog";

export default function Debts() {
    const [debts, setDebts] = useState<Debt[]>([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [debtToEdit, setDebtToEdit] = useState<Debt | null>(null);
    const [debtToDelete, setDebtToDelete] = useState<Debt | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

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
        } catch (error) {
            console.error("Failed to delete debt", error);
            alert("Erro ao excluir dívida.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Dívidas</h2>
                <Button onClick={handleCreate}>Nova Dívida</Button>
            </div>

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
                        onEdit={() => handleEdit(debt)}
                        onDelete={() => handleDeleteClick(debt)}
                    />
                ))}

                {debts.length === 0 && (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                        Nenhuma dívida cadastrada. Parabéns (ou cadastre uma
                        agora)!
                    </div>
                )}
            </div>

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
