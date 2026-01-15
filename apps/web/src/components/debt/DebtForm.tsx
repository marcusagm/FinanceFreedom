import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
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

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    totalAmount: z.number({ message: "Value must be a number" }).min(0),
    interestRate: z.number().min(0, "Interest cannot be negative"),
    minimumPayment: z.number().min(0, "Minimum payment cannot be negative"),
    dueDate: z.number().min(1).max(31, "Day must be between 1 and 31"),
    installmentsTotal: z.number().optional(),
    installmentsPaid: z.number().default(0),
    firstInstallmentDate: z.string().optional(), // Using string for date input
});

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
                    Number.parseFloat(calculatedPayment.toFixed(2))
                );
            }
        }
    }, [totalAmount, installmentsTotal, form]);

    useEffect(() => {
        if (isOpen) {
            if (debtToEdit) {
                form.reset({
                    name: debtToEdit.name,
                    totalAmount: Number.parseFloat(
                        String(debtToEdit.totalAmount)
                    ),
                    interestRate: Number.parseFloat(
                        String(debtToEdit.interestRate)
                    ),
                    minimumPayment: Number.parseFloat(
                        String(debtToEdit.minimumPayment)
                    ),
                    dueDate: debtToEdit.dueDate,
                    installmentsTotal: debtToEdit.installmentsTotal,
                    installmentsPaid: debtToEdit.installmentsPaid,
                    firstInstallmentDate: debtToEdit.firstInstallmentDate
                        ? new Date(debtToEdit.firstInstallmentDate)
                              .toISOString()
                              .split("T")[0]
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
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to save debt", error);
            // alert("Error saving debt."); // Ideally use toast
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {debtToEdit ? "Edit Debt" : "New Debt"}
                    </DialogTitle>
                    <DialogDescription className="sr-only">
                        Fill in the details to save the debt.
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
                                        <FormLabel>Debt Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="Ex: Credit Card"
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
                                            <FormLabel>Total Balance</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="$ 0.00"
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
                                                                "installmentsTotal"
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
                                                                    ).toFixed(2)
                                                                );
                                                            // Loop prevention
                                                            const currentPayment =
                                                                form.getValues(
                                                                    "minimumPayment"
                                                                );
                                                            if (
                                                                Math.abs(
                                                                    newPayment -
                                                                        currentPayment
                                                                ) > 0.05
                                                            ) {
                                                                form.setValue(
                                                                    "minimumPayment",
                                                                    newPayment
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
                                                Monthly Interest (%)
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="0.00%"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            Number(
                                                                e.target.value
                                                            )
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
                                                Installment Value (Min Payment)
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
                                                                "installmentsTotal"
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
                                                                    ).toFixed(2)
                                                                );
                                                            // Loop prevention
                                                            const currentTotal =
                                                                form.getValues(
                                                                    "totalAmount"
                                                                );
                                                            if (
                                                                Math.abs(
                                                                    newTotal -
                                                                        currentTotal
                                                                ) > 0.05
                                                            ) {
                                                                form.setValue(
                                                                    "totalAmount",
                                                                    newTotal
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
                                            <FormLabel>Due Day</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    min={1}
                                                    max={31}
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            Number(
                                                                e.target.value
                                                            )
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
                                                Total Installments
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="e.g. 12"
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
                                                                    "totalAmount"
                                                                );
                                                            const currentPayment =
                                                                form.getValues(
                                                                    "minimumPayment"
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
                                                                            2
                                                                        )
                                                                    );
                                                                if (
                                                                    Math.abs(
                                                                        newPayment -
                                                                            currentPayment
                                                                    ) > 0.05
                                                                ) {
                                                                    form.setValue(
                                                                        "minimumPayment",
                                                                        newPayment
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
                                                                            2
                                                                        )
                                                                    );
                                                                if (
                                                                    Math.abs(
                                                                        newTotal -
                                                                            currentTotal
                                                                    ) > 0.05
                                                                ) {
                                                                    form.setValue(
                                                                        "totalAmount",
                                                                        newTotal
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
                                                Paid Installments
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="e.g. 0"
                                                    {...field}
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            Number(
                                                                e.target.value
                                                            )
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
                                                First Installment Date
                                            </FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    date={
                                                        field.value
                                                            ? new Date(
                                                                  field.value
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
                            </div>
                        </DialogBody>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting
                                    ? "Saving..."
                                    : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
