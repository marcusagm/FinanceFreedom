import { useState } from "react";
import {
    Bar,
    CartesianGrid,
    ComposedChart,
    Line,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { ChartTooltip } from "../ui/ChartTooltip";
import { MoneyDisplay } from "../ui/MoneyDisplay";
import { Tabs, TabsList, TabsTrigger } from "../ui/Tabs";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface CheckpointData {
    date: string;
    balance: number;
    income: number;
    expense: number;
}

interface BalanceChartWidgetProps {
    dailyData: CheckpointData[];
    annualData: CheckpointData[];
    isObfuscated: boolean;
}

export function BalanceChartWidget({
    dailyData,
    annualData,
    isObfuscated,
}: BalanceChartWidgetProps) {
    const [viewMode, setViewMode] = useState<"monthly" | "annual">("monthly");

    const currentData = viewMode === "monthly" ? dailyData : annualData;

    // Transform data for chart: make expenses negative for "down" bars
    const chartData = currentData.map((d) => ({
        ...d,
        expense: -Math.abs(d.expense), // Ensure negative
    }));

    // Calculate domain for YAxis to accommodate both positive (Balance/Income) and negative (Expense)
    const allValues = chartData.flatMap((d) => [
        d.balance,
        d.income,
        d.expense,
    ]);
    const maxVal = Math.max(...allValues, 0);
    const minVal = Math.min(...allValues, 0);

    // Add some padding
    const domainMax = maxVal * 1.1;
    const domainMin = minVal * 1.1;

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-medium">
                    Evolução do Saldo & Fluxo de Caixa
                </CardTitle>
                <Tabs
                    defaultValue="monthly"
                    value={viewMode}
                    onValueChange={(v) =>
                        setViewMode(v as "monthly" | "annual")
                    }
                    className="w-75"
                >
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="monthly" className="text-sm">
                            Mensal
                        </TabsTrigger>
                        <TabsTrigger value="annual" className="text-sm">
                            Anual
                        </TabsTrigger>
                    </TabsList>
                </Tabs>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
                <div style={{ width: "100%", height: 300 }}>
                    <ResponsiveContainer>
                        <ComposedChart data={chartData}>
                            <defs>
                                <linearGradient
                                    id="balanceGradient"
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop
                                        offset="5%"
                                        stopColor="#2563eb"
                                        stopOpacity={0.3}
                                    />
                                    <stop
                                        offset="95%"
                                        stopColor="#2563eb"
                                        stopOpacity={0}
                                    />
                                </linearGradient>
                            </defs>
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#333"
                                opacity={0.2}
                            />
                            <XAxis
                                dataKey="date"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => {
                                    if (!value) return "";
                                    if (viewMode === "monthly") {
                                        // value is "YYYY-MM-DD"
                                        const [month, day] = value.split("-");
                                        return `${day}/${month}`;
                                    } else {
                                        // Annual: Show Month/Year stub or just Month
                                        // value is "YYYY-MM"
                                        const [_, month] = value.split("-");
                                        const months = [
                                            "Jan",
                                            "Fev",
                                            "Mar",
                                            "Abr",
                                            "Mai",
                                            "Jun",
                                            "Jul",
                                            "Ago",
                                            "Set",
                                            "Out",
                                            "Nov",
                                            "Dez",
                                        ];
                                        return months[parseInt(month) - 1];
                                    }
                                }}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                domain={[domainMin, domainMax]}
                                tickFormatter={(value) => {
                                    if (isObfuscated) return "••••••";
                                    return new Intl.NumberFormat("pt-BR", {
                                        notation: "compact",
                                        compactDisplay: "short",
                                        style: "currency",
                                        currency: "BRL",
                                    }).format(value);
                                }}
                            />
                            <Tooltip
                                content={
                                    <ChartTooltip
                                        formatter={(
                                            value: number,
                                            name?: string
                                        ) => (
                                            <MoneyDisplay
                                                value={Math.abs(value)}
                                                className={
                                                    name === "Despesa"
                                                        ? "text-red-500"
                                                        : name === "Receita"
                                                        ? "text-emerald-500"
                                                        : "text-blue-500"
                                                }
                                            />
                                        )}
                                    />
                                }
                            />
                            <ReferenceLine y={0} stroke="#666" />

                            <Bar
                                name="Receita"
                                dataKey="income"
                                barSize={8}
                                radius={[4, 4, 0, 0]}
                            >
                                {chartData.map((_, index) => (
                                    <Cell
                                        key={`cell-income-${index}`}
                                        fill="#10b981"
                                        opacity={0.8}
                                    />
                                ))}
                            </Bar>

                            {/* Expense Bar (Down) */}
                            <Bar
                                name="Despesa"
                                dataKey="expense"
                                barSize={8}
                                radius={[0, 0, 4, 4]}
                            >
                                {chartData.map((_, index) => (
                                    <Cell
                                        key={`cell-expense-${index}`}
                                        fill="#ef4444"
                                        opacity={0.8}
                                    />
                                ))}
                            </Bar>

                            <Line
                                name="Saldo"
                                type="monotone"
                                dataKey="balance"
                                stroke="#2563eb"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4 }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
