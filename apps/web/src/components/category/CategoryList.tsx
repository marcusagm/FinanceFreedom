import { Edit2, Trash2 } from "lucide-react";
import type { Category } from "../../services/category.service";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table";

interface CategoryListProps {
    categories: Category[];
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
}

export function CategoryList({ categories, onEdit, onDelete }: CategoryListProps) {
    if (categories.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground border rounded-lg bg-card">
                Nenhuma categoria encontrada. Crie sua primeira categoria!
            </div>
        );
    }

    return (
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12.5">Cor</TableHead>
                            <TableHead>Nome</TableHead>
                            <TableHead>Limite de Orçamento</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>
                                    <div
                                        className="w-6 h-6 rounded-full border"
                                        style={{
                                            backgroundColor: category.color || "#ccc",
                                        }}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{category.name}</TableCell>
                                <TableCell>
                                    {category.budgetLimit
                                        ? new Intl.NumberFormat("pt-BR", {
                                              style: "currency",
                                              currency: "BRL",
                                          }).format(category.budgetLimit)
                                        : "-"}
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onEdit(category)}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                                        onClick={() => onDelete(category.id)}
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
