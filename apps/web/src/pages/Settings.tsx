import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
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
import { PageHeader } from "../components/ui/PageHeader";
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
            toast.error("Erro ao carregar dados");
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
            toast.success("Configurações salvas com sucesso!");
        } catch (error) {
            console.error("Failed to save settings", error);
            toast.error("Erro ao salvar configurações");
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <PageHeader
                title="Configurações do Sistema"
                description="Ajuste os parâmetros globais do Finance Freedom."
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

                        <Card className="opacity-70 pointer-events-none">
                            <CardHeader>
                                <CardTitle>Outras Preferências</CardTitle>
                                <CardDescription>
                                    Funcionalidades de internacionalização em
                                    breve.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="p-4 border rounded-md">
                                    <h4 className="font-semibold text-muted-foreground">
                                        Idioma e Localização
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        Suporte a múltiplos idiomas e moedas.
                                    </p>
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
                                Salvar Configurações
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
}
