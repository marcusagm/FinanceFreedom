import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { api } from "../../lib/api";
import {
    type IncomeSource,
    createIncomeSource,
} from "../../services/income.service";
import {
    type Category,
    categoryService,
} from "../../services/category.service";
import { Button } from "../ui/Button";
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
import { Modal } from "../ui/Modal";

interface CreateIncomeSourceDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    itemToEdit?: IncomeSource | null;
}

const formSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    amount: z.number().min(0.01, "Valor deve ser maior que zero"),
    payDay: z.number().min(1, "Dia inválido").max(31, "Dia inválido"),
    categoryId: z.string().optional(),
});

export function CreateIncomeSourceDialog({
    isOpen,
    onClose,
    onSuccess,
    itemToEdit,
}: CreateIncomeSourceDialogProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            amount: 0,
            payDay: 5,
            categoryId: "",
        },
    });

    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        if (isOpen) {
            categoryService.getAll().then((data) => {
                setCategories(
                    data.filter((c: Category) => c.type === "INCOME")
                );
            });
        }
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            if (itemToEdit) {
                form.reset({
                    name: itemToEdit.name,
                    amount: Number(itemToEdit.amount),
                    payDay: Number(itemToEdit.payDay),
                    categoryId: itemToEdit.categoryId || "",
                });
            } else {
                form.reset({
                    name: "",
                    amount: 0,
                    payDay: 5,
                    categoryId: "",
                });
            }
        }
    }, [isOpen, itemToEdit, form]);

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (itemToEdit) {
                await api.patch(`/income/sources/${itemToEdit.id}`, values);
            } else {
                await createIncomeSource(values);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert("Erro ao salvar. Tente novamente.");
        }
    };

    return (
        <Modal
            title={itemToEdit ? "Editar Fonte de Renda" : "Nova Fonte de Renda"}
            isOpen={isOpen}
            onClose={onClose}
        >
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="space-y-4"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome (ex: Salário)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Nome da fonte"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field: { onChange, value, ...field } }) => (
                            <FormItem>
                                <FormLabel>Valor (R$)</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="0,00"
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
                        name="payDay"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dia do Pagamento</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="1"
                                        max="31"
                                        placeholder="5"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(
                                                Number(e.target.value)
                                            )
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Categoria de Renda (Opcional)
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        label="Categoria"
                                        value={field.value || ""}
                                        options={[
                                            {
                                                label: "Sem categoria",
                                                value: "",
                                            },
                                            ...categories.map((c) => ({
                                                label: c.name,
                                                value: c.id,
                                            })),
                                        ]}
                                        onChange={field.onChange}
                                        placeholder="Selecione uma categoria"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            className="mr-2"
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
                    </div>
                </form>
            </Form>
        </Modal>
    );
}
