import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";
import { api } from "../../lib/api";
import {
    type Category,
    categoryService,
} from "../../services/category.service";
import {
    createIncomeSource,
    type IncomeSource,
} from "../../services/income.service";
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
import { Select } from "../ui/Select";

interface CreateIncomeSourceDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    itemToEdit?: IncomeSource | null;
}

export function CreateIncomeSourceDialog({
    isOpen,
    onClose,
    onSuccess,
    itemToEdit,
}: CreateIncomeSourceDialogProps) {
    const { t } = useTranslation();

    const formSchema = z.object({
        name: z
            .string()
            .min(1, t("income.sourceDialog.validation.nameRequired")),
        amount: z
            .number()
            .min(0.01, t("income.sourceDialog.validation.amountPositive")),
        payDay: z
            .number()
            .min(1)
            .max(31, t("income.sourceDialog.validation.dayInvalid")),
        categoryId: z.string().optional(),
    });
    const [categories, setCategories] = useState<Category[]>([]);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            amount: 0,
            payDay: 5,
            categoryId: "",
        },
    });

    useEffect(() => {
        categoryService.getAll().then(setCategories);
    }, []);

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
            toast.error(t("common.error") || "Error saving.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {itemToEdit
                            ? t("income.sourceDialog.titleEdit")
                            : t("income.sourceDialog.titleNew")}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        {t("income.sourceDialog.desc")}
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
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t("income.sourceDialog.nameLabel")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    "income.sourceDialog.namePlaceholder"
                                                )}
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
                                render={({
                                    field: { onChange, value, ...field },
                                }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                "income.sourceDialog.amountLabel"
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="0,00"
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

                            <FormField
                                control={form.control}
                                name="payDay"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                "income.sourceDialog.payDayLabel"
                                            )}
                                        </FormLabel>
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
                                            {t(
                                                "income.sourceDialog.categoryLabel"
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value || ""}
                                                options={[
                                                    {
                                                        label: t(
                                                            "income.sourceDialog.noCategory"
                                                        ),
                                                        value: "",
                                                    },
                                                    ...categories.map((c) => ({
                                                        label: c.name,
                                                        value: c.id,
                                                    })),
                                                ]}
                                                onChange={field.onChange}
                                                placeholder={t(
                                                    "income.sourceDialog.selectCategory"
                                                )}
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
                                {t("common.cancel")}
                            </Button>
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting
                                    ? t("common.saving")
                                    : t("common.save")}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
