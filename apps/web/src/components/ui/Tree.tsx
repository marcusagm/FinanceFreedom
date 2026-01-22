import { ChevronRight } from "lucide-react";
import React, { useState } from "react";
import { cn } from "../../lib/utils";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "./Collapsible";

export interface TreeProps<T> {
    data: T[];
    renderItem: (props: {
        item: T;
        depth: number;
        isExpanded: boolean;
        hasChildren: boolean;
        toggle: () => void;
    }) => React.ReactNode;
    getId?: (item: T) => string;
    getChildren?: (item: T) => T[] | undefined;
    className?: string;
    expandAll?: boolean;
}

export function Tree<T>({
    data,
    renderItem,
    getId = (item: any) => item.id,
    getChildren = (item: any) => item.children,
    className,
    expandAll = false,
}: TreeProps<T>) {
    return (
        <ul className={cn("flex flex-col", className)} role="tree">
            {data.map((item) => (
                <TreeNode
                    key={getId(item)}
                    item={item}
                    renderItem={renderItem}
                    getId={getId}
                    getChildren={getChildren}
                    depth={0}
                    expandAll={expandAll}
                />
            ))}
        </ul>
    );
}

interface TreeNodeProps<T> {
    item: T;
    renderItem: TreeProps<T>["renderItem"];
    getId: (item: T) => string;
    getChildren: (item: T) => T[] | undefined;
    depth: number;
    expandAll: boolean;
}

function TreeNode<T>({
    item,
    renderItem,
    getId,
    getChildren,
    depth,
    expandAll,
}: TreeNodeProps<T>) {
    const children = getChildren(item) || [];
    const hasChildren = children.length > 0;
    const [isExpanded, setIsExpanded] = useState(expandAll);

    const toggle = () => {
        if (hasChildren) {
            setIsExpanded(!isExpanded);
        }
    };

    return (
        <li
            role="treeitem"
            aria-expanded={hasChildren ? isExpanded : undefined}
        >
            <Collapsible
                open={isExpanded}
                onOpenChange={setIsExpanded}
                className="flex flex-col"
            >
                <div className="flex items-center gap-1 group/tree-item">
                    {hasChildren ? (
                        <CollapsibleTrigger asChild>
                            <button
                                onClick={toggle}
                                className="h-6 w-6 shrink-0 flex items-center justify-center rounded-sm hover:bg-accent text-muted-foreground transition-colors"
                            >
                                <ChevronRight
                                    className={cn(
                                        "h-4 w-4 transition-transform duration-200",
                                        isExpanded && "rotate-90",
                                    )}
                                />
                            </button>
                        </CollapsibleTrigger>
                    ) : (
                        <span className="h-6 w-6 shrink-0" />
                    )}
                    <div className="flex-1">
                        {renderItem({
                            item,
                            depth,
                            isExpanded,
                            hasChildren,
                            toggle,
                        })}
                    </div>
                </div>

                <CollapsibleContent>
                    {hasChildren && (
                        <ul className="flex flex-col ml-3 pl-2 border-l border-border/50">
                            {children.map((child) => (
                                <TreeNode
                                    key={getId(child)}
                                    item={child}
                                    renderItem={renderItem}
                                    getId={getId}
                                    getChildren={getChildren}
                                    depth={depth + 1}
                                    expandAll={expandAll}
                                />
                            ))}
                        </ul>
                    )}
                </CollapsibleContent>
            </Collapsible>
        </li>
    );
}
