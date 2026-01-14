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

interface DeleteTransactionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    description: string;
    isDeleting: boolean;
}

export function DeleteTransactionDialog({
    isOpen,
    onClose,
    onConfirm,
    description,
    isDeleting,
}: DeleteTransactionDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Excluir Transação</DialogTitle>
                    <DialogDescription>Esta ação não pode ser desfeita.</DialogDescription>
                </DialogHeader>

                <AppAlert variant="destructive" title="Atenção">
                    A transação <strong>{description}</strong> será permanentemente removida.
                </AppAlert>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isDeleting}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting ? "Excluindo..." : "Sim, excluir transação"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
