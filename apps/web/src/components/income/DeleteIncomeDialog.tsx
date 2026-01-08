import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";

interface DeleteIncomeDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: string;
    itemType: "SOURCE" | "WORK_UNIT";
    isDeleting: boolean;
}

export function DeleteIncomeDialog({
    isOpen,
    onClose,
    onConfirm,
    itemName,
    itemType,
    isDeleting,
}: DeleteIncomeDialogProps) {
    const typeLabel =
        itemType === "SOURCE" ? "esta fonte de renda" : "este serviço";
    const typeLabelStrong =
        itemType === "SOURCE" ? "A fonte de renda" : "O serviço";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={`Excluir ${
                itemType === "SOURCE" ? "Fonte de Renda" : "Serviço"
            }`}
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
                        {isDeleting ? "Excluindo..." : "Sim, excluir"}
                    </Button>
                </>
            }
        >
            <div className="flex flex-col gap-4">
                <div className="p-4 rounded-md bg-red-50 text-red-900 border border-red-200">
                    <p className="font-medium">
                        Tem certeza que deseja excluir {typeLabel}?
                    </p>
                    <p className="text-sm mt-1 text-red-700">
                        Esta ação não pode ser desfeita. {typeLabelStrong}{" "}
                        <strong>{itemName}</strong> será permanentemente
                        removida.
                    </p>
                </div>
            </div>
        </Modal>
    );
}
