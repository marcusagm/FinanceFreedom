import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import * as z from "zod";
import { GeneralSettingsCard } from "../components/settings/GeneralSettingsCard";
import { ThemeCustomizer } from "../components/settings/ThemeCustomizer";
import { Button } from "../components/ui/Button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../components/ui/Card";
import { Form } from "../components/ui/Form";
import { Label } from "../components/ui/Label";
import { PageHeader } from "../components/ui/PageHeader";
import { Select } from "../components/ui/Select";
import { type Category, categoryService } from "../services/category.service";
import { systemConfigService } from "../services/system-config.service";

const settingsSchema = z.object({
    closingDay: z.string().optional(),
    defaultInterestRate: z.string().optional(),
    extraMonthlyValue: z.string().optional(),
    projectionLimit: z.string().optional(),
    defaultDailyHours: z.string().optional(),
    defaultRecurrence: z.string().optional(),
    defaultIncomeCategory: z.string().optional(),
    workOnWeekends: z.string().optional(),
});

export type SettingsFormValues = z.infer<typeof settingsSchema>;

export function Settings() {
    const { t, i18n } = useTranslation();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    const form = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            closingDay: "",
            defaultInterestRate: "",
            extraMonthlyValue: "",
            projectionLimit: "360",
            defaultDailyHours: "8",
            defaultRecurrence: "12",
            defaultIncomeCategory: "",
            workOnWeekends: "false",
        },
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [configsData, categoriesData] = await Promise.all([
                systemConfigService.getAll(),
                categoryService.getAll(),
            ]);
            form.reset(configsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error("Failed to load settings or categories", error);
            toast.error(t("settings.loadError"));
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (values: SettingsFormValues) => {
        try {
            // Filter out undefined values
            const cleanValues = Object.fromEntries(
                Object.entries(values).filter(
                    ([_, v]) => v !== undefined && v !== null
                )
            ) as Record<string, string>;

            await systemConfigService.setMany(cleanValues);
            toast.success(t("settings.saveSuccess"));
        } catch (error) {
            console.error("Failed to save settings", error);
            toast.error(t("settings.saveError"));
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader
                title={t("settings.title")}
                description={t("settings.description")}
            />

            {loading ? (
                <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSave)}
                        className="space-y-6"
                    >
                        <GeneralSettingsCard
                            form={form}
                            categories={categories}
                        />

                        <ThemeCustomizer />

                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    {t("settings.preferences")}
                                </CardTitle>
                                <CardDescription>
                                    {t("settings.preferences_desc")}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label>{t("settings.language")}</Label>
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm text-muted-foreground">
                                            {t("settings.language_desc")}
                                        </p>
                                        <Select
                                            value={i18n.language}
                                            onChange={(value) =>
                                                i18n.changeLanguage(value)
                                            }
                                            options={[
                                                {
                                                    value: "pt-br",
                                                    label: "Português (BR)",
                                                },
                                                {
                                                    value: "en",
                                                    label: "English (US)",
                                                },
                                            ]}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="flex justify-end">
                            <Button
                                type="submit"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {t("settings.save")}
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
}
