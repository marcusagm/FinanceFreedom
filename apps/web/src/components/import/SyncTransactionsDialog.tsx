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

interface SyncTransactionsDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export function SyncTransactionsDialog({
    isOpen,
    onClose,
    onConfirm,
}: SyncTransactionsDialogProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Sincronizar Contas</DialogTitle>
                </DialogHeader>

                <DialogBody>
                    <DialogDescription className="text-foreground text-base">
                        Deseja verificar manualmente a caixa de entrada de todos
                        os e-mails cadastrados em busca de novas transações?
                    </DialogDescription>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Isso pode levar alguns segundos.
                    </p>
                </DialogBody>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={onConfirm}>
                        Confirmar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
