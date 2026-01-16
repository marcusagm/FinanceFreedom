import { useTranslation, Trans } from "react-i18next";
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
    const { t } = useTranslation();
    const typeLabel =
        itemType === "SOURCE"
            ? t("income.deleteDialog.typeSource")
            : t("income.deleteDialog.typeWorkUnit");

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t("income.deleteDialog.title", { type: typeLabel })}
                    </DialogTitle>
                    <DialogDescription>
                        {t("income.deleteDialog.desc")}
                    </DialogDescription>
                </DialogHeader>

                <DialogBody>
                    <AppAlert
                        variant="destructive"
                        title={t("income.deleteDialog.attention")}
                    >
                        <Trans
                            i18nKey={
                                itemType === "SOURCE"
                                    ? "income.deleteDialog.messageSource"
                                    : "income.deleteDialog.messageWorkUnit"
                            }
                            values={{ name: itemName }}
                            components={{ strong: <strong /> }}
                        />
                    </AppAlert>
                </DialogBody>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isDeleting}
                    >
                        {t("common.cancel")}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isDeleting}
                    >
                        {isDeleting
                            ? t("income.deleteDialog.deleting")
                            : t("income.deleteDialog.confirm")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
