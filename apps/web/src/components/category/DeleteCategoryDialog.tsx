import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/Dialog";
import { Button } from "../ui/Button";
import { Loader2 } from "lucide-react";

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
                        Tem certeza que deseja excluir a categoria{" "}
                        <span className="font-bold">{categoryName}</span>? Esta
                        ação não pode ser desfeita.
                    </DialogDescription>
                </DialogHeader>
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
