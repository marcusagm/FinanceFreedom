import { Award, Calendar, Target } from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppCard } from "../ui/AppCard";
import { Button } from "../ui/Button";
import { MoneyDisplay } from "../ui/MoneyDisplay";
import { useLocalization } from "../../contexts/LocalizationContext";
import { format } from "date-fns";

export type SavingsGoal = {
    id: string;
    name: string;
    targetAmount: number | string;
    currentAmount: number | string;
    deadline?: string;
    priority: number;
    status: string;
};

interface SavingsGoalCardProps {
    goal: SavingsGoal;
    onEdit?: (goal: SavingsGoal) => void;
    onDelete?: (id: string) => void;
}

const getProgress = (current: number, target: number) => {
    if (target <= 0) return 0;
    const progress = (current / target) * 100;
    return Math.min(progress, 100);
};

export function SavingsGoalCard({
    goal,
    onEdit,
    onDelete,
}: SavingsGoalCardProps) {
    const { t } = useTranslation();
    const { dateFormat } = useLocalization();
    const current = Number(goal.currentAmount);
    const target = Number(goal.targetAmount);
    const progress = getProgress(current, target);

    // Formatting deadline if exists
    const formattedDeadline = goal.deadline
        ? format(new Date(goal.deadline), dateFormat)
        : t("savingsGoals.deadlineFormatted");

    const actions = (
        <>
            {onEdit && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(goal);
                    }}
                    title={t("common.edit")}
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            )}
            {onDelete && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(goal.id);
                    }}
                    title={t("common.delete")}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            )}
        </>
    );

    return (
        <AppCard
            title={goal.name}
            badge={<Target className="h-4 w-4 text-muted-foreground" />}
            actions={actions}
        >
            <div className="flex justify-between items-baseline mb-2">
                <span className="text-2xl font-bold">
                    <MoneyDisplay value={current} />
                </span>
                <span className="text-xs text-muted-foreground mr-1">
                    de <MoneyDisplay value={target} />
                </span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden mb-2">
                <div
                    className="h-full bg-primary transition-all duration-500 ease-in-out"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{formattedDeadline}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Award className="h-3 w-3" />
                    <span>{Math.round(progress)}%</span>
                </div>
            </div>
        </AppCard>
    );
}
