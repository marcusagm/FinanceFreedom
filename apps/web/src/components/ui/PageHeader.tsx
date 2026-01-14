import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

interface PageHeaderProps {
    title: string;
    description?: string;
    actions?: ReactNode;
    backLink?: string;
    className?: string;
}

export function PageHeader({ title, description, actions, backLink, className }: PageHeaderProps) {
    return (
        <div
            className={cn(
                "flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between mb-8 border-b pb-6",
                className,
            )}
        >
            <div className="flex items-center gap-4">
                {backLink && (
                    <Link to={backLink}>
                        <Button variant="outline" size="icon" className="h-9 w-9 shrink-0">
                            <ArrowLeft className="h-4 w-4" />
                            <span className="sr-only">Voltar</span>
                        </Button>
                    </Link>
                )}
                <div className="space-y-1 text-left">
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
                    {description && <p className="text-muted-foreground text-sm">{description}</p>}
                </div>
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
    );
}
