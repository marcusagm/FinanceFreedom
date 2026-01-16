import { AppAlert } from "../ui/AppAlert";
import { useTranslation, Trans } from "react-i18next";
import { Loader2 } from "lucide-react";
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

interface DeleteCategoryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    categoryName: string;
    isDeleting: boolean;
}

export function DeleteCategoryDialog({
    isOpen,
    onClose,
    onConfirm,
    categoryName,
    isDeleting,
}: DeleteCategoryDialogProps) {
    const { t } = useTranslation();
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {t("categories.deleteDialog.title")}
                    </DialogTitle>
                    <DialogDescription>
                        {t("categories.deleteDialog.desc")}
                    </DialogDescription>
                </DialogHeader>
                <DialogBody>
                    <AppAlert variant="destructive" title={t("common.error")}>
                        <Trans
                            i18nKey="categories.deleteDialog.message"
                            values={{ name: categoryName }}
                            components={{ strong: <strong /> }}
                        />
                    </AppAlert>
                </DialogBody>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
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
                            ? t("categories.deleteDialog.deleting")
                            : t("categories.deleteDialog.confirm")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
