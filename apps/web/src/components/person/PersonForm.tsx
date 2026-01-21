import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslation } from "react-i18next";
import { PatternFormat } from "react-number-format";
import { toast } from "sonner";
import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "../ui/Dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/Form";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import type { Person, CreatePersonDto } from "../../types/person";
import { personService } from "../../services/person.service";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    phone: z.string().optional(),
});

interface PersonFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    personToEdit?: Person | null;
    onSuccess: () => void;
}

export function PersonForm({
    open,
    onOpenChange,
    personToEdit,
    onSuccess,
}: PersonFormProps) {
    const { t } = useTranslation();
    const isEditing = !!personToEdit;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
        },
    });

    useEffect(() => {
        if (open) {
            if (personToEdit) {
                form.reset({
                    name: personToEdit.name,
                    email: personToEdit.email || "",
                    phone: personToEdit.phone || "",
                });
            } else {
                form.reset({
                    name: "",
                    email: "",
                    phone: "",
                });
            }
        }
    }, [open, personToEdit, form]);

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const data: CreatePersonDto = {
                name: values.name,
                email: values.email || undefined,
                phone: values.phone || undefined,
            };

            if (isEditing && personToEdit) {
                await personService.update(personToEdit.id, data);
            } else {
                await personService.create(data);
            }

            toast.success(t("persons.form.saveSuccess"));
            onSuccess();
            onOpenChange(false);
        } catch (error) {
            console.error(error);
            toast.error(t("persons.form.saveError"));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-106.25">
                <DialogHeader>
                    <DialogTitle>
                        {isEditing
                            ? t("persons.form.titleEdit")
                            : t("persons.form.titleNew")}
                    </DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <DialogBody className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t("persons.form.nameLabel")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder={t(
                                                    "persons.form.namePlaceholder",
                                                )}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t("persons.form.emailLabel")}
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="email"
                                                placeholder="exemplo@email.com"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t("persons.form.phoneLabel")}
                                        </FormLabel>
                                        <FormControl>
                                            <PatternFormat
                                                format="+## (##) #####-####"
                                                allowEmptyFormatting
                                                mask="_"
                                                customInput={Input}
                                                placeholder="+55 (00) 00000-0000"
                                                onValueChange={(values) => {
                                                    field.onChange(
                                                        values.value,
                                                    );
                                                }}
                                                value={field.value}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </DialogBody>
                        <DialogFooter>
                            <Button type="submit">
                                {form.formState.isSubmitting
                                    ? t("common.saving")
                                    : t("common.save")}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
