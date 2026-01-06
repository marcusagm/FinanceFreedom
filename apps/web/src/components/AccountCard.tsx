import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { Pencil, Trash2 } from "lucide-react";
import "./AccountCard.css";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface AccountCardProps {
    id: string;
    name: string;
    type: string;
    balance: number;
    color?: string;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
}

export function AccountCard({
    id,
    name,
    type,
    balance,
    color,
    onEdit,
    onDelete,
}: AccountCardProps) {
    const formattedBalance = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
    }).format(balance);

    return (
        <div className="account-card">
            <div className="account-card__header">
                <div className="account-card__title-group">
                    {color && (
                        <div
                            className="account-card__color-dot"
                            style={{ backgroundColor: color }}
                        />
                    )}
                    <h3 className="account-card__title">{name}</h3>
                </div>
                <span className="account-card__type-badge">{type}</span>
            </div>
            <div>
                <p className="account-card__balance-label">Saldo Atual</p>
                <p className="account-card__balance-value">
                    {formattedBalance}
                </p>
            </div>

            <div className="account-card__actions">
                <button
                    onClick={() => onEdit?.(id)}
                    className="account-card__action-btn account-card__action-btn--edit"
                    title="Editar"
                >
                    <Pencil className="w-4 h-4" />
                </button>
                <button
                    onClick={() => onDelete?.(id)}
                    className="account-card__action-btn account-card__action-btn--delete"
                    title="Excluir"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
