import {
    DndContext,
    type DragEndEvent,
    DragOverlay,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    addMonths,
    eachDayOfInterval,
    endOfMonth,
    format,
    isSameDay,
    isSameMonth,
    startOfMonth,
    subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { CalendarDay } from "../components/income/CalendarDay";
import { DraggableWorkUnit } from "../components/income/DraggableWorkUnit";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

import { DistributeIncomeDialog } from "../components/income/DistributeIncomeDialog";
import { MoneyDisplay } from "../components/ui/MoneyDisplay";
import { api } from "../lib/api";
import { fixedExpenseService } from "../services/fixed-expense.service";

export default function IncomeProjection() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [workUnits, setWorkUnits] = useState<any[]>([]);
    const [projections, setProjections] = useState<any[]>([]);
    const [fixedExpenses, setFixedExpenses] = useState<any[]>([]);
    const [activeDragItem, setActiveDragItem] = useState<any>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        })
    );

    useEffect(() => {
        fetchWorkUnits();
        fetchFixedExpenses();
    }, []);

    useEffect(() => {
        fetchProjections();
    }, [currentDate]);

    const fetchWorkUnits = async () => {
        try {
            const res = await api.get("/income/work-units");
            setWorkUnits(res.data);
        } catch (error) {
            console.error("Failed to fetch work units", error);
        }
    };

    const fetchFixedExpenses = async () => {
        try {
            const data = await fixedExpenseService.getAll();
            setFixedExpenses(data);
        } catch (error) {
            console.error("Failed to fetch fixed expenses", error);
        }
    };

    const fetchProjections = async () => {
        try {
            const monthStr = format(currentDate, "yyyy-MM");
            const res = await api.get(`/income/projection?month=${monthStr}`);
            setProjections(res.data);
        } catch (error) {
            console.error("Failed to fetch projections", error);
        }
    };

    const handleDragStart = (event: any) => {
        setActiveDragItem(event.active.data.current?.workUnit);
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragItem(null);

        if (over && active.data.current?.type === "WORK_UNIT") {
            const date = over.data.current?.date;
            const workUnit = active.data.current.workUnit;

            if (date && workUnit) {
                try {
                    await api.post("/income/projection", {
                        workUnitId: workUnit.id,
                        date: date.toISOString(),
                        amount: workUnit.defaultPrice,
                        status: "PLANNED",
                    });
                    fetchProjections();
                } catch (error) {
                    console.error("Failed to create projection", error);
                }
            }
        }
    };

    const handleRemoveProjection = async (id: string) => {
        try {
            await api.delete(`/income/projection/${id}`);
            fetchProjections();
        } catch (error) {
            console.error("Failed to delete projection", error);
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            await api.patch(`/income/projection/${id}`, { status: newStatus });
            fetchProjections();
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Fill start/end of grid
    const startDay = monthStart.getDay();
    const prefixDays = Array.from({ length: startDay }).map((_, i) => {
        return new Date(
            monthStart.getFullYear(),
            monthStart.getMonth(),
            -startDay + i + 1
        );
    });

    const calendarGrid = [...prefixDays, ...daysInMonth];

    const totalProjected = projections.reduce((acc, curr) => {
        const taxRate = Number(curr.workUnit?.taxRate || 0);
        const gross = Number(curr.amount);
        const net = gross * (1 - taxRate / 100);
        return acc + net;
        return acc + net;
    }, 0);

    const totalFixedExpenses = fixedExpenses.reduce((acc, curr) => {
        // Check dates
        // Ideally checking against the specific month logic
        const start = curr.startDate ? new Date(curr.startDate) : null;
        const end = curr.endDate ? new Date(curr.endDate) : null;

        // Simple check: if start is after current month end, or end is before current month start, exclude.
        if (start && start > monthEnd) return acc;
        if (end && end < monthStart) return acc;

        return acc + Number(curr.amount);
    }, 0);

    const [distributeDialog, setDistributeDialog] = useState<{
        open: boolean;
        item: any | null;
    }>({ open: false, item: null });

    const handleOpenDistribute = (item: any) => {
        setDistributeDialog({ open: true, item });
    };

    const handleConfirmDistribute = async (data: {
        hoursPerDay: number;
        skipWeekends: boolean;
    }) => {
        if (!distributeDialog.item) return;

        try {
            await api.post("/income/projection/distribute", {
                workUnitId: distributeDialog.item.workUnit.id,
                startDate: distributeDialog.item.date, // Use the projection date as start
                hoursPerDay: data.hoursPerDay,
                skipWeekends: data.skipWeekends,
            });
            // Optionally delete the original single-day item if desired,
            // but the user might want to keep it or the backend logic might cover it?
            // The backend logic creates NEW items.
            // If the user is distributing an existing item, we should probably delete the original "placeholder"
            // to avoid duplication + split.
            // Let's safe-delete the original item.
            await handleRemoveProjection(distributeDialog.item.id);

            fetchProjections();
        } catch (error) {
            console.error("Failed to distribute projection", error);
        }
    };

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
        >
            <div className="flex h-[calc(100vh-64px)] overflow-hidden bg-background">
                {/* Sidebar: Available Work Units - Hidden on mobile for now to prevent clutter */}
                <div className="hidden md:block w-72 lg:w-80 border-r bg-card border-border p-4 overflow-y-auto transition-colors shrink-0">
                    <h2 className="font-bold mb-4 text-lg text-foreground">
                        Unidades de Trabalho
                    </h2>
                    <p className="text-sm text-muted-foreground mb-4">
                        Arraste para o calendário para projetar.
                    </p>
                    <div className="space-y-2">
                        {workUnits.map((unit) => (
                            <DraggableWorkUnit key={unit.id} workUnit={unit} />
                        ))}
                    </div>
                </div>

                {/* Main: Calendar Area */}
                <div className="flex-1 flex flex-col h-full overflow-hidden bg-background">
                    {/* Header Area - Fixed */}
                    <div className="p-4 md:p-6 border-b bg-background z-10 shrink-0">
                        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-2">
                            <div className="flex items-center justify-between xl:justify-start gap-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        setCurrentDate(
                                            subMonths(currentDate, 1)
                                        )
                                    }
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <h1 className="text-xl md:text-2xl font-bold capitalize text-foreground">
                                    {format(currentDate, "MMMM yyyy", {
                                        locale: ptBR,
                                    })}
                                </h1>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        setCurrentDate(
                                            addMonths(currentDate, 1)
                                        )
                                    }
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 md:gap-4">
                                <div className="flex-1 min-w-35 px-3 py-2 rounded-lg border bg-destructive/10 border-destructive/20 text-destructive">
                                    <span className="text-xs font-medium mr-1 opacity-80 block md:inline">
                                        Despesas:
                                    </span>
                                    <span className="text-lg font-bold">
                                        <MoneyDisplay
                                            value={totalFixedExpenses}
                                        />
                                    </span>
                                </div>

                                <div className="flex-1 min-w-35 px-3 py-2 rounded-lg border bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                                    <span className="text-xs font-medium mr-1 opacity-80 block md:inline">
                                        Entradas:
                                    </span>
                                    <span className="text-lg font-bold">
                                        <MoneyDisplay value={totalProjected} />
                                    </span>
                                </div>

                                <div className="flex-1 min-w-35 px-3 py-2 rounded-lg border bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400">
                                    <span className="text-xs font-medium mr-1 opacity-80 block md:inline">
                                        Saldo:
                                    </span>
                                    <span className="text-lg font-bold">
                                        <MoneyDisplay
                                            value={
                                                totalProjected -
                                                totalFixedExpenses
                                            }
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Calendar Grid - Scrollable */}
                    <div className="flex-1 overflow-auto p-4 md:p-6 bg-muted/10">
                        <div className="min-w-200 h-full flex flex-col">
                            <div className="grid grid-cols-7 gap-px bg-border border border-border rounded-t-lg overflow-hidden shrink-0 shadow-sm z-10 sticky top-0">
                                {[
                                    "Dom",
                                    "Seg",
                                    "Ter",
                                    "Qua",
                                    "Qui",
                                    "Sex",
                                    "Sáb",
                                ].map((day) => (
                                    <div
                                        key={day}
                                        className="bg-card p-3 text-center text-xs font-bold text-muted-foreground uppercase tracking-wider"
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>
                            <div className="grid grid-cols-7 auto-rows-fr gap-px bg-border border-x border-b border-border rounded-b-lg overflow-hidden shadow-sm flex-1">
                                {calendarGrid.map((date) => {
                                    const dateProjections = projections.filter(
                                        (p) => isSameDay(new Date(p.date), date)
                                    );
                                    return (
                                        <CalendarDay
                                            key={date.toISOString()}
                                            date={date}
                                            isCurrentMonth={isSameMonth(
                                                date,
                                                currentDate
                                            )}
                                            projections={dateProjections}
                                            onRemove={handleRemoveProjection}
                                            onStatusChange={handleStatusChange}
                                            onDistribute={handleOpenDistribute}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <DragOverlay>
                {activeDragItem ? (
                    <div className="opacity-80 rotate-2 cursor-grabbing w-64">
                        <Card className="p-3 bg-white dark:bg-card shadow-xl ring-2 ring-emerald-500">
                            <div className="font-medium text-sm dark:text-foreground">
                                {activeDragItem.name}
                            </div>
                            <div className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                                <MoneyDisplay
                                    value={Number(activeDragItem.defaultPrice)}
                                />
                            </div>
                        </Card>
                    </div>
                ) : null}
            </DragOverlay>

            <DistributeIncomeDialog
                open={distributeDialog.open}
                onOpenChange={(open) =>
                    setDistributeDialog((prev) => ({ ...prev, open }))
                }
                onConfirm={handleConfirmDistribute}
                workUnitName={distributeDialog.item?.workUnit.name || ""}
            />
        </DndContext>
    );
}
