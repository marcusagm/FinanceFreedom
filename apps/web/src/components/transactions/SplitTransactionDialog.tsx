import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";
import { api } from "../../lib/api";
import type { Transaction } from "../../types";
import { Button } from "../ui/Button";
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

interface SplitTransactionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    transaction: Transaction | null;
}

const createSplitSchema = (t: (key: string) => string) =>
    z.object({
        splits: z
            .array(
                z.object({
                    amount: z
                        .number()
                        .min(
                            0.01,
                            t("transactions.split.validation.amountPositive")
                        ),
                    description: z
                        .string()
                        .min(
                            1,
                            t("transactions.split.validation.descRequired")
                        ),
                    category: z.string().optional(),
                })
            )
            .min(2, t("transactions.split.validation.minSplits")),
    });

export function SplitTransactionDialog({
    isOpen,
    onClose,
    onSuccess,
    transaction,
}: SplitTransactionDialogProps) {
    const { t } = useTranslation();
    const [originalAmount, setOriginalAmount] = useState(0);

    const splitSchema = createSplitSchema(t);

    const form = useForm<z.infer<typeof splitSchema>>({
        resolver: zodResolver(splitSchema),
        defaultValues: {
            splits: [
                { amount: 0, description: "", category: "" },
                { amount: 0, description: "", category: "" },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "splits",
    });

    useEffect(() => {
        if (isOpen && transaction) {
            setOriginalAmount(Number(transaction.amount));
            // Pre-fill first split with remaining? Or just fresh?
            // Let's reset to two empty/partial splits
            const half = Number(transaction.amount) / 2;
            form.reset({
                splits: [
                    {
                        amount: half,
                        description: `${transaction.description} (1)`,
                        category: transaction.category || "",
                    },
                    {
                        amount: Number(transaction.amount) - half,
                        description: `${transaction.description} (2)`,
                        category: transaction.category || "",
                    },
                ],
            });
        }
    }, [isOpen, transaction, form]);

    const handleSubmit = async (values: z.infer<typeof splitSchema>) => {
        if (!transaction) return;

        const totalSplit = values.splits.reduce(
            (sum, item) => sum + item.amount,
            0
        );

        if (Math.abs(totalSplit - originalAmount) > 0.01) {
            form.setError("root", {
                message: t("transactions.split.validation.subtotalMismatch", {
                    total: totalSplit.toFixed(2),
                    original: originalAmount.toFixed(2),
                }),
            });
            return;
        }

        try {
            await api.post(`/transactions/${transaction.id}/split`, {
                splits: values.splits,
            });
            toast.success(t("transactions.split.success"));
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to split transaction", error);
            toast.error(t("transactions.split.error"));
        }
    };

    const currentTotal = form
        .watch("splits")
        .reduce((sum, item) => sum + (item.amount || 0), 0);
    const remaining = originalAmount - currentTotal;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{t("transactions.split.title")}</DialogTitle>
                    <DialogDescription>
                        {t("transactions.split.description", {
                            amount: originalAmount.toFixed(2),
                        })}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="flex flex-col flex-1 min-h-0"
                    >
                        <DialogBody className="space-y-4">
                            <div className="mb-4 p-4 border rounded-lg bg-muted/50">
                                <div className="flex justify-between items-center text-sm font-medium">
                                    <span>
                                        {t("transactions.split.remaining")}:
                                    </span>
                                    <span
                                        className={
                                            remaining === 0
                                                ? "text-emerald-500"
                                                : remaining > 0
                                                ? "text-amber-500"
                                                : "text-rose-500"
                                        }
                                    >
                                        R$ {remaining.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-4">
                                {fields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="grid grid-cols-12 gap-3 items-end border p-3 rounded-md relative"
                                    >
                                        <div className="col-span-3">
                                            <FormField
                                                control={form.control}
                                                name={`splits.${index}.amount`}
                                                render={({
                                                    field: inputField,
                                                }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">
                                                            {t(
                                                                "transactions.table.amount"
                                                            )}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                step="0.01"
                                                                placeholder="0.00"
                                                                {...inputField}
                                                                onChange={(e) =>
                                                                    inputField.onChange(
                                                                        Number.parseFloat(
                                                                            e
                                                                                .target
                                                                                .value
                                                                        ) || 0
                                                                    )
                                                                }
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-5">
                                            <FormField
                                                control={form.control}
                                                name={`splits.${index}.description`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">
                                                            {t(
                                                                "transactions.table.description"
                                                            )}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Descr."
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-3">
                                            <FormField
                                                control={form.control}
                                                name={`splits.${index}.category`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">
                                                            {t(
                                                                "transactions.table.category"
                                                            )}
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Cat."
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-1 pb-2">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => remove(index)}
                                                disabled={fields.length <= 2}
                                                className="h-8 w-8 text-rose-500"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="w-full border-dashed"
                                onClick={() =>
                                    append({
                                        amount: 0,
                                        description: "",
                                        category: "",
                                    })
                                }
                            >
                                <Plus className="w-4 h-4 mr-2" />{" "}
                                {t("transactions.split.addSplit")}
                            </Button>

                            {form.formState.errors.root && (
                                <div className="text-sm font-medium text-destructive">
                                    {form.formState.errors.root.message}
                                </div>
                            )}
                        </DialogBody>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                            >
                                {t("common.cancel")}
                            </Button>
                            <Button
                                type="submit"
                                disabled={
                                    form.formState.isSubmitting ||
                                    Math.abs(remaining) > 0.01
                                }
                            >
                                {form.formState.isSubmitting
                                    ? t("transactions.split.splitting")
                                    : t("transactions.split.confirm")}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
