import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { cn } from "../../lib/utils";
import { formatCurrency } from "../../utils/format";
import { Badge } from "../ui/badge";

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
}

export function CalendarDay({
    date,
    isCurrentMonth,
    projections,
    onRemove,
    onStatusChange,
}: CalendarDayProps) {
    const { isOver, setNodeRef } = useDroppable({
        id: `day-${date.toISOString().split("T")[0]}`,
        data: {
            date: date,
        },
    });

    return (
        <div
            ref={setNodeRef}
            className={cn(
                "min-h-[100px] border p-2 flex flex-col gap-1 transition-colors",
                !isCurrentMonth && "bg-slate-50 text-slate-400",
                isOver &&
                    "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-200",
                "bg-white"
            )}
        >
            <span className="text-xs font-semibold mb-1 block">
                {date.getDate()}
            </span>

            {projections.map((proj) => (
                <div
                    key={proj.id}
                    className="group relative bg-emerald-50 border border-emerald-100 p-1.5 rounded text-xs hover:shadow-sm"
                >
                    <div className="flex justify-between items-center">
                        <span className="truncate font-medium flex-1">
                            {proj.workUnit.name}
                        </span>
                        <span className="text-emerald-700 font-bold ml-1">
                            {formatCurrency(Number(proj.amount))}
                        </span>
                    </div>

                    {/* Hover Actions */}
                    <div className="hidden group-hover:flex absolute -top-2 -right-2 bg-white shadow-sm border rounded-full p-0.5 gap-1">
                        <button
                            onClick={() => onRemove(proj.id)}
                            className="text-red-500 hover:bg-red-50 rounded-full w-4 h-4 flex items-center justify-center"
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
