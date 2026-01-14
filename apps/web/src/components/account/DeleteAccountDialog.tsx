import { AppAlert } from "../../components/ui/AppAlert";
import { Button } from "../../components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/Dialog";

interface DeleteAccountDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    accountName: string;
    isDeleting: boolean;
}

export function DeleteAccountDialog({
    isOpen,
    onClose,
    onConfirm,
    accountName,
    isDeleting,
}: DeleteAccountDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Excluir Conta</DialogTitle>
                    <DialogDescription>Esta ação não pode ser desfeita.</DialogDescription>
                </DialogHeader>

                <AppAlert variant="destructive" title="Atenção">
                    A conta <strong>{accountName}</strong> será permanentemente removida.
                </AppAlert>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isDeleting}>
                        Cancelar
                    </Button>
                    <Button variant="destructive" onClick={onConfirm} disabled={isDeleting}>
                        {isDeleting ? "Excluindo..." : "Sim, excluir conta"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
