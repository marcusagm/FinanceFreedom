import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import {
    analyticsService,
    type BudgetStatus,
} from "../../services/analytics.service";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { ChartTooltip } from "../ui/ChartTooltip";
import { MoneyDisplay } from "../ui/MoneyDisplay";

export function BudgetWidget() {
    const { t } = useTranslation();
    const [budgets, setBudgets] = useState<BudgetStatus[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadBudgets();
    }, []);

    const loadBudgets = async () => {
        try {
            const data = await analyticsService.getBudgets();
            setBudgets(data);
        } catch (error) {
            console.error("Failed to load budgets", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{t("dashboard.budget.title")}</CardTitle>
                </CardHeader>
                <CardContent className="h-75 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </CardContent>
            </Card>
        );
    }

    if (budgets.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{t("dashboard.budget.title")}</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center text-muted-foreground text-sm">
                        {t("dashboard.budget.empty")}
                        <Link
                            to="/categories"
                            className="block mt-2 text-primary hover:underline"
                        >
                            {t("dashboard.budget.configure")}
                        </Link>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Prepare data for Pie Chart
    const pieData = budgets
        .map((item) => ({
            name: item.categoryName,
            value: item.spent,
            limit: item.limit,
            percentage: item.percentage,
            color: item.categoryColor || "#cccccc",
        }))
        .filter((item) => item.value > 0); // Only show categories with spending

    const hasSpending = pieData.length > 0;

    return (
        <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-base font-semibold">
                    {t("dashboard.budget.distribution")}
                </CardTitle>
                <Link
                    to="/categories"
                    className="text-xs text-muted-foreground hover:underline"
                >
                    {t("dashboard.budget.manage")}
                </Link>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center pt-0">
                <div className="w-full" style={{ height: 250 }}>
                    {hasSpending ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={2}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                            stroke="none"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    content={
                                        <ChartTooltip
                                            formatter={(value: number) => (
                                                <MoneyDisplay value={value} />
                                            )}
                                        />
                                    }
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    height={36}
                                    formatter={(value: any) => (
                                        <span className="text-xs text-muted-foreground ml-1">
                                            {value}
                                        </span>
                                    )}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex bg-muted/20 flex-col items-center justify-center h-full text-center text-sm text-muted-foreground rounded-lg">
                            <p>{t("dashboard.budget.noSpending")}</p>
                            <p className="text-xs opacity-70 mt-1">
                                {t("dashboard.budget.addTransaction")}
                            </p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
