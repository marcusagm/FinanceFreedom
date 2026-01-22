import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";
import type { Category } from "../../services/category.service";
import {
    type FixedExpense,
    fixedExpenseService,
} from "../../services/fixed-expense.service";
import type { Account } from "../../types";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
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
import { CategorySelect } from "../category/CategorySelect";

interface FixedExpenseDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    expenseToEdit: FixedExpense | null;
    categories: Category[];
    accounts: Account[];
}

export function FixedExpenseDialog({
    isOpen,
    onClose,
    onSuccess,
    expenseToEdit,
    categories,
    accounts,
}: FixedExpenseDialogProps) {
    const { t } = useTranslation();

    const formSchema = z.object({
        description: z
            .string()
            .min(1, t("fixedExpenses.form.validation.descRequired")),
        amount: z
            .number({
                required_error: t(
                    "fixedExpenses.form.validation.amountRequired",
                ),
            })
            .min(0.01, t("fixedExpenses.form.validation.amountPositive")),
        dueDay: z.number().min(1).max(31),
        autoCreate: z.boolean().default(true),
        categoryId: z
            .string()
            .min(1, t("fixedExpenses.form.validation.categoryRequired")),
        accountId: z
            .string()
            .min(1, t("fixedExpenses.form.validation.accountRequired")),
    });

    type FormValues = z.infer<typeof formSchema>;

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
                toast.success(t("fixedExpenses.form.updateSuccess"));
            } else {
                await fixedExpenseService.create(payload);
                toast.success(t("fixedExpenses.form.createSuccess"));
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to save expense", error);
            toast.error(t("fixedExpenses.form.saveError"));
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {expenseToEdit
                            ? t("fixedExpenses.form.titleEdit")
                            : t("fixedExpenses.form.titleNew")}
                    </DialogTitle>
                    <DialogDescription>
                        {t("fixedExpenses.form.subtitle")}
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
                                        <FormLabel>
                                            {t(
                                                "fixedExpenses.form.descriptionLabel",
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    "fixedExpenses.form.descriptionPlaceholder",
                                                )}
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
                                            <FormLabel>
                                                {t(
                                                    "fixedExpenses.form.amountLabel",
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    currency
                                                    placeholder={t(
                                                        "common.currencyPlaceholder",
                                                    )}
                                                    value={value}
                                                    onValueChange={(values) => {
                                                        onChange(
                                                            values.floatValue ||
                                                                0,
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
                                    render={({
                                        field: { onChange, ...field },
                                    }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    "fixedExpenses.form.dueDayLabel",
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    max={31}
                                                    onChange={(e) =>
                                                        onChange(
                                                            Number.parseInt(
                                                                e.target.value,
                                                            ),
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
                                            <FormLabel>
                                                {t(
                                                    "fixedExpenses.form.categoryLabel",
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <CategorySelect
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    categories={categories}
                                                    placeholder={t(
                                                        "common.select",
                                                    )}
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
                                            <FormLabel>
                                                {t(
                                                    "fixedExpenses.form.accountLabel",
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    options={accounts.map(
                                                        (a) => ({
                                                            value: a.id,
                                                            label: a.name,
                                                        }),
                                                    )}
                                                    placeholder={t(
                                                        "common.select",
                                                    )}
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
                                                {t(
                                                    "fixedExpenses.form.autoCreateLabel",
                                                )}
                                            </FormLabel>
                                            <p className="text-sm text-muted-foreground">
                                                {t(
                                                    "fixedExpenses.form.autoCreateDesc",
                                                )}
                                            </p>
                                        </div>
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
                                {t("common.cancel")}
                            </Button>
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    t("common.save")
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
