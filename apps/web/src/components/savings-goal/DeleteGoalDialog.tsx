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

interface DeleteGoalDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    goalName: string;
    isDeleting: boolean;
}

export function DeleteGoalDialog({
    isOpen,
    onClose,
    onConfirm,
    goalName,
    isDeleting,
}: DeleteGoalDialogProps) {
    const { t } = useTranslation();

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("savingsGoals.delete.title")}</DialogTitle>
                    <DialogDescription>
                        {t("savingsGoals.delete.description")}
                    </DialogDescription>
                </DialogHeader>

                <DialogBody>
                    <AppAlert
                        variant="destructive"
                        title={t("common.attention")}
                    >
                        <Trans
                            i18nKey="savingsGoals.delete.message"
                            values={{ name: goalName }}
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
                            ? t("savingsGoals.delete.deleting")
                            : t("savingsGoals.delete.confirm")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
