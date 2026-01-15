import { useTheme } from "next-themes";
import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
    const { theme = "system" } = useTheme();

    return (
        <Sonner
            theme={theme as ToasterProps["theme"]}
            className="toaster group"
            toastOptions={{
                classNames: {
                    toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
                    description: "group-[.toast]:text-muted-foreground",
                    actionButton:
                        "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                    cancelButton:
                        "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                    success:
                        "group-[.toaster]:border-primary/50 group-[.toaster]:bg-primary/5 group-[.toaster]:text-primary",
                    error: "group-[.toaster]:border-destructive/50 group-[.toaster]:bg-destructive/5 group-[.toaster]:text-destructive",
                    warning:
                        "group-[.toaster]:border-amber-500/50 group-[.toaster]:bg-amber-500/5 group-[.toaster]:text-amber-600 dark:group-[.toaster]:text-amber-400",
                    info: "group-[.toaster]:border-blue-500/50 group-[.toaster]:bg-blue-500/5 group-[.toaster]:text-blue-600 dark:group-[.toaster]:text-blue-400",
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
