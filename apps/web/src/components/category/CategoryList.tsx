import type {
    BudgetStatus,
    IncomeStatus,
} from "../../services/analytics.service";
import { useTranslation } from "react-i18next";
import type { Category } from "../../services/category.service";
import { CategoryRow } from "./CategoryRow";
import { MoneyDisplay } from "../ui/MoneyDisplay";
import { cn } from "../../lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";
import { Tree } from "../ui/Tree";

interface CategoryListProps {
    categories: Category[];
    budgetData?: BudgetStatus[];
    incomeData?: IncomeStatus[];
    onEdit: (category: Category) => void;
    onDelete: (id: string) => void;
    onBudgetChange?: (categoryId: string, amount: number) => Promise<void>;
}

export function CategoryList({
    categories,
    budgetData,
    incomeData,
    onEdit,
    onDelete,
    onBudgetChange,
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
                <CategoryTabContent
                    data={expenseTree}
                    budgetData={budgetData}
                    type="EXPENSE"
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onBudgetChange={onBudgetChange}
                    t={t}
                />
            </TabsContent>

            <TabsContent value="incomes">
                <CategoryTabContent
                    data={incomeTree}
                    incomeData={incomeData}
                    type="INCOME"
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onBudgetChange={onBudgetChange}
                    t={t}
                />
            </TabsContent>
        </Tabs>
    );
}

