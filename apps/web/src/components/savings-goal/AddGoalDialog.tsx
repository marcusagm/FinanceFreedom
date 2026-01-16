import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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

// Schema created inside component to access t, or keep simple validation here
// For consistency, I will redefine schema inside component
const formSchema = z.object({
    name: z.string().min(1, "Required"),
    targetAmount: z.number().min(0.01, "Required"),
    currentAmount: z.number().min(0, "Required"),
    deadline: z.string().optional(),
    priority: z.number().int().optional(),
});
// Removing this block and moving inside
// Wait, to minimize diff, let's just make it a function or use generic keys if possible.
// But earlier I decided to move it inside.
// Actually, let's keep it here but with generic keys if they don't depend on `t` for variables.
// The keys "Nome é obrigatório" etc. are static. I can use `t` inside component if I move schema.
// Let's remove lines 36-42 and put them in component.

export function AddGoalDialog({
    isOpen,
    onClose,
    onSuccess,
    goalToEdit,
}: AddGoalDialogProps) {
    const { t } = useTranslation();

    const formSchema = z.object({
        name: z.string().min(1, t("auth.validation.nameRequired")), // Reuse or add specific key
        targetAmount: z
            .number()
            .min(0.01, t("transactions.split.validation.amountPositive")),
        currentAmount: z
            .number()
            .min(0, t("transactions.split.validation.amountPositive")),
        deadline: z.string().optional(),
        priority: z.number().int().optional(),
    });

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
                toast.success(t("savingsGoals.add.updateSuccess"));
            } else {
                await api.post("/savings-goals", payload);
                toast.success(t("savingsGoals.add.saveSuccess"));
            }

            onSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            toast.error(t("savingsGoals.add.saveError"));
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {goalToEdit
                            ? t("savingsGoals.add.titleEdit")
                            : t("savingsGoals.add.titleNew")}
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
                                            {t("savingsGoals.add.nameLabel")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    "savingsGoals.add.namePlaceholder"
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
                                    name="targetAmount"
                                    render={({
                                        field: { onChange, value, ...field },
                                    }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    "savingsGoals.add.targetAmount"
                                                )}
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

                                <FormField
                                    control={form.control}
                                    name="currentAmount"
                                    render={({
                                        field: { onChange, value, ...field },
                                    }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    "savingsGoals.add.currentAmount"
                                                )}
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
                                        <FormLabel>
                                            {t("savingsGoals.add.deadline")}
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
                                                            : ""
                                                    )
                                                }
                                                className="w-full"
                                                placeholder={t(
                                                    "transactions.selectDate"
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
