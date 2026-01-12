import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "../ui/Button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "../ui/Dialog";
import { CheckCircle, AlertCircle } from "lucide-react";

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
        data: ImapConfigFormData
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
    const { register, handleSubmit, reset } = useForm<ImapConfigFormData>({
        defaultValues: {
            host: "imap.gmail.com",
            port: 993,
            secure: true,
            folder: "INBOX",
            ...initialData,
        },
    });

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
                        (result.success ? "Success" : "Failed"),
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
                            ? "Edit Configuration"
                            : "New Configuration"}
                    </DialogTitle>
                    <DialogDescription>
                        Configure your IMAP connection details and filters
                        below.
                    </DialogDescription>
                </DialogHeader>

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

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Connection Settings */}
                    <div className="space-y-4 border-b pb-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            Connection
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="host"
                                    className="text-sm font-medium"
                                >
                                    Host (IMAP)
                                </label>
                                <input
                                    id="host"
                                    {...register("host", { required: true })}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    placeholder="imap.gmail.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="port"
                                    className="text-sm font-medium"
                                >
                                    Port
                                </label>
                                <input
                                    id="port"
                                    type="number"
                                    {...register("port", {
                                        required: true,
                                        valueAsNumber: true,
                                    })}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    placeholder="993"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="email"
                                    className="text-sm font-medium"
                                >
                                    Email / User
                                </label>
                                <input
                                    id="email"
                                    {...register("email", { required: true })}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    placeholder="user@example.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-medium"
                                >
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    {...register("password")}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    placeholder={
                                        initialData?.id
                                            ? "********"
                                            : "Enter password"
                                    }
                                />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                {...register("secure")}
                                id="secure"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <label
                                htmlFor="secure"
                                className="text-sm font-medium"
                            >
                                Use SSL/TLS
                            </label>
                        </div>
                    </div>

                    {/* Filter Settings */}
                    <div className="space-y-4">
                        <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                            Filters & Routing
                        </h3>

                        <div className="space-y-2">
                            <label
                                htmlFor="folder"
                                className="text-sm font-medium"
                            >
                                Source Folder
                            </label>
                            <input
                                id="folder"
                                {...register("folder", { required: true })}
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                placeholder="INBOX"
                            />
                            <p className="text-xs text-muted-foreground">
                                The mailbox folder to check for emails (e.g.
                                INBOX, Archive, Bills)
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label
                                    htmlFor="sender"
                                    className="text-sm font-medium"
                                >
                                    Sender (From){" "}
                                    <span className="text-xs text-muted-foreground">
                                        (Optional)
                                    </span>
                                </label>
                                <input
                                    id="sender"
                                    {...register("sender")}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    placeholder="example@bank.com"
                                />
                            </div>
                            <div className="space-y-2">
                                <label
                                    htmlFor="subject"
                                    className="text-sm font-medium"
                                >
                                    Subject Contains{" "}
                                    <span className="text-xs text-muted-foreground">
                                        (Optional)
                                    </span>
                                </label>
                                <input
                                    id="subject"
                                    {...register("subject")}
                                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                                    placeholder="Invoice"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handleSubmit(handleTestConnection)}
                            disabled={isTesting}
                        >
                            {isTesting ? "Testing..." : "Test Connection"}
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isSaving}
                        >
                            {isSaving ? "Saving..." : "Save Configuration"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};
