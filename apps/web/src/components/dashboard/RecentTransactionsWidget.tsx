import { format } from "date-fns";
import { ArrowRightLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { MoneyDisplay } from "../ui/MoneyDisplay";
import { useLocalization } from "../../contexts/LocalizationContext";

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
    const { t } = useTranslation();
    const { dateFormat } = useLocalization();
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
                        response.data,
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
                        {t("dashboard.recentTransactions.title")}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground">
                        {t("common.loading")}
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
                    {t("dashboard.recentTransactions.title")}
                </CardTitle>
                <Link
                    to="/transactions"
                    className="text-xs text-muted-foreground hover:underline"
                >
                    {t("dashboard.recentTransactions.viewAll")}
                </Link>
            </CardHeader>
            <CardContent>
                {transactions.length === 0 ? (
                    <div className="text-sm text-muted-foreground py-4 text-center">
                        {t("dashboard.recentTransactions.empty")}
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
                                            const datePart = transaction.date
                                                .toString()
                                                .split("T")[0];
                                            const [year, month, day] =
                                                datePart.split("-");
                                            const date = new Date(
                                                parseInt(year),
                                                parseInt(month) - 1,
                                                parseInt(day),
                                            );
                                            return format(date, dateFormat);
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
