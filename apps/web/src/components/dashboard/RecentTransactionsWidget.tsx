import { ArrowRightLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { MoneyDisplay } from "../ui/MoneyDisplay";

interface Transaction {
    id: string;
    description: string;
    amount: number;
    type: "INCOME" | "EXPENSE";
    date: string;
    account: {
        name: string;
    };
}

export function RecentTransactionsWidget() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const response = await api.get<any>("/transactions");

                let transactionList: Transaction[] = [];

                if (Array.isArray(response.data)) {
                    transactionList = response.data;
                } else if (response.data && Array.isArray(response.data.data)) {
                    transactionList = response.data.data;
                } else {
                    console.error(
                        "Invalid transactions data format:",
                        response.data
                    );
                }

                setTransactions(transactionList.slice(0, 5));
            } catch (error) {
                console.error("Failed to load transactions", error);
                setTransactions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTransactions();
    }, []);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">
                        Transações Recentes
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground">
                        Carregando...
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <ArrowRightLeft className="h-4 w-4 text-blue-500" />
                    Transações Recentes
                </CardTitle>
                <Link
                    to="/transactions"
                    className="text-xs text-muted-foreground hover:underline"
                >
                    Ver todas
                </Link>
            </CardHeader>
            <CardContent>
                {transactions.length === 0 ? (
                    <div className="text-sm text-muted-foreground py-4 text-center">
                        Nenhuma transação recente.
                    </div>
                ) : (
                    <div className="space-y-4 pt-2">
                        {transactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0"
                            >
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {transaction.description}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {(() => {
                                            if (!transaction.date) return "";
                                            // Handle potentially different date formats or ISO strings
                                            const dateStr =
                                                transaction.date.toString();
                                            // Extract YYYY-MM-DD part
                                            const datePart = dateStr.includes(
                                                "T"
                                            )
                                                ? dateStr.split("T")[0]
                                                : dateStr;

                                            const [, month, day] =
                                                datePart.split("-");
                                            return `${day}/${month}`;
                                        })()}{" "}
                                        • {transaction.account?.name}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p
                                        className={`text-sm font-bold ${
                                            transaction.type === "INCOME"
                                                ? "text-emerald-500"
                                                : "text-red-500"
                                        }`}
                                    >
                                        <MoneyDisplay
                                            value={Number(transaction.amount)}
                                        />
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
