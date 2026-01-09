import { Pencil, Trash2 } from "lucide-react";
import type { IncomeSource } from "../../services/income.service";
import { AppCard } from "../ui/AppCard";
import { Button } from "../ui/Button";

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
    const actions = (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit(source);
                }}
                title="Editar"
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
                title="Excluir"
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
            footer={`Recebe no dia ${source.payDay}`}
        >
            <div className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }).format(source.amount)}
            </div>
        </AppCard>
    );
}
