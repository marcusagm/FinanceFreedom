import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";
import type { Category } from "../../services/category.service";
import { categoryService } from "../../services/category.service";
import { Button } from "../ui/Button";
import { ColorInput } from "../ui/ColorInput";
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

interface CategoryDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    categoryToEdit: Category | null;
}

export function CategoryDialog({
    isOpen,
    onClose,
    onSuccess,
    categoryToEdit,
}: CategoryDialogProps) {
    const { t } = useTranslation();

    const formSchema = z.object({
        name: z.string().min(1, t("auth.validation.nameRequired")),
        color: z.string().min(1, t("common.error")),
        budgetLimit: z.number().min(0, t("common.error")),
        type: z.enum(["EXPENSE", "INCOME"]),
    });

    type FormValues = z.infer<typeof formSchema>;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            color: "#3B82F6",
            budgetLimit: 0,
            type: "EXPENSE",
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (categoryToEdit) {
                form.reset({
                    name: categoryToEdit.name,
                    color: categoryToEdit.color,
                    budgetLimit: Number(categoryToEdit.budgetLimit),
                    type:
                        (categoryToEdit.type as "EXPENSE" | "INCOME") ||
                        "EXPENSE",
                });
            } else {
                form.reset({
                    name: "",
                    color: "#3B82F6",
                    budgetLimit: 0,
                    type: "EXPENSE",
                });
            }
        }
    }, [categoryToEdit, isOpen, form]);

    const handleSubmit = async (values: FormValues) => {
        try {
            if (categoryToEdit) {
                await categoryService.update(categoryToEdit.id, values);
                toast.success(t("common.success"));
            } else {
                await categoryService.create(values);
                toast.success(t("common.success"));
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to save category", error);
            toast.error(t("common.error"));
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {categoryToEdit
                            ? t("categories.editTitle")
                            : t("categories.createTitle")}
                    </DialogTitle>
                    <DialogDescription>
                        {t("categories.configureDesc")}
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
                                            {t("categories.nameLabel")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    "categories.namePlaceholder"
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
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t("accounts.typeLabel")}
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                options={[
                                                    {
                                                        label: t(
                                                            "categories.typeExpense"
                                                        ),
                                                        value: "EXPENSE",
                                                    },
                                                    {
                                                        label: t(
                                                            "categories.typeIncome"
                                                        ),
                                                        value: "INCOME",
                                                    },
                                                ]}
                                                onChange={field.onChange}
                                                placeholder={t(
                                                    "settings.general.selectPlaceholder"
                                                )}
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
                                        <FormLabel>
                                            {t("categories.colorLabel")}
                                        </FormLabel>
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
                                            {form.watch("type") === "INCOME"
                                                ? t(
                                                      "categories.revenueGoalLabel"
                                                  )
                                                : t("categories.budgetLabel")}
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
                                    t("common.save", { defaultValue: "Salvar" })
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
