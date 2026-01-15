import type {
    BudgetStatus,
    IncomeStatus,
} from "../../services/analytics.service";
import type { Category } from "../../services/category.service";
import { CategoryCard } from "./CategoryCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";

interface CategoryListProps {
    categories: Category[];
    budgetData?: BudgetStatus[];
    incomeData?: IncomeStatus[];
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
}

export function CategoryList({
    categories,
    budgetData,
    incomeData,
    onEdit,
    onDelete,
}: CategoryListProps) {
    const expenses = categories.filter((c) => !c.type || c.type === "EXPENSE");
    const incomes = categories.filter((c) => c.type === "INCOME");

    const renderGrid = (items: Category[], isIncome = false) => {
        if (items.length === 0) {
            return (
                <div className="text-center py-12 text-muted-foreground border rounded-lg bg-card">
                    Nenhuma categoria encontrada neste grupo.
                </div>
            );
        }
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((category) => {
                    let status: BudgetStatus | undefined;

                    if (isIncome) {
                        const incomeItem = incomeData?.find(
                            (i) => i.categoryId === category.id
                        );
                        if (incomeItem) {
                            status = {
                                categoryId: category.id,
                                categoryName: category.name,
                                categoryColor: category.color || null,
                                limit: incomeItem.goal,
                                spent: incomeItem.received,
                                percentage: incomeItem.percentage,
                                remaining:
                                    incomeItem.goal - incomeItem.received,
                                status: "NORMAL",
                            };
                        }
                    } else {
                        status = budgetData?.find(
                            (b) => b.categoryId === category.id
                        );
                    }

                    return (
                        <CategoryCard
                            key={category.id}
                            category={category}
                            budgetStatus={status}
                            onEdit={onEdit}
                            onDelete={onDelete}
                        />
                    );
                })}
            </div>
        );
    };

    return (
        <Tabs defaultValue="expenses" className="w-full">
            <TabsList className="mb-4">
                <TabsTrigger value="expenses">Despesas</TabsTrigger>
                <TabsTrigger value="incomes">Receitas</TabsTrigger>
            </TabsList>
            <TabsContent value="expenses">{renderGrid(expenses)}</TabsContent>
            <TabsContent value="incomes">
                {renderGrid(incomes, true)}
            </TabsContent>
        </Tabs>
    );
}
