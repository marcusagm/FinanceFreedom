import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Modal } from "../ui/Modal";
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
import { createWorkUnit, type WorkUnit } from "../../services/income.service";
import { api } from "../../lib/api";

interface CreateWorkUnitDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    itemToEdit?: WorkUnit | null;
}

const formSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    defaultPrice: z.number().min(0.01, "Preço deve ser maior que zero"),
    estimatedTime: z.number().min(1, "Tempo inválido"),
});

export function CreateWorkUnitDialog({
    isOpen,
    onClose,
    onSuccess,
    itemToEdit,
}: CreateWorkUnitDialogProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            defaultPrice: 0,
            estimatedTime: 1,
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (itemToEdit) {
                form.reset({
                    name: itemToEdit.name,
                    defaultPrice: Number(itemToEdit.defaultPrice),
                    estimatedTime: Number(itemToEdit.estimatedTime),
                });
            } else {
                form.reset({
                    name: "",
                    defaultPrice: 0,
                    estimatedTime: 1,
                });
            }
        }
    }, [isOpen, itemToEdit, form]);

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (itemToEdit) {
                await api.patch(`/income/work-units/${itemToEdit.id}`, values);
            } else {
                await createWorkUnit(values);
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
            title={itemToEdit ? "Editar Serviço / Job" : "Novo Serviço / Job"}
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
                                <FormLabel>Nome do Serviço</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ex: Logo Design"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="defaultPrice"
                        render={({ field: { onChange, value, ...field } }) => (
                            <FormItem>
                                <FormLabel>Preço Base (R$)</FormLabel>
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
                        name="estimatedTime"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tempo Estimado (Horas)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="1"
                                        placeholder="Hrs"
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
