import { useTranslation } from "react-i18next";
import type React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/Table";
import type { ImportedTransaction } from "../../services/import.service";

interface Props {
    transactions: ImportedTransaction[];
    accounts: any[]; // Or specific type
}

import { useLocalization } from "../../contexts/LocalizationContext";
import { format } from "date-fns";

export const ImportReviewTable: React.FC<Props> = ({
    transactions,
    accounts,
}) => {
    const { t } = useTranslation();
    const { dateFormat, formatCurrency } = useLocalization();
    const getAccountName = (id: string) => {
        const acc = accounts.find((a) => a.id === id);
        return acc ? acc.name : t("import.review.unknownAccount");
    };

    return (
        <div className="rounded-md border bg-card mt-6">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t("import.review.table.date")}</TableHead>
                        <TableHead>
                            {t("import.review.table.account")}
                        </TableHead>
                        <TableHead>
                            {t("import.review.table.description")}
                        </TableHead>
                        <TableHead>
                            {t("import.review.table.category")}
                        </TableHead>
                        <TableHead className="text-right">
                            {t("import.review.table.amount")}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((tx, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                {format(new Date(tx.date), dateFormat)}
                            </TableCell>
                            <TableCell>
                                {getAccountName(tx.accountId)}
                            </TableCell>
                            <TableCell>{tx.description}</TableCell>
                            <TableCell>{tx.category}</TableCell>
                            <TableCell className="text-right font-mono font-medium">
                                <span
                                    className={
                                        tx.type === "INCOME"
                                            ? "text-emerald-600 dark:text-emerald-400"
                                            : "text-rose-600 dark:text-rose-400"
                                    }
                                >
                                    {formatCurrency(Math.abs(tx.amount))}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
