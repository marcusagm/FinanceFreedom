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

interface DeleteInvestmentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    accountName: string;
    isDeleting: boolean;
}

export function DeleteInvestmentDialog({
    isOpen,
    onClose,
    onConfirm,
    accountName,
    isDeleting,
}: DeleteInvestmentDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Excluir Carteira</DialogTitle>
                    <DialogDescription>Esta ação não pode ser desfeita.</DialogDescription>
                </DialogHeader>

                <AppAlert variant="destructive" title="Atenção">
                    A carteira <strong>{accountName}</strong> será permanentemente removida.
                </AppAlert>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isDeleting}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting ? "Excluindo..." : "Sim, excluir carteira"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
