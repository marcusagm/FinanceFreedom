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

interface DeletePersonDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    name: string;
    isDeleting?: boolean;
}

export function DeletePersonDialog({
    isOpen,
    onClose,
    onConfirm,
    name,
    isDeleting = false,
}: DeletePersonDialogProps) {
    const { t } = useTranslation();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("persons.deleteDialog.title")}</DialogTitle>
                    <DialogDescription>
                        {t("persons.deleteDialog.desc")}
                    </DialogDescription>
                </DialogHeader>

                <DialogBody>
                    <AppAlert
                        variant="destructive"
                        title={t("common.attention")}
                    >
                        <Trans
                            i18nKey="persons.deleteDialog.message"
                            values={{ name }}
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
                            ? t("common.deleting")
                            : t("persons.deleteDialog.confirm")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
