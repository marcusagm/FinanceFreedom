import { useEffect, useState } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../components/ui/Card";
import { TimeCostBadge } from "../components/simulators/TimeCostBadge";
import { getHourlyRate } from "../services/simulator.service";
import {
    getDashboardSummary,
    type DashboardSummary,
} from "../services/dashboard.service";
// import { formatMoney as _unused } from "../lib/utils"; // Not used, removing line
// import { cn } from "../lib/utils";
import { ActionFeed } from "../components/dashboard/ActionFeed";
import { ChartTooltip } from "../components/ui/ChartTooltip";

export default function Dashboard() {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [hourlyRate, setHourlyRate] = useState<number>(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [summaryData, hourlyData] = await Promise.all([
                    getDashboardSummary(),
                    getHourlyRate().catch(() => ({ hourlyRate: 0 })),
                ]);
                setSummary(summaryData);
                setHourlyRate(hourlyData.hourlyRate);
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="p-8">Loading dashboard...</div>;
    }

    if (!summary) {
        return <div className="p-8">Failed to load dashboard data.</div>;
    }

    const formatMoney = (value: number) => {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

    // Calculate gradient offset
    const gradientOffset = () => {
        const data = summary?.chartData || [];
        if (data.length <= 0) return 0;

        const dataMax = Math.max(...data.map((i) => i.balance));
        const dataMin = Math.min(...data.map((i) => i.balance));

        if (dataMax <= 0) return 0;
        if (dataMin >= 0) return 1;

        return dataMax / (dataMax - dataMin);
    };

    const off = gradientOffset();

    return (
        <div className="space-y-4 p-8 pt-6">
            <PageHeader title="Dashboard" />

            {/* Summary Cards */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Saldo Total
                        </CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-muted-foreground"
                        >
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div
                            className={`text-2xl font-bold ${
                                summary.totalBalance >= 0
                                    ? "text-emerald-500"
                                    : "text-red-500"
                            }`}
                        >
                            {formatMoney(summary.totalBalance)}
                        </div>
                        <p className="text-xs text-muted-foreground">
                            Visão geral de todas as contas
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Receitas (Mês)
                        </CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-emerald-500"
                        >
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-emerald-500">
                            {formatMoney(summary.monthlyIncome)}
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Despesas (Mês)
                        </CardTitle>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            className="h-4 w-4 text-red-500"
                        >
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                        </svg>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="text-2xl font-bold text-red-500">
                            {formatMoney(summary.monthlyExpenses)}
                        </div>
                        <TimeCostBadge
                            amount={summary.monthlyExpenses}
                            hourlyRate={hourlyRate}
                        />
                    </CardContent>
                </Card>
            </div>

            {/* Action Feed */}
            <div className="grid gap-4 md:grid-cols-1">
                <ActionFeed recommendations={summary.recommendations} />
            </div>

            {/* Chart */}
            <div className="grid gap-4 md:grid-cols-1">
                <Card className="col-span-1">
                    <CardHeader>
                        <CardTitle>Evolução do Saldo (30 dias)</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={summary.chartData}>
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
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                />
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
                                    tickFormatter={(value) => `R$ ${value}`}
                                />
                                <Tooltip
                                    content={
                                        <ChartTooltip formatter={formatMoney} />
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
            </div>
        </div>
    );
}
