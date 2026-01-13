import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "../../lib/api";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/Form";
import { Modal } from "../ui/Modal";
import { useEffect } from "react";

const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    totalAmount: z.number({ message: "Value must be a number" }).min(0),
    interestRate: z.number().min(0, "Interest cannot be negative"),
    minimumPayment: z.number().min(0, "Minimum payment cannot be negative"),
    dueDate: z.number().min(1).max(31, "Day must be between 1 and 31"),
});

export interface Debt {
    id: string;
    name: string;
    totalAmount: number;
    interestRate: number;
    minimumPayment: number;
    dueDate: number;
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

    useEffect(() => {
        if (isOpen) {
            if (debtToEdit) {
                form.reset({
                    name: debtToEdit.name,
                    totalAmount: parseFloat(String(debtToEdit.totalAmount)),
                    interestRate: parseFloat(String(debtToEdit.interestRate)),
                    minimumPayment: parseFloat(
                        String(debtToEdit.minimumPayment)
                    ),
                    dueDate: debtToEdit.dueDate,
                });
            } else {
                form.reset({
                    name: "",
                    totalAmount: 0,
                    interestRate: 0,
                    minimumPayment: 0,
                    dueDate: 10,
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
            alert("Error saving debt.");
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={debtToEdit ? "Edit Debt" : "New Debt"}
            footer={
                <>
                    <Button variant="outline" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        onClick={form.handleSubmit(handleSubmit)}
                        disabled={form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? "Saving..." : "Save"}
                    </Button>
                </>
            }
        >
            <Form {...form}>
                <form className="space-y-4">
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
                                            onValueChange={(values) =>
                                                onChange(values.floatValue || 0)
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
                            name="interestRate"
                            render={({
                                field: { onChange, value, ...field },
                            }) => (
                                <FormItem>
                                    <FormLabel>Monthly Interest (%)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.00%"
                                            value={value || ""}
                                            onChange={(e) =>
                                                onChange(Number(e.target.value))
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
                            name="minimumPayment"
                            render={({
                                field: { onChange, value, ...field },
                            }) => (
                                <FormItem>
                                    <FormLabel>Minimum Payment</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="$ 0.00"
                                            currency
                                            value={value}
                                            onValueChange={(values) =>
                                                onChange(values.floatValue || 0)
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
                            name="dueDate"
                            render={({
                                field: { onChange, value, ...field },
                            }) => (
                                <FormItem>
                                    <FormLabel>Due Day</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            min={1}
                                            max={31}
                                            value={value || ""}
                                            onChange={(e) =>
                                                onChange(Number(e.target.value))
                                            }
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </form>
            </Form>
        </Modal>
    );
}
