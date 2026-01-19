import { AppAlert } from "../ui/AppAlert";
import { Loader2 } from "lucide-react";
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

interface DeleteFixedExpenseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    description: string;
    isDeleting: boolean;
}

export function DeleteFixedExpenseDialog({
    isOpen,
    onClose,
    onConfirm,
    description,
    isDeleting,
}: DeleteFixedExpenseDialogProps) {
    const { t } = useTranslation();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t("fixedExpenses.deleteDialog.title")}
                    </DialogTitle>
                    <DialogDescription>
                        {t("fixedExpenses.deleteDialog.desc")}
                    </DialogDescription>
                </DialogHeader>
                <DialogBody>
                    <AppAlert
                        variant="destructive"
                        title={t("fixedExpenses.deleteDialog.attention")}
                    >
                        <Trans
                            i18nKey="fixedExpenses.deleteDialog.message"
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
                        {isDeleting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isDeleting
                            ? t("fixedExpenses.deleteDialog.deleting")
                            : t("fixedExpenses.deleteDialog.confirm")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
