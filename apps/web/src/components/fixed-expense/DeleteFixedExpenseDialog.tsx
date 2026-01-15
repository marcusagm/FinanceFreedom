import { AppAlert } from "../ui/AppAlert";
import { Loader2 } from "lucide-react";
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

interface DeleteFixedExpenseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    description: string;
    isDeleting: boolean;
}

export function DeleteFixedExpenseDialog({
    isOpen,
    onClose,
    onConfirm,
    description,
    isDeleting,
}: DeleteFixedExpenseDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Excluir Despesa Fixa</DialogTitle>
                    <DialogDescription>
                        Esta ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>
                <DialogBody>
                    <AppAlert variant="destructive" title="Atenção">
                        A despesa fixa <strong>{description}</strong> será
                        permanentemente removida.
                    </AppAlert>
                </DialogBody>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Excluir
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
