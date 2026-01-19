import { AppAlert } from "../ui/AppAlert";
import { Button } from "../ui/Button";
import { useTranslation, Trans } from "react-i18next";
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/Dialog";

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
    const { t } = useTranslation();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("debts.deleteDialog.title")}</DialogTitle>
                    <DialogDescription>
                        {t("debts.deleteDialog.desc")}
                    </DialogDescription>
                </DialogHeader>

                <DialogBody>
                    <AppAlert
                        variant="destructive"
                        title={t("debts.deleteDialog.attention")}
                    >
                        <Trans
                            i18nKey="debts.deleteDialog.message"
                            values={{ name: debtName }}
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
                            ? t("debts.deleteDialog.deleting")
                            : t("debts.deleteDialog.confirm")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
