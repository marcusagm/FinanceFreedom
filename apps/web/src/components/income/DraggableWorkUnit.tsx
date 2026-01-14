import { useDraggable } from "@dnd-kit/core";
import { Badge } from "../ui/Badge";
import { Card } from "../ui/Card";

import { MoneyDisplay } from "../ui/MoneyDisplay";

interface WorkUnit {
    id: string;
    name: string;
    defaultPrice: number;
    estimatedTime: number;
    taxRate?: number;
}

interface DraggableWorkUnitProps {
    workUnit: WorkUnit;
}

export function DraggableWorkUnit({ workUnit }: DraggableWorkUnitProps) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `work-unit-${workUnit.id}`,
        data: {
            type: "WORK_UNIT",
            workUnit,
        },
    });

    const style = transform
        ? {
              transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
          }
        : undefined;

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className="p-3 mb-2 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow bg-card dark:border"
        >
            <div className="flex justify-between items-start">
                <div>
                    <p className="font-medium text-sm">{workUnit.name}</p>
                    <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                            {workUnit.estimatedTime}h
                        </Badge>
                        {!!workUnit.taxRate && workUnit.taxRate > 0 && (
                            <Badge
                                variant="outline"
                                className="text-xs text-red-600 border-red-200 bg-red-50 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900"
                            >
                                -{workUnit.taxRate}%
                            </Badge>
                        )}
                    </div>
                </div>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm">
                    <MoneyDisplay value={Number(workUnit.defaultPrice)} />
                </span>
            </div>
        </Card>
    );
}
