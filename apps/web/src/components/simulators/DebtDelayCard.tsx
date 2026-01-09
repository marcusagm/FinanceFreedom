import React, { useState } from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { AppAlert } from "../ui/AppAlert";
import {
    calculateDelayCost,
    type DelayCostResponse,
} from "../../services/simulator.service";

interface DebtDelayCardProps {
    debtName: string;
    balance: number;
    interestRate: number;
}

export const DebtDelayCard: React.FC<DebtDelayCardProps> = ({
    debtName,
    balance,
    interestRate,
}) => {
    const [daysLate, setDaysLate] = useState(5);
    const [result, setResult] = useState<DelayCostResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSimulate = async () => {
        setLoading(true);
        try {
            const data = await calculateDelayCost(
                balance,
                interestRate,
                daysLate
            );
            setResult(data);
        } catch (error) {
            console.error("Failed to simulate", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <AppAlert variant="destructive" title="Validar Custo do Atraso">
                Simule quanto custa atrasar o pagamento de{" "}
                <strong className="font-semibold">{debtName}</strong>.
            </AppAlert>

            <div className="flex items-center gap-2">
                <Input
                    type="number"
                    value={daysLate}
                    onChange={(e) => setDaysLate(Number(e.target.value))}
                    className="w-20 dark:bg-background"
                    min={1}
                    max={60}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                    dias de atraso
                </span>
                <Button
                    size="sm"
                    variant="outline"
                    onClick={handleSimulate}
                    disabled={loading}
                >
                    {loading ? "..." : "Simular"}
                </Button>
            </div>

            {result && (
                <AppAlert
                    variant="destructive"
                    className="animate-in fade-in slide-in-from-top-2"
                >
                    <div className="text-lg font-bold">
                        +{" "}
                        {result.totalCost.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        })}
                    </div>
                    <div className="text-xs opacity-90 mt-1">
                        Isso é {result.comparison.toLowerCase()}!
                        <br />
                        (Juros: {result.interest.toFixed(2)} + Multa:{" "}
                        {result.fine.toFixed(2)})
                    </div>
                </AppAlert>
            )}
        </div>
    );
};
