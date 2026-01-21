import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "../ui/Dialog";
import { InvoiceTimeline } from "./InvoiceTimeline";
import { PayInvoiceDialog } from "./PayInvoiceDialog";
import { creditCardService } from "../../services/credit-card.service";
import { toast } from "sonner";
import type { CreditCard } from "../../types/credit-card";
import { MoneyDisplay } from "../ui/MoneyDisplay";

interface InvoiceDialogProps {
    isOpen: boolean;
    onClose: () => void;
    card: CreditCard | null;
}

export function InvoiceDialog({ isOpen, onClose, card }: InvoiceDialogProps) {
    const { t } = useTranslation();
    const [monthOffset, setMonthOffset] = useState(0);
    const [isPayOpen, setIsPayOpen] = useState(false);

    const currentDate = new Date();
    currentDate.setMonth(currentDate.getMonth() + monthOffset);
    const queryMonth = currentDate.getMonth() + 1;
    const queryYear = currentDate.getFullYear();

    const { data: invoice, isLoading: isLoadingInvoice } = useQuery({
        queryKey: ["invoice", card?.id, queryMonth, queryYear],
        queryFn: () =>
            creditCardService.getInvoice(card!.id, queryMonth, queryYear),
        enabled: !!card?.id && isOpen,
    });

    const handlePayConfirm = (accountId: string) => {
        // Placeholder for payment logic
        console.log(
            `Paying invoice for card ${card?.id} with account ${accountId}`,
        );
        toast.info("Feature not fully wired to backend yet");
        setIsPayOpen(false);
    };

    if (!card) return null;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>{card.name}</DialogTitle>
                    <DialogDescription>
                        {card.brand} - {t("creditCard.limit")}:{" "}
                        <MoneyDisplay value={card.limit} />
                    </DialogDescription>
                </DialogHeader>

                <DialogBody className="flex-1 overflow-y-auto">
                    {isLoadingInvoice ? (
                        <div className="flex justify-center items-center h-40">
                            {t("common.loading")}
                        </div>
                    ) : invoice ? (
                        <InvoiceTimeline
                            invoice={invoice}
                            onMonthChange={(inc) =>
                                setMonthOffset((prev) => prev + inc)
                            }
                            onPayInvoice={() => setIsPayOpen(true)}
                        />
                    ) : (
                        <div className="flex justify-center items-center h-40 text-red-500">
                            {t("creditCard.invoiceError")}
                        </div>
                    )}
                </DialogBody>

                <PayInvoiceDialog
                    open={isPayOpen}
                    onOpenChange={setIsPayOpen}
                    invoiceTotal={invoice?.total || 0}
                    onConfirm={handlePayConfirm}
                />
            </DialogContent>
        </Dialog>
    );
}
