import { HelpCircle } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./Tooltip";

interface HelpIconProps {
    text: string;
    className?: string;
}

export function HelpIcon({ text, className }: HelpIconProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <HelpCircle
                        className={`h-4 w-4 text-muted-foreground cursor-help ${className}`}
                    />
                </TooltipTrigger>
                <TooltipContent>
                    <p>{text}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
