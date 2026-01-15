import { Pencil, Trash2 } from "lucide-react";
import type { WorkUnit } from "../../services/income.service";
import { AppCard } from "../ui/AppCard";
import { Button } from "../ui/Button";
import { MoneyDisplay } from "../ui/MoneyDisplay";

interface WorkUnitCardProps {
    unit: WorkUnit;
    onEdit: (unit: WorkUnit) => void;
    onDelete: (unit: WorkUnit) => void;
}

export function WorkUnitCard({ unit, onEdit, onDelete }: WorkUnitCardProps) {
    const actions = (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit(unit);
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
                    onDelete(unit);
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
            title={unit.name}
            color="#3b82f6" // blue-500
            actions={actions}
            footer={`Tempo Estimado: ${unit.estimatedTime}h`}
        >
            <div className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                <MoneyDisplay value={unit.defaultPrice} />
            </div>
        </AppCard>
    );
}
