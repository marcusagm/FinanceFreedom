import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";

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
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Excluir Conta"
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
                        {isDeleting ? "Excluindo..." : "Sim, excluir conta"}
                    </Button>
                </>
            }
        >
            <div className="flex flex-col gap-4">
                <div className="p-4 rounded-md bg-red-50 text-red-900 border border-red-200">
                    <p className="font-medium">
                        Tem certeza que deseja excluir esta conta?
                    </p>
                    <p className="text-sm mt-1 text-red-700">
                        Esta ação não pode ser desfeita. A conta{" "}
                        <strong>{accountName}</strong> será permanentemente
                        removida.
                    </p>
                </div>
            </div>
        </Modal>
    );
}
