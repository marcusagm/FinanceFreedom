import React from "react";
import type { ImportedTransaction } from "../../services/import.service";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/Table";

interface Props {
    transactions: ImportedTransaction[];
}

export const ImportReviewTable: React.FC<Props> = ({ transactions }) => {
    return (
        <div className="rounded-md border bg-card mt-6">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
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
                                    }).format(t.amount)}
                                </span>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
};
