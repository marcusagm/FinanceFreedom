import { ListOrdered, Pencil, Timer, Trash2, TrendingUp } from "lucide-react";
import { useState } from "react";
import { DebtDelayCard } from "../simulators/DebtDelayCard";
import { PrepaymentOpportunity } from "../simulators/PrepaymentOpportunity";
import { AppCard } from "../ui/AppCard";
import { Button } from "../ui/Button";
import { MoneyDisplay } from "../ui/MoneyDisplay";
import { InstallmentsModal } from "./InstallmentsModal";

interface DebtCardProps {
    id: string;
    name: string;
    totalAmount: number;
    interestRate: number;
    minimumPayment: number;
    dueDate: number;
    onEdit?: (id: string) => void;
    onDelete?: (id: string) => void;
    installmentsTotal?: number;
    installmentsPaid?: number;
    firstInstallmentDate?: string;
    onUpdateInstallments?: (count: number) => void;
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
    installmentsTotal,
    installmentsPaid = 0,
    firstInstallmentDate,
    onUpdateInstallments,
}: DebtCardProps) {
    const [activeSimulator, setActiveSimulator] = useState<SimulatorType>("NONE");
    const [isInstallmentsModalOpen, setIsInstallmentsModalOpen] = useState(false);

    const toggleSimulator = (type: SimulatorType) => {
        setActiveSimulator(activeSimulator === type ? "NONE" : type);
    };

    const actions = (
        <>
            {installmentsTotal && installmentsTotal > 0 && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsInstallmentsModalOpen(true);
                    }}
                    title="Ver Parcelas"
                >
                    <ListOrdered className="w-4 h-4" />
                </Button>
            )}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => toggleSimulator("DELAY")}
                className={
                    activeSimulator === "DELAY" ? "text-red-500 bg-red-50 dark:bg-red-950/20" : ""
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
        <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-center">
                <span>
                    Vence dia {dueDate} • Mínimo: <MoneyDisplay value={minimumPayment} />
                </span>
            </div>
            {installmentsTotal && installmentsTotal > 0 && (
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                    <div
                        className="bg-emerald-500 h-full transition-all"
                        style={{
                            width: `${(installmentsPaid / installmentsTotal) * 100}%`,
                        }}
                    />
                </div>
            )}
        </div>
    );

    return (
        <>
            <AppCard
                title={name}
                badge={
                    <div className="flex gap-2">
                        {installmentsTotal && installmentsTotal > 0 && (
                            <span className="text-xs font-mono text-blue-500 bg-blue-100 dark:bg-blue-950/30 px-2 py-0.5 rounded-full">
                                {installmentsPaid}/{installmentsTotal}
                            </span>
                        )}
                        <span className="text-xs font-mono text-red-500 bg-red-100 dark:bg-red-950/30 px-2 py-0.5 rounded-full">
                            {interestRate}% a.m.
                        </span>
                    </div>
                }
                actions={actions}
                footer={footer}
            >
                <div>
                    <p className="text-sm font-medium text-muted-foreground">Saldo Devedor</p>
                    <p className="text-2xl font-bold text-red-500">
                        <MoneyDisplay value={totalAmount} />
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

            {installmentsTotal && installmentsTotal > 0 && (
                <InstallmentsModal
                    isOpen={isInstallmentsModalOpen}
                    onClose={() => setIsInstallmentsModalOpen(false)}
                    installmentsTotal={installmentsTotal}
                    installmentsPaid={installmentsPaid}
                    firstInstallmentDate={firstInstallmentDate}
                    dueDay={dueDate}
                    debtName={name}
                    onUpdatePaid={(newPaid) => {
                        onUpdateInstallments?.(newPaid);
                    }}
                />
            )}
        </>
    );
}
