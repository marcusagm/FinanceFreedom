import React from "react";
import { useTranslation } from "react-i18next";
import type { InvoiceTransaction } from "../../types/credit-card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/Table";
import { MoneyDisplay } from "../ui/MoneyDisplay";
import { format } from "date-fns";
import { ptBR, enUS, pt } from "date-fns/locale";
import { Badge } from "../ui/Badge";
import { useLocalization } from "../../contexts/LocalizationContext";

interface InvoiceTransactionListProps {
    transactions: InvoiceTransaction[];
}

export const InvoiceTransactionList: React.FC<InvoiceTransactionListProps> = ({
    transactions,
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

    if (transactions.length === 0) {
        return (
            <div className="text-center py-8 text-muted-foreground">
                {t("creditCard.noTransactions")}
            </div>
        );
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>{t("transactions.table.date")}</TableHead>
                    <TableHead>{t("transactions.table.description")}</TableHead>
                    <TableHead>{t("transactions.table.category")}</TableHead>
                    <TableHead>{t("transactions.installments")}</TableHead>
                    <TableHead className="text-right">
                        {t("transactions.table.amount")}
                    </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.map((tx) => (
                    <TableRow key={tx.id}>
                        <TableCell>
                            {format(new Date(tx.date), dateFormat, { locale })}
                        </TableCell>
                        <TableCell>{tx.description}</TableCell>
                        <TableCell>
                            {tx.category ? (
                                <Badge
                                    variant="outline"
                                    style={{
                                        borderColor: tx.category.color,
                                        color: tx.category.color,
                                    }}
                                >
                                    {tx.category.name}
                                </Badge>
                            ) : (
                                "-"
                            )}
                        </TableCell>
                        <TableCell>
                            {tx.totalInstallments ? (
                                <span className="text-xs text-muted-foreground">
                                    {tx.installmentNumber}/
                                    {tx.totalInstallments}
                                </span>
                            ) : (
                                "-"
                            )}
                        </TableCell>
                        <TableCell className="text-right">
                            <MoneyDisplay value={tx.amount} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};
