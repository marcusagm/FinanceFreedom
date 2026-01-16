import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { AddGoalDialog } from "../components/savings-goal/AddGoalDialog";
import { DeleteGoalDialog } from "../components/savings-goal/DeleteGoalDialog";
import {
    type SavingsGoal,
    SavingsGoalCard,
} from "../components/savings-goal/SavingsGoalCard";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import { api } from "../lib/api";

export function SavingsGoals() {
    const { t } = useTranslation();
    const [goals, setGoals] = useState<SavingsGoal[]>([]);
    const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
    const [goalToEdit, setGoalToEdit] = useState<SavingsGoal | null>(null);

    // Delete States
    const [goalToDelete, setGoalToDelete] = useState<SavingsGoal | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchGoals = async () => {
        try {
            const response = await api.get("/savings-goals");
            setGoals(response.data);
        } catch (error) {
            console.error("Error fetching savings goals:", error);
            toast.error(t("savingsGoals.loadError"));
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    const handleEditGoal = (goal: SavingsGoal) => {
        setGoalToEdit(goal);
        setIsAddGoalOpen(true);
    };

    const handleDeleteClick = (goal: SavingsGoal) => {
        setGoalToDelete(goal);
    };

    const handleConfirmDelete = async () => {
        if (!goalToDelete) return;
        setIsDeleting(true);
        try {
            await api.delete(`/savings-goals/${goalToDelete.id}`);
            toast.success(t("savingsGoals.deleteSuccess"));
            fetchGoals();
            setGoalToDelete(null);
        } catch (error) {
            console.error(error);
            toast.error(t("savingsGoals.deleteError"));
        } finally {
            setIsDeleting(false);
        }
    };

    const handleCreate = () => {
        setGoalToEdit(null);
        setIsAddGoalOpen(true);
    };

    return (
        <div className="container mx-auto p-4 max-w-7xl">
            <PageHeader
                title={t("savingsGoals.title")}
                description={t("savingsGoals.subtitle")}
                actions={
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t("savingsGoals.newGoal")}
                    </Button>
                }
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.length === 0 ? (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        {t("savingsGoals.empty")}
                    </div>
                ) : (
                    goals.map((goal) => (
                        <SavingsGoalCard
                            key={goal.id}
                            goal={goal}
                            onEdit={handleEditGoal}
                            onDelete={() => handleDeleteClick(goal)}
                        />
                    ))
                )}
            </div>

            <AddGoalDialog
                isOpen={isAddGoalOpen}
                onClose={() => setIsAddGoalOpen(false)}
                onSuccess={fetchGoals}
                goalToEdit={goalToEdit}
            />

            <DeleteGoalDialog
                isOpen={!!goalToDelete}
                onClose={() => setGoalToDelete(null)}
                onConfirm={handleConfirmDelete}
                goalName={goalToDelete?.name || ""}
                isDeleting={isDeleting}
            />
        </div>
    );
}

export default SavingsGoals;
