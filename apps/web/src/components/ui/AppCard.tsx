import type { ReactNode } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./Card";
import { cn } from "../../lib/utils";

interface AppCardProps {
    title: string;
    badge?: string | ReactNode;
    children: ReactNode;
    actions?: ReactNode;
    footer?: ReactNode;
    className?: string;
    color?: string; // Optional color indicator
    onClick?: () => void;
}

export function AppCard({
    title,
    badge,
    children,
    actions,
    footer,
    className,
    color,
    onClick,
}: AppCardProps) {
    return (
        <Card
            className={cn(
                "group relative transition-all hover:shadow-md dark:hover:border-primary/50 overflow-hidden",
                onClick && "cursor-pointer active:scale-[0.99]",
                className
            )}
            onClick={onClick}
        >
            {/* Actions: Visible on hover or focus, absolute positioned top-right */}
            {actions && (
                <div className="absolute top-4 right-4 z-20 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100 bg-white/80 dark:bg-black/50 backdrop-blur-sm p-1.5 rounded-full shadow-sm border border-black/5 dark:border-white/10">
                    {actions}
                </div>
            )}

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                    {color && (
                        <div
                            className="h-3 w-3 rounded-full shadow-sm"
                            style={{ backgroundColor: color }}
                        />
                    )}
                    <CardTitle className="text-base font-semibold tracking-tight pr-12">
                        {title}
                    </CardTitle>
                </div>
                {badge && (
                    <div className="text-sm font-medium text-muted-foreground">
                        {badge}
                    </div>
                )}
            </CardHeader>
            <CardContent>{children}</CardContent>

            {/* Footer Area */}
            {footer && (
                <CardFooter
                    className={cn("flex items-center pt-0", "justify-between")}
                >
                    <div className="text-xs text-muted-foreground w-full">
                        {footer}
                    </div>
                </CardFooter>
            )}
        </Card>
    );
}
