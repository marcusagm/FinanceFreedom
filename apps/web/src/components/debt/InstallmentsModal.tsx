import { format } from "date-fns";
import { CheckCircle2, Circle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "../ui/Dialog";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/Table";

interface InstallmentsModalProps {
    isOpen: boolean;
    onClose: () => void;
    installmentsTotal: number;
    installmentsPaid: number;
    firstInstallmentDate?: string | Date;
    dueDay: number;
    debtName: string;
    onUpdatePaid?: (newPaidCount: number) => void;
}

export function InstallmentsModal({
    isOpen,
    onClose,
    installmentsTotal,
    installmentsPaid,
    firstInstallmentDate,
    dueDay,
    debtName,
    onUpdatePaid,
}: InstallmentsModalProps) {
    const { t } = useTranslation();

    const generateInstallments = () => {
        const installments = [];
        let currentDate: Date;

        if (firstInstallmentDate) {
            currentDate = new Date(firstInstallmentDate);
        } else {
            const now = new Date();
            currentDate = new Date();
            currentDate.setDate(dueDay);
            if (currentDate < now) {
                currentDate.setMonth(currentDate.getMonth() + 1);
            }
        }

        const iterDate = new Date(currentDate);

        for (let i = 1; i <= installmentsTotal; i++) {
            let date: Date;

            if (i === 1) {
                date = new Date(iterDate);
            } else {
                const nextMonthDate = new Date(iterDate);
                nextMonthDate.setMonth(nextMonthDate.getMonth() + (i - 1));
                nextMonthDate.setDate(dueDay);
                date = nextMonthDate;
            }

            installments.push({
                number: i,
                status: i <= installmentsPaid ? "PAID" : "PENDING",
                dueDate: date,
            });
        }
        return installments;
    };

    const installments = generateInstallments();

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>
                        {t("debts.installments.title", { name: debtName })}
                    </DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        {t("debts.installments.subtitle")}
                    </DialogDescription>
                </DialogHeader>

                <DialogBody>
                    <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                        <span>
                            {installmentsPaid} {t("debts.installments.paid")}
                        </span>
                        <span>
                            {installmentsTotal - installmentsPaid}{" "}
                            {t("debts.installments.remaining")}
                        </span>
                    </div>

                    <div className="border rounded-md">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-25">
                                        {t(
                                            "debts.installments.table.installment",
                                        )}
                                    </TableHead>
                                    <TableHead>
                                        {t("debts.installments.table.dueDate")}
                                    </TableHead>
                                    <TableHead>
                                        {t("debts.installments.table.status")}
                                    </TableHead>
                                    <TableHead className="text-right">
                                        {t("debts.installments.table.actions")}
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {installments.map((inst) => (
                                    <TableRow key={inst.number}>
                                        <TableCell className="font-medium">
                                            {inst.number}ª
                                        </TableCell>
                                        <TableCell>
                                            {format(inst.dueDate, "dd/MM/yyyy")}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    inst.status === "PAID"
                                                        ? "default"
                                                        : "secondary"
                                                }
                                                className={
                                                    inst.status === "PAID"
                                                        ? "bg-emerald-500 hover:bg-emerald-600"
                                                        : ""
                                                }
                                            >
                                                {inst.status === "PAID"
                                                    ? t(
                                                          "debts.installments.status.paid",
                                                      )
                                                    : t(
                                                          "debts.installments.status.pending",
                                                      )}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    if (onUpdatePaid) {
                                                        if (
                                                            inst.status ===
                                                            "PENDING"
                                                        ) {
                                                            onUpdatePaid(
                                                                inst.number,
                                                            );
                                                        } else {
                                                            onUpdatePaid(
                                                                inst.number - 1,
                                                            );
                                                        }
                                                    }
                                                }}
                                                title={
                                                    inst.status === "PAID"
                                                        ? t(
                                                              "debts.installments.actions.markPending",
                                                          )
                                                        : t(
                                                              "debts.installments.actions.markPaid",
                                                          )
                                                }
                                            >
                                                {inst.status === "PAID" ? (
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                                ) : (
                                                    <Circle className="w-5 h-5 text-muted-foreground" />
                                                )}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}
