import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { PageHeader } from "../components/ui/PageHeader";
import { Button } from "../components/ui/Button";
import { PersonList } from "../components/person/PersonList";
import { PersonForm } from "../components/person/PersonForm";
import { personService } from "../services/person.service";
import type { Person } from "../types/person";
import { DeletePersonDialog } from "../components/person/DeletePersonDialog";

export default function PersonsPage() {
    const { t } = useTranslation();
    const [persons, setPersons] = useState<Person[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [personToEdit, setPersonToEdit] = useState<Person | null>(null);
    const [personToDelete, setPersonToDelete] = useState<Person | null>(null);

    const loadPersons = async () => {
        try {
            setLoading(true);
            const data = await personService.findAll();
            setPersons(data);
        } catch (error) {
            console.error(error);
            toast.error(t("common.error"));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadPersons();
    }, []);

    const handleCreate = () => {
        setPersonToEdit(null);
        setIsFormOpen(true);
    };

    const handleEdit = (person: Person) => {
        setPersonToEdit(person);
        setIsFormOpen(true);
    };

    const handleDelete = (person: Person) => {
        setPersonToDelete(person);
    };

    const confirmDelete = async () => {
        if (!personToDelete) return;
        try {
            await personService.remove(personToDelete.id);
            toast.success(t("persons.deleteSuccess"));
            loadPersons();
        } catch (error) {
            console.error(error);
            toast.error(t("persons.deleteError"));
        } finally {
            setPersonToDelete(null);
        }
    };

    return (
        <div className="container py-8 space-y-8">
            <PageHeader
                title={t("persons.title")}
                description={t("persons.subtitle")}
                actions={
                    <Button onClick={handleCreate}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t("persons.newPerson")}
                    </Button>
                }
            />

            {loading ? (
                <div>{t("common.loading")}</div>
            ) : (
                <PersonList
                    persons={persons}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            <PersonForm
                open={isFormOpen}
                onOpenChange={setIsFormOpen}
                personToEdit={personToEdit}
                onSuccess={loadPersons}
            />

            <DeletePersonDialog
                isOpen={!!personToDelete}
                onClose={() => setPersonToDelete(null)}
                onConfirm={confirmDelete}
                name={personToDelete?.name || ""}
            />
        </div>
    );
}
