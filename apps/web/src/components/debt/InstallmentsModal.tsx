import { format } from "date-fns";
import { CheckCircle2, Circle } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/Dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/Table";

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
                    <DialogTitle>Parcelas: {debtName}</DialogTitle>
                </DialogHeader>

                <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                    <span>{installmentsPaid} pagas</span>
                    <span>{installmentsTotal - installmentsPaid} restantes</span>
                </div>

                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-25">Parcela</TableHead>
                                <TableHead>Vencimento</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {installments.map((inst) => (
                                <TableRow key={inst.number}>
                                    <TableCell className="font-medium">{inst.number}ª</TableCell>
                                    <TableCell>{format(inst.dueDate, "dd/MM/yyyy")}</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={
                                                inst.status === "PAID" ? "default" : "secondary"
                                            }
                                            className={
                                                inst.status === "PAID"
                                                    ? "bg-emerald-500 hover:bg-emerald-600"
                                                    : ""
                                            }
                                        >
                                            {inst.status === "PAID" ? "Paga" : "Pendente"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                if (onUpdatePaid) {
                                                    if (inst.status === "PENDING") {
                                                        onUpdatePaid(inst.number);
                                                    } else {
                                                        onUpdatePaid(inst.number - 1);
                                                    }
                                                }
                                            }}
                                            title={
                                                inst.status === "PAID"
                                                    ? "Marcar como pendente"
                                                    : "Marcar como paga"
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
            </DialogContent>
        </Dialog>
    );
}
