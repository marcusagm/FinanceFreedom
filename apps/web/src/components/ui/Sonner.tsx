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
                    toast: "group toast group-[.toaster]:!bg-background group-[.toaster]:!text-foreground group-[.toaster]:!border-border group-[.toaster]:!shadow-lg",
                    description: "group-[.toast]:!text-muted-foreground",
                    actionButton:
                        "group-[.toast]:!bg-primary group-[.toast]:!text-primary-foreground font-medium",
                    cancelButton:
                        "group-[.toast]:!bg-muted group-[.toast]:!text-muted-foreground font-medium",

                    /* Success Type */
                    success:
                        "group-[.toaster]:!bg-emerald-50 dark:group-[.toaster]:!bg-emerald-950 " +
                        "group-[.toaster]:!border-emerald-200 dark:group-[.toaster]:!border-emerald-900 " +
                        "group-[.toaster]:!text-emerald-800 dark:group-[.toaster]:!text-emerald-50 " +
                        "[&>[data-button]]:!bg-emerald-600 [&>[data-button]]:!text-white " +
                        "[&>[data-cancel]]:!bg-emerald-100 dark:[&>[data-cancel]]:!bg-emerald-900/50 [&>[data-cancel]]:!text-emerald-800 dark:[&>[data-cancel]]:!text-emerald-200",

                    /* Error Type */
                    error:
                        "group-[.toaster]:!bg-red-50 dark:group-[.toaster]:!bg-red-950 " +
                        "group-[.toaster]:!border-red-200 dark:group-[.toaster]:!border-red-900 " +
                        "group-[.toaster]:!text-red-800 dark:group-[.toaster]:!text-red-50 " +
                        "[&>[data-button]]:!bg-red-600 [&>[data-button]]:!text-white " +
                        "[&>[data-cancel]]:!bg-red-100 dark:[&>[data-cancel]]:!bg-red-900/50 [&>[data-cancel]]:!text-red-800 dark:[&>[data-cancel]]:!text-red-200",

                    /* Warning Type */
                    warning:
                        "group-[.toaster]:!bg-amber-50 dark:group-[.toaster]:!bg-amber-950 " +
                        "group-[.toaster]:!border-amber-200 dark:group-[.toaster]:!border-amber-900 " +
                        "group-[.toaster]:!text-amber-800 dark:group-[.toaster]:!text-amber-50 " +
                        "[&>[data-button]]:!bg-amber-600 [&>[data-button]]:!text-white " +
                        "[&>[data-cancel]]:!bg-amber-100 dark:[&>[data-cancel]]:!bg-amber-900/50 [&>[data-cancel]]:!text-amber-800 dark:[&>[data-cancel]]:!text-amber-200",

                    /* Info Type */
                    info:
                        "group-[.toaster]:!bg-blue-50 dark:group-[.toaster]:!bg-blue-950 " +
                        "group-[.toaster]:!border-blue-200 dark:group-[.toaster]:!border-blue-900 " +
                        "group-[.toaster]:!text-blue-800 dark:group-[.toaster]:!text-blue-50 " +
                        "[&>[data-button]]:!bg-blue-600 [&>[data-button]]:!text-white " +
                        "[&>[data-cancel]]:!bg-blue-100 dark:[&>[data-cancel]]:!bg-blue-900/50 [&>[data-cancel]]:!text-blue-800 dark:[&>[data-cancel]]:!text-blue-200",

                    /* Loading Type (inherits default but good to be explicit just in case) */
                    loading:
                        "group-[.toaster]:!bg-background group-[.toaster]:!text-foreground group-[.toaster]:!border-border group-[.toaster]:!shadow-lg",
                },
            }}
            {...props}
        />
    );
};

export { Toaster };
