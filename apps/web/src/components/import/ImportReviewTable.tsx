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

export const ImportReviewTable: React.FC<Props> = ({
    transactions,
    accounts,
}) => {
    const getAccountName = (id: string) => {
        const acc = accounts.find((a) => a.id === id);
        return acc ? acc.name : "Unknown";
    };

    return (
        <div className="rounded-md border bg-card mt-6">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Account</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.map((t, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                {new Date(t.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>{getAccountName(t.accountId)}</TableCell>
                            <TableCell>{t.description}</TableCell>
                            <TableCell>{t.category}</TableCell>
                            <TableCell className="text-right font-mono font-medium">
                                <span
                                    className={
                                        t.type === "INCOME"
                                            ? "text-emerald-600 dark:text-emerald-400"
                                            : "text-rose-600 dark:text-rose-400"
                                    }
                                >
                                    {new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    }).format(Math.abs(t.amount))}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
