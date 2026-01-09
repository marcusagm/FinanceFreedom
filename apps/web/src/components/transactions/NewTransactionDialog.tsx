import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "../../lib/api";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/Dialog";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/Form";
import type { Account, Transaction } from "../../types";

interface NewTransactionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    accounts: Account[];
    initialData?: Transaction | null;
}

const formSchema = z.object({
    description: z.string().min(1, "Descrição é obrigatória"),
    amount: z
        .number({ message: "Valor deve ser um número" })
        .min(0.01, "Valor deve ser maior que 0"),
    type: z.enum(["INCOME", "EXPENSE"]),
    date: z.string().min(1, "Data é obrigatória"),
    accountId: z.string().min(1, "Conta é obrigatória"),
    category: z.string().optional(),
});

export function NewTransactionDialog({
    isOpen,
    onClose,
    onSuccess,
    accounts,
    initialData,
}: NewTransactionDialogProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: "",
            amount: 0,
            type: "EXPENSE",
            date: new Date().toISOString().split("T")[0],
            accountId: "",
            category: "",
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                form.reset({
                    description: initialData.description,
                    amount: Number(initialData.amount),
                    type: initialData.type,
                    date: new Date(initialData.date)
                        .toISOString()
                        .split("T")[0],
                    accountId: initialData.accountId,
                    category: initialData.category || "",
                });
            } else {
                form.reset({
                    description: "",
                    amount: 0,
                    type: "EXPENSE",
                    date: new Date().toISOString().split("T")[0],
                    accountId: accounts.length > 0 ? accounts[0].id : "",
                    category: "",
                });
            }
        }
    }, [isOpen, accounts, form, initialData]);

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (initialData) {
                await api.patch(`/transactions/${initialData.id}`, values);
            } else {
                await api.post("/transactions", values);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to save transaction", error);
            alert("Erro ao salvar transação.");
        }
    };

    const transactionTypes = [
        { value: "INCOME", label: "Receita" },
        { value: "EXPENSE", label: "Despesa" },
    ];

    const accountOptions = accounts.map((acc) => ({
        value: acc.id,
        label: acc.name,
    }));

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {initialData ? "Editar Transação" : "Nova Transação"}
                    </DialogTitle>
                    <DialogDescription>
                        Preencha os detalhes da transação abaixo.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="flex flex-col gap-5"
                    >
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Mercado, Salário"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="amount"
                                render={({
                                    field: { onChange, value, ...field },
                                }) => (
                                    <FormItem>
                                        <FormLabel>Valor</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="R$ 0,00"
                                                currency
                                                value={value}
                                                onValueChange={(values) => {
                                                    onChange(
                                                        values.floatValue || 0
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
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Tipo</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                options={transactionTypes}
                                                onChange={field.onChange}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
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
                                        <FormLabel>Conta</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                options={accountOptions}
                                                onChange={field.onChange}
                                                placeholder="Selecione uma conta"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Categoria (Opcional)</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Alimentação"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                        {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
