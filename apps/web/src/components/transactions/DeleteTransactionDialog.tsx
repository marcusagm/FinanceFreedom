import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

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
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Excluir Transação"
            footer={
                <>
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
                        {isDeleting ? "Excluindo..." : "Sim, excluir transação"}
                    </Button>
                </>
            }
        >
            <div className="flex flex-col gap-4">
                <div className="p-4 rounded-md bg-red-50 text-red-900 border border-red-200">
                    <p className="font-medium">
                        Tem certeza que deseja excluir esta transação?
                    </p>
                    <p className="text-sm mt-1 text-red-700">
                        Esta ação não pode ser desfeita. A transação{" "}
                        <strong>{description}</strong> será permanentemente
                        removida.
                    </p>
                </div>
            </div>
        </Modal>
    );
}
