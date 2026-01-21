import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as z from "zod";
import { api } from "../../lib/api";
import type { Category } from "../../services/category.service";
import type { Account, Transaction } from "../../types";
import type { CreditCard } from "../../types/credit-card";
import { PersonSelect } from "../person/PersonSelect";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
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
import { Select } from "../ui/Select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/Tabs";

interface NewTransactionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    accounts: Account[];
    creditCards: CreditCard[];
    categories: Category[];
    initialData?: Transaction | null;
}

export function NewTransactionDialog({
    isOpen,
    onClose,
    onSuccess,
    accounts = [],
    creditCards = [],
    categories = [],
    initialData,
}: NewTransactionDialogProps) {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState("account");

    // Filter out accounts that belong to credit cards
    const bankAccounts = accounts.filter(
        (acc) => !creditCards.some((cc) => cc.accountId === acc.id),
    );

    const formSchema = z.object({
        description: z
            .string()
            .min(1, t("transactions.split.validation.descRequired")),
        amount: z
            .number({
                message: t("transactions.split.validation.amountPositive"),
            })
            .min(0.01, t("transactions.split.validation.amountPositive")),
        type: z.enum(["INCOME", "EXPENSE"]),
        date: z.string().min(1, t("auth.validation.dateRequired")),
        accountId: z
            .string()
            .min(1, t("transactions.split.validation.accountRequired")),
        creditCardId: z.string().optional(),
        categoryId: z.string().optional(),
        isRecurring: z.boolean().optional(),
        repeatCount: z.number().optional(),
        totalInstallments: z.number().optional(),
        personId: z.string().optional(),
        isLoan: z.boolean().optional(),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: "",
            amount: 0,
            type: "EXPENSE",
            date: format(new Date(), "yyyy-MM-dd"),
            accountId: "",
            creditCardId: "",
            categoryId: "",
            isRecurring: false,
            repeatCount: 12,
            totalInstallments: 1,
            personId: "",
            isLoan: false,
        },
    });

    const isRecurring = form.watch("isRecurring");
    const type = form.watch("type");
    const personId = form.watch("personId");

    const filteredCategories = categories.filter((c) => {
        const catType = c.type || "EXPENSE";
        return catType === type;
    });

    useEffect(() => {
        const currentCategoryId = form.getValues("categoryId");
        if (currentCategoryId) {
            const isValid = filteredCategories.find(
                (c) => c.id === currentCategoryId,
            );
            if (!isValid) {
                form.setValue("categoryId", "");
            }
        }
    }, [type, filteredCategories, form]);

    useEffect(() => {
        if (!personId && form.getValues("isLoan")) {
            form.setValue("isLoan", false);
        }
    }, [personId, form]);

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                const isCreditCard = !!initialData.creditCardId;
                setActiveTab(isCreditCard ? "credit_card" : "account");

                form.reset({
                    description: initialData.description,
                    amount: Number(initialData.amount),
                    type: initialData.type,
                    date: initialData.date
                        ? String(initialData.date).split("T")[0]
                        : format(new Date(), "yyyy-MM-dd"),
                    accountId: initialData.accountId,
                    creditCardId: initialData.creditCardId || "",
                    categoryId:
                        initialData.categoryId || initialData.category || "",
                    isRecurring: initialData.isRecurring || false,
                    repeatCount: initialData.repeatCount || 12,
                    totalInstallments: initialData.totalInstallments || 1,
                    personId: initialData.personId || "",
                    isLoan: initialData.isLoan || false,
                });
            } else {
                setActiveTab("account");
                form.reset({
                    description: "",
                    amount: 0,
                    type: "EXPENSE",
                    date: format(new Date(), "yyyy-MM-dd"),
                    accountId:
                        bankAccounts.length > 0 ? bankAccounts[0].id : "",
                    creditCardId: "",
                    categoryId: "",
                    isRecurring: false,
                    repeatCount: 12,
                    totalInstallments: 1,
                    personId: "",
                    isLoan: false,
                });
            }
        }
    }, [isOpen, initialData, form]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        if (value === "account") {
            form.setValue("creditCardId", "");
            const currentAcc = form.getValues("accountId");
            if (!bankAccounts.some((a) => a.id === currentAcc)) {
                form.setValue(
                    "accountId",
                    bankAccounts.length > 0 ? bankAccounts[0].id : "",
                    { shouldValidate: true },
                );
            }
            form.setValue("totalInstallments", 1);
        } else {
            form.setValue("isRecurring", false);
            const currentCardId = form.getValues("creditCardId");
            if (!currentCardId && creditCards.length > 0) {
                const firstCard = creditCards[0];
                form.setValue("creditCardId", firstCard.id, {
                    shouldValidate: true,
                });
                form.setValue("accountId", firstCard.accountId, {
                    shouldValidate: true,
                });
            }
        }
    };

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const selectedCategory = categories.find(
                (c) => c.id === values.categoryId,
            );
            const payload = {
                ...values,
                category: selectedCategory ? selectedCategory.name : undefined,
                creditCardId:
                    activeTab === "credit_card"
                        ? values.creditCardId
                        : undefined,
                totalInstallments:
                    activeTab === "credit_card"
                        ? values.totalInstallments
                        : undefined,
                isRecurring:
                    activeTab === "account" ? values.isRecurring : false,
                repeatCount:
                    activeTab === "account" ? values.repeatCount : undefined,
                personId: values.personId || undefined,
                isLoan: values.isLoan,
            };

            if (initialData) {
                await api.patch(`/transactions/${initialData.id}`, payload);
            } else {
                await api.post("/transactions", payload);
            }
            onSuccess();
            onClose();
        } catch (error) {
            console.error("Failed to save transaction", error);
            alert("Erro ao salvar transação.");
        }
    };

    const transactionTypes = [
        { value: "INCOME", label: t("categories.typeIncome") },
        { value: "EXPENSE", label: t("categories.typeExpense") },
    ];

    const accountOptions = bankAccounts.map((acc) => ({
        value: acc.id,
        label: acc.name,
    }));

    const creditCardOptions = creditCards.map((cc) => ({
        value: cc.id,
        label: cc.name,
    }));

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {initialData
                            ? t("transactions.editTitle")
                            : t("transactions.createTitle")}
                    </DialogTitle>
                    <DialogDescription>
                        {t("transactions.details")}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="flex flex-col flex-1 min-h-0"
                    >
                        <DialogBody className="space-y-4">
                            <Tabs
                                defaultValue="account"
                                value={activeTab}
                                onValueChange={handleTabChange}
                                className="w-full"
                            >
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="account">
                                        {t("common.account") || "Account"}
                                    </TabsTrigger>{" "}
                                    {/* Using generic translation or fallback */}
                                    <TabsTrigger value="credit_card">
                                        {t("common.creditCard") ||
                                            "Credit Card"}
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent
                                    value="account"
                                    className="mt-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
                                ></TabsContent>
                                <TabsContent
                                    value="credit_card"
                                    className="mt-0 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 animate-in fade-in slide-in-from-bottom-2 duration-300"
                                ></TabsContent>
                            </Tabs>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t("transactions.descLabel")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    "transactions.descPlaceholder",
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
                                        field: { onChange, value, ...field },
                                    }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t("transactions.table.amount")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="R$ 0,00"
                                                    currency
                                                    value={value || ""}
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
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t("accounts.typeLabel")}
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value}
                                                    options={transactionTypes}
                                                    onChange={field.onChange}
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
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                            <FormLabel>
                                                {t("transactions.dateLabel")}
                                            </FormLabel>
                                            <FormControl>
                                                <DatePicker
                                                    date={
                                                        field.value
                                                            ? new Date(
                                                                  field.value +
                                                                      "T00:00:00",
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
                                                                : "",
                                                        )
                                                    }
                                                    className="w-full"
                                                    placeholder={t(
                                                        "transactions.selectDate",
                                                    )}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div>
                                    <div
                                        className={
                                            activeTab === "account"
                                                ? ""
                                                : "hidden"
                                        }
                                    >
                                        <FormField
                                            control={form.control}
                                            name="accountId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        {t(
                                                            "transactions.table.account",
                                                        )}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            value={field.value}
                                                            options={
                                                                accountOptions
                                                            }
                                                            onChange={
                                                                field.onChange
                                                            }
                                                            placeholder={t(
                                                                "transactions.filters.accountPlaceholder",
                                                            )}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div
                                        className={
                                            activeTab === "credit_card"
                                                ? ""
                                                : "hidden"
                                        }
                                    >
                                        <FormField
                                            control={form.control}
                                            name="creditCardId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        {t(
                                                            "common.creditCard",
                                                        ) || "Credit Card"}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Select
                                                            value={
                                                                field.value ||
                                                                ""
                                                            }
                                                            options={
                                                                creditCardOptions
                                                            }
                                                            onChange={(val) => {
                                                                field.onChange(
                                                                    val,
                                                                );
                                                                const card =
                                                                    creditCards.find(
                                                                        (c) =>
                                                                            c.id ===
                                                                            val,
                                                                    );
                                                                if (card) {
                                                                    form.setValue(
                                                                        "accountId",
                                                                        card.accountId,
                                                                        {
                                                                            shouldValidate: true,
                                                                        },
                                                                    );
                                                                }
                                                            }}
                                                            placeholder="Select card"
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <FormField
                                        control={form.control}
                                        name="personId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {type === "EXPENSE"
                                                        ? t(
                                                              "persons.beneficiary",
                                                          )
                                                        : t("persons.title")}
                                                    {t("imap.form.optional")}
                                                </FormLabel>
                                                <FormControl>
                                                    <PersonSelect
                                                        value={field.value}
                                                        onChange={
                                                            field.onChange
                                                        }
                                                        placeholder={t(
                                                            "persons.selectPlaceholder",
                                                        )}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {personId && (
                                        <FormField
                                            control={form.control}
                                            name="isLoan"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={
                                                                field.value
                                                            }
                                                            onCheckedChange={
                                                                field.onChange
                                                            }
                                                            data-testid="is-loan-checkbox"
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal cursor-pointer">
                                                        {t("persons.loanLabel")}
                                                    </FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </div>

                                <FormField
                                    control={form.control}
                                    name="categoryId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t(
                                                    "transactions.categoryOptional",
                                                )}
                                            </FormLabel>
                                            <FormControl>
                                                <Select
                                                    value={field.value || ""}
                                                    options={[
                                                        {
                                                            label: t(
                                                                "common.noCategory",
                                                            ),
                                                            value: "",
                                                        },
                                                        ...filteredCategories.map(
                                                            (c) => ({
                                                                label: c.name,
                                                                value: c.id,
                                                            }),
                                                        ),
                                                    ]}
                                                    onChange={field.onChange}
                                                    placeholder={t(
                                                        "transactions.selectCategory",
                                                    )}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {!initialData && activeTab === "account" && (
                                <div className="space-y-4 rounded-lg border p-4">
                                    <div className="flex flex-col gap-4">
                                        <FormField
                                            control={form.control}
                                            name="isRecurring"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={
                                                                field.value
                                                            }
                                                            onCheckedChange={
                                                                field.onChange
                                                            }
                                                        />
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel className="w-auto cursor-pointer font-normal">
                                                            {t(
                                                                "transactions.recurrence.label",
                                                            )}
                                                        </FormLabel>
                                                    </div>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {isRecurring && (
                                        <FormField
                                            control={form.control}
                                            name="repeatCount"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>
                                                        {t(
                                                            "transactions.recurrence.count",
                                                        )}
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            {...field}
                                                            onChange={(e) =>
                                                                field.onChange(
                                                                    Number(
                                                                        e.target
                                                                            .value,
                                                                    ),
                                                                )
                                                            }
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    )}
                                </div>
                            )}

                            {activeTab === "credit_card" && (
                                <div className="rounded-lg border p-4">
                                    <FormField
                                        control={form.control}
                                        name="totalInstallments"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {t(
                                                        "transactions.installments",
                                                    )}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        placeholder="1x"
                                                        {...field}
                                                        onChange={(e) => {
                                                            const val =
                                                                parseInt(
                                                                    e.target
                                                                        .value,
                                                                );
                                                            field.onChange(
                                                                isNaN(val)
                                                                    ? undefined
                                                                    : val,
                                                            );
                                                        }}
                                                        value={
                                                            field.value || ""
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}
                        </DialogBody>

                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={onClose}
                                type="button"
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
