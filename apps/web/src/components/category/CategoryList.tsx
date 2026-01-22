import type {
    BudgetStatus,
    IncomeStatus,
} from "../../services/analytics.service";
import { useTranslation } from "react-i18next";
import type { Category } from "../../services/category.service";
import { CategoryCard } from "./CategoryCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import { Tree } from "../ui/Tree";

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
    const { t } = useTranslation();
    const expenses = categories.filter((c) => !c.type || c.type === "EXPENSE");
    const incomes = categories.filter((c) => c.type === "INCOME");

    type TreeCategory = Category & { children: TreeCategory[] };

    const buildTree = (items: Category[]): TreeCategory[] => {
        const map = new Map<string, TreeCategory>();
        const roots: TreeCategory[] = [];

        // Initialize map
        items.forEach((item) => {
            // @ts-ignore - initializing children
            map.set(item.id, { ...item, children: [] });
        });

        // Build tree
        items.forEach((item) => {
            const node = map.get(item.id)!;
            if (item.parentId && map.has(item.parentId)) {
                map.get(item.parentId)!.children.push(node);
            } else {
                roots.push(node);
            }
        });

        return roots;
    };

    const expenseTree = buildTree(expenses);
    const incomeTree = buildTree(incomes);

    return (
        <Tabs defaultValue="expenses" className="w-full">
            <TabsList className="mb-4">
                <TabsTrigger value="expenses">
                    {t("categories.tabs.expenses")}
                </TabsTrigger>
                <TabsTrigger value="incomes">
                    {t("categories.tabs.incomes")}
                </TabsTrigger>
            </TabsList>
            <TabsContent value="expenses">
                {expenseTree.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground border rounded-lg bg-card">
                        {t("categories.emptyGroup")}
                    </div>
                ) : (
                    <Tree<TreeCategory>
                        data={expenseTree}
                        expandAll
                        renderItem={({ item, depth }) => {
                            const status = budgetData?.find(
                                (b) => b.categoryId === item.id,
                            );
                            return (
                                <div
                                    style={{ marginLeft: `${depth * 24}px` }}
                                    className="mb-2"
                                >
                                    <CategoryCard
                                        category={item}
                                        budgetStatus={status}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                    />
                                </div>
                            );
                        }}
                    />
                )}
            </TabsContent>
            <TabsContent value="incomes">
                {incomeTree.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground border rounded-lg bg-card">
                        {t("categories.emptyGroup")}
                    </div>
                ) : (
                    <Tree<TreeCategory>
                        data={incomeTree}
                        expandAll
                        renderItem={({ item, depth }) => {
                            const incomeItem = incomeData?.find(
                                (i) => i.categoryId === item.id,
                            );
                            let status: BudgetStatus | undefined;
                            if (incomeItem) {
                                status = {
                                    categoryId: item.id,
                                    categoryName: item.name,
                                    categoryColor: item.color || null,
                                    limit: incomeItem.goal,
                                    spent: incomeItem.received,
                                    percentage: incomeItem.percentage,
                                    remaining:
                                        incomeItem.goal - incomeItem.received,
                                    status: "NORMAL",
                                };
                            }
                            return (
                                <div
                                    style={{ marginLeft: `${depth * 24}px` }}
                                    className="mb-2"
                                >
                                    <CategoryCard
                                        category={item}
                                        budgetStatus={status}
                                        onEdit={onEdit}
                                        onDelete={onDelete}
                                    />
                                </div>
                            );
                        }}
                    />
                )}
            </TabsContent>
        </Tabs>
    );
}
