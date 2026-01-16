import type React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ImportReviewTable } from "../components/import/ImportReviewTable";
import { ImportZone } from "../components/import/ImportZone";
import { Button } from "../components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../components/ui/Dialog";
import { PageHeader } from "../components/ui/PageHeader";
import { Select } from "../components/ui/Select";
import { api } from "../lib/api";
import {
    ImportService,
    type ImportedTransaction,
} from "../services/import.service";

export const ImportPage: React.FC = () => {
    const { t } = useTranslation();
    const [accounts, setAccounts] = useState<any[]>([]);
    const [selectedAccount, setSelectedAccount] = useState<string>("");
    const [transactions, setTransactions] = useState<ImportedTransaction[]>([]);
    const [step, setStep] = useState<"upload" | "review">("upload");
    const [isLoading, setIsLoading] = useState(false);
    const [alertState, setAlertState] = useState<{
        isOpen: boolean;
        title: string;
        message: string;
    }>({ isOpen: false, title: "", message: "" });

    useEffect(() => {
        fetchAccounts();
    }, []);

    const fetchAccounts = async () => {
        try {
            const response = await api.get("/accounts");
            setAccounts(response.data);
            if (response.data.length > 0) {
                setSelectedAccount(response.data[0].id);
            }
        } catch (error) {
            console.error("Failed to fetch accounts", error);
        }
    };

    const showAlert = (title: string, message: string) => {
        setAlertState({ isOpen: true, title, message });
    };

    const closeAlert = () => {
        setAlertState((prev) => ({ ...prev, isOpen: false }));
    };

    const handleFileSelect = async (file: File) => {
        if (!selectedAccount) {
            showAlert(t("common.error"), t("import.selectAccountError"));
            return;
        }

        setIsLoading(true);
        try {
            const data = await ImportService.uploadFile(file, selectedAccount);
            setTransactions(data);
            setStep("review");
        } catch (error) {
            console.error("Upload failed", error);
            showAlert(t("common.error"), t("import.parseError"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await ImportService.confirmImport(transactions);
            showAlert(t("common.success"), t("import.success"));
            setTransactions([]);
            setStep("upload");
        } catch (error) {
            console.error("Import failed", error);
            showAlert(t("common.error"), t("import.error"));
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setTransactions([]);
        setStep("upload");
    };

    const accountOptions = accounts.map((acc) => ({
        value: acc.id,
        label: `${acc.name} (${acc.type})`,
    }));

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <PageHeader
                title={t("import.title")}
                actions={
                    <Link to="/import/config">
                        <Button variant="outline">
                            {t("import.configureImap")}
                        </Button>
                    </Link>
                }
                className="mb-6"
            />

            {step === "upload" && (
                <div className="mb-8 space-y-6">
                    <div>
                        <Select
                            label={t("import.selectAccount")}
                            value={selectedAccount}
                            onChange={setSelectedAccount}
                            options={accountOptions}
                            placeholder={t("import.selectAccountPlaceholder")}
                        />
                    </div>

                    <ImportZone
                        onFileSelect={handleFileSelect}
                        disabled={isLoading || !selectedAccount}
                    />
                    {isLoading && (
                        <p className="text-muted-foreground">
                            {t("import.processing")}
                        </p>
                    )}
                </div>
            )}

            {step === "review" && (
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">
                        {t("import.review.title")}
                    </h2>
                    <p className="text-muted-foreground mb-4">
                        {t("import.review.countFound", {
                            count: transactions.length,
                        })}
                    </p>

                    <ImportReviewTable
                        transactions={transactions}
                        accounts={accounts}
                    />

                    <div className="flex justify-end gap-4 mt-6">
                        <Button
                            variant="secondary"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            {t("common.cancel")}
                        </Button>
                        <Button
                            variant="primary"
                            onClick={handleConfirm}
                            disabled={isLoading}
                        >
                            {isLoading
                                ? t("import.importing")
                                : t("import.confirm")}
                        </Button>
                    </div>
                </div>
            )}

            <Dialog open={alertState.isOpen} onOpenChange={closeAlert}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{alertState.title}</DialogTitle>
                        <DialogDescription>
                            {alertState.message}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={closeAlert} variant="primary">
                            {t("common.ok")}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
};
