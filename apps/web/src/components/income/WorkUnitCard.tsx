import { Pencil, Trash2 } from "lucide-react";
import type { WorkUnit } from "../../services/income.service";
import "./IncomeCard.css";

interface WorkUnitCardProps {
    unit: WorkUnit;
    onEdit: (unit: WorkUnit) => void;
    onDelete: (unit: WorkUnit) => void;
}

export function WorkUnitCard({ unit, onEdit, onDelete }: WorkUnitCardProps) {
    return (
        <div className="income-card">
            <div className="income-card__header">
                <h3 className="income-card__title">{unit.name}</h3>
            </div>
            <div className="income-card__content">
                <div className="income-card__amount">
                    {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    }).format(unit.defaultPrice)}
                </div>
                <p className="income-card__subtitle">
                    Tempo Estimado: {unit.estimatedTime}h
                </p>
            </div>

            <div className="income-card__actions">
                <button
                    onClick={() => onEdit(unit)}
                    className="income-card__action-btn income-card__action-btn--edit"
                    title="Editar"
                >
                    <Pencil className="w-5 h-5" />
                </button>
                <button
                    onClick={() => onDelete(unit)}
                    className="income-card__action-btn income-card__action-btn--delete"
                    title="Excluir"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
