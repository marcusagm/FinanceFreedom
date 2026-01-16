import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";
import { api } from "../../lib/api";
import { type WorkUnit, createWorkUnit } from "../../services/income.service";
import { Button } from "../ui/Button";
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

interface CreateWorkUnitDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    itemToEdit?: WorkUnit | null;
}

export function CreateWorkUnitDialog({
    isOpen,
    onClose,
    onSuccess,
    itemToEdit,
}: CreateWorkUnitDialogProps) {
    const { t } = useTranslation();

    const formSchema = z.object({
        name: z
            .string()
            .min(1, t("income.workUnitDialog.validation.nameRequired")),
        defaultPrice: z
            .number()
            .min(0.01, t("income.workUnitDialog.validation.pricePositive")),
        estimatedTime: z
            .number()
            .min(1, t("income.workUnitDialog.validation.timeInvalid")),
        taxRate: z
            .number()
            .min(0, t("income.workUnitDialog.validation.taxMin"))
            .max(100, t("income.workUnitDialog.validation.taxMax"))
            .optional()
            .default(0),
    });
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            defaultPrice: 0,
            estimatedTime: 1,
            taxRate: 0,
        },
    });

    useEffect(() => {
        if (isOpen) {
            if (itemToEdit) {
                form.reset({
                    name: itemToEdit.name,
                    defaultPrice: Number(itemToEdit.defaultPrice),
                    estimatedTime: Number(itemToEdit.estimatedTime),
                    taxRate: Number(itemToEdit.taxRate || 0),
                });
            } else {
                form.reset({
                    name: "",
                    defaultPrice: 0,
                    estimatedTime: 1,
                    taxRate: 0,
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
            toast.error(t("common.error") || "Error saving.");
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {itemToEdit
                            ? t("income.workUnitDialog.titleEdit")
                            : t("income.workUnitDialog.titleNew")}
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
                                        <FormLabel>
                                            {t(
                                                "income.workUnitDialog.nameLabel"
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    "income.workUnitDialog.namePlaceholder"
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
                                name="defaultPrice"
                                render={({
                                    field: { onChange, value, ...field },
                                }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                "income.workUnitDialog.priceLabel"
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
                                name="estimatedTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                "income.workUnitDialog.timeLabel"
                                            )}
                                        </FormLabel>
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

                            <FormField
                                control={form.control}
                                name="taxRate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                "income.workUnitDialog.taxLabel"
                                            )}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                placeholder="%"
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
