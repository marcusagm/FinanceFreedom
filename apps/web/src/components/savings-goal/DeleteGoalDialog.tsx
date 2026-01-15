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

interface DeleteGoalDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    goalName: string;
    isDeleting: boolean;
}

export function DeleteGoalDialog({
    isOpen,
    onClose,
    onConfirm,
    goalName,
    isDeleting,
}: DeleteGoalDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Excluir Meta</DialogTitle>
                    <DialogDescription>
                        Esta ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>

                <DialogBody>
                    <AppAlert variant="destructive" title="Atenção">
                        A meta <strong>{goalName}</strong> será permanentemente
                        removida.
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
                        {isDeleting ? "Excluindo..." : "Sim, excluir meta"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
