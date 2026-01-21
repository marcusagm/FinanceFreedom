import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { z } from "zod";
import type { CreateCreditCardDTO, CreditCard } from "../../types/credit-card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/Form";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../ui/Dialog";

interface CreditCardDialogProps {
    isOpen: boolean;
    onClose: () => void;
    initialData?: CreditCard;
    onSubmit: (data: CreateCreditCardDTO) => void;
    isLoading?: boolean;
}

export const CreditCardDialog: React.FC<CreditCardDialogProps> = ({
    isOpen,
    onClose,
    initialData,
    onSubmit,
    isLoading,
}) => {
    const { t } = useTranslation();

    const formSchema = z.object({
        name: z.string().min(1, t("creditCard.validation.nameRequired")),
        brand: z.string().min(1, t("creditCard.validation.brandRequired")),
        limit: z
            .number({
                invalid_type_error: t("creditCard.validation.limitRequired"),
            })
            .min(0.01, t("creditCard.validation.limitPositive")),
        closingDay: z
            .number()
            .min(1)
            .max(31, t("creditCard.validation.dayRange")),
        dueDay: z.number().min(1).max(31, t("creditCard.validation.dayRange")),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            brand: "",
            limit: 0,
            closingDay: 1,
            dueDay: 10,
        },
    });

    useEffect(() => {
        if (isOpen) {
            form.reset({
                name: initialData?.name || "",
                brand: initialData?.brand || "",
                limit: initialData?.limit || 0,
                closingDay: initialData?.closingDay || 1,
                dueDay: initialData?.dueDay || 10,
            });
        }
    }, [isOpen, initialData, form]);

    const days = Array.from({ length: 31 }, (_, i) => i + 1);

    const handleSubmit = async (data: z.infer<typeof formSchema>) => {
        await onSubmit(data as CreateCreditCardDTO);
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {initialData
                            ? t("creditCard.edit")
                            : t("creditCard.addNew")}
                    </DialogTitle>
                </DialogHeader>
                <DialogBody>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(handleSubmit)}
                            className="space-y-4"
                            id="credit-card-form"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t("common.name")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                data-testid="credit-card-name-input"
                                                placeholder={t(
                                                    "common.namePlaceholder",
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
                                name="brand"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t("creditCard.brand")}
                                        </FormLabel>
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                onChange={field.onChange}
                                                options={[
                                                    {
                                                        value: "Visa",
                                                        label: "Visa",
                                                    },
                                                    {
                                                        value: "Mastercard",
                                                        label: "Mastercard",
                                                    },
                                                    {
                                                        value: "Amex",
                                                        label: "American Express",
                                                    },
                                                    {
                                                        value: "Elo",
                                                        label: "Elo",
                                                    },
                                                    {
                                                        value: "Other",
                                                        label: "Other",
                                                    },
                                                ]}
                                                placeholder={t(
                                                    "creditCard.selectBrand",
                                                )}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="limit"
                                render={({
                                    field: {
                                        onChange,
                                        value,
                                        ref,
                                        name,
                                        onBlur,
                                    },
                                }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t("creditCard.limit")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                currency
                                                placeholder="R$ 0,00"
                                                value={value}
                                                onValueChange={(values) => {
                                                    onChange(
                                                        values.floatValue || 0,
                                                    );
                                                }}
                                                name={name}
                                                ref={ref}
                                                onBlur={onBlur}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-2 gap-4">
                                <FormField
                                    control={form.control}
                                    name="closingDay"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t("creditCard.closingDay")}
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={String(field.value)}
                                                    onChange={(val) =>
                                                        field.onChange(
                                                            Number(val),
                                                        )
                                                    }
                                                    options={days.map((d) => ({
                                                        value: String(d),
                                                        label: String(d),
                                                    }))}
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
                                    name="dueDay"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t("creditCard.dueDay")}
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={String(field.value)}
                                                    onChange={(val) =>
                                                        field.onChange(
                                                            Number(val),
                                                        )
                                                    }
                                                    options={days.map((d) => ({
                                                        value: String(d),
                                                        label: String(d),
                                                    }))}
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
                        </form>
                    </Form>
                </DialogBody>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>
                        {t("common.cancel")}
                    </Button>
                    <Button
                        type="submit"
                        disabled={isLoading}
                        form="credit-card-form"
                    >
                        {isLoading ? t("common.saving") : t("common.save")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
