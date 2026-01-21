import React from "react";
import type { CreditCard } from "../../types/credit-card";
import { AppCard } from "../ui/AppCard";
import { Progress } from "../ui/Progress";
import { MoneyDisplay } from "../ui/MoneyDisplay";
import {
    ListOrdered,
    Pencil,
    Trash2,
    CreditCard as CreditCardIcon,
    AlertCircle,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/Button";

interface CreditCardCardProps {
    card: CreditCard;
    availableLimit: number;
    currentInvoiceTotal?: number;
    onClick?: () => void; // Used for "View Invoices" now primarily
    onEdit?: (card: CreditCard) => void;
    onDelete?: (card: CreditCard) => void;
}

export const CreditCardCard: React.FC<CreditCardCardProps> = ({
    card,
    availableLimit,
    currentInvoiceTotal = 0,
    onClick,
    onEdit,
    onDelete,
}) => {
    const { t } = useTranslation();

    const usagePercentage = Math.min(
        100,
        Math.max(0, ((card.limit - availableLimit) / card.limit) * 100),
    );

    const getProgressColor = (percentage: number) => {
        if (percentage < 50) return "bg-emerald-500";
        if (percentage < 80) return "bg-yellow-500";
        return "bg-red-500";
    };

    const actions = (
        <>
            <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                    e.stopPropagation();
                    onClick?.();
                }}
                title={t("creditCard.viewInvoices")}
            >
                <ListOrdered className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                    e.stopPropagation();
                    onEdit?.(card);
                }}
                title={t("common.edit")}
            >
                <Pencil className="w-4 h-4" />
            </Button>
            <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(card);
                }}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                title={t("common.delete")}
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </>
    );

    const footer = (
        <div className="flex flex-col gap-2 w-full">
            <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                    {t("creditCard.limit")}: <MoneyDisplay value={card.limit} />
                    {usagePercentage >= 90 && (
                        <span className="flex items-center gap-1 text-red-500 font-medium ml-2">
                            <AlertCircle className="h-3 w-3" />
                            {t("creditCard.nearLimit")}
                        </span>
                    )}
                </span>
                <span>
                    {t("creditCard.usedPercent", {
                        value: usagePercentage.toFixed(0),
                    })}
                </span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                <div
                    className={cn(
                        "h-full transition-all",
                        getProgressColor(usagePercentage),
                    )}
                    style={{ width: `${usagePercentage}%` }}
                />
            </div>
        </div>
    );

    return (
        <AppCard
            title={card.name}
            badge={
                <div className="flex gap-2 items-center">
                    <span className="text-xs uppercase font-bold text-muted-foreground">
                        {card.brand}
                    </span>
                </div>
            }
            actions={actions}
            footer={footer}
            // Optional: color indicator based on usage? Or brand color?
            // color={usagePercentage > 90 ? "#ef4444" : undefined}
        >
            <div className="flex justify-between items-end mb-2">
                <div>
                    <p className="text-sm font-medium text-muted-foreground">
                        {t("creditCard.currentInvoice")}
                    </p>
                    <p className="text-2xl font-bold">
                        <MoneyDisplay value={currentInvoiceTotal} />
                    </p>
                </div>
                <div className="text-right">
                    <p className="text-sm font-medium text-muted-foreground">
                        {t("creditCard.available")}
                    </p>
                    <p
                        className={cn(
                            "font-bold text-lg",
                            availableLimit < 0 && "text-red-500",
                        )}
                    >
                        <MoneyDisplay value={availableLimit} />
                    </p>
                </div>
            </div>
        </AppCard>
    );
};
