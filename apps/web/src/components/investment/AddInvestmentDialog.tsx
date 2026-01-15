import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import * as z from "zod";
import { api } from "../../lib/api";
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../ui/Dialog";
import { Button } from "../ui/Button";
import { DatePicker } from "../ui/DatePicker";
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
import type { InvestmentAccount } from "./InvestmentAccountCard";
import { toast } from "sonner";

interface AddInvestmentDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    accountToEdit?: InvestmentAccount | null;
}

const formSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    type: z.string().min(1, "Tipo é obrigatório"),
    balance: z.number({ message: "Saldo inválido" }),
    profitability: z.number().optional(),
    profitabilityType: z.string().optional(),
    maturityDate: z.string().optional(),
    description: z.string().optional(),
});

export function AddInvestmentDialog({
    isOpen,
    onClose,
    onSuccess,
    accountToEdit,
}: AddInvestmentDialogProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: "FIXED_INCOME",
            balance: 0,
            profitability: undefined,
            profitabilityType: undefined,
            maturityDate: "",
            description: "",
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (accountToEdit) {
                form.reset({
                    name: accountToEdit.name,
                    type: accountToEdit.type,
                    balance: Number(accountToEdit.balance),
                    profitability: accountToEdit.profitability
                        ? Number(accountToEdit.profitability)
                        : undefined,
                    profitabilityType:
                        accountToEdit.profitabilityType || undefined,
                    maturityDate: accountToEdit.maturityDate
                        ? format(
                              new Date(accountToEdit.maturityDate),
                              "yyyy-MM-dd"
                          )
                        : undefined,
                    description: accountToEdit.description || "",
                });
            } else {
                form.reset({
                    name: "",
                    type: "FIXED_INCOME",
                    balance: 0,
                    profitability: undefined,
                    profitabilityType: undefined,
                    maturityDate: "",
                    description: "",
                });
            }
        }
    }, [isOpen, accountToEdit, form]);

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const payload = {
                ...values,
                maturityDate: values.maturityDate
                    ? new Date(values.maturityDate + "T12:00:00").toISOString()
                    : undefined,
            };

            if (accountToEdit) {
                await api.patch(
                    `/investment-accounts/${accountToEdit.id}`,
                    payload
                );
                toast.success("Conta atualizada com sucesso!");
            } else {
                await api.post("/investment-accounts", payload);
                toast.success("Conta criada com sucesso!");
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error("Erro ao salvar conta. Tente novamente.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {accountToEdit
                            ? "Editar Conta"
                            : "Nova Conta de Investimento"}
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
                                        <FormLabel>Nome da Conta</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: NuBank Caixinha"
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
                                                onChange={field.onChange}
                                                options={[
                                                    {
                                                        value: "FIXED_INCOME",
                                                        label: "Renda Fixa",
                                                    },
                                                    {
                                                        value: "VARIABLE_INCOME",
                                                        label: "Renda Variável",
                                                    },
                                                    {
                                                        value: "CRYPTO",
                                                        label: "Criptomoedas",
                                                    },
                                                    {
                                                        value: "CASH",
                                                        label: "Caixa / Saldo",
                                                    },
                                                    {
                                                        value: "OTHER",
                                                        label: "Outro",
                                                    },
                                                ]}
                                                placeholder="Selecione o tipo"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="balance"
                                render={({
                                    field: { onChange, value, ...field },
                                }) => (
                                    <FormItem>
                                        <FormLabel>Saldo Atual</FormLabel>
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

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="profitability"
                                    render={({
                                        field: { onChange, value, ...field },
                                    }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Rentabilidade (%)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="Ex: 100"
                                                    value={value || ""}
                                                    onChange={(e) =>
                                                        onChange(
                                                            e.target.value
                                                                ? parseFloat(
                                                                      e.target
                                                                          .value
                                                                  )
                                                                : undefined
                                                        )
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
                                    name="profitabilityType"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Tipo de Rent.</FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value || ""}
                                                    onChange={field.onChange}
                                                    options={[
                                                        {
                                                            value: "CDI",
                                                            label: "% do CDI",
                                                        },
                                                        {
                                                            value: "IPCA",
                                                            label: "IPCA +",
                                                        },
                                                        {
                                                            value: "PRE",
                                                            label: "Prefixado (a.a.)",
                                                        },
                                                        {
                                                            value: "DY",
                                                            label: "Dividend Yield",
                                                        },
                                                        {
                                                            value: "OTHER",
                                                            label: "Outro",
                                                        },
                                                    ]}
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
                                name="maturityDate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Vencimento (Opcional)
                                        </FormLabel>
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
                                                            : undefined
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
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Descrição (Opcional)
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} />
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
