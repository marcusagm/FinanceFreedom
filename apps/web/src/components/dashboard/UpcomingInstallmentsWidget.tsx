import { format } from "date-fns";
import { CalendarClock } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { api } from "../../lib/api";
import { type Installment, generateInstallments } from "../../lib/installments";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { MoneyDisplay } from "../ui/MoneyDisplay";
import { useLocalization } from "../../contexts/LocalizationContext";

interface Debt {
    id: string;
    name: string;
    totalAmount: number;
    installmentsTotal?: number;
    installmentsPaid: number;
    firstInstallmentDate?: string;
    dueDate: number;
}

interface UpcomingInstallment extends Installment {
    debtName: string;
    debtId: string;
    amount: number; // Approximate, total / totalInstallments
}

export function UpcomingInstallmentsWidget() {
    const { t } = useTranslation();
    const { dateFormat } = useLocalization();
    const [upcoming, setUpcoming] = useState<UpcomingInstallment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDebts = async () => {
            try {
                const response = await api.get("/debts");
                const debts: Debt[] = response.data;
                const allUpcoming: UpcomingInstallment[] = [];

                debts.forEach((debt) => {
                    if (!debt.installmentsTotal || debt.installmentsTotal <= 0)
                        return;

                    const debtInstallments = generateInstallments({
                        installmentsTotal: debt.installmentsTotal,
                        installmentsPaid: debt.installmentsPaid,
                        firstInstallmentDate: debt.firstInstallmentDate,
                        dueDay: debt.dueDate,
                    });

                    // Filter pending
                    const pending = debtInstallments.filter(
                        (i) => i.status === "PENDING",
                    );

                    // Add metadata
                    pending.forEach((p) => {
                        allUpcoming.push({
                            ...p,
                            debtName: debt.name,
                            debtId: debt.id,
                            amount:
                                debt.totalAmount /
                                (debt.installmentsTotal! -
                                    debt.installmentsPaid), // This is an approximation if totalAmount decreases. Ideally we'd know original amount.
                        });
                    });
                });

                // Sort by date
                allUpcoming.sort(
                    (a, b) => a.dueDate.getTime() - b.dueDate.getTime(),
                );

                // Take top 5
                setUpcoming(allUpcoming.slice(0, 5));
            } catch (error) {
                console.error("Failed to load installments", error);
            } finally {
                setLoading(false);
            }
        };

        fetchDebts();
    }, []);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="text-sm font-medium">
                        {t("dashboard.upcomingInstallments.title")}
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
                    <CalendarClock className="h-4 w-4 text-orange-500" />
                    {t("dashboard.upcomingInstallments.title")}
                </CardTitle>
                <Link
                    to="/debts"
                    className="text-xs text-muted-foreground hover:underline"
                >
                    {t("dashboard.upcomingInstallments.viewAll")}
                </Link>
            </CardHeader>
            <CardContent>
                {upcoming.length === 0 ? (
                    <div className="text-sm text-muted-foreground py-4 text-center">
                        {t("dashboard.upcomingInstallments.empty")}
                    </div>
                ) : (
                    <div className="space-y-4 pt-2">
                        {upcoming.map((inst) => (
                            <div
                                key={`${inst.debtId}-${inst.number}`}
                                className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0"
                            >
                                <div className="space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        {inst.debtName}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {t(
                                            "dashboard.upcomingInstallments.installment",
                                            { number: inst.number },
                                        )}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-bold">
                                        <MoneyDisplay value={inst.amount} />
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {format(inst.dueDate, dateFormat)}
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
