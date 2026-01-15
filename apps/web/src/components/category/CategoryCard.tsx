import { Edit2, Trash2 } from "lucide-react";
import type { BudgetStatus } from "../../services/analytics.service";
import type { Category } from "../../services/category.service";
import { AppCard } from "../ui/AppCard";
import { Button } from "../ui/Button";
import { MoneyDisplay } from "../ui/MoneyDisplay";
import { Progress } from "../ui/Progress";

interface CategoryCardProps {
    category: Category;
    budgetStatus?: BudgetStatus;
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
}

export function CategoryCard({
    category,
    budgetStatus,
    onEdit,
    onDelete,
}: CategoryCardProps) {
    const actions = (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit(category);
                }}
                title="Editar"
            >
                <Edit2 className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(category.id);
                }}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                title="Excluir"
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </>
    );

    // Determines badge content (Budget Limit or Type)
    const badge = (
        <div className="flex gap-2">
            <span
                className="w-3 h-3 rounded-full border"
                style={{ backgroundColor: category.color || "#ccc" }}
            />
            {category.type && (
                <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded-full">
                    {category.type === "EXPENSE" ? "Despesa" : "Receita"}
                </span>
            )}
        </div>
    );

    const hasBudget = Boolean(
        category.budgetLimit && Number(category.budgetLimit) > 0
    );
    const spent = budgetStatus?.spent || 0;
    const limit = Number(category.budgetLimit || 0);
    const percentage =
        budgetStatus?.percentage ||
        (hasBudget && limit > 0 ? (spent / limit) * 100 : 0);

    // Status color
    let statusColor = "bg-emerald-500";
    let statusText = "text-emerald-500";
    if (percentage >= 90) {
        statusColor = "bg-red-500";
        statusText = "text-red-500";
    } else if (percentage >= 75) {
        statusColor = "bg-yellow-500";
        statusText = "text-yellow-500";
    }

    // Logic to show progress bar or generic info
    // If it's an EXPENSE category and has budget, show progress.
    // If it has no budget, just show spent maybe? Or just the card without progress.

    return (
        <AppCard
            title={category.name}
            badge={badge}
            actions={actions}
            footer={
                hasBudget ? (
                    <div className="flex flex-col gap-2 w-full pt-2">
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-muted-foreground">
                                <MoneyDisplay value={spent} /> de{" "}
                                <MoneyDisplay value={limit} />
                            </span>
                            <span className={statusText}>
                                {percentage.toFixed(0)}%
                            </span>
                        </div>
                        <Progress
                            value={percentage}
                            className="h-2"
                            indicatorClassName={statusColor}
                        />
                    </div>
                ) : (
                    <div className="text-xs text-muted-foreground pt-2">
                        Sem limite definido
                    </div>
                )
            }
        >
            <div className="flex items-center gap-4">
                {/* 
                  Category Icon could go here, but AppCard doesn't support an 'icon' prop easily 
                  besides badge/title. 
                  We'll stick to displaying the color in the badge. 
               */}
                <div className="text-2xl font-bold">
                    <MoneyDisplay value={category.budgetLimit || 0} />
                </div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Limite Mensal</p>
        </AppCard>
    );
}
