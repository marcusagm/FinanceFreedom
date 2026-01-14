import { Bitcoin, Landmark, PiggyBank, TrendingUp, Wallet } from "lucide-react";
import { Pencil, Trash2 } from "lucide-react";
import { formatMoney } from "../../lib/utils";
import { AppCard } from "../ui/AppCard";
import { Button } from "../ui/Button";

export type InvestmentAccount = {
    id: string;
    name: string;
    type: string;
    balance: number | string;
    profitability?: number | string;
    profitabilityType?: string;
    maturityDate?: string | Date;
    description?: string;
};

interface InvestmentAccountCardProps {
    account: InvestmentAccount;
    onEdit?: (account: InvestmentAccount) => void;
    onDelete?: (id: string) => void;
}

const getTypeIcon = (type: string) => {
    switch (type) {
        case "FIXED_INCOME":
            return <Landmark className="h-4 w-4" />;
        case "VARIABLE_INCOME":
            return <TrendingUp className="h-4 w-4" />;
        case "CRYPTO":
            return <Bitcoin className="h-4 w-4" />;
        case "CASH":
            return <Wallet className="h-4 w-4" />;
        default:
            return <PiggyBank className="h-4 w-4" />;
    }
};

const getTypeLabel = (type: string) => {
    switch (type) {
        case "FIXED_INCOME":
            return "Renda Fixa";
        case "VARIABLE_INCOME":
            return "Renda Variável";
        case "CRYPTO":
            return "Cripto";
        case "CASH":
            return "Caixa";
        default:
            return type;
    }
};

export function InvestmentAccountCard({ account, onEdit, onDelete }: InvestmentAccountCardProps) {
    const actions = (
        <>
            {onEdit && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(account);
                    }}
                    title="Editar"
                >
                    <Pencil className="h-4 w-4" />
                </Button>
            )}
            {onDelete && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(account.id);
                    }}
                    title="Excluir"
                    className="text-red-500 hover:text-red-600 hover:bg-red-50"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            )}
        </>
    );

    return (
        <AppCard
            title={account.name}
            badge={
                <div className="flex items-center gap-2">
                    {getTypeIcon(account.type)}
                    <span className="text-xs font-medium">{getTypeLabel(account.type)}</span>
                </div>
            }
            actions={actions}
        >
            <div className="space-y-2">
                <div className="text-2xl font-bold">{formatMoney(Number(account.balance))}</div>
                {(account.profitability || account.maturityDate) && (
                    <div className="text-xs text-muted-foreground flex flex-col gap-1">
                        {account.profitability && (
                            <span className="flex items-center gap-1">
                                <TrendingUp className="h-3 w-3" />
                                {Number(account.profitability)}%{" "}
                                {account.profitabilityType === "CDI"
                                    ? "CDI"
                                    : account.profitabilityType}
                            </span>
                        )}
                        {account.maturityDate && (
                            <span className="flex items-center gap-1">
                                <Landmark className="h-3 w-3" />
                                Vence em:{" "}
                                {new Date(account.maturityDate).toLocaleDateString(undefined, {
                                    timeZone: "UTC",
                                })}
                            </span>
                        )}
                    </div>
                )}
            </div>
        </AppCard>
    );
}
