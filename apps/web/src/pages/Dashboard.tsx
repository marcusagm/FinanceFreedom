import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";

import { ActionFeed } from "../components/dashboard/ActionFeed";
import { BalanceChartWidget } from "../components/dashboard/BalanceChartWidget";
import { BudgetWidget } from "../components/dashboard/BudgetWidget";
import { ExpenseSummaryWidget } from "../components/dashboard/ExpenseSummaryWidget";
import { HealthScoreWidget } from "../components/dashboard/HealthScoreWidget";
import { IncomeSummaryWidget } from "../components/dashboard/IncomeSummaryWidget";
import { IncomeWidget } from "../components/dashboard/IncomeWidget";
import { UpcomingInstallmentsWidget } from "../components/dashboard/UpcomingInstallmentsWidget";
import { WealthWidget } from "../components/dashboard/WealthWidget";
import { SyncTransactionsDialog } from "../components/import/SyncTransactionsDialog";
import { Button } from "../components/ui/Button";
import { PageHeader } from "../components/ui/PageHeader";
import { QuickActionFAB } from "../components/common/QuickActionFAB";
import { notify } from "../lib/notification";
import { ImportService } from "../services/import.service";
import { usePrivacy } from "../contexts/PrivacyContext";
import {
    getDashboardSummary,
    type DashboardSummary,
} from "../services/dashboard.service";
import { getHourlyRate } from "../services/simulator.service";

export default function Dashboard() {
    const [summary, setSummary] = useState<DashboardSummary | null>(null);
    const [hourlyRate, setHourlyRate] = useState<number>(0);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [isSyncConfirmOpen, setIsSyncConfirmOpen] = useState(false); // Confirmation modal state
    const { isObfuscated } = usePrivacy();

    const [error, setError] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            const [summaryData, hourlyData] = await Promise.all([
                getDashboardSummary(),
                getHourlyRate().catch(() => ({ hourlyRate: 0 })),
            ]);
            setSummary(summaryData);
            setHourlyRate(hourlyData.hourlyRate);
        } catch (err: any) {
            console.error("Failed to fetch dashboard data", err);
            setError(err.message || "Failed to load dashboard data");
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
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-lg">Carregando dashboard...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="text-destructive text-lg font-medium">
                    {error}
                </div>
                <Button onClick={fetchData}>Tentar Novamente</Button>
            </div>
        );
    }

    if (!summary) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <div className="text-lg">Nenhum dado disponível.</div>
                <Button onClick={fetchData}>Atualizar</Button>
            </div>
        );
    }

    // const formatMoney = ... (replaced by MoneyDisplay component)

    return (
        <div className="space-y-4 p-8 pt-6 relative min-h-screen">
            <PageHeader
                title="Dashboard"
                actions={
                    <div className="flex gap-2">
                        <Button
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
                        </Button>
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
                <div className="col-span-2">
                    <WealthWidget
                        totalInvested={summary.totalInvested || 0}
                        netWorth={summary.netWorth || summary.totalBalance}
                        totalDebt={summary.totalDebt || 0}
                        totalBalance={summary.totalBalance}
                    />
                </div>
                <IncomeSummaryWidget value={summary.monthlyIncome} />
                <ExpenseSummaryWidget
                    value={summary.monthlyExpenses}
                    hourlyRate={hourlyRate}
                />
            </div>

            {/* Main Content Grid: Chart + Upcoming Installments */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <div className="col-span-4 max-h-100">
                    <BalanceChartWidget
                        data={summary.chartData}
                        isObfuscated={isObfuscated}
                    />
                </div>

                <div className="col-span-3 space-y-4">
                    <HealthScoreWidget />
                </div>
            </div>

            {/* Financial Health Row */}
            <div className="grid gap-4 md:grid-cols-2">
                <IncomeWidget />
                <BudgetWidget />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <UpcomingInstallmentsWidget />
            </div>

            {/* Action Feed */}
            <div className="grid gap-4 md:grid-cols-1">
                <ActionFeed recommendations={summary.recommendations} />
            </div>

            <QuickActionFAB />

            <SyncTransactionsDialog
                isOpen={isSyncConfirmOpen}
                onClose={() => setIsSyncConfirmOpen(false)}
                onConfirm={confirmSync}
            />
        </div>
    );
}
