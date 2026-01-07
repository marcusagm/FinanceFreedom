import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import {
    calculateDelayCost,
    type DelayCostResponse,
} from "../../services/simulator.service";

interface DebtDelayCardProps {
    accountId: string;
    debtName: string;
    balance?: number;
}

export const DebtDelayCard: React.FC<DebtDelayCardProps> = ({
    accountId,
    debtName,
}) => {
    const [daysLate, setDaysLate] = useState(5);
    const [result, setResult] = useState<DelayCostResponse | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSimulate = async () => {
        setLoading(true);
        try {
            const data = await calculateDelayCost(accountId, daysLate);
            setResult(data);
        } catch (error) {
            console.error("Failed to simulate", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg border border-red-100">
                <AlertTriangle className="text-red-500 w-5 h-5 flex-shrink-0" />
                <div>
                    <h3 className="font-bold text-sm text-red-900">
                        Validar Custo do Atraso
                    </h3>
                    <p className="text-xs text-red-700">
                        Simule quanto custa atrasar o pagamento de{" "}
                        <strong>{debtName}</strong>.
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Input
                    type="number"
                    value={daysLate}
                    onChange={(e) => setDaysLate(Number(e.target.value))}
                    className="w-20"
                    min={1}
                    max={60}
                />
                <span className="text-sm text-gray-600">dias de atraso</span>
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
                <div className="animate-in fade-in slide-in-from-top-2 duration-300 p-3 bg-white rounded-md border border-red-100 shadow-sm">
                    <div className="text-lg font-bold text-red-600">
                        +{" "}
                        {result.totalCost.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                        })}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        Isso é {result.comparison.toLowerCase()}!
                        <br />
                        (Juros: {result.interest.toFixed(2)} + Multa:{" "}
                        {result.fine.toFixed(2)})
                    </div>
                </div>
            )}
        </div>
    );
};
