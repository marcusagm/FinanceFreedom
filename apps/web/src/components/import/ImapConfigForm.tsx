import {
    Dialog,
    DialogBody,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";
import { AlertCircle, CheckCircle } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/Button";
import { Checkbox } from "../ui/Checkbox";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "../ui/Form";
import { Input } from "../ui/Input";

interface ImapConfigFormData {
    id?: string;
    host: string;
    port: number;
    secure: boolean;
    email: string;
    password?: string;
    folder: string;
    sender?: string;
    subject?: string;
}

interface ImapConfigFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: ImapConfigFormData) => void;
    onTest?: (
        data: ImapConfigFormData,
    ) => Promise<{ success: boolean; message?: string }>;
    initialData?: Partial<ImapConfigFormData>;
    isTesting?: boolean;
    isSaving?: boolean;
}

export const ImapConfigForm: React.FC<ImapConfigFormProps> = ({
    isOpen,
    onClose,
    onSubmit,
    onTest,
    initialData,
    isTesting,
    isSaving,
}) => {
    const { t } = useTranslation();
    const form = useForm<ImapConfigFormData>({
        defaultValues: {
            host: "imap.gmail.com",
            port: 993,
            secure: true,
            folder: "INBOX",
            ...initialData,
        },
    });

    const { handleSubmit: hookSubmit, reset, control } = form;

    // Reset when initialData changes or isOpen changes
    React.useEffect(() => {
        if (isOpen) {
            reset({
                host: "imap.gmail.com",
                port: 993,
                secure: true,
                folder: "INBOX",
                ...initialData,
            });
        }
    }, [isOpen, initialData, reset]);

    const [testResult, setTestResult] = React.useState<{
        success: boolean;
        result: string;
    } | null>(null);

    const handleTestConnection = async (data: ImapConfigFormData) => {
        setTestResult(null);
        if (onTest) {
            const result = await onTest(data);
            if (result) {
                setTestResult({
                    success: result.success,
                    result:
                        result.message ||
                        (result.success
                            ? t("imap.form.success")
                            : t("imap.form.failed")),
                });
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>
                        {initialData?.id
                            ? t("imap.form.titleEdit")
                            : t("imap.form.titleNew")}
                    </DialogTitle>
                    <DialogDescription>
                        {t("imap.form.description")}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={hookSubmit(onSubmit)}
                        className="flex flex-col flex-1 min-h-0"
                    >
                        <DialogBody className="space-y-6">
                            {/* Feedback Alert */}
                            {testResult && (
                                <div
                                    className={`p-3 rounded-md flex items-center gap-2 text-sm ${
                                        testResult.success
                                            ? "bg-emerald-50 text-emerald-900 border border-emerald-200"
                                            : "bg-rose-50 text-rose-900 border border-rose-200"
                                    }`}
                                >
                                    {testResult.success ? (
                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                    ) : (
                                        <AlertCircle className="w-4 h-4 text-rose-600" />
                                    )}
                                    <span>{testResult.result}</span>
                                </div>
                            )}

                            {/* Connection Settings */}
                            <div className="space-y-4 border-b pb-4">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                    {t("imap.form.connection")}
                                </h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={control}
                                        name="host"
                                        rules={{
                                            required: t(
                                                "imap.form.validation.hostRequired",
                                            ),
                                        }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {t("imap.form.hostLabel")}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder={t(
                                                            "imap.form.hostPlaceholder",
                                                        )}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="port"
                                        rules={{
                                            required: t(
                                                "imap.form.validation.portRequired",
                                            ),
                                        }}
                                        render={({
                                            field: {
                                                onChange,
                                                value,
                                                ...field
                                            },
                                        }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {t("imap.form.portLabel")}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder={t(
                                                            "imap.form.portPlaceholder",
                                                        )}
                                                        value={value || ""}
                                                        onChange={(e) =>
                                                            onChange(
                                                                Number(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            )
                                                        }
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={control}
                                        name="email"
                                        rules={{
                                            required: t(
                                                "imap.form.validation.emailRequired",
                                            ),
                                        }}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {t("imap.form.emailLabel")}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder={t(
                                                            "imap.form.emailPlaceholder",
                                                        )}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {t(
                                                        "imap.form.passwordLabel",
                                                    )}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="password"
                                                        placeholder={
                                                            initialData?.id
                                                                ? t(
                                                                      "imap.form.passwordEditPlaceholder",
                                                                  )
                                                                : t(
                                                                      "imap.form.passwordPlaceholder",
                                                                  )
                                                        }
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={control}
                                    name="secure"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    {t("imap.form.sslLabel")}
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Filter Settings */}
                            <div className="space-y-4">
                                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                    {t("imap.form.filters")}
                                </h3>

                                <FormField
                                    control={control}
                                    name="folder"
                                    rules={{
                                        required: t(
                                            "imap.form.validation.folderRequired",
                                        ),
                                    }}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                {t("imap.form.folderLabel")}
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder={t(
                                                        "imap.form.folderPlaceholder",
                                                    )}
                                                    {...field}
                                                />
                                            </FormControl>
                                            <p className="text-xs text-muted-foreground">
                                                {t("imap.form.folderHelp")}
                                            </p>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={control}
                                        name="sender"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {t("imap.form.senderLabel")}{" "}
                                                    <span className="text-xs text-muted-foreground">
                                                        {t(
                                                            "imap.form.optional",
                                                        )}
                                                    </span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder={t(
                                                            "imap.form.senderPlaceholder",
                                                        )}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="subject"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {t(
                                                        "imap.form.subjectLabel",
                                                    )}{" "}
                                                    <span className="text-xs text-muted-foreground">
                                                        {t(
                                                            "imap.form.optional",
                                                        )}
                                                    </span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder={t(
                                                            "imap.form.subjectPlaceholder",
                                                        )}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </DialogBody>

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={onClose}
                            >
                                {t("imap.form.cancel")}
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={hookSubmit(handleTestConnection)}
                                disabled={isTesting}
                            >
                                {isTesting
                                    ? t("imap.form.testingButton")
                                    : t("imap.form.testButton")}
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isSaving}
                            >
                                {isSaving
                                    ? t("imap.form.savingButton")
                                    : t("imap.form.saveButton")}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
