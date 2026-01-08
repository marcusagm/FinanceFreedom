import { useEffect, useState } from "react";
import {
    DndContext,
    DragOverlay,
    useSensor,
    useSensors,
    PointerSensor,
    type DragEndEvent,
} from "@dnd-kit/core";
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { DraggableWorkUnit } from "../components/income/DraggableWorkUnit";
import { CalendarDay } from "../components/income/CalendarDay";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatCurrency } from "../utils/format";
import { api } from "../lib/api";
import { DistributeIncomeDialog } from "../components/income/DistributeIncomeDialog";

export default function IncomeProjection() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [workUnits, setWorkUnits] = useState<any[]>([]);
    const [projections, setProjections] = useState<any[]>([]);
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

    const totalProjected = projections.reduce(
        (acc, curr) => acc + Number(curr.amount),
        0
    );

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
            <div className="flex h-[calc(100vh-64px)] overflow-hidden">
                {/* Sidebar: Available Work Units */}
                <div className="w-80 border-r bg-slate-50 p-4 overflow-y-auto">
                    <h2 className="font-bold mb-4 text-lg">
                        Unidades de Trabalho
                    </h2>
                    <p className="text-sm text-slate-500 mb-4">
                        Arraste para o calendário para projetar.
                    </p>
                    <div className="space-y-2">
                        {workUnits.map((unit) => (
                            <DraggableWorkUnit key={unit.id} workUnit={unit} />
                        ))}
                    </div>
                </div>

                {/* Main: Calendar Area */}
                <div className="flex-1 flex flex-col p-6 overflow-hidden">
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                    setCurrentDate(subMonths(currentDate, 1))
                                }
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <h1 className="text-2xl font-bold capitalize">
                                {format(currentDate, "MMMM yyyy", {
                                    locale: ptBR,
                                })}
                            </h1>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() =>
                                    setCurrentDate(addMonths(currentDate, 1))
                                }
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="bg-emerald-100 px-4 py-2 rounded-lg border border-emerald-200">
                            <span className="text-emerald-800 text-sm font-medium mr-2">
                                Total Projetado:
                            </span>
                            <span className="text-emerald-800 text-xl font-bold">
                                {formatCurrency(totalProjected)}
                            </span>
                        </div>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-px bg-slate-200 border border-slate-200 rounded-lg overflow-hidden flex-1">
                        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(
                            (day) => (
                                <div
                                    key={day}
                                    className="bg-slate-50 p-2 text-center text-xs font-semibold text-slate-500 uppercase"
                                >
                                    {day}
                                </div>
                            )
                        )}
                        {calendarGrid.map((date) => {
                            const dateProjections = projections.filter((p) =>
                                isSameDay(new Date(p.date), date)
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

            <DragOverlay>
                {activeDragItem ? (
                    <div className="opacity-80 rotate-2 cursor-grabbing w-64">
                        <Card className="p-3 bg-white shadow-xl ring-2 ring-emerald-500">
                            <div className="font-medium text-sm">
                                {activeDragItem.name}
                            </div>
                            <div className="font-bold text-emerald-600 text-sm">
                                {formatCurrency(
                                    Number(activeDragItem.defaultPrice)
                                )}
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
