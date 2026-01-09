import { Timer, TrendingUp, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { AppCard } from "../ui/AppCard";
import { Button } from "../ui/Button";
import { DebtDelayCard } from "../simulators/DebtDelayCard";
import { PrepaymentOpportunity } from "../simulators/PrepaymentOpportunity";

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

    const actions = (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleSimulator("DELAY")}
                className={
                    activeSimulator === "DELAY"
                        ? "text-red-500 bg-red-50 dark:bg-red-950/20"
                        : ""
                }
                title="Simular Custo do Atraso"
            >
                <Timer className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleSimulator("PREPAYMENT")}
                className={
                    activeSimulator === "PREPAYMENT"
                        ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20"
                        : ""
                }
                title="Simular Antecipação"
            >
                <TrendingUp className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(id);
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
                    onDelete?.(id);
                }}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                title="Excluir"
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </>
    );

    const footer = (
        <span>
            Vence dia {dueDate} • Mínimo: {formatMoney(minimumPayment)}
        </span>
    );

    return (
        <AppCard
            title={name}
            badge={
                <span className="text-xs font-mono text-red-500 bg-red-100 dark:bg-red-950/30 px-2 py-0.5 rounded-full">
                    {interestRate}% a.m.
                </span>
            }
            actions={actions}
            footer={footer}
        >
            <div>
                <p className="text-sm font-medium text-muted-foreground">
                    Saldo Devedor
                </p>
                <p className="text-2xl font-bold text-red-500">
                    {formatMoney(totalAmount)}
                </p>
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
        </AppCard>
    );
}
