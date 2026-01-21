import React from "react";
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/Dialog";
import { Button } from "../ui/Button";
import { useTranslation } from "react-i18next";
import { Select } from "../ui/Select";
import { Label } from "../ui/Label";
import { useQuery } from "@tanstack/react-query";
import { api } from "../../lib/api";

interface PayInvoiceDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    invoiceTotal: number;
    onConfirm: (accountId: string) => void;
}

export const PayInvoiceDialog: React.FC<PayInvoiceDialogProps> = ({
    open,
    onOpenChange,
    invoiceTotal,
    onConfirm,
}) => {
    const { t } = useTranslation();
    const [selectedAccount, setSelectedAccount] = React.useState<string>("");

    // Fetch accounts (Need to import Account type or use any for now)
    const { data: accounts } = useQuery({
        queryKey: ["accounts"],
        queryFn: async () => {
            const res = await api.get("/accounts");
            return res.data;
        },
    });

    const handleConfirm = () => {
        if (selectedAccount) {
            onConfirm(selectedAccount);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("creditCard.payInvoice")}</DialogTitle>
                    <DialogDescription>
                        {t("creditCard.payInvoiceDescription", {
                            value: invoiceTotal,
                        })}
                    </DialogDescription>
                </DialogHeader>

                <DialogBody>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="account" className="text-right">
                                {t("common.account")}
                            </Label>
                            <Select
                                value={selectedAccount}
                                onChange={setSelectedAccount}
                                options={
                                    accounts
                                        ?.filter(
                                            (acc: any) =>
                                                acc.type !== "CREDIT_CARD",
                                        )
                                        .map((acc: any) => ({
                                            value: acc.id,
                                            label: acc.name,
                                        })) || []
                                }
                                placeholder={t("common.selectAccount")}
                                className="col-span-3"
                            />
                        </div>
                    </div>
                </DialogBody>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                    >
                        {t("common.cancel")}
                    </Button>
                    <Button onClick={handleConfirm} disabled={!selectedAccount}>
                        {t("common.pay")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
