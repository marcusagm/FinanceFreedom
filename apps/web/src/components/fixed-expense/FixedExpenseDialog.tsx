import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Label } from "../ui/Label";
import { Checkbox } from "../ui/Checkbox";
import { Select } from "../ui/Select";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/Form";
import { Loader2 } from "lucide-react";
import {
    fixedExpenseService,
    type FixedExpense,
} from "../../services/fixed-expense.service";
import type { Category } from "../../services/category.service";
import type { Account } from "../../types";
import { toast } from "sonner";

interface FixedExpenseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    expenseToEdit: FixedExpense | null;
    categories: Category[];
    accounts: Account[];
}

const formSchema = z.object({
    description: z.string().min(1, "Descrição é obrigatória"),
    amount: z
        .number({ required_error: "Valor é obrigatório" })
        .min(0.01, "Valor deve ser maior que 0"),
    dueDay: z.number().min(1).max(31),
    autoCreate: z.boolean().default(true),
    categoryId: z.string().min(1, "Categoria é obrigatória"),
    accountId: z.string().min(1, "Conta é obrigatória"),
});

type FormValues = z.infer<typeof formSchema>;

export function FixedExpenseDialog({
    isOpen,
    onClose,
    onSuccess,
    expenseToEdit,
    categories,
    accounts,
}: FixedExpenseDialogProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: "",
            amount: 0,
            dueDay: 10,
            autoCreate: true,
            categoryId: "",
            accountId: "",
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (expenseToEdit) {
                form.reset({
                    description: expenseToEdit.description,
                    amount: Number(expenseToEdit.amount),
                    dueDay: Number(expenseToEdit.dueDay),
                    autoCreate: expenseToEdit.autoCreate,
                    categoryId: expenseToEdit.categoryId,
                    accountId: expenseToEdit.accountId,
                });
            } else {
                form.reset({
                    description: "",
                    amount: 0,
                    dueDay: 10,
                    autoCreate: true,
                    categoryId: "",
                    accountId: "",
                });
            }
        }
    }, [expenseToEdit, isOpen, form]);

    const handleSubmit = async (values: FormValues) => {
        try {
            const payload = {
                ...values,
                amount: Number(values.amount),
                dueDay: Number(values.dueDay),
            };

            if (expenseToEdit) {
                await fixedExpenseService.update(expenseToEdit.id, payload);
                toast.success("Despesa fixa atualizada!");
            } else {
                await fixedExpenseService.create(payload);
                toast.success("Despesa fixa criada!");
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to save expense", error);
            toast.error("Erro ao salvar despesa fixa");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {expenseToEdit
                            ? "Editar Despesa Fixa"
                            : "Nova Despesa Fixa"}
                    </DialogTitle>
                    <DialogDescription>
                        Configure os detalhes do pagamento recorrente.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Descrição</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ex: Aluguel"
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
                                    field: { value, onChange, ...field },
                                }) => (
                                    <FormItem>
                                        <FormLabel>Valor (R$)</FormLabel>
                                        <FormControl>
                                            <Input
                                                currency
                                                placeholder="0,00"
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
                                name="dueDay"
                                render={({ field: { onChange, ...field } }) => (
                                    <FormItem>
                                        <FormLabel>Dia de Vencimento</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={1}
                                                max={31}
                                                onChange={(e) =>
                                                    onChange(
                                                        parseInt(e.target.value)
                                                    )
                                                }
                                                {...field}
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
                                name="categoryId"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Categoria</FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                onChange={field.onChange}
                                                options={categories.map(
                                                    (c) => ({
                                                        value: c.id,
                                                        label: c.name,
                                                    })
                                                )}
                                                placeholder="Selecione"
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
                                                onChange={field.onChange}
                                                options={accounts.map((a) => ({
                                                    value: a.id,
                                                    label: a.name,
                                                }))}
                                                placeholder="Selecione"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="autoCreate"
                            render={({ field }) => (
                                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                                    <FormControl>
                                        <Checkbox
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                        />
                                    </FormControl>
                                    <div className="space-y-1 leading-none">
                                        <FormLabel>
                                            Criar transação automaticamente
                                        </FormLabel>
                                        <p className="text-sm text-muted-foreground">
                                            O sistema irá gerar a despesa no dia
                                            do vencimento.
                                        </p>
                                    </div>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    "Salvar"
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
