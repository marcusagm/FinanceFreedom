import { format, isValid, parse } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { PatternFormat } from "react-number-format";
import { cn } from "../../lib/utils";
import { Button } from "../ui/Button";
import { Calendar } from "../ui/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { useLocalization } from "../../contexts/LocalizationContext";

interface DatePickerProps {
    date: Date | undefined;
    setDate: (date: Date | undefined) => void;
    className?: string;
    placeholder?: string;
    disabled?: boolean;
}

export function DatePicker({
    date,
    setDate,
    className,
    placeholder,
    disabled,
}: DatePickerProps) {
    const { t, i18n } = useTranslation();
    const { dateFormat } = useLocalization();
    const [inputValue, setInputValue] = React.useState("");

    const locale = React.useMemo(() => {
        return i18n.language.toLowerCase().includes("pt") ? ptBR : enUS;
    }, [i18n.language]);

    React.useEffect(() => {
        if (date && isValid(date)) {
            setInputValue(format(date, dateFormat));
        } else if (!date) {
            setInputValue("");
        }
    }, [date, dateFormat]);

    // Handle input change
    const handleValueChange = (values: any) => {
        const { formattedValue } = values;
        setInputValue(formattedValue);

        const maskLength = dateFormat === "yyyy-MM-dd" ? 10 : 10; // All supported formats are 10 chars for now

        if (formattedValue.length === maskLength) {
            const parsedDate = parse(formattedValue, dateFormat, new Date());
            if (isValid(parsedDate)) {
                setDate(parsedDate);
            }
        } else if (formattedValue === "") {
            setDate(undefined);
        }
    };

    // Determine mask based on dateFormat
    const maskFormat = React.useMemo(() => {
        if (dateFormat === "yyyy-MM-dd") return "####-##-##";
        return "##/##/####"; // dd/MM/yyyy or MM/dd/yyyy
    }, [dateFormat]);

    return (
        <div className={cn("relative", className)}>
            <PatternFormat
                format={maskFormat}
                mask="_"
                value={inputValue}
                onValueChange={handleValueChange}
                placeholder={placeholder || dateFormat.toLowerCase()}
                className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    "pr-10", // Space for the calendar icon
                )}
                disabled={disabled}
            />
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-10 w-10 text-muted-foreground hover:text-foreground"
                        disabled={disabled}
                        type="button"
                    >
                        <CalendarIcon className="h-4 w-4" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 z-50" align="end">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(d) => {
                            setDate(d);
                            // The useEffect will update the input value
                        }}
                        initialFocus
                        locale={locale}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
}
