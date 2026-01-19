import { AppAlert } from "../../components/ui/AppAlert";
import { useTranslation, Trans } from "react-i18next";
import { Button } from "../../components/ui/Button";
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/Dialog";

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
    const { t } = useTranslation();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t("accounts.deleteDialog.title")}
                    </DialogTitle>
                    <DialogDescription>
                        {t("accounts.deleteDialog.desc")}
                    </DialogDescription>
                </DialogHeader>

                <DialogBody>
                    <AppAlert
                        variant="destructive"
                        title={t("common.attention")}
                    >
                        <Trans
                            i18nKey="accounts.deleteDialog.message"
                            values={{ name: accountName }}
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
                            ? t("accounts.deleteDialog.deleting")
                            : t("accounts.deleteDialog.confirm")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
