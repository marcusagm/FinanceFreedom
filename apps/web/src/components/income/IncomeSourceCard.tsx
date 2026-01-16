import { Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { IncomeSource } from "../../services/income.service";
import { AppCard } from "../ui/AppCard";
import { Button } from "../ui/Button";
import { MoneyDisplay } from "../ui/MoneyDisplay";

interface IncomeSourceCardProps {
    source: IncomeSource;
    onEdit: (source: IncomeSource) => void;
    onDelete: (source: IncomeSource) => void;
}

export function IncomeSourceCard({
    source,
    onEdit,
    onDelete,
}: IncomeSourceCardProps) {
    const { t } = useTranslation();
    const actions = (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit(source);
                }}
                title={t("common.edit")}
            >
                <Pencil className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete(source);
                }}
                title={t("common.delete")}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </>
    );

    return (
        <AppCard
            title={source.name}
            color="#10b981" // emerald-500
            actions={actions}
            footer={t("income.receivesOn", { day: source.payDay })}
        >
            <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                <MoneyDisplay value={source.amount} />
            </div>
        </AppCard>
    );
}
