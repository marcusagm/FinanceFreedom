import { Moon, Sun, Laptop, Check } from "lucide-react";
import { useTheme } from "../providers/ThemeProvider";
import { Button } from "../ui/Button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/Card";
import { Label } from "../ui/Label";
import { Switch } from "../ui/Switch";
import { cn } from "../../lib/utils";
import { themes } from "../../registry/themes";

export function ThemeCustomizer() {
    const {
        theme,
        setTheme,
        primaryColor,
        setPrimaryColor,
        radius,
        setRadius,
        privacyMode,
        setPrivacyMode,
    } = useTheme();

    const formattedThemes = themes.map((t) => ({
        value: t.name,
        label: t.label,
        color: t.activeColor,
    }));

    const radii = [0, 0.3, 0.5, 0.75, 1.0];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Aparência</CardTitle>
                <CardDescription>
                    Personalize a aparência do Finance Freedom. Use o modo
                    escuro para descanso visual.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Tema</Label>
                    <div className="grid grid-cols-3 gap-2 max-w-md">
                        <Button
                            variant="outline"
                            className={cn(
                                "flex items-center justify-start gap-2 h-10 px-4",
                                theme === "light" &&
                                    "border-primary ring-1 ring-primary"
                            )}
                            onClick={() => setTheme("light")}
                            type="button"
                        >
                            <Sun className="h-4 w-4" />
                            <span>Claro</span>
                        </Button>
                        <Button
                            variant="outline"
                            className={cn(
                                "flex items-center justify-start gap-2 h-10 px-4",
                                theme === "dark" &&
                                    "border-primary ring-1 ring-primary"
                            )}
                            onClick={() => setTheme("dark")}
                            type="button"
                        >
                            <Moon className="h-4 w-4" />
                            <span>Escuro</span>
                        </Button>
                        <Button
                            variant="outline"
                            className={cn(
                                "flex items-center justify-start gap-2 h-10 px-4",
                                theme === "system" &&
                                    "border-primary ring-1 ring-primary"
                            )}
                            onClick={() => setTheme("system")}
                            type="button"
                        >
                            <Laptop className="h-4 w-4" />
                            <span>Sistema</span>
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Cor de Destaque</Label>
                    <div className="flex flex-wrap gap-2">
                        {formattedThemes.map((t) => (
                            <button
                                key={t.value}
                                onClick={() => setPrimaryColor(t.value)}
                                className={cn(
                                    "flex h-8 w-8 items-center justify-center rounded-full border-2 border-muted hover:scale-110 transition-transform",
                                    primaryColor === t.value &&
                                        "border-primary ring-2 ring-primary ring-offset-2 ring-offset-background"
                                )}
                                style={{ backgroundColor: t.color }}
                                title={t.label}
                                type="button"
                            >
                                {primaryColor === t.value && (
                                    <Check className="h-3 w-3 text-white" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Arredondamento (Radius)</Label>
                    <div className="flex flex-wrap gap-2">
                        {radii.map((r) => (
                            <Button
                                key={r}
                                variant="outline"
                                className={cn(
                                    "h-8 w-12",
                                    radius === r &&
                                        "border-primary ring-1 ring-primary"
                                )}
                                onClick={() => setRadius(r)}
                                type="button"
                            >
                                {r}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="relative flex items-center justify-between space-x-2 border rounded-lg p-4">
                    <div className="space-y-0.5">
                        <Label className="text-base">
                            Modo Privacidade (Padrão)
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            Iniciar com valores ocultos por padrão.
                        </p>
                    </div>
                    <Switch
                        checked={privacyMode}
                        onCheckedChange={setPrivacyMode}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
