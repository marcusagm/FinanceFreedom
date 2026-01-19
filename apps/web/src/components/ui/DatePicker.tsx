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
    const [inputValue, setInputValue] = React.useState("");

    const locale = React.useMemo(() => {
        return i18n.language.toLowerCase().includes("pt") ? ptBR : enUS;
    }, [i18n.language]);

    React.useEffect(() => {
        if (date && isValid(date)) {
            setInputValue(format(date, "dd/MM/yyyy"));
        } else if (!date) {
            setInputValue("");
        }
    }, [date]);

    // Handle input change
    const handleValueChange = (values: any) => {
        const { formattedValue } = values;
        setInputValue(formattedValue);

        if (formattedValue.length === 10) {
            const parsedDate = parse(formattedValue, "dd/MM/yyyy", new Date());
            if (isValid(parsedDate)) {
                setDate(parsedDate);
            }
        } else if (formattedValue === "") {
            setDate(undefined);
        }
    };

    return (
        <div className={cn("relative", className)}>
            <PatternFormat
                format="##/##/####"
                mask="_"
                value={inputValue}
                onValueChange={handleValueChange}
                placeholder={placeholder || t("common.dateFormat")}
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
