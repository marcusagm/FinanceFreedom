import { Clock } from "lucide-react";
import React from "react";
import { Badge } from "../ui/Badge";

interface TimeCostBadgeProps {
    amount: number;
    hourlyRate: number;
}

export const TimeCostBadge: React.FC<TimeCostBadgeProps> = ({
    amount,
    hourlyRate,
}) => {
    if (!hourlyRate || hourlyRate <= 0) return null;

    const hours = amount / hourlyRate;

    // Format: "2h 30m" or "4.5h"
    const formattedHours =
        hours < 1 ? `${Math.round(hours * 60)}m` : `${hours.toFixed(1)}h`;

    return (
        <Badge
            variant="secondary"
            className="cursor-help"
            title={`Considering your hourly rate of ${hourlyRate.toLocaleString(
                "pt-BR",
                { style: "currency", currency: "BRL" }
            )}`}
        >
            <Clock className="w-3 h-3 mr-1" />
            <span>{formattedHours} of work</span>
        </Badge>
    );
};
