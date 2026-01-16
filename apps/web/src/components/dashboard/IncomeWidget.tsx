import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    Legend,
} from "recharts";
import {
    analyticsService,
    type IncomeStatus,
} from "../../services/analytics.service";
import { ChartTooltip } from "../ui/ChartTooltip";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { MoneyDisplay } from "../ui/MoneyDisplay";

export function IncomeWidget() {
    const [data, setData] = useState<IncomeStatus[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const result = await analyticsService.getIncomes();
            setData(result);
        } catch (error) {
            console.error("Failed to load income data", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Distribuição de Receitas</CardTitle>
                </CardHeader>
                <CardContent className="h-75 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
                </CardContent>
            </Card>
        );
    }

    if (data.length === 0) {
        return (
            <Card className="h-full">
                <CardHeader>
                    <CardTitle>Distribuição de Receitas</CardTitle>
                </CardHeader>
                <CardContent className="h-75 flex flex-col items-center justify-center text-muted-foreground bg-gray-50/50 dark:bg-gray-900/20 rounded-lg m-4 border-2 border-dashed">
                    <p className="text-lg font-medium mb-2">
                        Sem receitas registradas
                    </p>
                    <p className="text-sm text-center max-w-50">
                        Adicione transações de entrada para ver o gráfico.
                    </p>
                    <Link
                        to="/transactions"
                        className="mt-4 text-primary hover:underline text-sm"
                    >
                        Criar Transação
                    </Link>
                </CardContent>
            </Card>
        );
    }

    const pieData = data.map((item) => ({
        name: item.categoryName,
        value: item.received,
        color: item.categoryColor || "#10b981", // green default for money in
    }));

    // formatMoney removed as we use MoneyDisplay directly in props

    return (
        <Card className="h-full">
            <CardHeader className="pb-2">
                <CardTitle>Distribuição de Receitas</CardTitle>
            </CardHeader>
            <CardContent>
                <div style={{ width: "100%", height: 250 }}>
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
                </div>
            </CardContent>
        </Card>
    );
}
