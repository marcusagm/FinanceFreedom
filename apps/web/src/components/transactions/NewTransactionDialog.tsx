import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { api } from "../../lib/api";
import type { Category } from "../../services/category.service";
import type { Account, Transaction } from "../../types";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import { DatePicker } from "../ui/DatePicker";
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

interface NewTransactionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    accounts: Account[];
    categories: Category[];
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
    categoryId: z.string().optional(),
    isRecurring: z.boolean().optional(),
    repeatCount: z.number().optional(),
});

export function NewTransactionDialog({
    isOpen,
    onClose,
    onSuccess,
    accounts,
    categories,
    initialData,
}: NewTransactionDialogProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: "",
            amount: 0,
            type: "EXPENSE",
            date: format(new Date(), "yyyy-MM-dd"),
            accountId: "",
            categoryId: "",
            isRecurring: false,
            repeatCount: 12,
        },
    });

    const isRecurring = form.watch("isRecurring");
    const type = form.watch("type");

    const filteredCategories = categories.filter((c) => {
        const catType = c.type || "EXPENSE";
        return catType === type;
    });

    useEffect(() => {
        // Clear category if type changes and selected category is not valid
        const currentCategoryId = form.getValues("categoryId");
        if (currentCategoryId) {
            const isValid = filteredCategories.find(
                (c) => c.id === currentCategoryId
            );
            if (!isValid) {
                form.setValue("categoryId", "");
            }
        }
    }, [type, filteredCategories, form]);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                form.reset({
                    description: initialData.description,
                    amount: Number(initialData.amount),
                    type: initialData.type,
                    date: initialData.date
                        ? format(new Date(initialData.date), "yyyy-MM-dd")
                        : format(new Date(), "yyyy-MM-dd"),
                    accountId: initialData.accountId,
                    categoryId: initialData.categoryId || "",
                    isRecurring: false,
                    repeatCount: 12,
                });
            } else {
                form.reset({
                    description: "",
                    amount: 0,
                    type: "EXPENSE",
                    date: format(new Date(), "yyyy-MM-dd"),
                    accountId: accounts.length > 0 ? accounts[0].id : "",
                    categoryId: "",
                    isRecurring: false,
                    repeatCount: 12,
                });
            }
        }
    }, [isOpen, accounts, form, initialData]);

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const selectedCategory = categories.find(
                (c) => c.id === values.categoryId
            );
            const payload = {
                ...values,
                category: selectedCategory ? selectedCategory.name : undefined,
            };

            if (initialData) {
                await api.patch(`/transactions/${initialData.id}`, payload);
            } else {
                await api.post("/transactions", payload);
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
                        className="flex flex-col flex-1 min-h-0"
                    >
                        <DialogBody className="space-y-4">
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
                                                    value={value || ""}
                                                    onValueChange={(values) => {
                                                        onChange(
                                                            values.floatValue ||
                                                                0
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
                                        <FormItem className="flex flex-col">
                                            <FormLabel>Data</FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    date={
                                                        field.value
                                                            ? new Date(
                                                                  field.value +
                                                                      "T00:00:00"
                                                              )
                                                            : undefined
                                                    }
                                                    setDate={(date) =>
                                                        field.onChange(
                                                            date
                                                                ? format(
                                                                      date,
                                                                      "yyyy-MM-dd"
                                                                  )
                                                                : ""
                                                        )
                                                    }
                                                    className="w-full"
                                                    placeholder="Selecione a data"
                                                />
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
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Categoria (Opcional)
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value || ""}
                                                options={[
                                                    {
                                                        label: "Sem categoria",
                                                        value: "",
                                                    },
                                                    ...filteredCategories.map(
                                                        (c) => ({
                                                            label: c.name,
                                                            value: c.id,
                                                        })
                                                    ),
                                                ]}
                                                onChange={field.onChange}
                                                placeholder="Selecione uma categoria"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {!initialData && (
                                <div className="space-y-4 rounded-lg border p-4">
                                    <FormField
                                        control={form.control}
                                        name="isRecurring"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                                                <FormControl>
                                                    <Checkbox
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                </FormControl>
                                                <div className="space-y-1 leading-none">
                                                    <FormLabel className="w-auto cursor-pointer font-normal">
                                                        Repetir mensalmente
                                                    </FormLabel>
                                                </div>
                                            </FormItem>
                                        )}
                                    />

                                    {isRecurring && (
                                        <FormField
                                            control={form.control}
                                            name="repeatCount"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        Número de vezes
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            {...field}
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    Number(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                )
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </div>
                            )}
                        </DialogBody>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={onClose}
                                type="button"
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting
                                    ? "Salvando..."
                                    : "Salvar"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
