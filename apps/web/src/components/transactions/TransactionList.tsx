import { Edit2, Trash2 } from "lucide-react";
import type { Transaction } from "../../types";
import "./TransactionList.css";
import { useHourlyRate } from "../../hooks/useHourlyRate";
import { TimeCostBadge } from "../simulators/TimeCostBadge";

interface TransactionListProps {
    transactions: Transaction[];
    onEdit: (transaction: Transaction) => void;
    onDelete: (id: string) => void;
}

export function TransactionList({
    transactions,
    onEdit,
    onDelete,
}: TransactionListProps) {
    const { hourlyRate } = useHourlyRate();

    return (
        <div className="transaction-list-container">
            <table className="transaction-table">
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Descrição</th>
                        <th>Categoria</th>
                        <th>Conta</th>
                        <th className="text-right">Valor</th>
                        <th className="w-[100px]">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td>
                                {new Date(
                                    transaction.date
                                ).toLocaleDateString()}
                            </td>
                            <td>{transaction.description}</td>
                            <td>{transaction.category || "-"}</td>
                            <td>{transaction.account.name}</td>
                            <td
                                className={`text-right ${
                                    transaction.type === "INCOME"
                                        ? "text-success"
                                        : "text-danger"
                                }`}
                            >
                                <div className="flex flex-col items-end gap-1">
                                    <span>
                                        {transaction.type === "INCOME"
                                            ? "+"
                                            : "-"}
                                        {new Intl.NumberFormat("pt-BR", {
                                            style: "currency",
                                            currency: "BRL",
                                        }).format(Number(transaction.amount))}
                                    </span>
                                    {transaction.type === "EXPENSE" && (
                                        <TimeCostBadge
                                            amount={Number(transaction.amount)}
                                            hourlyRate={hourlyRate}
                                        />
                                    )}
                                </div>
                            </td>
                            <td>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => onEdit(transaction)}
                                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                                        title="Editar"
                                    >
                                        <Edit2 className="w-4 h-4 text-slate-500" />
                                    </button>
                                    <button
                                        onClick={() => onDelete(transaction.id)}
                                        className="p-2 hover:bg-red-50 rounded-full transition-colors"
                                        title="Excluir"
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    {transactions.length === 0 && (
                        <tr>
                            <td
                                colSpan={6}
                                className="text-center py-4 text-muted"
                            >
                                Nenhuma transação encontrada.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
