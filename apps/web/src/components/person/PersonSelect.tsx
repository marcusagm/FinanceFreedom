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

    const options = [
        { value: "", label: t("persons.list.none") || "None" },
        ...persons.map((person) => ({
            value: person.id,
            label: person.name,
        })),
    ];

    return (
        <Select
            value={value || ""}
            onChange={onChange}
            options={options}
            placeholder={placeholder || t("common.select")}
        />
    );
}
