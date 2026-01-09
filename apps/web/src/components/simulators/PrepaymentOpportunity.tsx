import React, { useState } from "react";
import { TrendingUp } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { AppAlert } from "../ui/AppAlert";
import {
    calculatePrepaymentSavings,
    type PrepaymentSavingsResponse,
} from "../../services/simulator.service";

interface PrepaymentOpportunityProps {
    debtName: string;
    balance: number;
    interestRate: number;
    minimumPayment: number;
    initialAmount?: number;
}

export const PrepaymentOpportunity: React.FC<PrepaymentOpportunityProps> = ({
    debtName,
    balance,
    interestRate,
    minimumPayment,
    initialAmount = 500,
}) => {
    const [amount, setAmount] = useState(initialAmount);
    const [result, setResult] = useState<PrepaymentSavingsResponse | null>(
        null
    );
    const [loading, setLoading] = useState(false);

    const handleSimulate = async () => {
        setLoading(true);
        try {
            const data = await calculatePrepaymentSavings(
                balance,
                interestRate,
                minimumPayment,
                amount
            );
            setResult(data);
        } catch (error) {
            console.error("Failed to simulate", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
                <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-full">
                    <TrendingUp className="text-emerald-500 dark:text-emerald-400 w-4 h-4" />
                </div>
                <div>
                    <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                        Oportunidade de Antecipação
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Economize antecipando parcelas de{" "}
                        <strong>{debtName}</strong>.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <div className="relative w-32">
                    <span className="absolute left-2 top-2.5 text-xs text-gray-500 dark:text-gray-400">
                        R$
                    </span>
                    <Input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="pl-7 dark:bg-background"
                        min={10}
                    />
                </div>

                <Button
                    size="sm"
                    variant="primary"
                    onClick={handleSimulate}
                    disabled={loading}
                >
                    {loading ? "..." : "Simular"}
                </Button>
            </div>

            {result && (
                <AppAlert
                    variant="success"
                    className="animate-in fade-in slide-in-from-top-2"
                >
                    <div className="text-lg font-bold">
                        Economia de{" "}
                        {result.interestSaved.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        })}
                    </div>
                    <div className="text-xs opacity-90 mt-1">
                        Ao eliminar juros futuros.
                        {result.monthsSaved > 0 &&
                            ` Você "compra" ${result.monthsSaved} meses de liberdade!`}
                    </div>
                </AppAlert>
            )}
        </div>
    );
};
