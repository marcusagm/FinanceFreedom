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
    const { t } = useTranslation();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("transactions.deleteTitle")}</DialogTitle>
                    <DialogDescription>
                        {t("transactions.deleteDesc")}
                    </DialogDescription>
                </DialogHeader>

                <DialogBody>
                    <AppAlert
                        variant="destructive"
                        title={t("common.attention")}
                    >
                        <Trans
                            i18nKey="transactions.deleteMessage"
                            values={{ name: description }}
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
                            ? t("transactions.deleting")
                            : t("transactions.deleteConfirm")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
