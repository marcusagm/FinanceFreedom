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

interface DeleteCategoryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    categoryName: string;
    isDeleting: boolean;
}

export function DeleteCategoryDialog({
    isOpen,
    onClose,
    onConfirm,
    categoryName,
    isDeleting,
}: DeleteCategoryDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Excluir Categoria</DialogTitle>
                    <DialogDescription>
                        Esta ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>
                <DialogBody>
                    <AppAlert variant="destructive" title="Atenção">
                        A categoria <strong>{categoryName}</strong> será
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
