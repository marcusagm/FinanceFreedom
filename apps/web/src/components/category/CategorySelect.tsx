import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { Button } from "../ui/Button";
import { Tree } from "../ui/Tree";
import {
    categoryService,
    type Category,
} from "../../services/category.service";
import { cn } from "../../lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";

interface CategorySelectProps {
    value?: string;
    onChange: (value: string) => void;
    type?: "INCOME" | "EXPENSE";
    placeholder?: string;
    categories?: Category[]; // Optional: for providing external data
    defaultOptionLabel?: string;
}

type TreeCategory = Category & { children: TreeCategory[] };

export function CategorySelect({
    value,
    onChange,
    type,
    placeholder,
    categories: providedCategories,
    defaultOptionLabel,
}: CategorySelectProps) {
    const { t } = useTranslation();
    const [categories, setCategories] = useState<Category[]>(
        providedCategories || [],
    );
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!providedCategories) {
            categoryService.getAll().then(setCategories).catch(console.error);
        } else {
            setCategories(providedCategories);
        }
    }, [providedCategories]);

    const filteredCategories = categories.filter((c) => {
        if (type) {
            return (c.type || "EXPENSE") === type;
        }
        return true;
    });

    const buildTree = (items: Category[]): TreeCategory[] => {
        const map = new Map<string, TreeCategory>();
        const roots: TreeCategory[] = [];

        items.forEach((item) => {
            // @ts-ignore
            map.set(item.id, { ...item, children: [] });
        });

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

    const treeData = buildTree(filteredCategories);
    const selectedCategory = categories.find((c) => c.id === value);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between font-normal text-left px-3 hover:bg-background"
                >
                    <span className="truncate">
                        {selectedCategory
                            ? selectedCategory.name
                            : placeholder || t("transactions.selectCategory")}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className="w-[--radix-popover-trigger-width] p-0"
                align="start"
            >
                <div className="p-1 max-h-75 overflow-y-auto">
                    <div
                        className={cn(
                            "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                            !value && "bg-accent text-accent-foreground",
                        )}
                        onClick={() => {
                            onChange("");
                            setOpen(false);
                        }}
                    >
                        <span>
                            {defaultOptionLabel || t("common.noCategory")}
                        </span>
                        {!value && (
                            <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
                                <Check className="h-4 w-4" />
                            </span>
                        )}
                    </div>
                    <Tree<TreeCategory>
                        data={treeData}
                        expandAll
                        renderItem={({ item, depth }) => {
                            const isSelected = item.id === value;
                            return (
                                <div
                                    className={cn(
                                        "relative flex items-center rounded-sm py-1.5 px-2 text-sm outline-none cursor-pointer hover:bg-accent hover:text-accent-foreground",
                                        isSelected &&
                                            "bg-accent text-accent-foreground font-medium",
                                    )}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onChange(item.id);
                                        setOpen(false);
                                    }}
                                >
                                    <span className="flex-1 truncate">
                                        {item.name}
                                    </span>
                                    {isSelected && (
                                        <Check className="h-4 w-4 ml-2" />
                                    )}
                                </div>
                            );
                        }}
                        className="gap-0.5"
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
}
