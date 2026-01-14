import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import type { ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "./Alert";

import { cn } from "../../lib/utils";

interface AppAlertProps {
    title?: string;
    description?: string;
    children?: ReactNode;
    variant?: "default" | "destructive" | "info" | "success" | "warning";
    className?: string;
}

export function AppAlert({
    title,
    description,
    children,
    variant = "default",
    className,
}: AppAlertProps) {
    const getVariantStyles = () => {
        switch (variant) {
            case "destructive":
                return "bg-red-50 text-red-900 border-red-200 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-200";
            case "success":
                return "bg-emerald-50 text-emerald-900 border-emerald-200 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-400";
            case "warning":
                return "bg-amber-50 text-amber-900 border-amber-200 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400";
            case "info":
                return "bg-blue-50 text-blue-900 border-blue-200 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-400";
            default:
                return "bg-background text-foreground border-border";
        }
    };

    const getIcon = () => {
        switch (variant) {
            case "destructive":
                return <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />;
            case "success":
                return <CheckCircle2 className="h-4 w-4" />;
            case "warning":
                return <AlertCircle className="h-4 w-4" />;
            case "info":
                return <Info className="h-4 w-4" />;
            default:
                return <Info className="h-4 w-4" />;
        }
    };

    return (
        <Alert className={cn(getVariantStyles(), className)}>
            {getIcon()}
            {title && <AlertTitle>{title}</AlertTitle>}
            {description && <AlertDescription>{description}</AlertDescription>}
            {children && <AlertDescription>{children}</AlertDescription>}
        </Alert>
    );
}
