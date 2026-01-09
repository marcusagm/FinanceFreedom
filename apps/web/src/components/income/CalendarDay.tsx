import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "../../lib/utils";
import { formatCurrency } from "../../utils/format";

import { Scissors } from "lucide-react";

interface ProjectedMeta {
    id: string;
    workUnit: {
        name: string;
        defaultPrice: number;
    };
    amount: number;
    status: string;
}

interface CalendarDayProps {
    date: Date;
    isCurrentMonth: boolean;
    projections: ProjectedMeta[];
    onRemove: (id: string) => void;
    onStatusChange: (id: string, newStatus: string) => void;
    onDistribute?: (item: any) => void;
}

export function CalendarDay({
    date,
    isCurrentMonth,
    projections,
    onRemove,
    onStatusChange,
    onDistribute,
}: CalendarDayProps) {
    const { isOver, setNodeRef } = useDroppable({
        id: `day-${date.toISOString().split("T")[0]}`,
        data: {
            date: date,
        },
    });

    const nextStatus: any = {
        PLANNED: "DONE",
        DONE: "PAID",
        PAID: "PLANNED",
    };

    const handleStatusClick = (
        e: React.MouseEvent,
        id: string,
        currentStatus: string
    ) => {
        e.stopPropagation();
        const newStatus = nextStatus[currentStatus] || "PLANNED";
        onStatusChange(id, newStatus);
    };

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "min-h-[100px] border p-2 flex flex-col gap-1 transition-colors dark:border-border",
                !isCurrentMonth &&
                    "bg-slate-50 text-slate-400 dark:!bg-zinc-900/50 dark:text-muted-foreground",
                isOver &&
                    "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200 dark:bg-emerald-500/10 dark:ring-emerald-500/30",
                isCurrentMonth && "bg-white dark:!bg-zinc-950"
            )}
        >
            <span className="text-xs font-semibold mb-1 block dark:text-foreground">
                {date.getDate()}
            </span>

            {projections.map((proj) => (
                <div
                    key={proj.id}
                    className={cn(
                        "group relative border p-1.5 rounded text-xs hover:shadow-sm cursor-pointer select-none transition-colors",
                        proj.status === "PLANNED" &&
                            "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
                        proj.status === "DONE" &&
                            "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20",
                        proj.status === "PAID" &&
                            "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20"
                    )}
                    onClick={(e) => handleStatusClick(e, proj.id, proj.status)}
                    title="Clique para alterar status (Plano -> Feito -> Pago)"
                >
                    <div className="flex justify-between items-center">
                        <span className="truncate font-medium flex-1">
                            {proj.workUnit.name}
                        </span>
                        <span className="font-bold ml-1">
                            {formatCurrency(Number(proj.amount))}
                        </span>
                    </div>

                    {/* Hover Actions */}
                    <div className="hidden group-hover:flex absolute -top-2 -right-2 bg-white dark:bg-card shadow-sm border dark:border-border rounded-full p-0.5 gap-1">
                        {onDistribute && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDistribute(proj);
                                }}
                                className="text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/20 rounded-full w-4 h-4 flex items-center justify-center border border-transparent hover:border-blue-200 dark:hover:border-blue-500/30"
                                title="Distribuir (Dividir em vários dias)"
                            >
                                <Scissors className="w-2.5 h-2.5" />
                            </button>
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove(proj.id);
                            }}
                            className="text-red-500 hover:bg-red-50 dark:hover:bg-red-500/20 rounded-full w-4 h-4 flex items-center justify-center border border-transparent hover:border-red-200 dark:hover:border-red-500/30"
                            title="Remover"
                        >
                            ×
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
