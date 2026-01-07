import React from "react";
import type { ImportedTransaction } from "../services/import.service";

interface Props {
    transactions: ImportedTransaction[];
}

export const ImportReviewTable: React.FC<Props> = ({ transactions }) => {
    return (
        <div className="w-full overflow-hidden rounded-lg border bg-card shadow-sm mt-6">
            <div className="overflow-x-auto">
                <table className="w-full caption-bottom text-sm">
                    <thead className="[&_tr]:border-b">
                        <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                Date
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                Description
                            </th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">
                                Category
                            </th>
                            <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">
                                Amount
                            </th>
                        </tr>
                    </thead>
                    <tbody className="[&_tr:last-child]:border-0">
                        {transactions.map((t, index) => (
                            <tr
                                key={index}
                                className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                            >
                                <td className="p-4 align-middle">
                                    {new Date(t.date).toLocaleDateString()}
                                </td>
                                <td className="p-4 align-middle">
                                    {t.description}
                                </td>
                                <td className="p-4 align-middle">
                                    {t.category}
                                </td>
                                <td className="p-4 align-middle text-right font-mono font-medium">
                                    <span
                                        className={
                                            t.type === "INCOME"
                                                ? "text-emerald-600"
                                                : "text-rose-600"
                                        }
                                    >
                                        {new Intl.NumberFormat("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        }).format(t.amount)}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
