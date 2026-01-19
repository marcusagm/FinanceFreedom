import { format } from "date-fns";
import { Edit2, Split, Trash2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHourlyRate } from "../../hooks/useHourlyRate";
import type { Transaction } from "../../types";
import { TimeCostBadge } from "../simulators/TimeCostBadge";
import { Button } from "../ui/Button";
import { MoneyDisplay } from "../ui/MoneyDisplay";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/Table";
import { SplitTransactionDialog } from "./SplitTransactionDialog";

interface TransactionListProps {
    transactions: Transaction[];
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: string) => void;
    onTransactionUpdated?: () => void;
}

export function TransactionList({
    transactions,
    onEdit,
    onDelete,
    onTransactionUpdated,
}: TransactionListProps) {
    const { t } = useTranslation();
    const { hourlyRate } = useHourlyRate();
    const [splitDialogTransaction, setSplitDialogTransaction] =
        useState<Transaction | null>(null);

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t("transactions.table.date")}</TableHead>
                        <TableHead>
                            {t("transactions.table.description")}
                        </TableHead>
                        <TableHead>
                            {t("transactions.table.category")}
                        </TableHead>
                        <TableHead>{t("transactions.table.account")}</TableHead>
                        <TableHead className="text-right">
                            {t("transactions.table.amount")}
                        </TableHead>
                        <TableHead className="w-32 text-center">
                            {t("transactions.table.actions")}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell className="text-left">
                                {transaction.date
                                    ? format(
                                          new Date(transaction.date),
                                          "dd/MM/yyyy",
                                      )
                                    : "-"}
                            </TableCell>
                            <TableCell className="text-left">
                                {transaction.description}
                            </TableCell>
                            <TableCell className="text-left">
                                {transaction.category || "-"}
                            </TableCell>
                            <TableCell className="text-left">
                                {transaction.account.name}
                            </TableCell>
                            <TableCell
                                className={`text-right ${
                                    transaction.type === "INCOME"
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-rose-600 dark:text-rose-400"
                                }`}
                            >
                                <div className="flex flex-col items-end gap-1">
                                    <span className="font-medium">
                                        {transaction.type === "INCOME"
                                            ? "+"
                                            : "-"}
                                        <MoneyDisplay
                                            value={Math.abs(
                                                Number(transaction.amount),
                                            )}
                                        />
                                    </span>
                                    {transaction.type === "EXPENSE" && (
                                        <TimeCostBadge
                                            amount={Number(transaction.amount)}
                                            hourlyRate={hourlyRate}
                                        />
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() =>
                                            setSplitDialogTransaction(
                                                transaction,
                                            )
                                        }
                                        className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20"
                                        title={t("transactions.split.title")}
                                    >
                                        <Split className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEdit(transaction)}
                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                        title={t("common.edit")}
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onDelete(transaction.id)}
                                        className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                        title={t("common.delete")}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                    {transactions.length === 0 && (
                        <TableRow>
                            <TableCell
                                colSpan={6}
                                className="h-24 text-center text-muted-foreground"
                            >
                                {t("common.noData")}
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <SplitTransactionDialog
                isOpen={!!splitDialogTransaction}
                onClose={() => setSplitDialogTransaction(null)}
                transaction={splitDialogTransaction}
                onSuccess={() => {
                    setSplitDialogTransaction(null);
                    onTransactionUpdated?.();
                }}
            />
        </div>
    );
}
