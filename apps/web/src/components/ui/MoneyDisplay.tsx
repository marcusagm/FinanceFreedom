import { useLocalization } from "../../contexts/LocalizationContext";
import { usePrivacy } from "../../contexts/PrivacyContext";
import { cn } from "../../lib/utils";

interface MoneyDisplayProps {
    value: number;
    currency?: string;
    className?: string;
}

export function MoneyDisplay({
    value,
    currency,
    className,
}: MoneyDisplayProps) {
    const { isObfuscated } = usePrivacy();
    const { formatCurrency } = useLocalization();

    const formattedValue = formatCurrency(value, currency);

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
