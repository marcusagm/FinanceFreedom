import { Edit2, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import type { BudgetStatus } from "../../services/analytics.service";
import type { Category } from "../../services/category.service";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { MoneyDisplay } from "../ui/MoneyDisplay";
import { Progress } from "../ui/Progress";
import { HelpIcon } from "../ui/HelpIcon";
import { cn } from "../../lib/utils";

interface CategoryRowProps {
    category: Category;
    budgetStatus?: BudgetStatus;
    depth: number;
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
    onBudgetChange?: (categoryId: string, amount: number) => Promise<void>;
    isExpanded: boolean;
    hasChildren: boolean;
    toggle: () => void;
}

export function CategoryRow({
    category,
    budgetStatus,
    depth,
    onEdit,
    onDelete,
    onBudgetChange,
    hasChildren,
}: CategoryRowProps) {
    const { t } = useTranslation();
    const [isEditingBudget, setIsEditingBudget] = useState(false);
    const [editValue, setEditValue] = useState<number>(0);

    const spent = budgetStatus?.spent || 0;
    const limit = budgetStatus?.limit || Number(category.budgetLimit || 0);
    const percentage =
        budgetStatus?.percentage || (limit > 0 ? (spent / limit) * 100 : 0);

    // Status color logic
    let statusColor = "bg-emerald-500";
    let statusText = "text-emerald-500";
    if (percentage >= 100) {
        statusColor = "bg-red-500";
        statusText = "text-red-500";
    } else if (percentage >= 90) {
        statusColor = "bg-red-500";
        statusText = "text-red-500";
    } else if (percentage >= 75) {
        statusColor = "bg-yellow-500";
        statusText = "text-yellow-500";
    }

    const handleStartEdit = () => {
        setEditValue(limit);
        setIsEditingBudget(true);
    };

    const handleSaveBudget = async () => {
        if (onBudgetChange) {
            await onBudgetChange(category.id, editValue);
        }
        setIsEditingBudget(false);
    };

    return (
        <div
            className={cn(
                "flex items-center py-3 px-4 border-b hover:bg-muted/50 transition-colors group",
                depth > 0 && "bg-muted/10",
            )}
        >
            {/* Name Column */}
            <div
                className="flex-1 flex items-center gap-3 overflow-hidden"
                style={{ paddingLeft: `${depth * 24}px` }}
            >
                <div
                    className="w-3 h-3 rounded-full shrink-0 border"
                    style={{ backgroundColor: category.color || "#ccc" }}
                />
                <span className="font-medium truncate">{category.name}</span>
            </div>

            {/* Progress Column */}
            <div className="w-1/3 px-4 flex flex-col justify-center gap-1">
                {/* Show progress for all categories if limit/goal > 0 */}
                {limit > 0 && (
                    <>
                        <div className="flex justify-between text-xs">
                            <div className="text-muted-foreground">
                                <span className={cn(statusText, "font-medium")}>
                                    <MoneyDisplay value={spent} />
                                </span>
                                <span className="mx-1">/</span>
                                <MoneyDisplay value={limit} />
                            </div>
                            <span className={statusText}>
                                {percentage.toFixed(0)}%
                            </span>
                        </div>
                        <Progress
                            value={Math.min(percentage, 100)}
                            className="h-2"
                            indicatorClassName={statusColor}
                        />
                    </>
                )}
            </div>

            {/* Budget/Limit Column */}
            <div className="w-40 px-4 flex items-center justify-end">
                {hasChildren ? (
                    <div className="flex items-center gap-2 text-muted-foreground cursor-help">
                        <span className="text-sm font-medium">
                            <MoneyDisplay value={limit} />
                        </span>
                        <HelpIcon
                            text={t("categories.parentBudgetAutomatic")}
                        />
                    </div>
                ) : isEditingBudget ? (
                    <div className="flex items-center gap-2">
                        <Input
                            currency
                            value={editValue}
                            onValueChange={(v) =>
                                setEditValue(v.floatValue || 0)
                            }
                            className="h-8 w-24 text-right"
                            autoFocus
                        />
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-emerald-500"
                            onClick={handleSaveBudget}
                        >
                            <Save className="h-4 w-4" />
                        </Button>
                    </div>
                ) : (
                    <div
                        className="text-right cursor-pointer hover:bg-muted rounded px-2 py-1 transition-colors"
                        onClick={handleStartEdit}
                        title={t("categories.clickToEditBudget")}
                    >
                        <MoneyDisplay value={limit} />
                    </div>
                )}
            </div>

            {/* Actions Column */}
            <div className="w-24 flex items-center justify-end gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onEdit(category)}
                >
                    <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => onDelete(category.id)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}
