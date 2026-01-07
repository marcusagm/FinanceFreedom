import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Pencil, Trash2 } from "lucide-react";
import "./DebtCard.css";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface DebtCardProps {
    id: string;
    name: string;
    totalAmount: number;
    interestRate: number;
    minimumPayment: number;
    dueDate: number;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export function DebtCard({
    id,
    name,
    totalAmount,
    interestRate,
    minimumPayment,
    dueDate,
    onEdit,
    onDelete,
}: DebtCardProps) {
    const formatMoney = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    return (
        <div className="debt-card">
            <div className="debt-card__header">
                <div className="debt-card__title-group">
                    <h3 className="debt-card__title">{name}</h3>
                </div>
                <span className="debt-card__interest-badge">
                    {interestRate}% a.m.
                </span>
            </div>

            <div>
                <p className="debt-card__amount-label">Saldo Devedor</p>
                <p className="debt-card__amount-value">
                    {formatMoney(totalAmount)}
                </p>
            </div>

            <div className="debt-card__details">
                Vence dia {dueDate} • Mínimo: {formatMoney(minimumPayment)}
            </div>

            <div className="debt-card__actions">
                <button
                    onClick={() => onEdit?.(id)}
                    className="debt-card__action-btn debt-card__action-btn--edit"
                    title="Editar"
                >
                    <Pencil className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onDelete?.(id)}
                    className="debt-card__action-btn debt-card__action-btn--delete"
                    title="Excluir"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
