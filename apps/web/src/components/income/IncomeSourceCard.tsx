import { Pencil, Trash2 } from "lucide-react";
import type { IncomeSource } from "../../services/income.service";
import "./IncomeCard.css";

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
    return (
        <div className="income-card">
            <div className="income-card__header">
                <h3 className="income-card__title">{source.name}</h3>
            </div>
            <div className="income-card__content">
                <div className="income-card__amount">
                    {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    }).format(source.amount)}
                </div>
                <p className="income-card__subtitle">
                    Recebe no dia {source.payDay}
                </p>
            </div>

            <div className="income-card__actions">
                <button
                    onClick={() => onEdit(source)}
                    className="income-card__action-btn income-card__action-btn--edit"
                    title="Editar"
                >
                    <Pencil className="w-5 h-5" />
                </button>
                <button
                    onClick={() => onDelete(source)}
                    className="income-card__action-btn income-card__action-btn--delete"
                    title="Excluir"
                >
                    <Trash2 className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
}
