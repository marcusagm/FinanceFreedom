import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { api } from "../../lib/api";
import type { Account } from "../../types";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/Dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/Form";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import type { Debt } from "./DebtForm";

interface DebtPaymentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    debt: Debt;
}

const formSchema = z.object({
    amount: z
        .number({ message: "Valor deve ser um número" })
        .min(0.01, "Valor deve ser maior que 0"),
    date: z.string().min(1, "Data é obrigatória"),
    accountId: z.string().min(1, "Conta é obrigatória"),
    paysInstallment: z.boolean().default(false).optional(),
});

export function DebtPaymentDialog({ isOpen, onClose, onSuccess, debt }: DebtPaymentDialogProps) {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loadingAccounts, setLoadingAccounts] = useState(false);

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
                paysInstallment: !!(debt.installmentsTotal && debt.installmentsTotal > 0), // Auto-check if it has installments? Maybe safer to default false.
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
                description: `Pagamento Dívida: ${debt.name}`,
                amount: values.amount,
                type: "EXPENSE",
                date: values.date,
                accountId: values.accountId,
                category: "Pagamento de Dívida", // Hardcoded per plan requirement
                debtId: debt.id,
                paysInstallment: values.paysInstallment,
            });

            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to register payment", error);
            alert("Erro ao registrar pagamento.");
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
                    <DialogTitle>Registrar Pagamento de Dívida</DialogTitle>
                    <DialogDescription>
                        Pagamento para: <strong>{debt.name}</strong>
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="flex flex-col gap-5"
                    >
                        <div className="grid grid-cols-1 gap-4">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({ field: { onChange, value, ...field } }) => (
                                    <FormItem>
                                        <FormLabel>Valor do Pagamento</FormLabel>
                                        <FormControl>
                                            <Input
                                                data-testid="amount-input"
                                                placeholder="R$ 0,00"
                                                currency
                                                value={value}
                                                onValueChange={(values) => {
                                                    onChange(values.floatValue || 0);
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
                                        <FormLabel>Data</FormLabel>
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
                                        <FormLabel>Conta de Origem</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                options={accountOptions}
                                                onChange={field.onChange}
                                                placeholder={
                                                    loadingAccounts
                                                        ? "Carregando contas..."
                                                        : "Selecione uma conta"
                                                }
                                                disabled={loadingAccounts}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {debt.installmentsTotal && debt.installmentsTotal > 0 && (
                                <FormField
                                    control={form.control}
                                    name="paysInstallment"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    Este pagamento quita uma parcela?
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            )}
                        </div>
                    </form>
                </Form>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={form.handleSubmit(handleSubmit)}
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? "Registrando..." : "Confirmar Pagamento"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
