import { cn } from "../../lib/utils";
import { usePrivacy } from "@/contexts/PrivacyContext";

interface MoneyDisplayProps {
    value: number;
    currency?: string;
    className?: string;
}

export function MoneyDisplay({
    value,
    currency = "BRL",
    className,
}: MoneyDisplayProps) {
    const { isObfuscated } = usePrivacy();

    const formattedValue = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: currency,
    }).format(value);

    if (isObfuscated) {
        return (
            <span
                className={cn("blur-sm select-none", className)}
                aria-label="Hidden value"
                title="Privacy mode on"
            >
                ••••••
            </span>
        );
    }

    return <span className={className}>{formattedValue}</span>;
}
