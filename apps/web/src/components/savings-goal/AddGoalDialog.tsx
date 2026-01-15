import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { api } from "../../lib/api";
import { Button } from "../ui/Button";
import { DatePicker } from "../ui/DatePicker";
import {
    Dialog,
    DialogBody,
    DialogContent,
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
import type { SavingsGoal } from "./SavingsGoalCard";

interface AddGoalDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    goalToEdit?: SavingsGoal | null;
}

const formSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    targetAmount: z.number().min(0.01, "Valor alvo deve ser positivo"),
    currentAmount: z.number().min(0, "Valor atual não pode ser negativo"),
    deadline: z.string().optional(),
    priority: z.number().int().optional(),
});

export function AddGoalDialog({
    isOpen,
    onClose,
    onSuccess,
    goalToEdit,
}: AddGoalDialogProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            targetAmount: undefined,
            currentAmount: 0,
            priority: 1,
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (goalToEdit) {
                form.reset({
                    name: goalToEdit.name,
                    targetAmount: Number(goalToEdit.targetAmount),
                    currentAmount: Number(goalToEdit.currentAmount),
                    deadline: goalToEdit.deadline
                        ? format(new Date(goalToEdit.deadline), "yyyy-MM-dd")
                        : undefined,
                    priority: goalToEdit.priority || 1,
                });
            } else {
                form.reset({
                    name: "",
                    targetAmount: undefined,
                    currentAmount: 0,
                    deadline: "",
                    priority: 1,
                });
            }
        }
    }, [isOpen, goalToEdit, form]);

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const payload = {
                ...values,
                deadline: values.deadline
                    ? new Date(values.deadline + "T12:00:00").toISOString()
                    : undefined,
            };

            if (goalToEdit) {
                await api.patch(`/savings-goals/${goalToEdit.id}`, payload);
                toast.success("Meta atualizada com sucesso!");
            } else {
                await api.post("/savings-goals", payload);
                toast.success("Meta criada com sucesso!");
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar meta. Tente novamente.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {goalToEdit ? "Editar Meta" : "Nova Meta de Economia"}
                    </DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="flex flex-col flex-1 min-h-0"
                    >
                        <DialogBody className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome da Meta</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: Viagem para Japão"
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
                                    name="targetAmount"
                                    render={({
                                        field: { onChange, value, ...field },
                                    }) => (
                                        <FormItem>
                                            <FormLabel>Valor Alvo</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="R$ 0,00"
                                                    currency
                                                    value={value}
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
                                    name="currentAmount"
                                    render={({
                                        field: { onChange, value, ...field },
                                    }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Valor Atual (Guardado)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="R$ 0,00"
                                                    currency
                                                    value={value}
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
                            </div>

                            <FormField
                                control={form.control}
                                name="deadline"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Prazo (Opcional)</FormLabel>
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
                        </DialogBody>

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
