import React, { useState, useEffect } from "react";
import { PageHeader } from "../components/ui/PageHeader";
import { api } from "../lib/api";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Select";
import { Modal } from "../components/ui/Modal";
import { CheckCircle, AlertCircle, Plus, RefreshCw } from "lucide-react";
import {
    ImapConfigList,
    type ImapConfig,
} from "../components/import/ImapConfigList";
import { ImapConfigForm } from "../components/import/ImapConfigForm";

export const ImapConfigPage: React.FC = () => {
    const [accounts, setAccounts] = useState<any[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<string>("");

    const [configs, setConfigs] = useState<ImapConfig[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Form Modal State
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingConfig, setEditingConfig] = useState<
        Partial<ImapConfig> | undefined
    >(undefined);
    const [isSaving, setIsSaving] = useState(false);
    const [isTesting, setIsTesting] = useState(false);

    // Feedback State
    const [feedbackModal, setFeedbackModal] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
        type: "success" | "error";
    }>({ isOpen: false, title: "", message: "", type: "success" });

    // Sync State
    const [isSyncing, setIsSyncing] = useState(false);

    // Load available accounts
    useEffect(() => {
        api.get("/accounts").then((res) => {
            setAccounts(res.data);
            if (res.data.length > 0) {
                setSelectedAccount(res.data[0].id);
            }
        });
    }, []);

    // Load configs when account changes
    useEffect(() => {
        if (!selectedAccount) return;
        loadConfigs();
    }, [selectedAccount]);

    const loadConfigs = () => {
        setIsLoading(true);
        api.get(`/import/imap-configs?accountId=${selectedAccount}`)
            .then((res) => {
                setConfigs(res.data);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    };

    const handleAdd = () => {
        setEditingConfig(undefined);
        setIsFormOpen(true);
    };

    const handleEdit = (config: ImapConfig) => {
        setEditingConfig(config);
        setIsFormOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this configuration?"))
            return;

        try {
            await api.post("/import/imap-config/delete", { id });
            setConfigs((prev) => prev.filter((c) => c.id !== id));
            showFeedback("Success", "Configuration deleted", "success");
        } catch (error: any) {
            showFeedback(
                "Error",
                error.response?.data?.message || "Failed to delete",
                "error"
            );
        }
    };

    const handleSave = async (data: any) => {
        setIsSaving(true);
        try {
            await api.post("/import/imap-config", {
                ...data,
                accountId: selectedAccount,
            });
            setIsFormOpen(false);
            showFeedback(
                "Success",
                "Configuration saved successfully",
                "success"
            );
            loadConfigs();
        } catch (error: any) {
            showFeedback(
                "Error",
                error.response?.data?.message || "Failed to save",
                "error"
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleTest = async (
        data: any
    ): Promise<{ success: boolean; message?: string }> => {
        setIsTesting(true);
        try {
            const res = await api.post("/import/imap-test", {
                ...data,
                accountId: selectedAccount,
            });

            if (res.data.success) {
                return { success: true, message: "Connection successful!" };
            } else {
                return {
                    success: false,
                    message: res.data.message || "Connection failed",
                };
            }
        } catch (error: any) {
            return {
                success: false,
                message: error.response?.data?.message || "Test failed",
            };
        } finally {
            setIsTesting(false);
        }
    };

    const handleSync = async () => {
        setIsSyncing(true);
        try {
            const res = await api.post("/import/sync-now", {
                accountId: selectedAccount,
            });
            showFeedback(
                "Sync Complete",
                `Synced ${res.data.imported} transactions!`,
                "success"
            );
        } catch (error: any) {
            showFeedback(
                "Error",
                error.response?.data?.message || "Sync failed",
                "error"
            );
        } finally {
            setIsSyncing(false);
        }
    };

    const showFeedback = (
        title: string,
        message: string,
        type: "success" | "error"
    ) => {
        setFeedbackModal({ isOpen: true, title, message, type });
    };

    const accountOptions = accounts.map((acc) => ({
        value: acc.id,
        label: acc.name,
    }));

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <PageHeader
                title="IMAP Configuration"
                backLink="/import"
                className="mb-6"
            />

            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row gap-4 sm:items-end justify-between">
                    <div className="space-y-2 w-full sm:w-1/3">
                        <label className="text-sm font-medium">
                            Select Account Scope
                        </label>
                        <Select
                            value={selectedAccount}
                            onChange={setSelectedAccount}
                            options={accountOptions}
                            placeholder="Select Account"
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleSync}
                            disabled={isSyncing || !selectedAccount}
                        >
                            <RefreshCw
                                className={`w-4 h-4 mr-2 ${
                                    isSyncing ? "animate-spin" : ""
                                }`}
                            />
                            Sync All
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleAdd}
                            disabled={!selectedAccount}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Configuration
                        </Button>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-8 text-muted-foreground">
                        Loading configurations...
                    </div>
                ) : (
                    <ImapConfigList
                        configs={configs}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                )}
            </div>

            <ImapConfigForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={handleSave}
                onTest={handleTest}
                initialData={editingConfig}
                isSaving={isSaving}
                isTesting={isTesting}
            />

            {/* Feedback Modal */}
            <Modal
                isOpen={feedbackModal.isOpen}
                onClose={() =>
                    setFeedbackModal((prev) => ({ ...prev, isOpen: false }))
                }
                title={feedbackModal.title}
                footer={
                    <div className="flex justify-end">
                        <Button
                            variant={
                                feedbackModal.type === "success"
                                    ? "primary"
                                    : "destructive"
                            }
                            onClick={() =>
                                setFeedbackModal((prev) => ({
                                    ...prev,
                                    isOpen: false,
                                }))
                            }
                        >
                            Close
                        </Button>
                    </div>
                }
            >
                <div className="flex items-center gap-3">
                    {feedbackModal.type === "success" ? (
                        <CheckCircle className="text-emerald-500 w-6 h-6" />
                    ) : (
                        <AlertCircle className="text-rose-500 w-6 h-6" />
                    )}
                    <p>{feedbackModal.message}</p>
                </div>
            </Modal>
        </div>
    );
};
