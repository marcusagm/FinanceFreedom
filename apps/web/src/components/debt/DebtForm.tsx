import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "../../lib/api";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/Form";
import { Modal } from "../ui/Modal";
import { useEffect } from "react";

const formSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    totalAmount: z.number({ message: "Valor deve ser um número" }).min(0),
    interestRate: z.number().min(0, "Juros não pode ser negativo"),
    minimumPayment: z.number().min(0, "Pagamento mínimo não pode ser negativo"),
    dueDate: z.number().min(1).max(31, "Dia deve ser entre 1 e 31"),
});

export interface Debt {
    id: string;
    name: string;
    totalAmount: number;
    interestRate: number;
    minimumPayment: number;
    dueDate: number;
}

interface DebtFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    debtToEdit?: Debt | null;
}

export function DebtForm({
    isOpen,
    onClose,
    onSuccess,
    debtToEdit,
}: DebtFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            totalAmount: 0,
            interestRate: 0,
            minimumPayment: 0,
            dueDate: 10,
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (debtToEdit) {
                form.reset({
                    name: debtToEdit.name,
                    totalAmount: parseFloat(String(debtToEdit.totalAmount)),
                    interestRate: parseFloat(String(debtToEdit.interestRate)),
                    minimumPayment: parseFloat(
                        String(debtToEdit.minimumPayment)
                    ),
                    dueDate: debtToEdit.dueDate,
                });
            } else {
                form.reset({
                    name: "",
                    totalAmount: 0,
                    interestRate: 0,
                    minimumPayment: 0,
                    dueDate: 10,
                });
            }
        }
    }, [isOpen, debtToEdit, form]);

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (debtToEdit) {
                await api.patch(`/debts/${debtToEdit.id}`, values);
            } else {
                await api.post("/debts", values);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to save debt", error);
            alert("Erro ao salvar dívida.");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={debtToEdit ? "Editar Dívida" : "Nova Dívida"}
            footer={
                <>
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={form.handleSubmit(handleSubmit)}
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? "Salvando..." : "Salvar"}
                    </Button>
                </>
            }
        >
            <Form {...form}>
                <form className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome da Dívida</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ex: Nubank"
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
                            name="totalAmount"
                            render={({
                                field: { onChange, value, ...field },
                            }) => (
                                <FormItem>
                                    <FormLabel>Saldo Devedor</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="R$ 0,00"
                                            currency
                                            value={value}
                                            onValueChange={(values) =>
                                                onChange(values.floatValue || 0)
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="interestRate"
                            render={({
                                field: { onChange, value, ...field },
                            }) => (
                                <FormItem>
                                    <FormLabel>Juros Mensal (%)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00%"
                                            value={value || ""}
                                            onChange={(e) =>
                                                onChange(Number(e.target.value))
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
                            name="minimumPayment"
                            render={({
                                field: { onChange, value, ...field },
                            }) => (
                                <FormItem>
                                    <FormLabel>Pagamento Mínimo</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="R$ 0,00"
                                            currency
                                            value={value}
                                            onValueChange={(values) =>
                                                onChange(values.floatValue || 0)
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="dueDate"
                            render={({
                                field: { onChange, value, ...field },
                            }) => (
                                <FormItem>
                                    <FormLabel>Dia Vencimento</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={31}
                                            value={value || ""}
                                            onChange={(e) =>
                                                onChange(Number(e.target.value))
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
        </Modal>
    );
}
