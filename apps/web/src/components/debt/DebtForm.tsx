import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";
import { api } from "../../lib/api";
import { Button } from "../ui/Button";
import { DatePicker } from "../ui/DatePicker";
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
import { toast } from "sonner"; // Assuming sonner is used as in other components

export interface Debt {
    id: string;
    name: string;
    totalAmount: number;
    interestRate: number;
    minimumPayment: number;
    dueDate: number;
    installmentsTotal?: number;
    installmentsPaid?: number;
    firstInstallmentDate?: string;
}

interface DebtFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    debtToEdit?: Debt | null;
}

export function DebtForm({
    isOpen,
    onClose,
    onSuccess,
    debtToEdit,
}: DebtFormProps) {
    const { t } = useTranslation();

    const formSchema = z.object({
        name: z.string().min(1, t("debts.form.validation.nameRequired")),
        totalAmount: z
            .number({ message: t("debts.form.validation.amountNumber") })
            .min(0),
        interestRate: z
            .number()
            .min(0, t("debts.form.validation.interestPositive")),
        minimumPayment: z
            .number()
            .min(0, t("debts.form.validation.paymentPositive")),
        dueDate: z.number().min(1).max(31, t("debts.form.validation.dayRange")),
        installmentsTotal: z.number().optional(),
        installmentsPaid: z.number().default(0),
        firstInstallmentDate: z.string().optional(), // Using string for date input
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            totalAmount: 0,
            interestRate: 0,
            minimumPayment: 0,
            dueDate: 10,
        },
    });

    // Calculation Logic
    const totalAmount = form.watch("totalAmount");
    const installmentsTotal = form.watch("installmentsTotal");
    const minimumPayment = form.watch("minimumPayment");

    // Forward: Total / Installments -> Payment
    useEffect(() => {
        if (totalAmount > 0 && installmentsTotal && installmentsTotal > 0) {
            const calculatedPayment = totalAmount / installmentsTotal;
            // Only update if difference is significant to avoid loops/rounding jitter
            if (Math.abs(calculatedPayment - minimumPayment) > 0.05) {
                form.setValue(
                    "minimumPayment",
                    Number.parseFloat(calculatedPayment.toFixed(2)),
                );
            }
        }
    }, [totalAmount, installmentsTotal, form, minimumPayment]);

    useEffect(() => {
        if (isOpen) {
            if (debtToEdit) {
                form.reset({
                    name: debtToEdit.name,
                    totalAmount: Number.parseFloat(
                        String(debtToEdit.totalAmount),
                    ),
                    interestRate: Number.parseFloat(
                        String(debtToEdit.interestRate),
                    ),
                    minimumPayment: Number.parseFloat(
                        String(debtToEdit.minimumPayment),
                    ),
                    dueDate: debtToEdit.dueDate,
                    installmentsTotal: debtToEdit.installmentsTotal,
                    installmentsPaid: debtToEdit.installmentsPaid,
                    firstInstallmentDate: debtToEdit.firstInstallmentDate
                        ? String(debtToEdit.firstInstallmentDate).split("T")[0]
                        : undefined,
                });
            } else {
                form.reset({
                    name: "",
                    totalAmount: 0,
                    interestRate: 0,
                    minimumPayment: 0,
                    dueDate: 10,
                    installmentsTotal: undefined,
                    installmentsPaid: 0,
                    firstInstallmentDate: undefined,
                });
            }
        }
    }, [isOpen, debtToEdit, form]);

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (debtToEdit) {
                await api.patch(`/debts/${debtToEdit.id}`, values);
            } else {
                await api.post("/debts", values);
            }
            toast.success(t("debts.form.saveSuccess"));
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to save debt", error);
            // alert("Error saving debt."); // Ideally use toast
            toast.error(t("debts.form.saveError"));
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {debtToEdit
                            ? t("debts.form.titleEdit")
                            : t("debts.form.titleNew")}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        {t("debts.form.subtitle")}
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
                                            {t("debts.form.nameLabel")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    "debts.form.namePlaceholder",
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
                                    name="totalAmount"
                                    render={({
                                        field: { onChange, value, ...field },
                                    }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t("debts.form.totalLabel")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t(
                                                        "common.currencyPlaceholder",
                                                    )}
                                                    currency
                                                    value={value}
                                                    onValueChange={(values) => {
                                                        const newTotal =
                                                            values.floatValue ||
                                                            0;
                                                        onChange(newTotal);

                                                        // Calc Payment: Total / Inst
                                                        const installs =
                                                            form.getValues(
                                                                "installmentsTotal",
                                                            );
                                                        if (
                                                            installs &&
                                                            installs > 0
                                                        ) {
                                                            const newPayment =
                                                                Number.parseFloat(
                                                                    (
                                                                        newTotal /
                                                                        installs
                                                                    ).toFixed(
                                                                        2,
                                                                    ),
                                                                );
                                                            // Loop prevention
                                                            const currentPayment =
                                                                form.getValues(
                                                                    "minimumPayment",
                                                                );
                                                            if (
                                                                Math.abs(
                                                                    newPayment -
                                                                        currentPayment,
                                                                ) > 0.05
                                                            ) {
                                                                form.setValue(
                                                                    "minimumPayment",
                                                                    newPayment,
                                                                );
                                                            }
                                                        }
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
                                    name="interestRate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t("debts.form.interestLabel")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder={t(
                                                        "common.percentPlaceholder",
                                                    )}
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
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
                                    name="minimumPayment"
                                    render={({
                                        field: { onChange, value, ...field },
                                    }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    "debts.form.minPaymentLabel",
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="$ 0.00"
                                                    currency
                                                    value={value}
                                                    onValueChange={(values) => {
                                                        const newPayment =
                                                            values.floatValue ||
                                                            0;
                                                        onChange(newPayment);

                                                        // Calc Total: Payment * Inst
                                                        const installs =
                                                            form.getValues(
                                                                "installmentsTotal",
                                                            );
                                                        if (
                                                            installs &&
                                                            installs > 0
                                                        ) {
                                                            const newTotal =
                                                                Number.parseFloat(
                                                                    (
                                                                        newPayment *
                                                                        installs
                                                                    ).toFixed(
                                                                        2,
                                                                    ),
                                                                );
                                                            // Loop prevention
                                                            const currentTotal =
                                                                form.getValues(
                                                                    "totalAmount",
                                                                );
                                                            if (
                                                                Math.abs(
                                                                    newTotal -
                                                                        currentTotal,
                                                                ) > 0.05
                                                            ) {
                                                                form.setValue(
                                                                    "totalAmount",
                                                                    newTotal,
                                                                );
                                                            }
                                                        }
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
                                    name="dueDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t("debts.form.dueDayLabel")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    max={31}
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
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
                                    name="installmentsTotal"
                                    render={({
                                        field: { onChange, value, ...field },
                                    }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    "debts.form.installmentsTotalLabel",
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder={t(
                                                        "common.numberExample",
                                                    )}
                                                    value={value || ""}
                                                    onChange={(e) => {
                                                        const val =
                                                            e.target.value;
                                                        const newInstalls = val
                                                            ? Number(val)
                                                            : undefined;
                                                        onChange(newInstalls);

                                                        if (
                                                            newInstalls &&
                                                            newInstalls > 0
                                                        ) {
                                                            const currentTotal =
                                                                form.getValues(
                                                                    "totalAmount",
                                                                );
                                                            const currentPayment =
                                                                form.getValues(
                                                                    "minimumPayment",
                                                                );

                                                            // Prioritize mapping: If Total > 0, calc Payment.
                                                            if (
                                                                currentTotal > 0
                                                            ) {
                                                                const newPayment =
                                                                    Number.parseFloat(
                                                                        (
                                                                            currentTotal /
                                                                            newInstalls
                                                                        ).toFixed(
                                                                            2,
                                                                        ),
                                                                    );
                                                                if (
                                                                    Math.abs(
                                                                        newPayment -
                                                                            currentPayment,
                                                                    ) > 0.05
                                                                ) {
                                                                    form.setValue(
                                                                        "minimumPayment",
                                                                        newPayment,
                                                                    );
                                                                }
                                                            } else if (
                                                                currentPayment >
                                                                0
                                                            ) {
                                                                const newTotal =
                                                                    Number.parseFloat(
                                                                        (
                                                                            currentPayment *
                                                                            newInstalls
                                                                        ).toFixed(
                                                                            2,
                                                                        ),
                                                                    );
                                                                if (
                                                                    Math.abs(
                                                                        newTotal -
                                                                            currentTotal,
                                                                    ) > 0.05
                                                                ) {
                                                                    form.setValue(
                                                                        "totalAmount",
                                                                        newTotal,
                                                                    );
                                                                }
                                                            }
                                                        }
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
                                    name="installmentsPaid"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    "debts.form.installmentsPaidLabel",
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder={t(
                                                        "common.zeroPlaceholder",
                                                    )}
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            Number(
                                                                e.target.value,
                                                            ),
                                                        )
                                                    }
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
                                    name="firstInstallmentDate"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t("debts.form.firstDateLabel")}
                                            </FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    date={
                                                        field.value
                                                            ? new Date(
                                                                  field.value,
                                                              )
                                                            : undefined
                                                    }
                                                    setDate={(date) =>
                                                        field.onChange(
                                                            date
                                                                ? format(
                                                                      date,
                                                                      "yyyy-MM-dd",
                                                                  )
                                                                : undefined,
                                                        )
                                                    }
                                                    className="w-full"
                                                    placeholder={t(
                                                        "common.selectDate",
                                                    )}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
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
