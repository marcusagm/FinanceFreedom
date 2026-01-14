import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/Card";
import { Input } from "../ui/Input";
import { Checkbox } from "../ui/Checkbox";
import { Select } from "../ui/Select";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/Form";
import type { Category } from "../../services/category.service";
import type { UseFormReturn } from "react-hook-form";
import type { SettingsFormValues } from "../../pages/Settings";

interface GeneralSettingsCardProps {
    form: UseFormReturn<SettingsFormValues>;
    categories: Category[];
}

export function GeneralSettingsCard({
    form,
    categories,
}: GeneralSettingsCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Parâmetros Gerais</CardTitle>
                <CardDescription>
                    Defina os padrões de comportamento do sistema.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="closingDay"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Dia Padrão de Fechamento</FormLabel>
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
                                    Para faturas e relatórios.
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
                                <FormLabel>Juros Médios Padrão (%)</FormLabel>
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
                                    Para novas dívidas.
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
                                <FormLabel>Valor Extra Mensal Padrão</FormLabel>
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
                                    Para estratégias de dívidas.
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
                                    Limite de Projeção (Meses)
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
                                <FormLabel>Horas Diárias Padrão</FormLabel>
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
                                    Número Padrão de Recorrências
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
                                    Categoria Padrão p/ Recebimentos
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        value={field.value}
                                        onChange={field.onChange}
                                        options={categories.map((c) => ({
                                            value: c.name,
                                            label: c.name,
                                        }))}
                                        placeholder="Selecione"
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
                                            checked ? "true" : "false"
                                        )
                                    }
                                />
                            </FormControl>
                            <FormLabel className="font-normal text-base">
                                Trabalhar nos Fins de Semana
                            </FormLabel>
                        </FormItem>
                    )}
                />
            </CardContent>
        </Card>
    );
}
