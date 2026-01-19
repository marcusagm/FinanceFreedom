import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation, Trans } from "react-i18next";
import * as z from "zod";
import { api } from "../../lib/api";
import type { Account } from "../../types";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/Dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/Form";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import type { Debt } from "./DebtForm";
import { toast } from "sonner"; // Assuming sonner

interface DebtPaymentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    debt: Debt;
}

export function DebtPaymentDialog({
    isOpen,
    onClose,
    onSuccess,
    debt,
}: DebtPaymentDialogProps) {
    const { t } = useTranslation();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loadingAccounts, setLoadingAccounts] = useState(false);

    const formSchema = z.object({
        amount: z
            .number({
                message: t("debts.paymentDialog.validation.amountNumber"),
            })
            .min(0.01, t("debts.paymentDialog.validation.amountPositive")),
        date: z
            .string()
            .min(1, t("debts.paymentDialog.validation.dateRequired")),
        accountId: z
            .string()
            .min(1, t("debts.paymentDialog.validation.accountRequired")),
        paysInstallment: z.boolean().default(false).optional(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: 0,
            date: new Date().toISOString().split("T")[0],
            accountId: "",
            paysInstallment: false,
        },
    });

    useEffect(() => {
        if (isOpen) {
            // Reset form with debt suggestion (e.g. minimum payment or total)
            // For now, let's suggest the minimum payment if available, else 0
            form.reset({
                amount: Number(debt.minimumPayment) || 0,
                date: new Date().toISOString().split("T")[0],
                accountId: accounts.length > 0 ? accounts[0].id : "",
                paysInstallment: !!(
                    debt.installmentsTotal && debt.installmentsTotal > 0
                ), // Auto-check if it has installments? Maybe safer to default false.
                // Let's default to FALSE to avoid accidental double counting if user isn't paying full installment.
                // Or true if amount matches min payment? Too complex. Default false.
            });

            // Fetch accounts if not already loaded or if we want fresh data
            const fetchAccounts = async () => {
                setLoadingAccounts(true);
                try {
                    const response = await api.get("/accounts");
                    setAccounts(response.data);
                    // If no account selected yet, select the first one
                    const currentAccountId = form.getValues("accountId");
                    if (!currentAccountId && response.data.length > 0) {
                        form.setValue("accountId", response.data[0].id);
                    }
                } catch (error) {
                    console.error("Failed to fetch accounts", error);
                } finally {
                    setLoadingAccounts(false);
                }
            };
            fetchAccounts();
        }
    }, [isOpen, debt, form]);

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            // Create expense transaction
            await api.post("/transactions", {
                description: `Pagamento Dívida: ${debt.name}`, // Keeping this one hardcoded or generic for now, potentially could be localized too but usually transaction descriptions are stored as string
                amount: values.amount,
                type: "EXPENSE",
                date: values.date,
                accountId: values.accountId,
                category: "Pagamento de Dívida", // Hardcoded per plan requirement
                debtId: debt.id,
                paysInstallment: values.paysInstallment,
            });

            toast.success(t("debts.paymentDialog.success"));
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to register payment", error);
            toast.error(t("debts.paymentDialog.error"));
        }
    };

    const accountOptions = accounts.map((acc) => ({
        value: acc.id,
        label: acc.name,
    }));

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t("debts.paymentDialog.title")}</DialogTitle>
                    <DialogDescription>
                        <Trans
                            i18nKey="debts.paymentDialog.subtitle"
                            values={{ name: debt.name }}
                            components={{ strong: <strong /> }}
                        />
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="flex flex-col flex-1 min-h-0"
                    >
                        <DialogBody className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <FormField
                                    control={form.control}
                                    name="amount"
                                    render={({
                                        field: { onChange, value, ...field },
                                    }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    "debts.paymentDialog.amountLabel",
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    data-testid="amount-input"
                                                    placeholder="R$ 0,00"
                                                    currency
                                                    value={value}
                                                    onValueChange={(values) => {
                                                        onChange(
                                                            values.floatValue ||
                                                                0,
                                                        );
                                                    }}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    "debts.paymentDialog.dateLabel",
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input type="date" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="accountId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    "debts.paymentDialog.sourceAccountLabel",
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    options={accountOptions}
                                                    onChange={field.onChange}
                                                    placeholder={
                                                        loadingAccounts
                                                            ? t(
                                                                  "debts.paymentDialog.loadingAccounts",
                                                              )
                                                            : t(
                                                                  "debts.paymentDialog.selectAccount",
                                                              )
                                                    }
                                                    disabled={loadingAccounts}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {debt.installmentsTotal &&
                                    debt.installmentsTotal > 0 && (
                                        <FormField
                                            control={form.control}
                                            name="paysInstallment"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={
                                                                field.value
                                                            }
                                                            onCheckedChange={
                                                                field.onChange
                                                            }
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel>
                                                            {t(
                                                                "debts.paymentDialog.paysInstallmentLabel",
                                                            )}
                                                        </FormLabel>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                    )}
                            </div>
                        </DialogBody>

                        <DialogFooter>
                            <Button variant="outline" onClick={onClose}>
                                {t("common.cancel")}
                            </Button>
                            <Button
                                onClick={form.handleSubmit(handleSubmit)}
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting
                                    ? t("debts.paymentDialog.registering")
                                    : t("debts.paymentDialog.confirm")}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
