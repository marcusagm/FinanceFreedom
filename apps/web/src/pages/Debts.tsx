import { useEffect, useState } from "react";
import { api } from "../lib/api";
import { Button } from "../components/ui/Button";
import { DebtForm, type Debt } from "../components/debt/DebtForm";
import { DebtCard } from "../components/debt/DebtCard";
import { DeleteDebtDialog } from "../components/debt/DeleteDebtDialog";
import { StrategyComparison } from "../components/debt/StrategyComparison";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "../components/ui/Tabs";
import { AppAlert } from "../components/ui/AppAlert";

export default function Debts() {
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
            setError("Erro ao excluir dívida. Tente novamente.");
        } finally {
            setIsDeleting(false);
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
                    title="Erro"
                    description={error}
                    className="mb-4"
                />
            )}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Dívidas
                    </h2>
                    <p className="text-muted-foreground">
                        Gerencie suas dívidas e escolha a melhor estratégia para
                        quitá-las.
                    </p>
                </div>
                <Button onClick={handleCreate}>Nova Dívida</Button>
            </div>

            <Tabs
                defaultValue="LIST"
                value={viewMode}
                onValueChange={(v) => setViewMode(v as "LIST" | "STRATEGY")}
            >
                <TabsList>
                    <TabsTrigger value="LIST">Minhas Dívidas</TabsTrigger>
                    <TabsTrigger value="STRATEGY">
                        Estratégias de Pagamento
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
                                onEdit={() => handleEdit(debt)}
                                onDelete={() => handleDeleteClick(debt)}
                            />
                        ))}

                        {debts.length === 0 && (
                            <div className="col-span-full text-center py-10 text-muted-foreground border rounded-lg bg-card/50">
                                Nenhuma dívida cadastrada. Parabéns (ou cadastre
                                uma agora)!
                            </div>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="STRATEGY">
                    <StrategyComparison />
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
