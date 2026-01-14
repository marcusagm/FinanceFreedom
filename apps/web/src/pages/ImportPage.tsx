import type React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ImportReviewTable } from "../components/import/ImportReviewTable";
import { ImportZone } from "../components/import/ImportZone";
import { Button } from "../components/ui/Button";
import { Modal } from "../components/ui/Modal";
import { PageHeader } from "../components/ui/PageHeader";
import { Select } from "../components/ui/Select";
import { api } from "../lib/api";
import { ImportService, type ImportedTransaction } from "../services/import.service";

export const ImportPage: React.FC = () => {
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
            showAlert("Error", "Please select an account first");
            return;
        }

        setIsLoading(true);
        try {
            const data = await ImportService.uploadFile(file, selectedAccount);
            setTransactions(data);
            setStep("review");
        } catch (error) {
            console.error("Upload failed", error);
            showAlert("Error", "Failed to parse file");
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirm = async () => {
        setIsLoading(true);
        try {
            await ImportService.confirmImport(transactions);
            showAlert("Success", "Import successful!");
            setTransactions([]);
            setStep("upload");
        } catch (error) {
            console.error("Import failed", error);
            showAlert("Error", "Failed to confirm import");
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
                title="Smart Import"
                actions={
                    <Link to="/import/config">
                        <Button variant="outline">Configure IMAP</Button>
                    </Link>
                }
                className="mb-6"
            />

            {step === "upload" && (
                <div className="mb-8 space-y-6">
                    <div>
                        <Select
                            label="Select Account"
                            value={selectedAccount}
                            onChange={setSelectedAccount}
                            options={accountOptions}
                            placeholder="Select an account..."
                        />
                    </div>

                    <ImportZone
                        onFileSelect={handleFileSelect}
                        disabled={isLoading || !selectedAccount}
                    />
                    {isLoading && <p className="text-muted-foreground">Processing file...</p>}
                </div>
            )}

            {step === "review" && (
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4 text-foreground">
                        Review Transactions
                    </h2>
                    <p className="text-muted-foreground mb-4">
                        {transactions.length} new transactions found.
                    </p>

                    <ImportReviewTable transactions={transactions} accounts={accounts} />

                    <div className="flex justify-end gap-4 mt-6">
                        <Button variant="secondary" onClick={handleCancel} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={handleConfirm} disabled={isLoading}>
                            {isLoading ? "Importing..." : "Confirm Import"}
                        </Button>
                    </div>
                </div>
            )}

            <Modal
                isOpen={alertState.isOpen}
                onClose={closeAlert}
                title={alertState.title}
                footer={
                    <Button onClick={closeAlert} variant="primary">
                        OK
                    </Button>
                }
            >
                <p>{alertState.message}</p>
            </Modal>
        </div>
    );
};
