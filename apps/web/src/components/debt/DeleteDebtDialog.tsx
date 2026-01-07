import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

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
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Excluir Dívida"
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
                        {isDeleting ? "Excluindo..." : "Sim, excluir dívida"}
                    </Button>
                </>
            }
        >
            <div className="flex flex-col gap-4">
                <div className="p-4 rounded-md bg-red-50 text-red-900 border border-red-200">
                    <p className="font-medium">
                        Tem certeza que deseja excluir esta dívida?
                    </p>
                    <p className="text-sm mt-1 text-red-700">
                        Esta ação não pode ser desfeita. A dívida{" "}
                        <strong>{debtName}</strong> será permanentemente
                        removida.
                    </p>
                </div>
            </div>
        </Modal>
    );
}
