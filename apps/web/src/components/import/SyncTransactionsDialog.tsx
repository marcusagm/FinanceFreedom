import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";

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
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Sincronizar Contas"
            footer={
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={onConfirm}>
                        Confirmar
                    </Button>
                </div>
            }
        >
            <p>
                Deseja verificar manualmente a caixa de entrada de todos os
                e-mails cadastrados em busca de novas transações?
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
                Isso pode levar alguns segundos.
            </p>
        </Modal>
    );
}
