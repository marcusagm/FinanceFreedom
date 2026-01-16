import { useDraggable } from "@dnd-kit/core";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();
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
                                className="text-xs text-destructive border-destructive/20 bg-destructive/5"
                            >
                                -{workUnit.taxRate}%
                            </Badge>
                        )}
                    </div>
                </div>
                <span className="font-bold text-primary text-sm">
                    <MoneyDisplay value={Number(workUnit.defaultPrice)} />
                </span>
            </div>
        </Card>
    );
}
