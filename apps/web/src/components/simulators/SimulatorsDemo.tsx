import React, { useEffect, useState } from "react";
import { api } from "../../lib/api";
import { DebtDelayCard } from "./DebtDelayCard";
import { PrepaymentOpportunity } from "./PrepaymentOpportunity";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { Lightbulb } from "lucide-react";

interface Account {
    id: string;
    name: string;
    type: string;
    balance: number;
    interestRate?: number;
}

export const SimulatorsDemo: React.FC = () => {
    const [debts, setDebts] = useState<Account[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDebts = async () => {
            try {
                const response = await api.get<Account[]>("/accounts");
                const debtAccounts = response.data.filter(
                    (acc) =>
                        acc.type === "DEBT" ||
                        acc.type === "LOAN" ||
                        acc.type === "CREDIT_CARD" ||
                        (acc.balance < 0 &&
                            acc.interestRate &&
                            acc.interestRate > 0)
                );
                setDebts(debtAccounts);
            } catch (error) {
                console.error("Failed to fetch accounts for simulators", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDebts();
    }, []);

    if (loading) return null;

    // Don't show anything if no debts, unless we want to show an empty state to encourage usage.
    // Given the user feedback, we will show an empty state.

    const hasDebts = debts.length > 0;
    const displayDebts = debts.slice(0, 2);

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <Lightbulb className="w-5 h-5 text-yellow-500" />
                <h3 className="text-xl font-bold tracking-tight">
                    Estratégias e Simuladores
                </h3>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                {hasDebts ? (
                    displayDebts.map((debt) => (
                        <Card
                            key={debt.id}
                            className="border-t-4 border-t-red-500"
                        >
                            <CardHeader>
                                <CardTitle>{debt.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <DebtDelayCard
                                    accountId={debt.id}
                                    debtName={debt.name}
                                    balance={Math.abs(debt.balance || 0)} // Pass balance
                                />
                                <PrepaymentOpportunity
                                    accountId={debt.id}
                                    debtName={debt.name}
                                />
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <Card className="col-span-2 border-dashed">
                        <CardContent className="flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
                            <Lightbulb className="w-10 h-10 mb-2 opacity-20" />
                            <p className="font-medium">
                                Nenhuma dívida cadastrada
                            </p>
                            <p className="text-sm">
                                Cadastre uma conta do tipo "Dívida",
                                "Empréstimo" ou "Cartão de Crédito" para liberar
                                os simuladores de economia e juros.
                            </p>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
};
