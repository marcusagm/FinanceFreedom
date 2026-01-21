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

interface DeleteCreditCardDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    cardName: string;
    isDeleting: boolean;
}

export function DeleteCreditCardDialog({
    isOpen,
    onClose,
    onConfirm,
    cardName,
    isDeleting,
}: DeleteCreditCardDialogProps) {
    const { t } = useTranslation();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t("creditCard.deleteDialog.title")}
                    </DialogTitle>
                    <DialogDescription>
                        {t("creditCard.deleteDialog.desc")}
                    </DialogDescription>
                </DialogHeader>

                <DialogBody>
                    <AppAlert
                        variant="destructive"
                        title={t("creditCard.deleteDialog.attention")}
                    >
                        <Trans
                            i18nKey="creditCard.deleteDialog.message"
                            values={{ name: cardName }}
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
                            ? t("creditCard.deleteDialog.deleting")
                            : t("creditCard.deleteDialog.confirm")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
