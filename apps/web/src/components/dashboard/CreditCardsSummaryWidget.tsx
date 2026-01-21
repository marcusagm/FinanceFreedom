import React from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import type { CreditCard } from "../../types/credit-card";
import { creditCardService } from "../../services/credit-card.service";
import { MoneyDisplay } from "../ui/MoneyDisplay";
import { CreditCard as CardIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CreditCardsSummaryWidget: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const { data: cards, isLoading } = useQuery({
        queryKey: ["credit-cards"],
        queryFn: creditCardService.getAll,
    });

    if (isLoading || !cards || cards.length === 0) return null;

    const totalLimit = cards.reduce((acc, card) => acc + Number(card.limit), 0);
    // Assuming we can get used amount from somewhere, or calculate it.
    // For now showing total Limit.

    return (
        <Card
            className="cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => navigate("/credit-cards")}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {t("creditCard.title")}
                </CardTitle>
                <CardIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    <MoneyDisplay value={totalLimit} />
                </div>
                <p className="text-xs text-muted-foreground">
                    {t("creditCard.totalLimit")} ({cards.length} cards)
                </p>
            </CardContent>
        </Card>
    );
};
