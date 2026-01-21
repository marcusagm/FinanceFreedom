import React from "react";
import { useTranslation } from "react-i18next";
import type { Invoice, InvoiceStatus } from "../../types/credit-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card";
import { MoneyDisplay } from "../ui/MoneyDisplay";
import { Button } from "../ui/Button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { format } from "date-fns";
import { ptBR, enUS, pt } from "date-fns/locale";
import { InvoiceTransactionList } from "./InvoiceTransactionList";
import { useLocalization } from "../../contexts/LocalizationContext";

interface InvoiceTimelineProps {
    invoice: Invoice;
    onMonthChange: (increment: number) => void;
    onPayInvoice: () => void;
    isLoading?: boolean;
}

export const InvoiceTimeline: React.FC<InvoiceTimelineProps> = ({
    invoice,
    onMonthChange,
    onPayInvoice,
    isLoading,
}) => {
    const { t, i18n } = useTranslation();
    const { dateFormat } = useLocalization();

    const getLocale = () => {
        const lang = i18n.language.toLowerCase();
        if (lang === "pt-br") return ptBR;
        if (lang === "pt") return pt;
        return enUS;
    };

    const locale = getLocale();

    const getStatusColor = (status: InvoiceStatus) => {
        switch (status) {
            case "OPEN":
                return "text-blue-500";
            case "CLOSED":
                return "text-red-500";
            case "FUTURE":
                return "text-orange-500";
            case "OVERDUE":
                return "text-red-700 font-bold";
            default:
                return "text-foreground";
        }
    };

    const getStatusLabel = (status: InvoiceStatus) => {
        switch (status) {
            case "OPEN":
                return t("creditCard.status.open");
            case "CLOSED":
                return t("creditCard.status.closed");
            case "FUTURE":
                return t("creditCard.status.future");
            case "OVERDUE":
                return t("creditCard.status.overdue");
            default:
                return status;
        }
    };

    const formatDate = (dateString: string | Date, customFormat?: string) => {
        if (!dateString) return "--";
        const date = new Date(dateString);
        // Default invoice title format: "MMMM yyyy"
        // Date ranges: usually short "dd/MM"
        return format(date, customFormat || dateFormat, { locale });
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between bg-card p-4 rounded-lg border shadow-sm">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onMonthChange(-1)}
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="text-center">
                    <div className="text-sm text-muted-foreground capitalize flex items-center justify-center gap-2">
                        <Calendar className="h-3 w-3" />
                        {invoice.dueDate
                            ? formatDate(invoice.dueDate, "MMMM yyyy")
                            : "..."}
                    </div>
                    <div
                        className={`text-lg font-bold ${getStatusColor(invoice.status)}`}
                    >
                        {getStatusLabel(invoice.status)}
                    </div>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onMonthChange(1)}
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>{t("creditCard.invoiceDetails")}</CardTitle>
                    <div className="text-right">
                        <div className="text-2xl font-bold">
                            <MoneyDisplay value={invoice.total} />
                        </div>
                        {invoice.status === "CLOSED" && (
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={onPayInvoice}
                                className="mt-1"
                            >
                                {t("creditCard.payInvoice")}
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground mb-4">
                        <span>{t("common.period")}: </span>
                        {invoice.period?.start
                            ? formatDate(invoice.period.start, "dd/MM")
                            : "--"}
                        {" - "}
                        {invoice.period?.end
                            ? formatDate(invoice.period.end, "dd/MM")
                            : "--"}
                        <span className="ml-4">{t("common.dueDate")}: </span>
                        {invoice.dueDate ? formatDate(invoice.dueDate) : "--"}
                    </div>

                    <InvoiceTransactionList
                        transactions={invoice.transactions}
                    />
                </CardContent>
            </Card>
        </div>
    );
};
