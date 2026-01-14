import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import type { Category } from "../../services/category.service";
import { categoryService } from "../../services/category.service";
import { Button } from "../ui/Button";
import { ColorInput } from "../ui/ColorInput";
import {
    Dialog,
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

interface CategoryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    categoryToEdit: Category | null;
}

const formSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    color: z.string().min(1, "Cor é obrigatória"),
    budgetLimit: z.number().min(0, "O limite deve ser positivo"),
});

type FormValues = z.infer<typeof formSchema>;

export function CategoryDialog({
    isOpen,
    onClose,
    onSuccess,
    categoryToEdit,
}: CategoryDialogProps) {
    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            color: "#3B82F6",
            budgetLimit: 0,
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (categoryToEdit) {
                form.reset({
                    name: categoryToEdit.name,
                    color: categoryToEdit.color,
                    budgetLimit: Number(categoryToEdit.budgetLimit),
                });
            } else {
                form.reset({
                    name: "",
                    color: "#3B82F6",
                    budgetLimit: 0,
                });
            }
        }
    }, [categoryToEdit, isOpen, form]);

    const handleSubmit = async (values: FormValues) => {
        try {
            if (categoryToEdit) {
                await categoryService.update(categoryToEdit.id, values);
                toast.success("Categoria atualizada!");
            } else {
                await categoryService.create(values);
                toast.success("Categoria criada!");
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to save category", error);
            toast.error("Erro ao salvar categoria");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {categoryToEdit ? "Editar Categoria" : "Nova Categoria"}
                    </DialogTitle>
                    <DialogDescription>
                        Configure o nome e a cor da sua categoria.
                    </DialogDescription>
                </DialogHeader>

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
                                    <FormLabel>Nome</FormLabel>
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

                        <FormField
                            control={form.control}
                            name="color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cor</FormLabel>
                                    <FormControl>
                                        <ColorInput
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="budgetLimit"
                            render={({
                                field: { value, onChange, ...field },
                            }) => (
                                <FormItem>
                                    <FormLabel>
                                        Limite de Orçamento (Mensal)
                                    </FormLabel>
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
