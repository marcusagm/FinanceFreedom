import { Button } from "../ui/Button";
import { Edit2, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { PatternFormat } from "react-number-format";
import type { Person } from "../../types/person";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/Table";

interface PersonListProps {
    persons: Person[];
    onEdit: (person: Person) => void;
    onDelete: (person: Person) => void;
}

export function PersonList({ persons, onEdit, onDelete }: PersonListProps) {
    const { t } = useTranslation();

    if (persons.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground bg-card border rounded-lg">
                <p>{t("persons.empty")}</p>
            </div>
        );
    }

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>{t("persons.list.name")}</TableHead>
                        <TableHead>{t("persons.list.email")}</TableHead>
                        <TableHead>{t("persons.list.phone")}</TableHead>
                        <TableHead className="w-32 text-center">
                            {t("persons.list.actions")}
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {persons.map((person) => (
                        <TableRow key={person.id}>
                            <TableCell className="font-medium">
                                {person.name}
                            </TableCell>
                            <TableCell>{person.email || "-"}</TableCell>
                            <TableCell>
                                {person.phone ? (
                                    <PatternFormat
                                        value={person.phone}
                                        format="+## (##) #####-####"
                                        displayType="text"
                                    />
                                ) : (
                                    "-"
                                )}
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEdit(person)}
                                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                        title={t("common.edit")}
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onDelete(person)}
                                        className="h-8 w-8 text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20"
                                        title={t("common.delete")}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
