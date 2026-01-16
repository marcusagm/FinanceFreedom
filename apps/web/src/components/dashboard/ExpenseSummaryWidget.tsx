import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { MoneyDisplay } from "../ui/MoneyDisplay";
import { TimeCostBadge } from "../simulators/TimeCostBadge";
import { useTranslation } from "react-i18next";

interface ExpenseSummaryWidgetProps {
    value: number;
    hourlyRate?: number;
}

export function ExpenseSummaryWidget({
    value,
    hourlyRate,
}: ExpenseSummaryWidgetProps) {
    const { t } = useTranslation();
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {t("dashboard.expenseSummary.title")}
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
                    <MoneyDisplay value={value} />
                </div>
                {hourlyRate && (
                    <TimeCostBadge amount={value} hourlyRate={hourlyRate} />
                )}
            </CardContent>
        </Card>
    );
}
