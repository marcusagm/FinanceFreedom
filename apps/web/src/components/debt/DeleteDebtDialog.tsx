import { AppAlert } from "../ui/AppAlert";
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

interface DeleteDebtDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    debtName: string;
    isDeleting: boolean;
}

export function DeleteDebtDialog({
    isOpen,
    onClose,
    onConfirm,
    debtName,
    isDeleting,
}: DeleteDebtDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Excluir Dívida</DialogTitle>
                    <DialogDescription>
                        Esta ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>

                <DialogBody>
                    <AppAlert variant="destructive" title="Atenção">
                        A dívida <strong>{debtName}</strong> será
                        permanentemente removida.
                    </AppAlert>
                </DialogBody>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting ? "Excluindo..." : "Sim, excluir dívida"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
