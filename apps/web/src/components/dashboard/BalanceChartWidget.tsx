import {
    CartesianGrid,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { ChartTooltip } from "../ui/ChartTooltip";
import { MoneyDisplay } from "../ui/MoneyDisplay";

/* eslint-disable @typescript-eslint/no-explicit-any */
interface BalanceChartWidgetProps {
    data: any[];
    isObfuscated: boolean;
}

export function BalanceChartWidget({
    data,
    isObfuscated,
}: BalanceChartWidgetProps) {
    // Calculate gradient offset
    const gradientOffset = () => {
        const dataMax = Math.max(...data.map((i) => i.balance));
        const dataMin = Math.min(...data.map((i) => i.balance));

        if (dataMax <= 0) {
            return 0;
        }
        if (dataMin >= 0) {
            return 1;
        }
        return dataMax / (dataMax - dataMin);
    };

    const off = gradientOffset();

    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle>Evolução do Saldo (30 dias)</CardTitle>
            </CardHeader>
            <CardContent className="h-75 pl-2">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <defs>
                            <linearGradient
                                id="splitColor"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset={off}
                                    stopColor="#10b981"
                                    stopOpacity={1}
                                />
                                <stop
                                    offset={off}
                                    stopColor="#ef4444"
                                    stopOpacity={1}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => {
                                const date = new Date(value);
                                return `${date.getDate()}/${
                                    date.getMonth() + 1
                                }`;
                            }}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) =>
                                isObfuscated ? "••••••" : `R$ ${value}`
                            }
                        />
                        <Tooltip
                            content={
                                <ChartTooltip
                                    formatter={(value: number) => (
                                        <MoneyDisplay value={value} />
                                    )}
                                />
                            }
                        />
                        <ReferenceLine y={0} stroke="#000" />
                        <Line
                            type="monotone"
                            dataKey="balance"
                            stroke="url(#splitColor)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
}
