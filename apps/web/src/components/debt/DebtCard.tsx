import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Pencil, Trash2, Timer, TrendingUp } from "lucide-react";
import { useState } from "react";
import "./DebtCard.css";
import { DebtDelayCard } from "../simulators/DebtDelayCard";
import { PrepaymentOpportunity } from "../simulators/PrepaymentOpportunity";

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

type SimulatorType = "NONE" | "DELAY" | "PREPAYMENT";

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
    const [activeSimulator, setActiveSimulator] =
        useState<SimulatorType>("NONE");

    const toggleSimulator = (type: SimulatorType) => {
        setActiveSimulator(activeSimulator === type ? "NONE" : type);
    };

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
                    onClick={() => toggleSimulator("DELAY")}
                    className={`debt-card__action-btn hover:bg-red-50 ${
                        activeSimulator === "DELAY"
                            ? "text-red-600 bg-red-50"
                            : "text-gray-500"
                    }`}
                    title="Simular Custo do Atraso"
                >
                    <Timer className="w-4 h-4" />
                </button>
                <button
                    onClick={() => toggleSimulator("PREPAYMENT")}
                    className={`debt-card__action-btn hover:bg-emerald-50 ${
                        activeSimulator === "PREPAYMENT"
                            ? "text-emerald-600 bg-emerald-50"
                            : "text-gray-500"
                    }`}
                    title="Simular Antecipação"
                >
                    <TrendingUp className="w-4 h-4" />
                </button>
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

            {activeSimulator === "DELAY" && (
                <div className="mt-4 pt-4 border-t border-border animate-in fade-in slide-in-from-top-2 duration-300">
                    <DebtDelayCard
                        debtName={name}
                        balance={totalAmount}
                        interestRate={interestRate}
                    />
                </div>
            )}

            {activeSimulator === "PREPAYMENT" && (
                <div className="mt-4 pt-4 border-t border-border animate-in fade-in slide-in-from-top-2 duration-300">
                    <PrepaymentOpportunity
                        debtName={name}
                        balance={totalAmount}
                        interestRate={interestRate}
                        minimumPayment={minimumPayment}
                    />
                </div>
            )}
        </div>
    );
}
