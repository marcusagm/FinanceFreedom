import { Button } from "../ui/Button";
import { Edit2, Trash2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/Table";
import { Card, CardContent } from "../ui/Card";
import type { FixedExpense } from "../../services/fixed-expense.service";

interface FixedExpenseListProps {
    expenses: FixedExpense[];
    onEdit: (expense: FixedExpense) => void;
    onDelete: (id: string) => void;
}

export function FixedExpenseList({
    expenses,
    onEdit,
    onDelete,
}: FixedExpenseListProps) {
    if (expenses.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground border rounded-lg bg-card">
                Nenhuma despesa fixa encontrada. Crie a primeira para começar!
            </div>
        );
    }

    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Descrição</TableHead>
                            <TableHead>Valor</TableHead>
                            <TableHead>Dia Venc.</TableHead>
                            <TableHead>Categoria</TableHead>
                            <TableHead>Conta</TableHead>
                            <TableHead>Auto-criar</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expenses.map((expense) => (
                            <TableRow key={expense.id}>
                                <TableCell className="font-medium">
                                    {expense.description}
                                </TableCell>
                                <TableCell>
                                    {new Intl.NumberFormat("pt-BR", {
                                        style: "currency",
                                        currency: "BRL",
                                    }).format(Number(expense.amount))}
                                </TableCell>
                                <TableCell>{expense.dueDay}</TableCell>
                                <TableCell>
                                    {expense.category ? (
                                        <span className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{
                                                    backgroundColor:
                                                        expense.category
                                                            .color || "#999",
                                                }}
                                            />
                                            {expense.category.name}
                                        </span>
                                    ) : (
                                        "-"
                                    )}
                                </TableCell>
                                <TableCell>
                                    {expense.account?.name || "-"}
                                </TableCell>
                                <TableCell>
                                    {expense.autoCreate ? "Sim" : "Não"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(expense)}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                        onClick={() => onDelete(expense.id)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
