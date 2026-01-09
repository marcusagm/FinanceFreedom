import { useEffect, useState } from "react";
import { usePrivacy } from "../contexts/PrivacyContext";
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

// import { cn } from "../lib/utils";
import { ActionFeed } from "../components/dashboard/ActionFeed";
import { ChartTooltip } from "../components/ui/ChartTooltip";
import { MoneyDisplay } from "../components/ui/MoneyDisplay";
import { QuickActionFAB } from "../components/common/QuickActionFAB";
import { Button } from "../components/ui/Button";
import { RefreshCw } from "lucide-react";
import { ImportService } from "../services/import.service";
import { Modal } from "../components/ui/Modal";
import { notify } from "../lib/notification";

export default function Dashboard() {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [hourlyRate, setHourlyRate] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [isSyncConfirmOpen, setIsSyncConfirmOpen] = useState(false); // Confirmation modal state
    const { isObfuscated } = usePrivacy();

    const chartFormatter = (value: number) => {
        if (isObfuscated) return "••••••";
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
        }).format(value);
    };

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

    useEffect(() => {
        fetchData();
    }, []);

    const confirmSync = async () => {
        setIsSyncConfirmOpen(false);
        setSyncing(true);
        const toastId = notify.loading("Sincronizando contas...");
        try {
            const result = await ImportService.syncNow(); // Sync ALL accounts
            const count = result.imported;
            await fetchData(); // Refresh data
            notify.dismiss(toastId);
            notify.success(
                "Sincronização Concluída",
                `Foram importadas ${count} novas transações.`
            );
        } catch (error: any) {
            console.error("Sync failed", error);
            notify.dismiss(toastId);
            notify.error(
                "Erro na Sincronização",
                error.message || "Falha ao conectar com o servidor de e-mail."
            );
        } finally {
            setSyncing(false);
        }
    };

    const handleSyncClick = () => {
        setIsSyncConfirmOpen(true);
    };

    if (loading) {
        return <div className="p-8">Loading dashboard...</div>;
    }

    if (!summary) {
        return <div className="p-8">Failed to load dashboard data.</div>;
    }

    // const formatMoney = ... (replaced by MoneyDisplay component)

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
        <div className="space-y-4 p-8 pt-6 relative min-h-screen">
            <PageHeader
                title="Dashboard"
                actions={
                    <div className="flex gap-2">
                        {/* <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                notify.success(
                                    "Success",
                                    "Operation completed successfully"
                                )
                            }
                        >
                            Success
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                notify.error("Error", "Something went wrong")
                            }
                        >
                            Error
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                                notify.info("Info", "Some information")
                            }
                        >
                            Info
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => notify.loading("Loading")}
                        >
                            Loading
                        </Button> */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSyncClick}
                            disabled={syncing}
                        >
                            <RefreshCw
                                className={`mr-2 h-4 w-4 ${
                                    syncing ? "animate-spin" : ""
                                }`}
                            />
                            {syncing ? "Sincronizando..." : "Sincronizar"}
                        </Button>
                    </div>
                }
            />

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
                            <MoneyDisplay value={summary.totalBalance} />
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
                            <MoneyDisplay value={summary.monthlyIncome} />
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
                            <MoneyDisplay value={summary.monthlyExpenses} />
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
                                    tickFormatter={(value) =>
                                        isObfuscated ? "••••••" : `R$ ${value}`
                                    }
                                />
                                <Tooltip
                                    content={
                                        <ChartTooltip
                                            formatter={chartFormatter}
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
            </div>

            <QuickActionFAB />

            <Modal
                isOpen={isSyncConfirmOpen}
                onClose={() => setIsSyncConfirmOpen(false)}
                title="Sincronizar Contas"
                footer={
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsSyncConfirmOpen(false)}
                        >
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={confirmSync}>
                            Confirmar
                        </Button>
                    </div>
                }
            >
                <p>
                    Deseja verificar manualmente a caixa de entrada de todos os
                    e-mails cadastrados em busca de novas transações?
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                    Isso pode levar alguns segundos.
                </p>
            </Modal>
        </div>
    );
}
