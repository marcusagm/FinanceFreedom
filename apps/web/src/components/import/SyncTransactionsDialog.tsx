import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("imap.syncDialog.title")}</DialogTitle>
                </DialogHeader>

                <DialogBody>
                    <DialogDescription className="text-foreground text-base">
                        {t("imap.syncDialog.description")}
                    </DialogDescription>
                    <p className="mt-2 text-sm text-muted-foreground">
                        {t("imap.syncDialog.note")}
                    </p>
                </DialogBody>

                <DialogFooter className="gap-2">
                    <Button variant="outline" onClick={onClose}>
                        {t("common.cancel")}
                    </Button>
                    <Button variant="primary" onClick={onConfirm}>
                        {t("imap.syncDialog.confirm")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
