import React from "react";
import { DebtDelayCard } from "./DebtDelayCard";
import { PrepaymentOpportunity } from "./PrepaymentOpportunity";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Lightbulb } from "lucide-react";

// Use the Debt type from DebtForm or define a shared one if possible.
// For now, let's define the interface compatible with Debt.
interface Debt {
    id: string;
    name: string;
    totalAmount: number;
    interestRate: number;
    minimumPayment: number;
}

interface SimulatorsDemoProps {
    debts: Debt[];
}

export const SimulatorsDemo: React.FC<SimulatorsDemoProps> = ({ debts }) => {
    // Filter pertinent debts (e.g. have balance and interest)
    const activeDebts = debts.filter(
        (debt) => debt.totalAmount > 0 && debt.interestRate > 0
    );

    const hasDebts = activeDebts.length > 0;
    // Show top 2 just like before to avoid clutter
    const displayDebts = activeDebts.slice(0, 2);

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <h3 className="text-xl font-bold tracking-tight">
                    Simuladores de Economia
                </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                {hasDebts ? (
                    displayDebts.map((debt) => (
                        <Card
                            key={debt.id}
                            className="border-t-4 border-t-emerald-500"
                        >
                            <CardHeader>
                                <CardTitle>{debt.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <DebtDelayCard
                                    debtName={debt.name}
                                    balance={debt.totalAmount}
                                    interestRate={debt.interestRate}
                                />
                                <PrepaymentOpportunity
                                    debtName={debt.name}
                                    balance={debt.totalAmount}
                                    interestRate={debt.interestRate}
                                    minimumPayment={debt.minimumPayment}
                                />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="col-span-2 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                            <Lightbulb className="w-10 h-10 mb-2 opacity-20" />
                            <p className="font-medium">
                                Nenhuma dívida elegível para simulação
                            </p>
                            <p className="text-sm">
                                Cadastre dívidas com juros para ver as
                                oportunidades de economia.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};
