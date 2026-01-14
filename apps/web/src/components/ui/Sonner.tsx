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
                    toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg data-[type=success]:bg-emerald-50 data-[type=success]:text-emerald-900 data-[type=success]:border-emerald-200 dark:data-[type=success]:!border-emerald-800 dark:data-[type=success]:!bg-emerald-950/30 dark:data-[type=success]:!text-emerald-400 data-[type=error]:bg-red-50 data-[type=error]:text-red-900 data-[type=error]:border-red-200 dark:data-[type=error]:!bg-red-950/30 dark:data-[type=error]:!border-red-900/50 dark:data-[type=error]:!text-red-200 data-[type=info]:bg-blue-50 data-[type=info]:text-blue-900 data-[type=info]:border-blue-200 dark:data-[type=info]:!border-blue-800 dark:data-[type=info]:!bg-blue-950/30 dark:data-[type=info]:!text-blue-400 data-[type=warning]:bg-amber-50 data-[type=warning]:text-amber-900 data-[type=warning]:border-amber-200 dark:data-[type=warning]:!border-amber-800 dark:data-[type=warning]:!bg-amber-950/30 dark:data-[type=warning]:!text-amber-400",
                    description: "group-[.toast]:text-muted-foreground",
                    actionButton:
                        "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
                    cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
