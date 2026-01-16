import { ArrowDownRight, ArrowUpRight, TrendingUp } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { MoneyDisplay } from "../ui/MoneyDisplay";

interface WealthWidgetProps {
    totalInvested: number;
    netWorth: number;
    totalDebt: number;
    totalBalance: number;
}

export function WealthWidget({
    totalInvested,
    netWorth,
    totalDebt,
    totalBalance,
}: WealthWidgetProps) {
    const { t } = useTranslation();
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {t("dashboard.wealth.title")}
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    <MoneyDisplay value={netWorth} />
                </div>
                <div className="grid grid-cols-3 gap-2 mt-4 text-xs">
                    <div>
                        <p className="text-muted-foreground">
                            {t("dashboard.wealth.invested")}
                        </p>
                        <div className="font-medium text-emerald-600 flex items-center">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            <MoneyDisplay value={totalInvested} />
                        </div>
                    </div>
                    <div>
                        <p className="text-muted-foreground">
                            {t("dashboard.wealth.balance")}
                        </p>
                        <div className="font-medium text-blue-500 flex items-center">
                            <ArrowUpRight className="h-3 w-3 mr-1" />
                            <MoneyDisplay value={totalBalance} />
                        </div>
                    </div>
                    <div>
                        <p className="text-muted-foreground">
                            {t("dashboard.wealth.debts")}
                        </p>
                        <div className="font-medium text-red-500 flex items-center">
                            <ArrowDownRight className="h-3 w-3 mr-1" />
                            <MoneyDisplay value={totalDebt} />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
