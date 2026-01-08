import { useEffect, useState } from "react";
import { api } from "../../lib/api";
import type { Debt } from "./DebtForm";
import { DebtCard } from "./DebtCard";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";

type StrategyType = "SNOWBALL" | "AVALANCHE";

export function StrategyComparison() {
    const [activeTab, setActiveTab] = useState<StrategyType>("SNOWBALL");
    const [debts, setDebts] = useState<Debt[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStrategy = async () => {
            setLoading(true);
            try {
                const response = await api.get(
                    `/debts/strategy?type=${activeTab}`
                );
                setDebts(response.data);
            } catch (error) {
                console.error("Failed to fetch strategy", error);
            } finally {
                setLoading(false);
            }
        };

        fetchStrategy();
    }, [activeTab]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 border-b border-border pb-2">
                <Button
                    variant={activeTab === "SNOWBALL" ? "primary" : "ghost"}
                    onClick={() => setActiveTab("SNOWBALL")}
                    className={cn(
                        "justify-start",
                        activeTab === "SNOWBALL" &&
                            "bg-blue-600 hover:bg-blue-700"
                    )}
                >
                    ❄️ Bola de Neve (Psicológico)
                </Button>
                <Button
                    variant={activeTab === "AVALANCHE" ? "primary" : "ghost"}
                    onClick={() => setActiveTab("AVALANCHE")}
                    className={cn(
                        "justify-start",
                        activeTab === "AVALANCHE" &&
                            "bg-red-600 hover:bg-red-700"
                    )}
                >
                    ⛰️ Avalanche (Matemático)
                </Button>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg text-sm text-muted-foreground border border-border">
                {activeTab === "SNOWBALL" ? (
                    <p>
                        O método <strong>Bola de Neve</strong> foca em pagar as
                        dívidas <strong>menores primeiro</strong>. Embora não
                        seja o mais eficiente matematicamente, ele gera{" "}
                        <strong>vitórias rápidas</strong> que motivam você a
                        continuar pagando.
                    </p>
                ) : (
                    <p>
                        O método <strong>Avalanche</strong> foca em pagar as
                        dívidas com <strong>maiores juros primeiro</strong>. É o
                        método que <strong>economiza mais dinheiro</strong> a
                        longo prazo, eliminando o custo do dinheiro mais caro.
                    </p>
                )}
            </div>

            {loading ? (
                <div className="py-10 text-center text-muted-foreground">
                    Carregando estratégia...
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {debts.map((debt, index) => (
                        <div key={debt.id} className="relative">
                            {index === 0 && (
                                <div className="absolute -top-3 left-4 z-10 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md animate-bounce">
                                    🎯 Foco Atual
                                </div>
                            )}
                            <div
                                className={cn(
                                    index === 0 &&
                                        "ring-2 ring-green-500 ring-offset-2 rounded-xl"
                                )}
                            >
                                <DebtCard
                                    id={debt.id}
                                    name={debt.name}
                                    totalAmount={debt.totalAmount}
                                    interestRate={debt.interestRate}
                                    minimumPayment={debt.minimumPayment}
                                    dueDate={debt.dueDate}
                                    // Disable actions in strategy view to keep focus on viewing
                                    onEdit={undefined}
                                    onDelete={undefined}
                                />
                            </div>
                            {index === 0 && (
                                <p className="text-center text-xs text-green-600 font-medium mt-2">
                                    Pague o máximo possível nesta dívida!
                                </p>
                            )}
                            {index > 0 && (
                                <p className="text-center text-xs text-muted-foreground mt-2">
                                    Pague apenas o mínimo.
                                </p>
                            )}
                        </div>
                    ))}

                    {debts.length === 0 && (
                        <div className="col-span-full text-center py-10 text-muted-foreground">
                            Nenhuma dívida para exibir nesta estratégia.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
