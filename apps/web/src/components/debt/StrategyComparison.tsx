import { useEffect, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { api } from "../../lib/api";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Label } from "../ui/Label";
import { DebtCard } from "./DebtCard";
import type { Debt } from "./DebtForm";
import { DebtPaymentDialog } from "./DebtPaymentDialog";
import { useLocalization } from "../../contexts/LocalizationContext";

type StrategyType = "SNOWBALL" | "AVALANCHE";

interface StrategyComparisonProps {
    onEdit: (debt: Debt) => void;
    onDelete: (debt: Debt) => void;
}

export function StrategyComparison({
    onEdit,
    onDelete,
}: StrategyComparisonProps) {
    const { t } = useTranslation();
    const { formatCurrency } = useLocalization();
    const [activeTab, setActiveTab] = useState<StrategyType>("SNOWBALL");
    const [debts, setDebts] = useState<Debt[]>([]);
    const [loading, setLoading] = useState(false);
    const [monthlyExtra, setMonthlyExtra] = useState<number>(() => {
        const saved = localStorage.getItem("debt_strategy_extra_value");
        return saved ? Number(saved) : 0;
    });
    const [paymentDialogDebt, setPaymentDialogDebt] = useState<Debt | null>(
        null,
    );

    useEffect(() => {
        localStorage.setItem(
            "debt_strategy_extra_value",
            monthlyExtra.toString(),
        );
    }, [monthlyExtra]);

    const [projection, setProjection] = useState<{
        monthsToPayoff: number;
        totalInterest: number;
    } | null>(null);

    useEffect(() => {
        const fetchStrategy = async () => {
            setLoading(true);
            try {
                const response = await api.get(
                    `/debts/strategy?type=${activeTab}&monthlyExtra=${monthlyExtra}`,
                );
                // Handle new response structure
                // Handle new response structure
                if (response.data.debts && Array.isArray(response.data.debts)) {
                    setDebts(response.data.debts);
                    setProjection(response.data.projection);
                } else if (Array.isArray(response.data)) {
                    setDebts(response.data);
                } else {
                    console.error(
                        "Invalid debts data received:",
                        response.data,
                    );
                    setDebts([]);
                }
            } catch (error) {
                console.error("Failed to fetch strategy", error);
            } finally {
                setLoading(false);
            }
        };

        const timeout = setTimeout(fetchStrategy, 500); // Debounce
        return () => clearTimeout(timeout);
    }, [activeTab, monthlyExtra]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 border-b border-border pb-2">
                <Button
                    variant={activeTab === "SNOWBALL" ? "primary" : "ghost"}
                    onClick={() => setActiveTab("SNOWBALL")}
                    className={cn(
                        "justify-start",
                        activeTab === "SNOWBALL" &&
                            "bg-blue-600 hover:bg-blue-700",
                    )}
                >
                    {t("debts.strategy.snowball")}
                </Button>
                <Button
                    variant={activeTab === "AVALANCHE" ? "primary" : "ghost"}
                    onClick={() => setActiveTab("AVALANCHE")}
                    className={cn(
                        "justify-start",
                        activeTab === "AVALANCHE" &&
                            "bg-red-600 hover:bg-red-700",
                    )}
                >
                    {t("debts.strategy.avalanche")}
                </Button>
            </div>

            <div className="bg-card border border-border p-4 rounded-lg space-y-2">
                <Label htmlFor="monthlyExtra">
                    {t("debts.strategy.extraValueLabel")}
                </Label>
                <div className="flex items-center gap-2">
                    <div className="max-w-50">
                        <Input
                            id="monthlyExtra"
                            placeholder="R$ 0,00"
                            currency
                            value={monthlyExtra}
                            onValueChange={(values) =>
                                setMonthlyExtra(values.floatValue || 0)
                            }
                        />
                    </div>
                    {projection ? (
                        <div className="flex flex-col sm:flex-row gap-4 w-full">
                            <div className="bg-primary/10 p-3 rounded-md flex-1">
                                <p className="text-xs text-muted-foreground font-medium uppercase">
                                    {t("debts.strategy.estimatedTime")}
                                </p>
                                <p className="text-xl font-bold text-primary">
                                    {Math.floor(
                                        projection.monthsToPayoff / 12,
                                    ) > 0 &&
                                        `${Math.floor(
                                            projection.monthsToPayoff / 12,
                                        )} ${t("debts.strategy.years")} `}
                                    {projection.monthsToPayoff % 12}{" "}
                                    {t("debts.strategy.months")}
                                </p>
                            </div>
                            <div className="bg-red-500/10 p-3 rounded-md flex-1">
                                <p className="text-xs text-muted-foreground font-medium uppercase">
                                    {t("debts.strategy.totalInterest")}
                                </p>
                                <p className="text-xl font-bold text-red-600">
                                    {formatCurrency(projection.totalInterest)}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground">
                            {t("debts.strategy.extraValueHelp")}
                        </p>
                    )}
                </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground border border-border">
                {activeTab === "SNOWBALL" ? (
                    <p>
                        <Trans
                            i18nKey="debts.strategy.snowballDesc"
                            components={{ strong: <strong /> }}
                        />
                    </p>
                ) : (
                    <p>
                        <Trans
                            i18nKey="debts.strategy.avalancheDesc"
                            components={{ strong: <strong /> }}
                        />
                    </p>
                )}
            </div>

            {loading ? (
                <div className="py-10 text-center text-muted-foreground">
                    {t("debts.strategy.loading")}
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {Array.isArray(debts) &&
                        debts.map((debt, index) => (
                            <div key={debt.id} className="relative">
                                {index === 0 && (
                                    <div className="absolute -top-3 left-4 z-10 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-bounce">
                                        {t("debts.strategy.focus")}
                                    </div>
                                )}
                                <div
                                    className={cn(
                                        index === 0 &&
                                            "ring-2 ring-green-500 ring-offset-2 rounded-xl",
                                    )}
                                >
                                    <DebtCard
                                        id={debt.id}
                                        name={debt.name}
                                        totalAmount={debt.totalAmount}
                                        interestRate={debt.interestRate}
                                        minimumPayment={debt.minimumPayment}
                                        dueDate={debt.dueDate}
                                        onEdit={() => onEdit(debt)}
                                        onDelete={() => onDelete(debt)}
                                    />
                                </div>
                                {index === 0 && (
                                    <div className="mt-4 flex flex-col gap-2">
                                        <p className="text-center text-xs text-green-600 font-medium">
                                            {t("debts.strategy.payMax")}
                                        </p>
                                        <Button
                                            size="sm"
                                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                                            onClick={() =>
                                                setPaymentDialogDebt(debt)
                                            }
                                        >
                                            {t(
                                                "debts.strategy.registerPayment",
                                            )}
                                        </Button>
                                    </div>
                                )}
                                {index > 0 && (
                                    <p className="text-center text-xs text-muted-foreground mt-2">
                                        {t("debts.strategy.payMin")}
                                    </p>
                                )}
                            </div>
                        ))}

                    {debts.length === 0 && (
                        <div className="col-span-full text-center py-10 text-muted-foreground">
                            {t("debts.strategy.empty")}
                        </div>
                    )}
                </div>
            )}

            {paymentDialogDebt && (
                <DebtPaymentDialog
                    isOpen={!!paymentDialogDebt}
                    debt={paymentDialogDebt}
                    onClose={() => setPaymentDialogDebt(null)}
                    onSuccess={() => {
                        // Refresh strategy list after payment
                        const fetchStrategy = async () => {
                            setLoading(true);
                            try {
                                const response = await api.get(
                                    `/debts/strategy?type=${activeTab}&monthlyExtra=${monthlyExtra}`,
                                );
                                // Fix: Handle response structure same as main useEffect
                                if (
                                    response.data.debts &&
                                    Array.isArray(response.data.debts)
                                ) {
                                    setDebts(response.data.debts);
                                    setProjection(response.data.projection);
                                } else if (Array.isArray(response.data)) {
                                    setDebts(response.data);
                                } else {
                                    setDebts([]);
                                }
                            } catch (error) {
                                console.error(
                                    "Failed to fetch strategy",
                                    error,
                                );
                            } finally {
                                setLoading(false);
                            }
                        };
                        fetchStrategy();
                    }}
                />
            )}
        </div>
    );
}
