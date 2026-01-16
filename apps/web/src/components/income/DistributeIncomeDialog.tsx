import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/Button";
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/Dialog";
import { Input } from "../ui/Input";

interface DistributeIncomeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (data: { hoursPerDay: number; skipWeekends: boolean }) => void;
    workUnitName: string;
}

export function DistributeIncomeDialog({
    open,
    onOpenChange,
    onConfirm,
    workUnitName,
}: DistributeIncomeDialogProps) {
    const { t } = useTranslation();
    const [hoursPerDay, setHoursPerDay] = useState(8);
    const [skipWeekends, setSkipWeekends] = useState(true);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onConfirm({ hoursPerDay, skipWeekends });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t("income.distributeDialog.title", {
                            name: workUnitName,
                        })}
                    </DialogTitle>
                    <DialogDescription>
                        {t("income.distributeDialog.desc")}
                    </DialogDescription>
                </DialogHeader>

                <DialogBody>
                    <form onSubmit={handleSubmit}>
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <label
                                    htmlFor="hours"
                                    className="text-right text-sm font-medium"
                                >
                                    {t("income.distributeDialog.hoursPerDay")}
                                </label>
                                <Input
                                    id="hours"
                                    type="number"
                                    value={hoursPerDay}
                                    onChange={(e) =>
                                        setHoursPerDay(Number(e.target.value))
                                    }
                                    className="col-span-3"
                                    min={1}
                                    max={24}
                                />
                            </div>
                            <div className="flex items-center space-x-2 offset-1">
                                <div className="w-[25%] text-right" />
                                <input
                                    type="checkbox"
                                    id="weekends"
                                    checked={skipWeekends}
                                    onChange={(e) =>
                                        setSkipWeekends(e.target.checked)
                                    }
                                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                                />
                                <label
                                    htmlFor="weekends"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {t("income.distributeDialog.skipWeekends")}
                                </label>
                            </div>
                        </div>
                    </form>
                </DialogBody>

                <DialogFooter>
                    <Button
                        variant="ghost"
                        onClick={() => onOpenChange(false)}
                        type="button"
                    >
                        {t("common.cancel")}
                    </Button>
                    <Button onClick={handleSubmit}>
                        {t("income.distributeDialog.distribute")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
