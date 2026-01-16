import { useDroppable } from "@dnd-kit/core";
import { useTranslation } from "react-i18next";
import type React from "react";
import { cn } from "../../lib/utils";
import { MoneyDisplay } from "../ui/MoneyDisplay";
import { Scissors } from "lucide-react";

interface ProjectedMeta {
    id: string;
    workUnit: {
        name: string;
        defaultPrice: number;
        taxRate?: number;
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
    const { t } = useTranslation();
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
                "min-h-24 p-2 flex flex-col gap-1 transition-colors outline-none",
                !isCurrentMonth && "bg-muted/30 text-muted-foreground",
                isOver && "bg-primary/5 ring-2 ring-inset ring-primary/20",
                isCurrentMonth && "bg-card text-card-foreground"
            )}
        >
            <span
                className={cn(
                    "text-xs font-semibold mb-1 block",
                    !isCurrentMonth && "opacity-50"
                )}
            >
                {date.getDate()}
            </span>

            {projections.map((proj) => (
                <div
                    key={proj.id}
                    className={cn(
                        "group relative border p-1.5 rounded-md text-xs hover:shadow-sm cursor-pointer select-none transition-all duration-200",
                        proj.status === "PLANNED" &&
                            "bg-muted/50 text-muted-foreground border-transparent hover:border-border hover:bg-muted",
                        proj.status === "DONE" &&
                            "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20 hover:bg-amber-500/20",
                        proj.status === "PAID" &&
                            "bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20"
                    )}
                    onClick={(e) => handleStatusClick(e, proj.id, proj.status)}
                    title={t("income.calendar.statusTooltip")}
                >
                    <div className="flex justify-between items-center gap-1">
                        <span className="truncate font-medium flex-1">
                            {proj.workUnit.name}
                        </span>
                        <span className="font-bold whitespace-nowrap">
                            <MoneyDisplay
                                value={
                                    Number(proj.amount) *
                                    (1 -
                                        Number(proj.workUnit.taxRate || 0) /
                                            100)
                                }
                            />
                        </span>
                    </div>
                    {/* Tooltip detail (visible on hover via title or custom UI) */}
                    <div className="hidden group-hover:block absolute -top-8 left-0 bg-popover text-popover-foreground border shadow-lg text-[10px] p-1.5 rounded z-10 whitespace-nowrap">
                        {t("income.calendar.grossLabel")}:{" "}
                        <MoneyDisplay value={Number(proj.amount)} /> |{" "}
                        {t("income.calendar.taxLabel")}:{" "}
                        {proj.workUnit.taxRate || 0}%
                    </div>

                    {/* Hover Actions */}
                    <div className="hidden group-hover:flex absolute -top-2 -right-2 bg-card shadow-sm border rounded-full p-0.5 gap-1">
                        {onDistribute && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onDistribute(proj);
                                }}
                                className="text-blue-500 hover:bg-blue-500/10 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                                title={t("income.calendar.distributeTooltip")}
                            >
                                <Scissors className="w-3 h-3" />
                            </button>
                        )}
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove(proj.id);
                            }}
                            className="text-destructive hover:bg-destructive/10 rounded-full w-5 h-5 flex items-center justify-center transition-colors"
                            title={t("income.calendar.removeTooltip")}
                        >
                            <span className="text-lg leading-none transform -translate-y-px">
                                ×
                            </span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