function CategoryTabContent({
    data,
    budgetData,
    incomeData,
    type,
    onEdit,
    onDelete,
    onBudgetChange,
    t,
}: {
    data: any[];
    budgetData?: BudgetStatus[];
    incomeData?: IncomeStatus[];
    type: "EXPENSE" | "INCOME";
    onEdit: (c: Category) => void;
    onDelete: (id: string) => void;
    onBudgetChange?: (id: string, v: number) => Promise<void>;
    t: any;
}) {
    if (data.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground border rounded-lg bg-card">
                {t("categories.emptyGroup")}
            </div>
        );
    }

    // Helper to aggregate data
    const getAggregatedStatus = (item: any) => {
        if (type === "EXPENSE") {
            const status = budgetData?.find((b) => b.categoryId === item.id);
            // If parent, we might want to sum children?
            // The requirement says: Parent Budget = Sum of Children.
            // But we also need to account for direct budget on parent if any (though logic implies read-only sum)

            // Let's implement recursive sum
            const calculateRecursive = (
                node: any,
            ): { limit: number; spent: number } => {
                let currentLimit = 0;
                let currentSpent = 0;

                // Check self status first
                const selfStatus = budgetData?.find(
                    (b) => b.categoryId === node.id,
                );
                if (selfStatus) {
                    currentLimit += selfStatus.limit;
                    currentSpent += selfStatus.spent;
                }

                // If node has children, override limit with sum of children limits?
                // Or add to it?
                // "A categoria pai deve ter o budget dos seus filhos somados, não permitindo alterar o valor"
                // This implies Parent Limit = Sum(Children Limits).

                if (node.children && node.children.length > 0) {
                    let childrenLimit = 0;
                    let childrenSpent = 0;

                    node.children.forEach((child: any) => {
                        const childStats = calculateRecursive(child);
                        childrenLimit += childStats.limit;
                        childrenSpent += childStats.spent;
                    });

                    // Override limit with sum of children
                    currentLimit = childrenLimit;
                    // Spent is also sum of children (plus self content if any, but assume aggregation)
                    // If we strictly follow "Parent is aggregation", then its own transactions + children transactions?
                    // Usually Parent Spent = Sum(Children Spent) + Self Spent.
                    // The recursive call above sums children.
                    // But we need to be careful not to double count if the backend already aggregates?
                    // Backend does NOT aggregate children automatically usually.
                    // Let's assume we sum all descendants.

                    // Actually, let's keep it simple:
                    // Limit = Sum of Children Limits.
                    // Spent = Sum of Children Spent (plus own if any).
                    // But budgetData usually comes flat.

                    // Re-doing logic:
                    // We need to calculate this OUTSIDE the render loop if we want totals efficiently,
                    // but inside is fine for display.
                }

                return { limit: currentLimit, spent: currentSpent };
            };

            // However, passing "status" to CategoryRow expects a BudgetStatus object.
            // We should wrap the aggregation logic.

            return status;
        } else {
            const iItem = incomeData?.find((i) => i.categoryId === item.id);
            return iItem
                ? {
                      categoryId: item.id,
                      limit: iItem.goal,
                      spent: iItem.received,
                      percentage: iItem.percentage,
                  }
                : undefined;
        }
    };

    // Calculate Totals (Only sum ROOTS to avoid double counting)
    let totalLimit = 0;
    let totalSpent = 0;

    // We need a helper to get stats for a node including its children aggregation
    const getNodeStats = (node: any): { limit: number; spent: number } => {
        let stats = { limit: 0, spent: 0 };

        if (type === "EXPENSE") {
            // Base stats from backend
            const directStats = budgetData?.find(
                (b) => b.categoryId === node.id,
            );
            let limit = directStats?.limit || 0;
            let spent = directStats?.spent || 0;

            // If has children, overwrite limit with sum of children limits
            // And spent with sum of children spent + own spent
            if (node.children && node.children.length > 0) {
                let childrenLimit = 0;
                let childrenSpent = 0;
                node.children.forEach((child: any) => {
                    const childStats = getNodeStats(child);
                    childrenLimit += childStats.limit;
                    childrenSpent += childStats.spent;
                });
                limit = childrenLimit;
                // spent = spent + childrenSpent; // If backend doesn't aggregate
                // Assuming backend doesn't aggregate children into parent spent automatically:
                spent = childrenSpent; // Pure aggregation container? Or mixed?
                // Usually mixed. Let's add them.
                if (directStats?.spent) spent += directStats.spent;
            }
            stats = { limit, spent };
        } else {
            const directStats = incomeData?.find(
                (i) => i.categoryId === node.id,
            );
            stats = {
                limit: directStats?.goal || 0,
                spent: directStats?.received || 0,
            };
            // Income usually doesn't nest budgets same way, but let's keep consistent if needed.
            if (node.children && node.children.length > 0) {
                let childrenLimit = 0;
                let childrenSpent = 0;
                node.children.forEach((child: any) => {
                    const childStats = getNodeStats(child);
                    childrenLimit += childStats.limit;
                    childrenSpent += childStats.spent;
                });
                stats.limit += childrenLimit;
                stats.spent += childrenSpent;
            }
        }
        return stats;
    };

    data.forEach((rootNode) => {
        const stats = getNodeStats(rootNode);
        totalLimit += stats.limit;
        totalSpent += stats.spent;
    });

    return (
        <div className="space-y-4">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">
                        {type === "EXPENSE"
                            ? t("budgets.totalBudget")
                            : t("categories.totalGoal")}
                    </div>
                    <div className="text-2xl font-bold mt-1">
                        <MoneyDisplay value={totalLimit} />
                    </div>
                </div>
                <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">
                        {type === "EXPENSE"
                            ? t("budgets.totalSpent")
                            : t("categories.totalReceived")}
                    </div>
                    <div className="text-2xl font-bold mt-1">
                        <MoneyDisplay value={totalSpent} />
                    </div>
                </div>
                <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
                    <div className="text-sm font-medium text-muted-foreground">
                        {type === "EXPENSE"
                            ? t("budgets.remaining")
                            : t("categories.remaining")}
                    </div>
                    <div
                        className={cn(
                            "text-2xl font-bold mt-1",
                            totalLimit - totalSpent < 0
                                ? "text-red-500"
                                : "text-emerald-500",
                        )}
                    >
                        <MoneyDisplay value={totalLimit - totalSpent} />
                    </div>
                </div>
            </div>

            {/* Category List / Tree Table */}
            <div className="rounded-md border bg-card">
                <div className="flex items-center py-3 px-4 border-b bg-muted/40 text-xs font-medium text-muted-foreground uppercase">
                    <div className="flex-1 pl-4">
                        {t("categories.nameLabel")}
                    </div>
                    <div className="w-1/3 px-4">{t("common.status")}</div>
                    <div className="w-40 px-4 text-right">
                        {t("categories.budgetLabel")}
                    </div>
                    <div className="w-24 px-4 text-right">
                        {t("common.actions")}
                    </div>
                </div>

                <Tree<any>
                    data={data}
                    expandAll
                    renderItem={({
                        item,
                        depth,
                        isExpanded,
                        hasChildren,
                        toggle,
                    }) => {
                        // Use the SAME logic for item status
                        const stats = getNodeStats(item);

                        // Construct a Status object compatible with CategoryRow
                        const status = {
                            categoryId: item.id,
                            limit: stats.limit,
                            spent: stats.spent,
                            percentage:
                                stats.limit > 0
                                    ? (stats.spent / stats.limit) * 100
                                    : 0,
                            remaining: stats.limit - stats.spent,
                        };

                        return (
                            <CategoryRow
                                category={item}
                                budgetStatus={status as any}
                                depth={depth}
                                onEdit={onEdit}
                                onDelete={onDelete}
                                onBudgetChange={
                                    hasChildren ? undefined : onBudgetChange
                                } // Disable budget edit for parents
                                isExpanded={isExpanded}
                                hasChildren={hasChildren}
                                toggle={toggle}
                            />
                        );
                    }}
                    className="gap-0"
                />
            </div>
        </div>
    );
}
