import type { UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import type { SettingsFormValues } from "../../pages/Settings";
import type { Category } from "../../services/category.service";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/Card";
import { Checkbox } from "../ui/Checkbox";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/Form";
import { Input } from "../ui/Input";

import { CategorySelect } from "../category/CategorySelect";

interface GeneralSettingsCardProps {
    form: UseFormReturn<SettingsFormValues>;
    categories: Category[];
}

export function GeneralSettingsCard({
    form,
    categories,
}: GeneralSettingsCardProps) {
    const { t } = useTranslation();
    return (
        <Card>
            <CardHeader>
                <CardTitle>{t("settings.general.title")}</CardTitle>
                <CardDescription>
                    {t("settings.general.description")}
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="closingDay"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("settings.general.closingDay")}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        min="1"
                                        max="31"
                                        placeholder="Ex: 5"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(e.target.value)
                                        }
                                    />
                                </FormControl>
                                <p className="text-sm text-muted-foreground">
                                    {t("settings.general.helperClosing")}
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="defaultInterestRate"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("settings.general.interestRate")}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step="0.01"
                                        placeholder="Ex: 2.5"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(e.target.value)
                                        }
                                    />
                                </FormControl>
                                <p className="text-sm text-muted-foreground">
                                    {t("settings.general.helperInterest")}
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="extraMonthlyValue"
                        render={({ field: { value, onChange, ...field } }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("settings.general.extraValue")}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        currency
                                        placeholder="0,00"
                                        value={value}
                                        onValueChange={(values) => {
                                            onChange(values.value);
                                        }}
                                        {...field}
                                    />
                                </FormControl>
                                <p className="text-sm text-muted-foreground">
                                    {t("settings.general.helperExtra")}
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="projectionLimit"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("settings.general.projectionLimit")}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(e.target.value)
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="defaultDailyHours"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("settings.general.dailyHours")}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(e.target.value)
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="defaultRecurrence"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("settings.general.recurrence")}
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) =>
                                            field.onChange(e.target.value)
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="defaultIncomeCategory"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    {t("settings.general.incomeCategory")}
                                </FormLabel>
                                <FormControl>
                                    <CategorySelect
                                        value={field.value}
                                        onChange={field.onChange}
                                        type="INCOME"
                                        categories={categories}
                                        placeholder={t(
                                            "settings.general.selectPlaceholder",
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
                    name="workOnWeekends"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox
                                    checked={field.value === "true"}
                                    onCheckedChange={(checked) =>
                                        field.onChange(
                                            checked ? "true" : "false",
                                        )
                                    }
                                />
                            </FormControl>
                            <FormLabel className="font-normal text-base">
                                {t("settings.general.weekends")}
                            </FormLabel>
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    );
}
