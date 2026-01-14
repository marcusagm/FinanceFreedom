import { AppAlert } from "../ui/AppAlert";
import { Button } from "../ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/Dialog";

interface DeleteIncomeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
    itemType: "SOURCE" | "WORK_UNIT";
    isDeleting: boolean;
}

export function DeleteIncomeDialog({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    itemType,
    isDeleting,
}: DeleteIncomeDialogProps) {
    const typeLabel = itemType === "SOURCE" ? "Fonte de Renda" : "Serviço";
    const typeLabelStrong = itemType === "SOURCE" ? "A fonte de renda" : "O serviço";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Excluir {typeLabel}</DialogTitle>
                    <DialogDescription>Esta ação não pode ser desfeita.</DialogDescription>
                </DialogHeader>

                <AppAlert variant="destructive" title="Atenção">
                    {typeLabelStrong} <strong>{itemName}</strong> será permanentemente removida.
                </AppAlert>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isDeleting}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting ? "Excluindo..." : "Sim, excluir"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
