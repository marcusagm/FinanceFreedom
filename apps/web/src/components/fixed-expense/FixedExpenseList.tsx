import { Edit2, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { FixedExpense } from "../../services/fixed-expense.service";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { MoneyDisplay } from "../ui/MoneyDisplay";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/Table";

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
    const { t } = useTranslation();

    if (expenses.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground border rounded-lg bg-card">
                {t("fixedExpenses.list.empty")}
            </div>
        );
    }

    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>
                                {t("fixedExpenses.list.table.description")}
                            </TableHead>
                            <TableHead>
                                {t("fixedExpenses.list.table.category")}
                            </TableHead>
                            <TableHead>
                                {t("fixedExpenses.list.table.account")}
                            </TableHead>
                            <TableHead className="w-24 text-center">
                                {t("fixedExpenses.list.table.autoCreate")}
                            </TableHead>
                            <TableHead className="w-24 text-center">
                                {t("fixedExpenses.list.table.dueDay")}
                            </TableHead>
                            <TableHead className="text-right">
                                {t("fixedExpenses.list.table.amount")}
                            </TableHead>
                            <TableHead className="w-32 text-center">
                                {t("fixedExpenses.list.table.actions")}
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {expenses.map((expense) => (
                            <TableRow key={expense.id}>
                                <TableCell className="text-left font-medium">
                                    {expense.description}
                                </TableCell>
                                <TableCell className="text-left">
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
                                <TableCell className="text-left">
                                    {expense.account?.name || "-"}
                                </TableCell>
                                <TableCell className="text-center">
                                    {expense.autoCreate
                                        ? t("fixedExpenses.list.yes")
                                        : t("fixedExpenses.list.no")}
                                </TableCell>
                                <TableCell>{expense.dueDay}</TableCell>
                                <TableCell className="text-right">
                                    <MoneyDisplay
                                        value={Number(expense.amount)}
                                    />
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
