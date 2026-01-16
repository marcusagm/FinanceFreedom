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

interface DeleteInvestmentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    accountName: string;
    isDeleting: boolean;
}

export function DeleteInvestmentDialog({
    isOpen,
    onClose,
    onConfirm,
    accountName,
    isDeleting,
}: DeleteInvestmentDialogProps) {
    const { t } = useTranslation();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("investments.delete.title")}</DialogTitle>
                    <DialogDescription>
                        {t("investments.delete.description")}
                    </DialogDescription>
                </DialogHeader>

                <DialogBody>
                    <AppAlert
                        variant="destructive"
                        title={t("common.attention")}
                    >
                        <Trans
                            i18nKey="investments.delete.message"
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
                            ? t("investments.delete.deleting")
                            : t("investments.delete.confirm")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
