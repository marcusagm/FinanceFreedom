import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "../lib/api";
import { Modal } from "./ui/Modal";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { Select } from "./ui/Select";
import { ColorInput } from "./ui/ColorInput";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "./ui/Form";

interface Account {
    id: string;
    name: string;
    type: string;
    balance: number;
    color?: string;
}

interface CreateAccountDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    accountToEdit?: Account | null;
}

const ACCOUNT_TYPES = [
    { value: "WALLET", label: "Carteira / Dinheiro" },
    { value: "BANK", label: "Conta Bancária" },
    { value: "INVESTMENT", label: "Investimento" },
];

const formSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    type: z.string().min(1, "Tipo é obrigatório"),
    balance: z.number({ message: "Saldo deve ser um número" }), // Formatted input might need transform?
    // NumericFormat with 'floatValue' gives number.
    color: z.string().regex(/^#[0-9A-F]{6}$/i, "Cor inválida"),
});

export function CreateAccountDialog({
    isOpen,
    onClose,
    onSuccess,
    accountToEdit,
}: CreateAccountDialogProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: "WALLET",
            balance: 0,
            color: "#000000",
        },
    });

    // Reset/Populate form on open/change
    useEffect(() => {
        if (isOpen) {
            if (accountToEdit) {
                form.reset({
                    name: accountToEdit.name,
                    type: accountToEdit.type,
                    balance: parseFloat(String(accountToEdit.balance)),
                    color: accountToEdit.color || "#000000",
                });
            } else {
                form.reset({
                    name: "",
                    type: "WALLET",
                    balance: 0,
                    color: "#000000",
                });
            }
        }
    }, [accountToEdit, isOpen, form]);

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (accountToEdit) {
                await api.patch(`/accounts/${accountToEdit.id}`, values);
            } else {
                await api.post("/accounts", values);
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to save account", error);
            alert("Erro ao salvar conta (API).");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={accountToEdit ? "Editar Conta" : "Nova Conta"}
            footer={
                <>
                    <Button variant="outline" onClick={onClose}>
                        Cancelar
                    </Button>
                    <Button
                        onClick={form.handleSubmit(handleSubmit)}
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting
                            ? "Salvando..."
                            : accountToEdit
                              ? "Salvar Alterações"
                              : "Criar Conta"}
                    </Button>
                </>
            }
        >
            <Form {...form}>
                <form
                    id="create-account-form"
                    onSubmit={form.handleSubmit(handleSubmit)}
                    className="flex flex-col gap-5"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Nome da Conta</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Ex: Minha Carteira"
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
                                        options={ACCOUNT_TYPES}
                                        onChange={field.onChange}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="balance"
                        render={({ field: { onChange, value, ...field } }) => (
                            <FormItem>
                                <FormLabel>Saldo Atual</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="R$ 0,00"
                                        currency
                                        value={value}
                                        onValueChange={(values) => {
                                            // Set float value
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
                        name="color"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Cor</FormLabel>
                                <FormControl>
                                    <ColorInput
                                        value={field.value}
                                        onChange={field.onChange}
                                        onBlur={field.onBlur}
                                        name={field.name}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </form>
            </Form>
        </Modal>
    );
}
