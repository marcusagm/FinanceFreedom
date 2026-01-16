import { Moon, Sun, Laptop, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
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
    const { t } = useTranslation();
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
                <CardTitle>{t("settings.themeSettings.title")}</CardTitle>
                <CardDescription>
                    {t("settings.themeSettings.description")}
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>{t("settings.themeSettings.mode.label")}</Label>
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
                            <span>
                                {t("settings.themeSettings.mode.light")}
                            </span>
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
                            <span>{t("settings.themeSettings.mode.dark")}</span>
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
                            <span>
                                {t("settings.themeSettings.mode.system")}
                            </span>
                        </Button>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>{t("settings.themeSettings.primaryColor")}</Label>
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
                    <Label>{t("settings.themeSettings.radius")}</Label>
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
                            {t("settings.themeSettings.privacyMode.label")}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                            {t(
                                "settings.themeSettings.privacyMode.description"
                            )}
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
