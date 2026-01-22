import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Select } from "../ui/Select";
import { personService } from "../../services/person.service";
import type { Person } from "../../types/person";

interface PersonSelectProps {
    value?: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

export function PersonSelect({
    value,
    onChange,
    placeholder,
}: PersonSelectProps) {
    const { t } = useTranslation();
    const [persons, setPersons] = useState<Person[]>([]);

    useEffect(() => {
        personService.findAll().then(setPersons).catch(console.error);
    }, []);

    const NO_SELECTION_ID = "__no_selection__";

    const options = [
        { value: NO_SELECTION_ID, label: t("persons.list.none") || "None" },
        ...persons.map((person) => ({
            value: person.id,
            label: person.name,
        })),
    ];

    return (
        <Select
            value={value || NO_SELECTION_ID}
            onChange={(val) => onChange(val === NO_SELECTION_ID ? "" : val)}
            options={options}
            placeholder={placeholder || t("common.select")}
        />
    );
}
